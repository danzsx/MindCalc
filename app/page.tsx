import Link from "next/link";
import { Brain, BarChart3, Sparkles } from "lucide-react";
import { Footer } from "@/components/shared/Footer";

const features = [
  {
    icon: Brain,
    title: "Adaptativo",
    description:
      "O sistema ajusta a dificuldade automaticamente com base no seu desempenho, garantindo que você esteja sempre no nível ideal de desafio.",
  },
  {
    icon: BarChart3,
    title: "Tracking de Progresso",
    description:
      "Acompanhe sua evolução com gráficos detalhados de acurácia, tempo de resposta e nível ao longo do tempo.",
  },
  {
    icon: Sparkles,
    title: "IA Generativa",
    description:
      "Exercícios gerados por inteligência artificial que identificam seus pontos fracos e criam treinos personalizados.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Treine cálculo mental como um profissional
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Melhore sua velocidade e precisão com treinos adaptativos, relatórios
          inteligentes e exercícios gerados por IA.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Começar Agora
        </Link>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
