"use client";

import Link from "next/link";
import { Grid3X3, ArrowRight, Trophy } from "lucide-react";
import type { TablesProgress } from "@/types";

const operationLabels: Record<string, string> = {
  "+": "Adição",
  "-": "Subtração",
  "*": "Multiplicação",
  "/": "Divisão",
};

interface TablesCardProps {
  progress: TablesProgress[];
}

export function TablesCard({ progress }: TablesCardProps) {
  const best = progress.length > 0
    ? progress.reduce((a, b) => (a.masteredPercentage > b.masteredPercentage ? a : b))
    : null;

  return (
    <div
      className="dash-card flex flex-col"
      style={{
        padding: "var(--card-padding)",
        animationDelay: "160ms",
        "--card-accent": "linear-gradient(135deg, #FDE047, #FACC15)",
        "--card-accent-glow": "rgba(253, 224, 71, 0.05)",
      } as React.CSSProperties}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div
          className="flex items-center"
          style={{ gap: "var(--card-header-gap)", marginBottom: "var(--card-header-gap)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FDE047, #FACC15)" }}
          >
            <Grid3X3 className="h-5 w-5 text-amber-900" />
          </div>
          <h2 className="text-card-title text-foreground">Tabuada</h2>
        </div>

        {progress.length === 0 ? (
          <p
            className="text-body-primary text-muted-foreground"
            style={{ marginBottom: "var(--card-section-gap)" }}
          >
            Que tal começar?
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", marginBottom: "var(--card-section-gap)" }}>
            {best && (
              <div
                className="flex items-center rounded-lg"
                style={{
                  gap: "var(--space-sm)",
                  padding: "var(--space-sm) var(--space-md)",
                  background: "rgba(253, 224, 71, 0.08)",
                }}
              >
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-caption text-muted-foreground">
                  Melhor:{" "}
                  <span className="text-caption-medium text-foreground">
                    {operationLabels[best.operation] ?? best.operation} — {Math.round(best.masteredPercentage)}%
                  </span>
                </span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {progress.map((p) => {
                const pct = Math.round(p.masteredPercentage);
                const barGradient =
                  pct >= 60
                    ? "linear-gradient(90deg, #10B981, #059669)"
                    : "linear-gradient(90deg, #FB923C, #F97316)";

                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between text-caption-medium" style={{ marginBottom: 4 }}>
                      <span className="text-muted-foreground">
                        {operationLabels[p.operation] ?? p.operation} ({p.rangeMin}–{p.rangeMax})
                      </span>
                      <span className="text-foreground">{pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full dash-progress-fill"
                        style={{ width: `${pct}%`, background: barGradient }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <Link
            href="/tabuada"
            className="inline-flex items-center gap-2 text-body-emphasis text-primary hover:text-[#14B8A6] transition-colors group"
          >
            Treinar Tabuada
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
