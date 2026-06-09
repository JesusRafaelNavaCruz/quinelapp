"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { joinGroup, getGroup } from "@/lib/db";
import type { Group } from "@/types";

export default function UnirsePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    async function join() {
      const u = getOrCreateUser();
      const g = await getGroup(groupId);
      if (!g) { setStatus("error"); return; }
      setGroup(g);
      await joinGroup(groupId, u.id);
      setStatus("success");
      setTimeout(() => router.push(`/pronosticos?grupo=${groupId}`), 1500);
    }
    join();
  }, [groupId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-8 max-w-sm w-full text-center animate-slide-up">
        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-2 border-pitch-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-pitch-300">Uniéndote al grupo…</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display text-2xl text-white tracking-wide mb-2">¡BIENVENIDO!</h2>
            <p className="text-pitch-300">Te uniste a <span className="text-white font-medium">{group?.name}</span></p>
            <p className="text-pitch-400 text-sm mt-2">Redirigiendo a pronósticos…</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">😕</div>
            <h2 className="font-display text-2xl text-white tracking-wide mb-2">GRUPO NO ENCONTRADO</h2>
            <p className="text-pitch-300 mb-6">El código de invitación no es válido o expiró.</p>
            <button onClick={() => router.push("/")} className="bg-pitch-500 hover:bg-pitch-400 text-white px-6 py-3 rounded-xl transition-all">
              Ir al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}
