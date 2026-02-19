"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isAdmin } from "@/lib/admin";
import { ArrowRight, UserPlus, LogIn, Mail, Lock } from "lucide-react";
import { NumetriaLogo } from "@/components/shared/NumetriaLogo";

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
      <div
        className="absolute inset-0 rounded-3xl blur-3xl opacity-25 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(55, 112, 191, 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Main card */}
      <div
        className="relative rounded-3xl p-8 md:p-10"
        style={{
          background: "rgba(13, 29, 58, 0.75)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(141, 194, 255, 0.15)",
          boxShadow:
            "0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(141, 194, 255, 0.08)",
        }}
      >
        {/* Logo & branding */}
        <div className="flex flex-col items-center mb-8">
          {/* Icon container */}
          <div className="relative mb-5">
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-50"
              style={{ background: "rgba(55, 112, 191, 0.4)" }}
            />
            <div
              className="relative flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(37, 88, 160, 0.8) 0%, rgba(55, 112, 191, 0.9) 100%)",
                border: "1px solid rgba(141, 194, 255, 0.3)",
                boxShadow: "0 8px 24px rgba(55, 112, 191, 0.35)",
              }}
            >
              {/* Rhombus mark in Ice Blue for visibility on blue bg */}
              <svg
                width="34"
                height="34"
                viewBox="0 0 30 30"
                fill="none"
                aria-hidden="true"
              >
                <path
                  fill="#f0f4ff"
                  d="M22.64 0 L30 4.75 L30 23.38 L25.71 30 L6.20 30 L0 26.00 L0 6.92 L4.48 0 Z"
                />
              </svg>
            </div>
          </div>

          <NumetriaLogo variant="full" size={36} color="light" />

          <p
            className="mt-2 text-sm text-center"
            style={{ color: "#6b89b4" }}
          >
            Domine os números. Treine sua mente.
          </p>

          {/* Badge */}
          <div
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background: "rgba(206, 242, 109, 0.08)",
              border: "1px solid rgba(206, 242, 109, 0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#cef26d" }}
            />
            <span className="text-xs font-medium" style={{ color: "#b8d85a" }}>
              Precisão que flui naturalmente
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium"
              style={{ color: "rgba(168, 192, 224, 0.8)" }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "rgba(107, 137, 180, 0.6)" }}
              />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-200 disabled:opacity-50 outline-none"
                style={{
                  background: "rgba(8, 15, 30, 0.5)",
                  border: "1px solid rgba(141, 194, 255, 0.12)",
                  color: "#f0f4ff",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(55, 112, 191, 0.5)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(206, 242, 109, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.border =
                    "1px solid rgba(141, 194, 255, 0.12)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
              style={{ color: "rgba(168, 192, 224, 0.8)" }}
            >
              Senha
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "rgba(107, 137, 180, 0.6)" }}
              />
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-200 disabled:opacity-50 outline-none"
                style={{
                  background: "rgba(8, 15, 30, 0.5)",
                  border: "1px solid rgba(141, 194, 255, 0.12)",
                  color: "#f0f4ff",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(55, 112, 191, 0.5)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(206, 242, 109, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.border =
                    "1px solid rgba(141, 194, 255, 0.12)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(141, 194, 255, 0.06)",
                border: "1px solid rgba(141, 194, 255, 0.2)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#8dc2ff" }}
              />
              <p className="text-sm" style={{ color: "#8dc2ff" }}>
                {error}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            {/* Sign In - Primary (Sunny Herb lime) */}
            <button
              onClick={handleSignIn}
              disabled={loading || !email || !password}
              className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#cef26d",
                color: "#080f1e",
                boxShadow: "0 8px 24px rgba(206, 242, 109, 0.28)",
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: "rgba(8, 15, 30, 0.2)",
                      borderTopColor: "#080f1e",
                    }}
                  />
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
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(141, 194, 255, 0.08)" }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(107, 137, 180, 0.6)" }}
              >
                ou
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(141, 194, 255, 0.08)" }}
              />
            </div>

            {/* Sign Up - Ghost */}
            <button
              onClick={handleSignUp}
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "rgba(55, 112, 191, 0.08)",
                border: "1px solid rgba(55, 112, 191, 0.2)",
                color: "#a8c0e0",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(55, 112, 191, 0.15)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(55, 112, 191, 0.35)";
                (e.currentTarget as HTMLButtonElement).style.color = "#f0f4ff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(55, 112, 191, 0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(55, 112, 191, 0.2)";
                (e.currentTarget as HTMLButtonElement).style.color = "#a8c0e0";
              }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar conta</span>
            </button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-8 flex items-center justify-center">
          <div
            className="h-0.5 w-12 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(55, 112, 191, 0.4), rgba(206, 242, 109, 0.4))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
