import * as admin from "firebase-admin";

function initializeApp(): admin.app.App {
  if (admin.apps.length > 0) return admin.apps[0]!;
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminDb(): admin.firestore.Firestore {
  return admin.firestore(initializeApp());
}

export function getAdminMessaging(): admin.messaging.Messaging {
  return admin.messaging(initializeApp());
}

export default admin;
