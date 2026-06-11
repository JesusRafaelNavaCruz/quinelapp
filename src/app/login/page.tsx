"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/lib/AuthContext";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace(redirect);
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pitch-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function errorMessage(code: string): string {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Correo o contraseña incorrectos.";
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con ese correo.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      case "auth/invalid-email":
        return "El correo no es válido.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Espera unos minutos.";
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "";
      case "auth/unauthorized-domain":
        return "Este dominio no está autorizado en Firebase. Revisa la configuración de Authentication.";
      default:
        return "Algo salió mal. Intenta de nuevo.";
    }
  }

  async function handleSubmit() {
    if (!email || !password) return;
    if (mode === "register" && !name.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, name.trim());
      }
      router.replace(redirect);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      const msg = errorMessage(code);
      if (msg) setError(msg);
    }
    setSubmitting(false);
  }

  async function handleGoogle() {
    setSubmitting(true);
    setError("");
    try {
      await signInWithGoogle();
      router.replace(redirect);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      const msg = errorMessage(code);
      if (msg) setError(msg);
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-md animate-slide-up">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="font-display text-5xl text-white tracking-wide">CANCHA 26</h1>
          <p className="font-display text-3xl text-gold-400 tracking-widest">PRONOSTICOS</p>
        </div>

        {/* Tab login / registro */}
        <div className="flex gap-2 mb-6 p-1 bg-pitch-800/60 rounded-xl">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "login" ? "bg-pitch-500 text-white" : "text-pitch-400 hover:text-white"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "register" ? "bg-pitch-500 text-white" : "text-pitch-400 hover:text-white"
            }`}
          >
            Registrarse
          </button>
        </div>

        <div className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm text-pitch-300 mb-2">Tu nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llaman?"
                maxLength={30}
                className="w-full bg-pitch-800/60 border border-pitch-600/40 rounded-xl px-4 py-3 text-white placeholder-pitch-500 focus:outline-none focus:border-pitch-400 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-pitch-300 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-pitch-800/60 border border-pitch-600/40 rounded-xl px-4 py-3 text-white placeholder-pitch-500 focus:outline-none focus:border-pitch-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-pitch-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-pitch-800/60 border border-pitch-600/40 rounded-xl px-4 py-3 text-white placeholder-pitch-500 focus:outline-none focus:border-pitch-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !email || !password || (mode === "register" && !name.trim())}
            className="w-full bg-pitch-500 hover:bg-pitch-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pitch-700/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-pitch-900 px-3 text-pitch-500 text-xs">o continúa con</span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={submitting}
            className="w-full card py-3 flex items-center justify-center gap-3 hover:border-pitch-400/60 transition-all disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-pitch-300">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
