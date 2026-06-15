import * as admin from "firebase-admin";
import crypto from "crypto";

let app: admin.app.App;
let db: admin.firestore.Firestore;

function normalizeKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw
    .replace(/\\n/g, "\n")   // literal \n → newline
    .replace(/\r\n/g, "\n")  // CRLF → newline
    .replace(/\r/g, "\n")    // CR → newline
    .trim();
}

function initializeApp(): admin.app.App {
  if (app) return app;
  if (admin.apps.length > 0) { app = admin.apps[0]!; return app; }

  const privateKey = normalizeKey(process.env.FIREBASE_PRIVATE_KEY);

  // Diagnóstico: validar que la llave se puede parsear
  try {
    crypto.createPrivateKey(privateKey!);
    console.log("[firebase-admin] ✓ Llave privada válida");
  } catch (e: any) {
    console.error("[firebase-admin] ✗ Llave privada INVÁLIDA:", e.message);
    console.error("[firebase-admin]   Primeros 60 chars:", privateKey?.substring(0, 60));
    console.error("[firebase-admin]   Longitud:", privateKey?.length);
    console.error("[firebase-admin]   Tiene saltos de línea reales:", privateKey?.includes("\n"));
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
  return app;
}

export function getAdminDb(): admin.firestore.Firestore {
  if (db) return db;
  db = admin.firestore(initializeApp());
  db.settings({ preferRest: true });
  return db;
}

export function getAdminMessaging(): admin.messaging.Messaging {
  return admin.messaging(initializeApp());
}

export default admin;
