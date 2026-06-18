"use client";
import { useState, useEffect } from "react";
import { subscribeMatches, getPredictionsForMatch, getUsersByIds } from "@/lib/db";
import type { Match, Prediction, User } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Shield, ChevronDown, Plus, Minus } from "lucide-react";

const PHASE_LABELS: Record<string, string> = {
  grupos: "Grupos", octavos: "Octavos", cuartos: "Cuartos",
  semis: "Semis", tercer: "3er lugar", final: "Final",
};

type PredBreakdown = { preds: Prediction[]; users: Record<string, User> };

export default function AdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [predData, setPredData] = useState<Record<string, PredBreakdown | "loading">>({});

  useEffect(() => {
    return subscribeMatches(setMatches);
  }, []);

  function setScore(matchId: string, side: "home" | "away", val: string) {
    setScores((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: val },
    }));
  }

  function adjustScore(matchId: string, side: "home" | "away", delta: number) {
    const current = parseInt(scores[matchId]?.[side] ?? "0") || 0;
    const next = Math.min(20, Math.max(0, current + delta));
    setScore(matchId, side, String(next));
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

  async function toggleMatch(matchId: string) {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
      return;
    }
    setExpandedMatch(matchId);
    if (matchId in predData) return;

    setPredData((prev) => ({ ...prev, [matchId]: "loading" }));
    const preds = await getPredictionsForMatch(matchId);
    preds.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    const userIds = [...new Set(preds.map((p) => p.userId))];
    const users = await getUsersByIds(userIds);
    setPredData((prev) => ({ ...prev, [matchId]: { preds, users } }));
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
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjustScore(match.id, "home", 1)}
                          className="w-6 h-5 flex items-center justify-center rounded-md bg-pitch-800/60 text-pitch-400 hover:bg-pitch-700/60 hover:text-white transition-colors"
                          aria-label={`Aumentar goles de ${match.homeTeam}`}
                        >
                          <Plus size={12} />
                        </button>
                        <input
                          type="number" min={0} max={20}
                          value={s.home}
                          onChange={(e) => setScore(match.id, "home", e.target.value)}
                          placeholder="0"
                          className="w-14 bg-pitch-800 border border-pitch-600/40 rounded-lg px-2 py-2 text-white font-display text-xl text-center focus:outline-none focus:border-pitch-400"
                        />
                        <button
                          type="button"
                          onClick={() => adjustScore(match.id, "home", -1)}
                          className="w-6 h-5 flex items-center justify-center rounded-md bg-pitch-800/60 text-pitch-400 hover:bg-pitch-700/60 hover:text-white transition-colors"
                          aria-label={`Disminuir goles de ${match.homeTeam}`}
                        >
                          <Minus size={12} />
                        </button>
                      </div>
                      <span className="text-pitch-500 font-display">-</span>
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjustScore(match.id, "away", 1)}
                          className="w-6 h-5 flex items-center justify-center rounded-md bg-pitch-800/60 text-pitch-400 hover:bg-pitch-700/60 hover:text-white transition-colors"
                          aria-label={`Aumentar goles de ${match.awayTeam}`}
                        >
                          <Plus size={12} />
                        </button>
                        <input
                          type="number" min={0} max={20}
                          value={s.away}
                          onChange={(e) => setScore(match.id, "away", e.target.value)}
                          placeholder="0"
                          className="w-14 bg-pitch-800 border border-pitch-600/40 rounded-lg px-2 py-2 text-white font-display text-xl text-center focus:outline-none focus:border-pitch-400"
                        />
                        <button
                          type="button"
                          onClick={() => adjustScore(match.id, "away", -1)}
                          className="w-6 h-5 flex items-center justify-center rounded-md bg-pitch-800/60 text-pitch-400 hover:bg-pitch-700/60 hover:text-white transition-colors"
                          aria-label={`Disminuir goles de ${match.awayTeam}`}
                        >
                          <Minus size={12} />
                        </button>
                      </div>
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
              {finishedMatches.map((match) => {
                const expanded = expandedMatch === match.id;
                const data = predData[match.id];
                return (
                  <div key={match.id} className="card overflow-hidden">
                    <button
                      onClick={() => toggleMatch(match.id)}
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-pitch-800/30 transition-colors"
                    >
                      <span className="flex-1 text-pitch-300 text-sm">{match.homeTeam}</span>
                      <span className="font-display text-2xl text-white">
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <span className="flex-1 text-pitch-300 text-sm text-right">{match.awayTeam}</span>
                      <ChevronDown
                        size={16}
                        className={`text-pitch-500 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {expanded && (
                      <div className="border-t border-pitch-800/60 px-4 pb-4 pt-3">
                        {data === "loading" && (
                          <div className="flex justify-center py-3">
                            <div className="w-5 h-5 border-2 border-pitch-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {data && data !== "loading" && data.preds.length === 0 && (
                          <p className="text-pitch-500 text-sm text-center py-2">
                            Nadie pronosticó este partido
                          </p>
                        )}
                        {data && data !== "loading" && data.preds.length > 0 && (
                          <div className="space-y-2">
                            {data.preds.map((pred) => {
                              const user = data.users[pred.userId];
                              const pts = pred.points ?? 0;
                              return (
                                <div key={pred.id} className="flex items-center gap-3">
                                  <span className="text-lg w-7 text-center flex-shrink-0">
                                    {user?.avatar ?? "⚽"}
                                  </span>
                                  <span className="flex-1 text-white text-sm truncate">
                                    {user?.name ?? "Desconocido"}
                                  </span>
                                  <span className="text-pitch-400 text-sm font-display tabular-nums">
                                    {pred.predictedHomeScore} - {pred.predictedAwayScore}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                    pts === 3
                                      ? "bg-green-500/20 text-green-400"
                                      : pts === 1
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-pitch-800 text-pitch-500"
                                  }`}>
                                    {pts === 3 ? "✓✓ 3 pts" : pts === 1 ? "✓ 1 pt" : "0 pts"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
