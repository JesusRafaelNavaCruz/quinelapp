"use client";
import { useState, useEffect } from "react";
import { subscribeMatches } from "@/lib/db";
import type { Match } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Shield } from "lucide-react";

const PHASE_LABELS: Record<string, string> = {
  grupos: "Grupos", octavos: "Octavos", cuartos: "Cuartos",
  semis: "Semis", tercer: "3er lugar", final: "Final",
};

export default function AdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});

  useEffect(() => {
    return subscribeMatches(setMatches);
  }, []);

  function setScore(matchId: string, side: "home" | "away", val: string) {
    setScores((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: val },
    }));
  }

  async function handleUpdate(match: Match) {
    const s = scores[match.id];
    if (!s) return;
    const homeScore = parseInt(s.home);
    const awayScore = parseInt(s.away);
    if (isNaN(homeScore) || isNaN(awayScore)) return;

    setUpdating(match.id);
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id, homeScore, awayScore }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      alert(`✅ Resultado guardado: ${homeScore}-${awayScore}`);
      setScores((prev) => {
        const next = { ...prev };
        delete next[match.id];
        return next;
      });
    } catch (e) {
      alert("❌ Error al guardar el resultado");
    }
    setUpdating(null);
  }

  const finishedMatches = matches.filter((m) => m.status === "finished");
  const pendingMatches = matches.filter((m) => m.status !== "finished");

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 pt-6 pb-6">
        <Shield size={24} className="text-gold-400" />
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide">PANEL ADMIN</h1>
          <p className="text-pitch-400 text-sm">Actualizar resultados de partidos</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Partidos pendientes */}
        <div>
          <h2 className="font-display text-xl text-pitch-300 tracking-wide mb-3">PARTIDOS PENDIENTES</h2>
          <div className="space-y-2">
            {pendingMatches.map((match) => {
              const s = scores[match.id] ?? { home: "", away: "" };
              return (
                <div key={match.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-pitch-400 text-xs">
                      {format(new Date(match.date), "EEE d MMM · HH:mm", { locale: es })} · {PHASE_LABELS[match.phase]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      match.status === "live"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-pitch-800 text-pitch-500"
                    }`}>
                      {match.status === "live" ? "🔴 En vivo" : "Por jugar"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex-1 text-white font-medium">{match.homeTeam}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" min={0} max={20}
                        value={s.home}
                        onChange={(e) => setScore(match.id, "home", e.target.value)}
                        placeholder="0"
                        className="w-14 bg-pitch-800 border border-pitch-600/40 rounded-lg px-2 py-2 text-white font-display text-xl text-center focus:outline-none focus:border-pitch-400"
                      />
                      <span className="text-pitch-500 font-display">-</span>
                      <input
                        type="number" min={0} max={20}
                        value={s.away}
                        onChange={(e) => setScore(match.id, "away", e.target.value)}
                        placeholder="0"
                        className="w-14 bg-pitch-800 border border-pitch-600/40 rounded-lg px-2 py-2 text-white font-display text-xl text-center focus:outline-none focus:border-pitch-400"
                      />
                    </div>
                    <span className="flex-1 text-white font-medium text-right">{match.awayTeam}</span>
                    <button
                      onClick={() => handleUpdate(match)}
                      disabled={!s.home || !s.away || updating === match.id}
                      className="ml-2 bg-pitch-500 hover:bg-pitch-400 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-1"
                    >
                      {updating === match.id ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : "Guardar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partidos terminados */}
        {finishedMatches.length > 0 && (
          <div>
            <h2 className="font-display text-xl text-pitch-300 tracking-wide mb-3">RESULTADOS GUARDADOS</h2>
            <div className="space-y-2">
              {finishedMatches.map((match) => (
                <div key={match.id} className="card p-4 opacity-70">
                  <div className="flex items-center gap-4">
                    <span className="flex-1 text-pitch-300">{match.homeTeam}</span>
                    <span className="font-display text-2xl text-white">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <span className="flex-1 text-pitch-300 text-right">{match.awayTeam}</span>
                    <span className="text-pitch-500 text-xs">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
