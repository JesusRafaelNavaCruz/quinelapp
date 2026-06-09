"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { createGroup, getUserGroups, joinGroup } from "@/lib/db";
import type { Group, User } from "@/types";
import { nanoid } from "nanoid";
import { Plus, Link2, LogIn, Users, Copy, Check, ChevronLeft, Crown } from "lucide-react";

export default function GruposPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "create" | "join">("list");
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getOrCreateUser();
    if (!u.name) { router.push("/"); return; }
    setUser(u);
    loadGroups(u.id);
  }, []);

  async function loadGroups(userId: string) {
    setLoading(true);
    const g = await getUserGroups(userId);
    setGroups(g);
    setLoading(false);
  }

  async function handleCreate() {
    if (!groupName.trim() || !user) return;
    setSaving(true);
    const id = nanoid(6).toUpperCase();
    const group: Group = {
      id,
      name: groupName.trim(),
      adminId: user.id,
      members: [user.id],
      createdAt: Date.now(),
    };
    await createGroup(group);
    setGroups((prev) => [...prev, group]);
    setMode("list");
    setGroupName("");
    setSaving(false);
  }

  async function handleJoin() {
    if (!joinCode.trim() || !user) return;
    setSaving(true);
    setError("");
    const code = joinCode.trim().toUpperCase();
    const ok = await joinGroup(code, user.id);
    if (ok) {
      await loadGroups(user.id);
      setMode("list");
      setJoinCode("");
    } else {
      setError("No se encontró un grupo con ese código.");
    }
    setSaving(false);
  }

  function copyInviteLink(groupId: string) {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/unirse/${groupId}`;
    navigator.clipboard.writeText(url);
    setCopied(groupId);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pt-6 pb-6">
        <button onClick={() => router.push("/")} className="text-pitch-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide">MIS GRUPOS</h1>
          <p className="text-pitch-400 text-sm">Quinielas en las que participas</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      {mode === "list" && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("create")}
            className="flex-1 flex items-center justify-center gap-2 bg-pitch-500 hover:bg-pitch-400 text-white py-3 rounded-xl font-medium transition-all"
          >
            <Plus size={16} />
            Crear grupo
          </button>
          <button
            onClick={() => setMode("join")}
            className="flex-1 flex items-center justify-center gap-2 card border-pitch-600/40 hover:border-pitch-400/60 text-pitch-300 hover:text-white py-3 rounded-xl font-medium transition-all"
          >
            <LogIn size={16} />
            Unirse
          </button>
        </div>
      )}

      {/* Formulario crear */}
      {mode === "create" && (
        <div className="card p-5 mb-6 animate-slide-up">
          <h2 className="font-display text-xl text-white tracking-wide mb-4">NUEVO GRUPO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-pitch-300 mb-2">Nombre del grupo</label>
              <input
                autoFocus
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Ej. Los Compadres, Trabajo 2026…"
                maxLength={40}
                className="w-full bg-pitch-800/60 border border-pitch-600/40 rounded-xl px-4 py-3 text-white placeholder-pitch-500 focus:outline-none focus:border-pitch-400 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setMode("list"); setGroupName(""); }} className="flex-1 card py-3 text-pitch-300 hover:text-white transition-colors rounded-xl">
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!groupName.trim() || saving}
                className="flex-1 bg-pitch-500 hover:bg-pitch-400 disabled:opacity-40 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario unirse */}
      {mode === "join" && (
        <div className="card p-5 mb-6 animate-slide-up">
          <h2 className="font-display text-xl text-white tracking-wide mb-4">UNIRSE A UN GRUPO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-pitch-300 mb-2">Código de invitación (6 caracteres)</label>
              <input
                autoFocus
                type="text"
                value={joinCode}
                onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="Ej. AB12CD"
                maxLength={6}
                className="w-full bg-pitch-800/60 border border-pitch-600/40 rounded-xl px-4 py-3 text-white placeholder-pitch-500 focus:outline-none focus:border-pitch-400 transition-colors font-mono text-center text-xl tracking-widest uppercase"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setMode("list"); setJoinCode(""); setError(""); }} className="flex-1 card py-3 text-pitch-300 hover:text-white transition-colors rounded-xl">
                Cancelar
              </button>
              <button
                onClick={handleJoin}
                disabled={joinCode.length < 6 || saving}
                className="flex-1 bg-pitch-500 hover:bg-pitch-400 disabled:opacity-40 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Unirse"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de grupos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-pitch-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : groups.length === 0 ? (
        <div className="card p-8 text-center">
          <Users size={40} className="text-pitch-600 mx-auto mb-3" />
          <p className="text-pitch-400">Aún no perteneces a ningún grupo.</p>
          <p className="text-pitch-500 text-sm mt-1">Crea uno o pide el código a tu amigo.</p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {groups.map((g) => (
            <div key={g.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{g.name}</h3>
                    {g.adminId === user?.id && (
                      <Crown size={14} className="text-gold-400" />
                    )}
                  </div>
                  <p className="text-pitch-400 text-sm font-mono mt-0.5">
                    Código: <span className="text-pitch-300 tracking-widest">{g.id}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-pitch-400 text-sm">
                  <Users size={14} />
                  {g.members.length}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/pronosticos?grupo=${g.id}`)}
                  className="flex-1 bg-pitch-500/20 hover:bg-pitch-500/30 text-pitch-300 hover:text-white text-sm py-2 rounded-lg transition-all"
                >
                  Pronosticar
                </button>
                <button
                  onClick={() => router.push(`/tabla?grupo=${g.id}`)}
                  className="flex-1 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-sm py-2 rounded-lg transition-all"
                >
                  Tabla
                </button>
                <button
                  onClick={() => copyInviteLink(g.id)}
                  className="px-3 bg-pitch-800/60 hover:bg-pitch-700/60 text-pitch-400 hover:text-white rounded-lg transition-all"
                  title="Copiar link de invitación"
                >
                  {copied === g.id ? <Check size={16} className="text-pitch-400" /> : <Link2 size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
