import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { calculatePoints } from "@/lib/db";
import type { Match, Prediction, Standing } from "@/types";

// POST /api/admin/insert-prediction
// Inserta un pronóstico manualmente y actualiza puntos + standing.
// Usar solo para correcciones de admin.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SEED_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { matchId, userId, groupId, homeScore, awayScore } = await req.json();

    if (!matchId || !userId || !groupId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Faltan parámetros: matchId, userId, groupId, homeScore, awayScore" }, { status: 400 });
    }

    const db = getAdminDb();

    // 1. Obtener el partido para ver si ya tiene resultado
    const matchSnap = await db.collection("matches").doc(matchId).get();
    if (!matchSnap.exists) {
      return NextResponse.json({ error: `Partido ${matchId} no encontrado` }, { status: 404 });
    }
    const match = matchSnap.data() as Match;

    // 2. Construir el pronóstico
    const winner = homeScore > awayScore ? "home" : homeScore < awayScore ? "away" : "draw";
    const predId = `${userId}_${matchId}`;

    const pred: Prediction = {
      id: predId,
      userId,
      matchId,
      groupId,
      winner,
      predictedHomeScore: homeScore,
      predictedAwayScore: awayScore,
      updatedAt: Date.now(),
    };

    // 3. Si el partido ya tiene resultado, calcular puntos
    let points: number | undefined;
    if (match.homeScore !== undefined && match.awayScore !== undefined) {
      points = calculatePoints(pred, match.homeScore, match.awayScore);
      pred.points = points;
    }

    // 4. Guardar el pronóstico
    await db.collection("predictions").doc(predId).set(pred, { merge: true });

    // 5. Si hubo puntos, actualizar el standing
    if (points !== undefined) {
      const standingRef = db.collection("standings").doc(`${userId}_${groupId}`);
      const standingSnap = await standingRef.get();

      const userSnap = await db.collection("users").doc(userId).get();
      const userName = userSnap.exists ? (userSnap.data()?.name ?? "Desconocido") : "Desconocido";

      if (standingSnap.exists) {
        const current = standingSnap.data() as Standing;
        await standingRef.update({
          totalPoints: (current.totalPoints ?? 0) + points,
          exactScores: (current.exactScores ?? 0) + (points === 3 ? 1 : 0),
          correctWinners: (current.correctWinners ?? 0) + (points === 1 ? 1 : 0),
          userName,
        });
      } else {
        await standingRef.set({
          userId,
          groupId,
          userName,
          totalPoints: points,
          exactScores: points === 3 ? 1 : 0,
          correctWinners: points === 1 ? 1 : 0,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      prediction: pred,
      points: points ?? "partido sin resultado aún",
      standing: points !== undefined ? "actualizado" : "sin cambios (partido no terminado)",
    });
  } catch (err) {
    console.error("Error en /api/admin/insert-prediction:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
