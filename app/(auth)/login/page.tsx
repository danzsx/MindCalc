"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isAdmin } from "@/lib/admin";
import { Brain, Sparkles, ArrowRight, UserPlus, LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function redirectAfterAuth(userId: string, userEmail?: string) {
    if (isAdmin(userEmail)) {
      router.push("/dashboard");
      return;
    }

    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("level")
      .eq("id", userId)
      .single();

    if (!profile || profile.level === 1) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSignIn() {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await redirectAfterAuth(data.user.id, data.user.email);
    }
    setLoading(false);
  }

  async function handleSignUp() {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push("/onboarding");
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSignIn();
    }
  }

  return (
    <div className="relative w-full max-w-md landing-fade-up">
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl blur-3xl opacity-30 pointer-events-none" />

      {/* Main card */}
      <div className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/20">
        {/* Logo & branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            {/* Icon glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl blur-xl opacity-40" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent font-[var(--font-family-display)]">
            MindCalc
          </h1>
          <p className="mt-2 text-white/50 text-sm text-center">
            Seu treino de mente para os números
          </p>

          {/* Decorative sparkle badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span className="text-xs text-teal-300 font-medium">Aprenda brincando</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/70">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/70">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            {/* Sign In - Primary */}
            <button
              onClick={handleSignIn}
              disabled={loading || !email || !password}
              className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30 font-medium">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Sign Up - Secondary */}
            <button
              onClick={handleSignUp}
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.12] text-white/80 font-medium text-sm hover:bg-white/[0.1] hover:text-white hover:border-white/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar conta</span>
            </button>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-8 flex items-center justify-center">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-teal-500/40 to-cyan-500/40" />
        </div>
      </div>
    </div>
  );
}
