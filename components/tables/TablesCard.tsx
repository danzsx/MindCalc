"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Grid3X3, ArrowRight, Trophy } from "lucide-react";
import type { TablesProgress } from "@/types";

const operationLabels: Record<string, string> = {
  "+": "Adição",
  "-": "Subtração",
  "*": "Multiplicação",
  "/": "Divisão",
};

const operationColors: Record<string, string> = {
  "+": "#3770bf",
  "-": "#8dc2ff",
  "*": "#cef26d",
  "/": "#a8cc47",
};

interface TablesCardProps {
  progress: TablesProgress[];
}

const glassCard: React.CSSProperties = {
  background: "rgba(13, 29, 58, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(141, 194, 255, 0.12)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
};

export function TablesCard({ progress }: TablesCardProps) {
  const best =
    progress.length > 0
      ? progress.reduce((a, b) =>
          a.masteredPercentage > b.masteredPercentage ? a : b
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="h-full"
    >
      <div
        className="rounded-[32px] p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-0.5"
        style={{
          ...glassCard,
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(141, 194, 255, 0.06)",
        }}
      >
        {/* Icon */}
        <div
          className="p-4 rounded-2xl w-fit mb-6"
          style={{
            background: "rgba(141, 194, 255, 0.1)",
            border: "1px solid rgba(141, 194, 255, 0.2)",
          }}
        >
          <Grid3X3 className="w-7 h-7" style={{ color: "#8dc2ff" }} />
        </div>

        <h3
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: "var(--font-family-display)",
            color: "#f0f4ff",
          }}
        >
          Tabuada
        </h3>
        <p className="mb-6 text-sm font-medium" style={{ color: "#6b89b4" }}>
          Treinos cronometrados de tabuada
        </p>

        {/* Best score or empty */}
        {progress.length === 0 ? (
          <div
            className="rounded-2xl p-4 mb-6"
            style={{
              background: "rgba(141, 194, 255, 0.05)",
              border: "1px solid rgba(141, 194, 255, 0.1)",
            }}
          >
            <p
              className="text-sm font-medium text-center"
              style={{ color: "#6b89b4" }}
            >
              Que tal começar?
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {best && (
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(206, 242, 109, 0.07)",
                  border: "1px solid rgba(206, 242, 109, 0.18)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4" style={{ color: "#cef26d" }} />
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: "#b8d85a" }}
                  >
                    Melhor resultado
                  </p>
                </div>
                <p className="font-bold text-sm" style={{ color: "#f0f4ff" }}>
                  {operationLabels[best.operation] ?? best.operation} —{" "}
                  {Math.round(best.masteredPercentage)}%
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {progress.slice(0, 3).map((p) => {
                const pct = Math.round(p.masteredPercentage);
                const barColor = operationColors[p.operation] ?? "#3770bf";
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium" style={{ color: "#6b89b4" }}>
                        {operationLabels[p.operation] ?? p.operation} (
                        {p.rangeMin}–{p.rangeMax})
                      </span>
                      <span className="font-bold" style={{ color: "#f0f4ff" }}>
                        {pct}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full rounded-full overflow-hidden"
                      style={{ background: "rgba(141, 194, 255, 0.08)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          delay: 0.9,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{ background: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/tabuada"
          className="w-full mt-auto py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 group"
          style={{
            background: "#cef26d",
            color: "#080f1e",
            boxShadow: "0 4px 20px rgba(206, 242, 109, 0.25)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 8px 30px rgba(206, 242, 109, 0.4)";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 20px rgba(206, 242, 109, 0.25)";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(0)";
          }}
        >
          <span>Iniciar treino</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
