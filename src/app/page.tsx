"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateUser, saveUser } from "@/lib/user";
import { upsertUser } from "@/lib/db";
import type { User } from "@/types";
import { Trophy, Users, Zap, ArrowRight } from "lucide-react";

const AVATARS = ["⚽", "🏆", "🥅", "🧤", "👟", "🎯", "🔥", "⭐", "🦅", "🐆"];

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<"loading" | "setup" | "home">("loading");
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = getOrCreateUser();
    setUser(u);
    setAvatar(u.avatar ?? AVATARS[0]);
    if (u.name) {
      setStep("home");
    } else {
      setStep("setup");
    }
  }, []);

  async function handleSave() {
    if (!name.trim() || !user) return;
    setSaving(true);
    const updated: User = { ...user, name: name.trim(), avatar };
    saveUser(updated);
    await upsertUser(updated);
    setUser(updated);
    setSaving(false);
    setStep("home");
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pitch-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === "setup") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚽</div>
            <h1 className="font-display text-5xl text-white tracking-wide">
              QUINIELA
            </h1>
            <p className="font-display text-3xl text-gold-400 tracking-widest">
              MUNDIAL 2026
            </p>
            <p className="text-pitch-300 mt-2 text-sm">
              Crea tu perfil para empezar a pronosticar
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-pitch-300 mb-2">Tu nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="¿Cómo te llamas?"
                maxLength={30}
                className="w-full bg-pitch-800/60 border border-pitch-600/40 rounded-xl px-4 py-3 text-white placeholder-pitch-500 focus:outline-none focus:border-pitch-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-pitch-300 mb-3">Elige tu avatar</label>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`text-2xl h-12 rounded-xl transition-all ${
                      avatar === a
                        ? "bg-pitch-500 scale-110 shadow-lg shadow-pitch-500/30"
                        : "bg-pitch-800/60 hover:bg-pitch-700/60"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!name.trim() || saving}
              className="w-full bg-pitch-500 hover:bg-pitch-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Comenzar
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center pt-12 pb-8 animate-fade-in">
        <p className="text-4xl mb-2">{user?.avatar}</p>
        <h2 className="text-pitch-300 text-sm">Bienvenido,</h2>
        <h1 className="font-display text-4xl text-white tracking-wide">{user?.name}</h1>
      </div>

      {/* Hero */}
      <div className="card p-6 mb-6 animate-slide-up text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pitch-500/10 to-gold-500/5" />
        <div className="relative">
          <p className="font-display text-6xl text-white tracking-widest">MUNDIAL</p>
          <p className="font-display text-3xl text-gold-400 tracking-widest">FIFA 2026</p>
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
            <div className="text-pitch-400 text-sm">Crea o únete a una quiniela</div>
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
            <div className="text-pitch-400 text-sm">Pronostica resultados</div>
          </div>
          <ArrowRight size={16} className="text-pitch-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-pitch-600 text-xs mt-8 pb-4">
        Sistema de puntos: Marcador exacto = 3pts · Ganador = 1pt · Campeón = 5pts
      </p>
    </div>
  );
}
