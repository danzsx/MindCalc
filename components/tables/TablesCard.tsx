"use client";

import Link from "next/link";
import { Grid3X3, ArrowRight } from "lucide-react";
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
  // Find the operation with the highest mastered percentage
  const best = progress.length > 0
    ? progress.reduce((a, b) => (a.masteredPercentage > b.masteredPercentage ? a : b))
    : null;

  return (
    <div
      className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 fade-in"
      style={{ animationDelay: "500ms" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Grid3X3 className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Tabuada</h2>
      </div>

      {progress.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-5">
          Que tal começar?
        </p>
      ) : (
        <div className="space-y-4 mb-5">
          {best && (
            <p className="text-sm text-muted-foreground">
              {operationLabels[best.operation] ?? best.operation}{" "}
              <span className="font-medium text-foreground">
                {Math.round(best.masteredPercentage)}%
              </span>
            </p>
          )}

          <div className="space-y-3">
            {progress.map((p, index) => {
              const pct = Math.round(p.masteredPercentage);
              const isHigh = pct >= 60;
              const barColor = isHigh ? "bg-[#10B981]" : "bg-[#FB923C]";

              return (
                <div
                  key={p.id}
                  className="space-y-1"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {operationLabels[p.operation] ?? p.operation} ({p.rangeMin}–{p.rangeMax})
                    </span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Link
        href="/tabuada"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-[#14B8A6] transition-colors"
      >
        Treinar Tabuada
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
