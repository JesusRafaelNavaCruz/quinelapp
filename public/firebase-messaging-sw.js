// Service Worker para Firebase Cloud Messaging
// Este archivo DEBE estar en /public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY,
  authDomain: self.FIREBASE_AUTH_DOMAIN,
  projectId: self.FIREBASE_PROJECT_ID,
  storageBucket: self.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID,
  appId: self.FIREBASE_APP_ID,
});

// IMPORTANTE: Reemplaza los valores de arriba con tus variables de entorno
// O usa el siguiente patrón con variables hardcodeadas (el SW no tiene acceso a env):
//
// firebase.initializeApp({
//   apiKey: "AIza...",
//   projectId: "mi-quiniela-2026",
//   ...
// });

const messaging = firebase.messaging();

// Manejar mensajes en background
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'Quiniela Mundial', {
    body: body ?? '',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: payload.data,
  });
});

// Al hacer click en la notificación, abrir la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.link ?? '/';
  event.waitUntil(clients.openWindow(url));
});
