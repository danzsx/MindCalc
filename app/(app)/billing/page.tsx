"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, Sparkles, Zap, BarChart3, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    icon: Brain,
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

  const plans: {
    name: string;
    price: string;
    period: string;
    planKey: UserPlan;
    highlighted: boolean;
  }[] = [
    {
      name: "Free",
      price: "R$ 0",
      period: "/mês",
      planKey: "free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "R$ 19,90",
      period: "/mês",
      planKey: "pro",
      highlighted: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-foreground">
          Seu plano
        </h1>
        <p className="mt-2 text-muted-foreground">
          Treine no ritmo que faz sentido pra você.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {plans.map((p) => {
          const isCurrent = plan === p.planKey;
          const isProCard = p.planKey === "pro";

          return (
            <div
              key={p.name}
              className={`flex flex-col rounded-[20px] p-8 transition-all duration-300 ${
                p.highlighted
                  ? "bg-card ring-2 ring-primary shadow-[0_20px_40px_-10px_rgba(45,212,191,0.15)] md:scale-105"
                  : "bg-card shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">
                  {p.name}
                </h2>
                {p.highlighted && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Popular
                  </span>
                )}
                {isCurrent && (
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    Atual
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground lg:text-5xl">
                  {p.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {p.period}
                </span>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                {features.map((feature) => {
                  const included = isProCard ? feature.pro : feature.free;
                  return (
                    <li key={feature.label} className="flex items-center gap-3">
                      {included ? (
                        <div className="flex size-6 items-center justify-center rounded-full bg-success/10">
                          <Check className="size-4 text-success" />
                        </div>
                      ) : (
                        <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                          <X className="size-4 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className={
                          included
                            ? "text-sm text-foreground"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {feature.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {isProCard ? (
                isCurrent ? (
                  <Button
                    className="mt-8 w-full min-h-[56px] rounded-xl text-base"
                    variant="outline"
                    size="xl"
                    onClick={handlePortal}
                    disabled={isPortalLoading}
                  >
                    {isPortalLoading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Gerenciar assinatura"
                    )}
                  </Button>
                ) : (
                  <Button
                    className="mt-8 w-full min-h-[56px] rounded-xl text-base"
                    variant="default"
                    size="xl"
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Assinar Pro"
                    )}
                  </Button>
                )
              ) : (
                <Button
                  className="mt-8 w-full min-h-[56px] rounded-xl text-base"
                  variant="outline"
                  size="xl"
                  disabled
                >
                  {isCurrent ? "Plano Atual" : "Free"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Why Pro section */}
      <div className="mt-12 rounded-[20px] border border-primary/20 bg-primary/5 p-6 lg:p-8">
        <h2 className="mb-6 text-center text-lg font-semibold text-foreground">
          O que muda com o Pro?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {whyProReasons.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="text-sm text-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
