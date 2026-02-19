"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, Sparkles, Zap, BarChart3, Loader2, TrendingUp, Star, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const features = [
  { label: "1 treino por dia", free: true, pro: true },
  { label: "Nível máximo 5", free: true, pro: true },
  { label: "Treinos ilimitados", free: false, pro: true },
  { label: "Nível máximo 10", free: false, pro: true },
  { label: "Análise detalhada", free: false, pro: true },
];

const whyProReasons = [
  { icon: Zap, text: "Treinos sem limite, no seu ritmo" },
  { icon: TrendingUp, text: "Níveis que acompanham seu crescimento" },
  { icon: BarChart3, text: "Veja como você está evoluindo, com detalhes" },
  { icon: Sparkles, text: "Exercícios pensados pra você, sob medida" },
];

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const { plan } = useAuth();
  const searchParams = useSearchParams();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Assinatura realizada com sucesso! Bem-vindo ao Pro!");
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erro ao iniciar checkout. Tente novamente.");
      }
    } catch {
      toast.error("Erro ao iniciar checkout. Tente novamente.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handlePortal = async () => {
    setIsPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erro ao abrir portal. Tente novamente.");
      }
    } catch {
      toast.error("Erro ao abrir portal. Tente novamente.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const isFree = plan === "free";
  const isPro = plan === "pro";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-20">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{
            background: "rgba(206, 242, 109, 0.08)",
            border: "1px solid rgba(206, 242, 109, 0.2)",
          }}
        >
          <Star className="w-3.5 h-3.5" style={{ color: "#cef26d" }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#cef26d" }}
          >
            Planos Numetria
          </span>
        </div>

        <h1
          className="text-5xl md:text-6xl font-bold mb-5 tracking-tight"
          style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
        >
          Escolha seu plano
        </h1>
        <p className="text-lg md:text-xl font-medium" style={{ color: "#6b89b4" }}>
          Treine no ritmo que faz sentido pra você.
        </p>
      </motion.div>

      {/* ── Plans Grid — flex-col mobile, flex-row md+ ── */}
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto mb-20">

        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="flex-1"
        >
          <div
            className="relative h-full rounded-[32px] p-8 md:p-10 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(13, 29, 58, 0.6)",
              border: "1px solid rgba(141, 194, 255, 0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            {isFree && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4"
                style={{
                  background: "rgba(141, 194, 255, 0.1)",
                  border: "1px solid rgba(141, 194, 255, 0.2)",
                  color: "#8dc2ff",
                }}
              >
                Plano atual
              </div>
            )}

            <h2
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
            >
              Free
            </h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span
                className="text-5xl font-bold"
                style={{ color: "#f0f4ff", fontFamily: "var(--font-family-display)" }}
              >
                R$ 0
              </span>
              <span className="font-medium" style={{ color: "#6b89b4" }}>/mês</span>
            </div>

            <ul className="space-y-4 mb-10">
              {features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  {feature.free ? (
                    <div
                      className="p-1.5 rounded-full shrink-0"
                      style={{ background: "rgba(55, 112, 191, 0.15)" }}
                    >
                      <Check className="w-4 h-4" style={{ color: "#8dc2ff" }} />
                    </div>
                  ) : (
                    <div
                      className="p-1.5 rounded-full shrink-0"
                      style={{ background: "rgba(141, 194, 255, 0.04)" }}
                    >
                      <X className="w-4 h-4" style={{ color: "#1e3355" }} />
                    </div>
                  )}
                  <span
                    className="font-medium"
                    style={{ color: feature.free ? "#a8c0e0" : "#1e3355" }}
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className="w-full py-4 rounded-2xl font-bold cursor-default"
              style={{
                background: "rgba(141, 194, 255, 0.04)",
                border: "1px solid rgba(141, 194, 255, 0.08)",
                color: "#2a4060",
              }}
              disabled
            >
              {isFree ? "Plano Atual" : "Free"}
            </button>
          </div>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="flex-1 relative group"
        >
          {/* Lime glow behind card */}
          <div
            className="absolute inset-0 rounded-[32px] -z-10 opacity-25 group-hover:opacity-40 transition-opacity duration-500"
            style={{
              background: "radial-gradient(ellipse at 50% 100%, rgba(206, 242, 109, 0.5) 0%, transparent 65%)",
              filter: "blur(24px)",
              transform: "translateY(12px) scale(0.9)",
            }}
          />

          <div
            className="relative h-full rounded-[32px] p-8 md:p-10 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(13, 29, 58, 0.75)",
              border: "1px solid rgba(206, 242, 109, 0.28)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow:
                "0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(206, 242, 109, 0.08), inset 0 1px 0 rgba(206, 242, 109, 0.08)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  background: "rgba(206, 242, 109, 0.12)",
                  border: "1px solid rgba(206, 242, 109, 0.28)",
                  color: "#cef26d",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Popular
              </div>
              {isPro && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: "rgba(206, 242, 109, 0.08)",
                    border: "1px solid rgba(206, 242, 109, 0.2)",
                    color: "#cef26d",
                  }}
                >
                  Atual
                </div>
              )}
            </div>

            <h2
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
            >
              Pro
            </h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span
                className="text-5xl font-bold"
                style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
              >
                R$ 19,90
              </span>
              <span className="font-medium" style={{ color: "#6b89b4" }}>/mês</span>
            </div>

            <ul className="space-y-4 mb-10">
              {features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  <div
                    className="p-1.5 rounded-full shrink-0"
                    style={{ background: "rgba(206, 242, 109, 0.12)" }}
                  >
                    <Check className="w-4 h-4" style={{ color: "#cef26d" }} />
                  </div>
                  <span className="font-medium" style={{ color: "#f0f4ff" }}>
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            {isPro ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-bold transition-all duration-300"
                style={{
                  background: "rgba(206, 242, 109, 0.08)",
                  border: "1px solid rgba(206, 242, 109, 0.22)",
                  color: "#cef26d",
                }}
                onClick={handlePortal}
                disabled={isPortalLoading}
              >
                {isPortalLoading ? (
                  <Loader2 className="size-5 animate-spin mx-auto" style={{ color: "#cef26d" }} />
                ) : (
                  "Gerenciar assinatura"
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 32px rgba(206, 242, 109, 0.35)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                style={{ background: "#cef26d", color: "#080f1e" }}
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? (
                  <Loader2 className="size-5 animate-spin" style={{ color: "#080f1e" }} />
                ) : (
                  <>
                    Assinar Pro
                    <ArrowRight className="size-4" />
                  </>
                )}
              </motion.button>
            )}

            <p className="text-center text-xs mt-4" style={{ color: "#2a4060" }}>
              Cancele quando quiser. Sem taxas escondidas.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Benefits Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div
          className="rounded-[32px] p-8 md:p-12"
          style={{
            background: "rgba(13, 29, 58, 0.6)",
            border: "1px solid rgba(141, 194, 255, 0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold mb-10 text-center"
            style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
          >
            O que muda com o Pro?
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {whyProReasons.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.08 }}
                className="flex items-start gap-4"
              >
                <div
                  className="p-3 rounded-2xl shrink-0"
                  style={{
                    background: "rgba(55, 112, 191, 0.12)",
                    border: "1px solid rgba(55, 112, 191, 0.22)",
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#8dc2ff" }} />
                </div>
                <p
                  className="text-lg font-medium leading-relaxed pt-1"
                  style={{ color: "#a8c0e0" }}
                >
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
