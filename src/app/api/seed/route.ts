import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { WORLD_CUP_2026_MATCHES } from "@/lib/matches-data";

// GET /api/seed — poblar Firestore con los partidos del mundial
// ⚠️  Usar solo una vez o para desarrollo. Proteger con una clave en producción.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SEED_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const batch = db.batch();
    for (const match of WORLD_CUP_2026_MATCHES) {
      const ref = db.collection("matches").doc(match.id);
      batch.set(ref, match, { merge: true });
    }
    await batch.commit();

    return NextResponse.json({
      ok: true,
      seeded: WORLD_CUP_2026_MATCHES.length,
      message: `${WORLD_CUP_2026_MATCHES.length} partidos guardados en Firestore.`,
    });
  } catch (err) {
    console.error("Error en /api/seed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
