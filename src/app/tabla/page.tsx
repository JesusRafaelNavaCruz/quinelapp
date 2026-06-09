"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { subscribeStandings, getUserGroups } from "@/lib/db";
import type { Standing, Group, User } from "@/types";
import { ChevronLeft, Trophy, Medal, ChevronDown } from "lucide-react";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy size={16} className="text-gold-400" />;
  if (rank === 2) return <Medal size={16} className="text-gray-300" />;
  if (rank === 3) return <Medal size={16} className="text-amber-600" />;
  return <span className="text-pitch-500 text-sm w-4 text-center">{rank}</span>;
}

export default function TablaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupIdParam = searchParams.get("grupo");

  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [standings, setStandings] = useState<Standing[]>([]);
  const [showGroupSelect, setShowGroupSelect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getOrCreateUser();
    if (!u.name) { router.push("/"); return; }
    setUser(u);
    getUserGroups(u.id).then((g) => {
      setGroups(g);
      setSelectedGroupId(groupIdParam ?? g[0]?.id ?? "");
    });
  }, []);

  useEffect(() => {
    if (!selectedGroupId) return;
    setLoading(true);
    const unsub = subscribeStandings(selectedGroupId, (s) => {
      setStandings(s);
      setLoading(false);
    });
    return unsub;
  }, [selectedGroupId]);

  const myStanding = standings.find((s) => s.userId === user?.id);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pt-6 pb-4">
        <button onClick={() => router.push("/")} className="text-pitch-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide">TABLA DE POSICIONES</h1>
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
              <p className="text-pitch-400 text-xs">Grupo</p>
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

      {/* Mi posición */}
      {myStanding && (
        <div className="card p-4 mb-4 border-pitch-500/30 bg-pitch-500/5 animate-fade-in">
          <p className="text-pitch-400 text-xs mb-2">Tu posición</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8">
              <RankIcon rank={myStanding.rank ?? 0} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{myStanding.userName}</p>
              <p className="text-pitch-400 text-xs">
                {myStanding.exactScores} marcadores exactos · {myStanding.correctWinners} ganadores
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl text-pitch-400">{myStanding.totalPoints}</p>
              <p className="text-pitch-500 text-xs">puntos</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabla completa */}
      {!selectedGroupId ? (
        <div className="card p-8 text-center">
          <p className="text-pitch-400">Selecciona un grupo para ver la tabla.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-pitch-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : standings.length === 0 ? (
        <div className="card p-8 text-center">
          <Trophy size={40} className="text-pitch-600 mx-auto mb-3" />
          <p className="text-pitch-400">Aún no hay puntos en este grupo.</p>
          <p className="text-pitch-500 text-sm mt-1">Los puntos aparecerán cuando se actualicen resultados.</p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-slide-up">
          {/* Encabezado */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-pitch-700/40 text-pitch-500 text-xs uppercase tracking-wider">
            <div className="w-6">#</div>
            <div className="flex-1">Jugador</div>
            <div className="w-16 text-center">Exactos</div>
            <div className="w-16 text-center">Puntos</div>
          </div>

          {standings.map((s, i) => (
            <div
              key={s.userId}
              className={`flex items-center gap-3 px-4 py-4 border-b border-pitch-800/40 last:border-0 transition-colors ${
                s.userId === user?.id ? "bg-pitch-500/10" : "hover:bg-pitch-800/30"
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-6 flex items-center justify-center">
                <RankIcon rank={s.rank ?? i + 1} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${s.userId === user?.id ? "text-pitch-300" : "text-white"}`}>
                  {s.userName}
                  {s.userId === user?.id && <span className="text-pitch-500 text-xs ml-1">(tú)</span>}
                </p>
                <p className="text-pitch-500 text-xs">{s.correctWinners} ganadores</p>
              </div>
              <div className="w-16 text-center">
                <span className="text-gold-400 text-sm font-medium">{s.exactScores}</span>
              </div>
              <div className="w-16 text-center">
                <span className="font-display text-xl text-white">{s.totalPoints}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-4 card p-4">
        <p className="text-pitch-500 text-xs font-medium mb-2 uppercase tracking-wider">Sistema de puntos</p>
        <div className="space-y-1 text-xs text-pitch-400">
          <div className="flex justify-between">
            <span>Marcador exacto</span>
            <span className="text-gold-400 font-medium">3 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Ganador / empate correcto</span>
            <span className="text-pitch-300 font-medium">1 pt</span>
          </div>
          <div className="flex justify-between">
            <span>Campeón del mundial</span>
            <span className="text-gold-400 font-medium">5 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
