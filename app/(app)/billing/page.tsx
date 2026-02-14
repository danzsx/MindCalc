"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, Sparkles, Zap, BarChart3, Brain, Loader2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { UserPlan } from "@/types";

const features = [
  { label: "1 treino por dia", free: true, pro: true },
  { label: "Nível máximo 5", free: true, pro: true },
  { label: "Treinos ilimitados", free: false, pro: true },
  { label: "Nível máximo 10", free: false, pro: true },
  { label: "Análise detalhada", free: false, pro: true },
];

const whyProReasons = [
  {
    icon: Zap,
    text: "Treinos sem limite, no seu ritmo",
  },
  {
    icon: TrendingUp,
    text: "Níveis que acompanham seu crescimento",
  },
  {
    icon: BarChart3,
    text: "Veja como você está evoluindo, com detalhes",
  },
  {
    icon: Sparkles,
    text: "Exercícios pensados pra você, sob medida",
  },
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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent font-[var(--font-family-display)]">
          Seu plano
        </h1>
        <p className="text-lg md:text-xl text-white/60">
          Treine no ritmo que faz sentido pra você.
        </p>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto mb-16">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="mb-6">
              {isFree && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-4">
                  Atual
                </div>
              )}
              <h2 className="text-3xl font-bold mb-2 font-[var(--font-family-display)]">
                Free
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">R$ 0</span>
                <span className="text-white/50">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  {feature.free ? (
                    <div className="bg-teal-500/20 p-1 rounded-full">
                      <Check className="w-4 h-4 text-teal-400" />
                    </div>
                  ) : (
                    <div className="bg-white/5 p-1 rounded-full">
                      <X className="w-4 h-4 text-white/30" />
                    </div>
                  )}
                  <span className={feature.free ? "text-white" : "text-white/30"}>
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className="w-full py-4 rounded-2xl border-2 border-white/20 bg-white/5 text-white/50 font-semibold cursor-default"
              disabled
            >
              {isFree ? "Plano Atual" : "Free"}
            </button>
          </div>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
          <div className="relative bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-xl border-2 border-teal-500/30 rounded-3xl p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-sm font-medium">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </div>
                {isPro && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
                    Atual
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-2 font-[var(--font-family-display)]">
                Pro
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">R$ 19,90</span>
                <span className="text-white/50">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  <div className="bg-teal-500/20 p-1 rounded-full">
                    <Check className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-white">{feature.label}</span>
                </li>
              ))}
            </ul>

            {isPro ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl border-2 border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold transition-all duration-300"
                onClick={handlePortal}
                disabled={isPortalLoading}
              >
                {isPortalLoading ? (
                  <Loader2 className="size-5 animate-spin mx-auto" />
                ) : (
                  "Gerenciar assinatura"
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? (
                  <Loader2 className="size-5 animate-spin mx-auto" />
                ) : (
                  "Assinar Pro"
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-5xl mx-auto relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-10 blur-2xl" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center font-[var(--font-family-display)]">
            O que muda com o Pro?
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {whyProReasons.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/90 leading-relaxed text-base">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
