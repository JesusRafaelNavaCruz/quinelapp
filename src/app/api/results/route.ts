import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminMessaging } from "@/lib/firebase-admin";
import { calculatePoints } from "@/lib/db";
import type { Prediction, Standing, Match } from "@/types";

type ResultInput = { matchId: string; homeScore: number; awayScore: number };

function normalizeResults(body: unknown): ResultInput[] {
  if (Array.isArray(body)) return body as ResultInput[];
  if (body && typeof body === "object" && Array.isArray((body as { results?: unknown }).results)) {
    return (body as { results: ResultInput[] }).results;
  }
  return [body as ResultInput];
}

export async function POST(req: NextRequest) {
  try {
    const results = normalizeResults(await req.json());

    if (
      results.length === 0 ||
      results.some((r) => !r || !r.matchId || r.homeScore === undefined || r.awayScore === undefined)
    ) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    let updatedCount = 0;
    const pointsByUserGroup: Record<
      string,
      { userId: string; groupId: string; points: number; exactCount: number; correctWinnerCount: number }
    > = {};
    const matchesByGroup: Record<
      string,
      { matchId: string; homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }[]
    > = {};

    for (const { matchId, homeScore, awayScore } of results) {
      // 1. Actualizar el partido
      const matchRef = getAdminDb().collection("matches").doc(matchId);
      const matchSnap = await matchRef.get();
      if (!matchSnap.exists) {
        return NextResponse.json({ error: `Partido no encontrado: ${matchId}` }, { status: 404 });
      }

      await matchRef.update({
        homeScore,
        awayScore,
        status: "finished",
      });

      const match = matchSnap.data() as Match;

      // 2. Obtener todos los pronósticos para este partido
      const predsSnap = await getAdminDb()
        .collection("predictions")
        .where("matchId", "==", matchId)
        .get();

      if (predsSnap.empty) continue;

      // 3. Calcular y actualizar puntos con un batch
      const batch = getAdminDb().batch();
      const touchedGroupIds = new Set<string>();

      for (const doc of predsSnap.docs) {
        const pred = doc.data() as Prediction;
        const pts = calculatePoints(pred, homeScore, awayScore);

        batch.update(doc.ref, { points: pts });
        updatedCount++;
        touchedGroupIds.add(pred.groupId);

        const key = `${pred.userId}_${pred.groupId}`;
        const entry = pointsByUserGroup[key] ?? {
          userId: pred.userId,
          groupId: pred.groupId,
          points: 0,
          exactCount: 0,
          correctWinnerCount: 0,
        };
        entry.points += pts;
        entry.exactCount += pts === 3 ? 1 : 0;
        entry.correctWinnerCount += pts === 1 ? 1 : 0;
        pointsByUserGroup[key] = entry;
      }

      await batch.commit();

      for (const groupId of touchedGroupIds) {
        if (!matchesByGroup[groupId]) matchesByGroup[groupId] = [];
        matchesByGroup[groupId].push({ matchId, homeTeam: match.homeTeam, awayTeam: match.awayTeam, homeScore, awayScore });
      }
    }

    // 4. Actualizar standings (tabla de posiciones)
    for (const { userId, groupId, points, exactCount, correctWinnerCount } of Object.values(pointsByUserGroup)) {
      const standingRef = getAdminDb().collection("standings").doc(`${userId}_${groupId}`);
      const standingSnap = await standingRef.get();

      // Obtener nombre del usuario
      const userSnap = await getAdminDb().collection("users").doc(userId).get();
      const userName = userSnap.exists ? (userSnap.data()?.name ?? "Desconocido") : "Desconocido";

      if (standingSnap.exists) {
        const current = standingSnap.data() as Standing;
        await standingRef.update({
          totalPoints: (current.totalPoints ?? 0) + points,
          exactScores: (current.exactScores ?? 0) + exactCount,
          correctWinners: (current.correctWinners ?? 0) + correctWinnerCount,
          userName,
        });
      } else {
        await standingRef.set({
          userId,
          groupId,
          userName,
          totalPoints: points,
          exactScores: exactCount,
          correctWinners: correctWinnerCount,
        });
      }
    }

    // 5. Enviar notificaciones push a los miembros de grupos afectados
    for (const [groupId, matches] of Object.entries(matchesByGroup)) {
      if (matches.length === 0) continue;

      const groupSnap = await getAdminDb().collection("groups").doc(groupId).get();
      if (!groupSnap.exists) continue;
      const members: string[] = groupSnap.data()?.members ?? [];

      const title = matches.length === 1 ? "Resultado actualizado ⚽" : "Resultados actualizados ⚽";
      const body = matches.map((m) => `${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}`).join(" | ");

      const tokens: string[] = [];
      for (const memberId of members) {
        const uSnap = await getAdminDb().collection("users").doc(memberId).get();
        const token = uSnap.data()?.fcmToken;
        if (token) tokens.push(token);

        // Guardar notificación en Firestore
        const notifRef = getAdminDb().collection("notifications").doc();
        await notifRef.set({
          id: notifRef.id,
          userId: memberId,
          title,
          body,
          read: false,
          createdAt: Date.now(),
          type: "result_updated",
          relatedId: matches.length === 1 ? matches[0].matchId : null,
        });
      }

      // Enviar FCM si hay tokens
      if (tokens.length > 0) {
        try {
          await getAdminMessaging().sendEachForMulticast({
            tokens,
            notification: { title, body },
            webpush: {
              fcmOptions: { link: `${process.env.NEXT_PUBLIC_BASE_URL}/tabla?grupo=${groupId}` },
            },
          });
        } catch (fcmErr) {
          console.error("FCM error (no crítico):", fcmErr);
        }
      }
    }

    return NextResponse.json({ ok: true, updated: updatedCount });
  } catch (err) {
    console.error("Error en /api/results:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
