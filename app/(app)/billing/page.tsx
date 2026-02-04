import { Check, X, Sparkles, Zap, BarChart3, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    features: [
      { label: "1 treino por dia", included: true },
      { label: "Nível máximo 5", included: true },
      { label: "Treinos ilimitados", included: false },
      { label: "Nível máximo 10", included: false },
      { label: "Análise detalhada", included: false },
    ],
    cta: "Plano Atual",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 19,90",
    period: "/mês",
    features: [
      { label: "1 treino por dia", included: true },
      { label: "Nível máximo 5", included: true },
      { label: "Treinos ilimitados", included: true },
      { label: "Nível máximo 10", included: true },
      { label: "Análise detalhada", included: true },
    ],
    cta: "Assinar Pro",
    highlighted: true,
  },
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
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-[20px] p-8 transition-all duration-300 ${
              plan.highlighted
                ? "bg-card ring-2 ring-primary shadow-[0_20px_40px_-10px_rgba(45,212,191,0.15)] md:scale-105"
                : "bg-card shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground">
                {plan.name}
              </h2>
              {plan.highlighted && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Popular
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground lg:text-5xl">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {plan.period}
              </span>
            </div>

            <ul className="mt-8 flex-1 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  {feature.included ? (
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
                      feature.included
                        ? "text-sm text-foreground"
                        : "text-sm text-muted-foreground"
                    }
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-8 w-full min-h-[56px] rounded-xl text-base"
              variant={plan.highlighted ? "default" : "outline"}
              size="xl"
              disabled={!plan.highlighted}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
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
