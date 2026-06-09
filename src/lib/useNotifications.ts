"use client";
import { useEffect, useState } from "react";
import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "@/lib/firebase";
import { getUserId, updateUserToken } from "@/lib/user";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
    } else {
      setPermission(Notification.permission);
    }
  }, []);

  async function requestPermission() {
    if (!("Notification" in window)) return;
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        const messaging = await getMessagingInstance();
        if (!messaging) return;

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          ),
        });

        if (token) {
          updateUserToken(token);
          const userId = getUserId();
          if (userId) {
            await fetch("/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, token }),
            });
          }
        }
      }
    } catch (err) {
      console.error("Error al obtener token FCM:", err);
    }
    setLoading(false);
  }

  return { permission, requestPermission, loading };
}
