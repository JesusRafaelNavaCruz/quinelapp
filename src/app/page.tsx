"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
import { Trophy, Users, Zap, ArrowRight, LogOut } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pitch-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pitch-500/20 rounded-full flex items-center justify-center text-xl">
            {user.avatar ?? user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-pitch-400 text-xs">Bienvenido,</p>
            <p className="font-display text-xl text-white tracking-wide">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl bg-pitch-800/60 hover:bg-pitch-700/60 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={18} className="text-pitch-400" />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="card p-6 mb-6 animate-slide-up text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pitch-500/10 to-gold-500/5" />
        <div className="relative">
          <p className="font-display text-6xl text-white tracking-widest">MUNDIAL</p>
          <p className="font-display text-3xl text-gold-400 tracking-widest">2026</p>
          <p className="text-pitch-300 text-sm mt-2">🇲🇽 México · 🇺🇸 USA · 🇨🇦 Canadá</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <button
          onClick={() => router.push("/grupos")}
          className="w-full card p-5 flex items-center gap-4 hover:border-pitch-500/60 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-pitch-500/20 rounded-xl flex items-center justify-center group-hover:bg-pitch-500/30 transition-colors">
            <Users size={24} className="text-pitch-400" />
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">Mis grupos</div>
            <div className="text-pitch-400 text-sm">Crea o únete a un grupo</div>
          </div>
          <ArrowRight size={16} className="text-pitch-500 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => router.push("/tabla")}
          className="w-full card p-5 flex items-center gap-4 hover:border-gold-500/40 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
            <Trophy size={24} className="text-gold-400" />
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">Tabla de posiciones</div>
            <div className="text-pitch-400 text-sm">Ver el ranking de tu grupo</div>
          </div>
          <ArrowRight size={16} className="text-pitch-500 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => router.push("/pronosticos")}
          className="w-full card p-5 flex items-center gap-4 hover:border-pitch-500/60 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-pitch-500/20 rounded-xl flex items-center justify-center group-hover:bg-pitch-500/30 transition-colors">
            <Zap size={24} className="text-pitch-400" />
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">Mis pronósticos</div>
            <div className="text-pitch-400 text-sm">Pronostica resultados del Mundial</div>
          </div>
          <ArrowRight size={16} className="text-pitch-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <p className="text-center text-pitch-600 text-xs mt-8 pb-4">
        Marcador exacto = 3pts · Ganador = 1pt · Campeón = 5pts
      </p>
    </div>
  );
}
