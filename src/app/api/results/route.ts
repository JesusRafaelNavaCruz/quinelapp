import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";
import { calculatePoints } from "@/lib/db";
import type { Prediction, Standing, Match } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { matchId, homeScore, awayScore } = await req.json();

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    // 1. Actualizar el partido
    const matchRef = adminDb.collection("matches").doc(matchId);
    const matchSnap = await matchRef.get();
    if (!matchSnap.exists) {
      return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
    }

    await matchRef.update({
      homeScore,
      awayScore,
      status: "finished",
    });

    const match = matchSnap.data() as Match;

    // 2. Obtener todos los pronósticos para este partido
    const predsSnap = await adminDb
      .collection("predictions")
      .where("matchId", "==", matchId)
      .get();

    if (predsSnap.empty) {
      return NextResponse.json({ ok: true, updated: 0 });
    }

    // 3. Calcular y actualizar puntos con un batch
    const batch = adminDb.batch();
    let updatedCount = 0;

    // Agrupar por grupo para actualizar standings
    const pointsByUserGroup: Record<string, { userId: string; groupId: string; points: number; exact: boolean }> = {};

    for (const doc of predsSnap.docs) {
      const pred = doc.data() as Prediction;
      const pts = calculatePoints(pred, homeScore, awayScore);

      batch.update(doc.ref, { points: pts });
      updatedCount++;

      const key = `${pred.userId}_${pred.groupId}`;
      pointsByUserGroup[key] = {
        userId: pred.userId,
        groupId: pred.groupId,
        points: pts,
        exact: pts === 3,
      };
    }

    await batch.commit();

    // 4. Actualizar standings (tabla de posiciones)
    for (const { userId, groupId, points, exact } of Object.values(pointsByUserGroup)) {
      const standingRef = adminDb.collection("standings").doc(`${userId}_${groupId}`);
      const standingSnap = await standingRef.get();

      // Obtener nombre del usuario
      const userSnap = await adminDb.collection("users").doc(userId).get();
      const userName = userSnap.exists ? (userSnap.data()?.name ?? "Desconocido") : "Desconocido";

      if (standingSnap.exists) {
        const current = standingSnap.data() as Standing;
        await standingRef.update({
          totalPoints: (current.totalPoints ?? 0) + points,
          exactScores: (current.exactScores ?? 0) + (exact ? 1 : 0),
          correctWinners: (current.correctWinners ?? 0) + (points === 1 ? 1 : 0),
          userName,
        });
      } else {
        await standingRef.set({
          userId,
          groupId,
          userName,
          totalPoints: points,
          exactScores: exact ? 1 : 0,
          correctWinners: points === 1 ? 1 : 0,
        });
      }
    }

    // 5. Enviar notificaciones push a los miembros de grupos afectados
    const groupIds = [...new Set(Object.values(pointsByUserGroup).map((v) => v.groupId))];

    for (const groupId of groupIds) {
      const groupSnap = await adminDb.collection("groups").doc(groupId).get();
      if (!groupSnap.exists) continue;
      const members: string[] = groupSnap.data()?.members ?? [];

      const tokens: string[] = [];
      for (const memberId of members) {
        const uSnap = await adminDb.collection("users").doc(memberId).get();
        const token = uSnap.data()?.fcmToken;
        if (token) tokens.push(token);

        // Guardar notificación en Firestore
        const notifRef = adminDb.collection("notifications").doc();
        await notifRef.set({
          id: notifRef.id,
          userId: memberId,
          title: "Resultado actualizado ⚽",
          body: `${match.homeTeam} ${homeScore} - ${awayScore} ${match.awayTeam}`,
          read: false,
          createdAt: Date.now(),
          type: "result_updated",
          relatedId: matchId,
        });
      }

      // Enviar FCM si hay tokens
      if (tokens.length > 0) {
        try {
          await adminMessaging.sendEachForMulticast({
            tokens,
            notification: {
              title: "Resultado actualizado ⚽",
              body: `${match.homeTeam} ${homeScore} - ${awayScore} ${match.awayTeam}`,
            },
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
