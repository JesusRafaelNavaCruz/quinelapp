"use client";
import { useState, useEffect } from "react";
import { Bell, BellRing, X } from "lucide-react";
import { subscribeNotifications, markNotificationRead } from "@/lib/db";
import { useAuth } from "@/lib/AuthContext";
import { useNotifications } from "@/lib/useNotifications";
import type { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function NotificationBell() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { permission, requestPermission, loading } = useNotifications(user?.id);

  useEffect(() => {
    if (!user?.id) return;
    return subscribeNotifications(user.id, setNotifs);
  }, [user?.id]);

  const unread = notifs.filter((n) => !n.read).length;

  async function handleOpen() {
    setOpen(!open);
    if (!open) {
      // Marcar todas como leídas al abrir
      const unreadNotifs = notifs.filter((n) => !n.read);
      for (const n of unreadNotifs) {
        await markNotificationRead(n.id);
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl bg-pitch-800 hover:bg-pitch-700/60 transition-colors"
      >
        {unread > 0 ? (
          <BellRing size={20} className="text-gold-400" />
        ) : (
          <Bell size={20} className="text-pitch-400" />
        )}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-pitch-950 text-xs font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 card !bg-pitch-900 border-pitch-600/60 overflow-hidden animate-slide-up shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-pitch-700/40">
            <span className="text-white font-medium text-sm">Notificaciones</span>
            <button onClick={() => setOpen(false)}>
              <X size={16} className="text-pitch-400 hover:text-white" />
            </button>
          </div>

          {/* Activar notificaciones push */}
          {permission !== "granted" && permission !== "unsupported" && (
            <div className="px-4 py-3 bg-gold-500/10 border-b border-pitch-700/40">
              <p className="text-pitch-300 text-xs mb-2">Activa las notificaciones para recibir alertas de resultados.</p>
              <button
                onClick={requestPermission}
                disabled={loading}
                className="text-xs bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 px-3 py-1.5 rounded-lg transition-all"
              >
                {loading ? "Activando…" : "Activar notificaciones"}
              </button>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="text-pitch-400 text-sm text-center py-6">Sin notificaciones</p>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-pitch-800/40 last:border-0 ${
                    !n.read ? "bg-pitch-800/30" : ""
                  }`}
                >
                  <p className="text-white text-sm font-medium">{n.title}</p>
                  <p className="text-pitch-400 text-xs mt-0.5">{n.body}</p>
                  <p className="text-pitch-600 text-xs mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: es })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
