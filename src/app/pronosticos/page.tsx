"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import {
  getMatches,
  subscribePredictions,
  savePrediction,
  saveChampionPrediction,
  getChampionPrediction,
  getUserGroups,
} from "@/lib/db";
import type { Match, Prediction, ChampionPrediction, Group, User } from "@/types";
import { ChevronLeft, Trophy, Lock, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { WORLD_CUP_TEAMS } from "@/lib/matches-data";

const PHASE_LABELS: Record<string, string> = {
  grupos: "Fase de grupos",
  octavos: "Octavos de final",
  cuartos: "Cuartos de final",
  semis: "Semifinales",
  tercer: "Tercer lugar",
  final: "Gran Final",
};

function FlagImg({ code, size = 24 }: { code: string; size?: number }) {
  if (!code || code === "un") return <span style={{ fontSize: size * 0.8 }}>🏳️</span>;
  return (
    <img
      src={`https://flagcdn.com/w${size * 2}/${code.toLowerCase()}.png`}
      alt={code}
      width={size * 1.5}
      height={size}
      loading="lazy"
      decoding="async"
      className="rounded-sm object-cover"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function MatchCard({
  match,
  prediction,
  onSave,
  locked,
}: {
  match: Match;
  prediction?: Prediction;
  onSave: (pred: Partial<Prediction>) => void;
  locked: boolean;
}) {
  const [homeScore, setHomeScore] = useState(prediction?.predictedHomeScore ?? 0);
  const [awayScore, setAwayScore] = useState(prediction?.predictedAwayScore ?? 0);
  const [winner, setWinner] = useState<"home" | "draw" | "away">(
    prediction?.winner ?? (homeScore > awayScore ? "home" : homeScore < awayScore ? "away" : "draw")
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sincroniza winner automáticamente con los scores
  function updateScore(side: "home" | "away", val: number) {
    const h = side === "home" ? val : homeScore;
    const a = side === "away" ? val : awayScore;
    if (side === "home") setHomeScore(val); else setAwayScore(val);
    const w = h > a ? "home" : h < a ? "away" : "draw";
    setWinner(w);
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    await onSave({ predictedHomeScore: homeScore, predictedAwayScore: awayScore, winner });
    setDirty(false);
    setSaving(false);
  }

  const hasResult = match.homeScore !== undefined;
  const pts = prediction?.points;

  return (
    <div className={`card p-4 ${locked ? "opacity-75" : ""}`}>
      {/* Fecha y fase */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-pitch-400 text-xs">
          {format(new Date(match.date), "EEE d MMM · HH:mm", { locale: es })}
        </span>
        <div className="flex items-center gap-2">
          {pts !== undefined && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pts > 0 ? "bg-gold-500/20 text-gold-400" : "bg-pitch-800 text-pitch-500"}`}>
              {pts} {pts === 1 ? "pt" : "pts"}
            </span>
          )}
          {locked && <Lock size={12} className="text-pitch-500" />}
        </div>
      </div>

      {/* Partido */}
      <div className="flex items-center gap-3 mb-4">
        {/* Local */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <FlagImg code={match.homeCode} size={28} />
          <span className="text-white text-sm font-medium text-center leading-tight">{match.homeTeam}</span>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-2">
          {hasResult ? (
            <div className="flex items-center gap-1">
              <span className="font-display text-3xl text-white">{match.homeScore}</span>
              <span className="font-display text-2xl text-pitch-500">-</span>
              <span className="font-display text-3xl text-white">{match.awayScore}</span>
            </div>
          ) : locked ? (
            <div className="flex items-center gap-1 opacity-60">
              <span className="font-display text-2xl text-pitch-300">{homeScore}</span>
              <span className="font-display text-xl text-pitch-500">-</span>
              <span className="font-display text-2xl text-pitch-300">{awayScore}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0} max={20}
                value={homeScore}
                onChange={(e) => updateScore("home", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 h-12 bg-pitch-800 border border-pitch-600/40 rounded-xl text-white font-display text-2xl text-center focus:outline-none focus:border-pitch-400"
              />
              <span className="text-pitch-500 font-display text-xl">-</span>
              <input
                type="number"
                min={0} max={20}
                value={awayScore}
                onChange={(e) => updateScore("away", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 h-12 bg-pitch-800 border border-pitch-600/40 rounded-xl text-white font-display text-2xl text-center focus:outline-none focus:border-pitch-400"
              />
            </div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <FlagImg code={match.awayCode} size={28} />
          <span className="text-white text-sm font-medium text-center leading-tight">{match.awayTeam}</span>
        </div>
      </div>

      {/* Ganador seleccionado */}
      {!locked && !hasResult && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            {(["home", "draw", "away"] as const).map((w) => (
              <button
                key={w}
                onClick={() => { setWinner(w); setDirty(true); }}
                className={`px-3 py-1 rounded-full transition-all ${
                  winner === w
                    ? "bg-pitch-500 text-white"
                    : "bg-pitch-800/60 text-pitch-400 hover:bg-pitch-700/60"
                }`}
              >
                {w === "home" ? match.homeTeam.split(" ")[0] : w === "away" ? match.awayTeam.split(" ")[0] : "Empate"}
              </button>
            ))}
          </div>
          {dirty && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs bg-pitch-500 hover:bg-pitch-400 text-white px-3 py-1 rounded-full transition-all flex items-center gap-1"
            >
              {saving ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : "Guardar"}
            </button>
          )}
        </div>
      )}

      {/* Pronóstico guardado */}
      {!dirty && prediction && !locked && !hasResult && (
        <p className="text-pitch-500 text-xs text-center">✓ Pronóstico guardado</p>
      )}
    </div>
  );
}

export default function PronosticosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupIdParam = searchParams.get("grupo");

  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [champion, setChampion] = useState<ChampionPrediction | null>(null);
  const [championTeam, setChampionTeam] = useState("");
  const [activePhase, setActivePhase] = useState("grupos");
  const [showGroupSelect, setShowGroupSelect] = useState(false);

  useEffect(() => {
    const u = getOrCreateUser();
    if (!u.name) { router.push("/"); return; }
    setUser(u);

    // Carga grupos y partidos en paralelo (evita el waterfall de 2 round trips)
    Promise.all([getUserGroups(u.id), getMatches()]).then(([g, m]) => {
      setGroups(g);
      setMatches(m);
      const gid = groupIdParam || g[0]?.id || "";
      setSelectedGroupId(gid);
    });
  }, []);

  useEffect(() => {
    if (!selectedGroupId || !user) return;

    const unsub = subscribePredictions(user.id, selectedGroupId, setPredictions);

    // Recargar campeón siempre que cambie el grupo activo
    setChampion(null);
    setChampionTeam("");
    getChampionPrediction(user.id, selectedGroupId).then((c) => {
      if (c) { setChampion(c); setChampionTeam(c.teamName); }
    });

    return unsub;
  }, [selectedGroupId, user]);

  const predictionMap = Object.fromEntries(predictions.map((p) => [p.matchId, p]));

  async function handleSavePrediction(match: Match, partial: Partial<Prediction>) {
    if (!user || !selectedGroupId) return;
    const pred: Prediction = {
      id: `${user.id}_${match.id}_${selectedGroupId}`,
      userId: user.id,
      matchId: match.id,
      groupId: selectedGroupId,
      winner: partial.winner ?? "home",
      predictedHomeScore: partial.predictedHomeScore ?? 0,
      predictedAwayScore: partial.predictedAwayScore ?? 0,
      updatedAt: Date.now(),
    };
    await savePrediction(pred);
  }

  async function handleSaveChampion() {
    if (!user || !selectedGroupId || !championTeam) return;
    const pred: ChampionPrediction = {
      id: `${user.id}_${selectedGroupId}_champion`,
      userId: user.id,
      groupId: selectedGroupId,
      teamName: championTeam,
      updatedAt: Date.now(),
    };
    await saveChampionPrediction(pred);
    setChampion(pred);
  }

  const phases = [...new Set(matches.map((m) => m.phase))];
  const filteredMatches = matches.filter((m) => m.phase === activePhase);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pt-6 pb-4">
        <button onClick={() => router.push("/")} className="text-pitch-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-3xl text-white tracking-wide">MIS PRONÓSTICOS</h1>
        </div>
      </div>

      {/* Selector de grupo */}
      {groups.length > 0 && (
        <div className="relative mb-4">
          <button
            onClick={() => setShowGroupSelect(!showGroupSelect)}
            className="w-full card p-3 flex items-center justify-between text-left"
          >
            <div>
              <p className="text-pitch-400 text-xs">Grupo activo</p>
              <p className="text-white font-medium">
                {groups.find((g) => g.id === selectedGroupId)?.name ?? "Seleccionar grupo"}
              </p>
            </div>
            <ChevronDown size={16} className={`text-pitch-400 transition-transform ${showGroupSelect ? "rotate-180" : ""}`} />
          </button>
          {showGroupSelect && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 card border-pitch-600/40 overflow-hidden">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setSelectedGroupId(g.id); setShowGroupSelect(false); }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-pitch-800/60 transition-colors ${
                    g.id === selectedGroupId ? "text-pitch-400" : "text-white"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedGroupId && (
        <div className="card p-8 text-center">
          <p className="text-pitch-400 mb-4">Primero únete a un grupo para poder pronosticar.</p>
          <button onClick={() => router.push("/grupos")} className="bg-pitch-500 hover:bg-pitch-400 text-white px-6 py-3 rounded-xl transition-all">
            Ir a grupos
          </button>
        </div>
      )}

      {selectedGroupId && (
        <>
          {/* Campeón del torneo */}
          <div className="card p-4 mb-4 border-gold-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Campeón del mundial (5 pts)</span>
            </div>
            <div className="flex gap-2">
              <select
                value={championTeam}
                onChange={(e) => setChampionTeam(e.target.value)}
                disabled={!!champion?.points}
                className="flex-1 bg-pitch-800/60 border border-pitch-600/40 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/60 transition-colors"
              >
                <option value="">Selecciona un equipo…</option>
                {WORLD_CUP_TEAMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={handleSaveChampion}
                disabled={!championTeam || !!champion?.points}
                className="bg-gold-500/20 hover:bg-gold-500/30 disabled:opacity-40 text-gold-400 px-4 rounded-xl transition-all text-sm"
              >
                {champion?.teamName === championTeam && championTeam ? "✓" : "Guardar"}
              </button>
            </div>
            {champion?.teamName && (
              <p className="text-pitch-400 text-xs mt-2">
                Tu pronóstico: <span className="text-gold-400">{champion.teamName}</span>
                {champion.points !== undefined && ` · ${champion.points} pts`}
              </p>
            )}
          </div>

          {/* Tabs de fase */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {phases.map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activePhase === phase
                    ? "bg-pitch-500 text-white"
                    : "bg-pitch-800/60 text-pitch-400 hover:text-white"
                }`}
              >
                {PHASE_LABELS[phase] ?? phase}
              </button>
            ))}
          </div>

          {/* Partidos */}
          <div className="space-y-3">
            {filteredMatches.map((match) => {
              const locked = Date.now() >= match.date || match.status !== "upcoming";
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={predictionMap[match.id]}
                  locked={locked}
                  onSave={(partial) => handleSavePrediction(match, partial)}
                />
              );
            })}
            {filteredMatches.length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-pitch-400">No hay partidos en esta fase todavía.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
