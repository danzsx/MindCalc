import { Check, X } from "lucide-react";
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
      { label: "Relatórios com IA", included: false },
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
      { label: "Relatórios com IA", included: true },
    ],
    cta: "Assinar Pro",
    highlighted: true,
  },
];

export default function BillingPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Escolha seu plano
        </h1>
        <p className="mt-2 text-muted-foreground">
          Desbloqueie todo o potencial do MindCalc com o plano Pro.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.highlighted
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <h2 className="text-xl font-semibold text-foreground">
              {plan.name}
            </h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {plan.period}
              </span>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="size-4 text-primary" />
                  ) : (
                    <X className="size-4 text-muted-foreground/50" />
                  )}
                  <span
                    className={
                      feature.included
                        ? "text-sm text-foreground"
                        : "text-sm text-muted-foreground/50"
                    }
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-8 w-full"
              variant={plan.highlighted ? "default" : "secondary"}
              disabled={!plan.highlighted}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
