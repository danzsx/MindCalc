"use client";

import { motion } from "motion/react";
import { Crosshair, Sparkles } from "lucide-react";

interface WeakPoint {
  operation: string;
  errorRate: number;
}

interface WeakPointsListProps {
  weakPoints: WeakPoint[];
}

// Numetria operation color mapping (per design spec)
const operationColors: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  "Adição (+)": {
    color: "#3770bf",
    bg: "rgba(55, 112, 191, 0.15)",
    border: "rgba(55, 112, 191, 0.3)",
    label: "+",
  },
  "Subtração (−)": {
    color: "#8dc2ff",
    bg: "rgba(141, 194, 255, 0.12)",
    border: "rgba(141, 194, 255, 0.25)",
    label: "−",
  },
  "Multiplicação (×)": {
    color: "#cef26d",
    bg: "rgba(206, 242, 109, 0.12)",
    border: "rgba(206, 242, 109, 0.2)",
    label: "×",
  },
  "Divisão (÷)": {
    color: "#a8cc47",
    bg: "rgba(168, 204, 71, 0.12)",
    border: "rgba(168, 204, 71, 0.2)",
    label: "÷",
  },
};

const defaultColor = {
  color: "#6b89b4",
  bg: "rgba(107, 137, 180, 0.1)",
  border: "rgba(107, 137, 180, 0.2)",
  label: "?",
};

export function WeakPointsList({ weakPoints }: WeakPointsListProps) {
  const sorted = [...weakPoints].sort((a, b) => b.errorRate - a.errorRate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="h-full"
    >
      <div
        className="h-full p-7 rounded-[32px]"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
          boxShadow: "var(--glass-shadow)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(141,194,255,0.25)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-2xl"
            style={{
              background: "rgba(206, 242, 109, 0.1)",
              border: "1px solid rgba(206, 242, 109, 0.2)",
            }}
          >
            <Crosshair
              className="w-5 h-5"
              style={{ color: "#cef26d" }}
              strokeWidth={2}
            />
          </div>
          <div>
            <h3
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-family-display)",
                color: "var(--color-text-primary)",
              }}
            >
              Áreas para Melhorar
            </h3>
            <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              Foque nestas operações
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div
            className="h-[200px] flex flex-col items-center justify-center text-center p-6 rounded-2xl gap-3"
            style={{
              background: "rgba(13, 29, 58, 0.4)",
              border: "1px solid rgba(141, 194, 255, 0.06)",
            }}
          >
            <Sparkles className="w-6 h-6" style={{ color: "var(--color-text-muted)" }} strokeWidth={1.5} />
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Ainda sem dados. Faça mais treinos para ver onde focar.
            </p>
          </div>
        ) : (
          <>
            {/* Tip card */}
            <div
              className="p-4 mb-7 rounded-2xl"
              style={{
                background: "rgba(206, 242, 109, 0.06)",
                border: "1px solid rgba(206, 242, 109, 0.15)",
              }}
            >
              <div className="flex items-start gap-2">
                <Sparkles
                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                  style={{ color: "#cef26d" }}
                  strokeWidth={2}
                />
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  O treino adapta os exercícios automaticamente para fortalecer estas operações.
                </p>
              </div>
            </div>

            {/* Progress items */}
            <div className="flex flex-col gap-5">
              {sorted.map((wp, i) => {
                const pct = Math.round(wp.errorRate * 100);
                const opColor = operationColors[wp.operation] ?? defaultColor;

                return (
                  <motion.div
                    key={wp.operation}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85 + i * 0.1, duration: 0.45 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Operation symbol badge */}
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold"
                          style={{
                            background: opColor.bg,
                            border: `1px solid ${opColor.border}`,
                            color: opColor.color,
                          }}
                        >
                          {opColor.label}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {wp.operation}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: opColor.color }}
                      >
                        {pct}% de erro
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "rgba(141, 194, 255, 0.06)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          delay: 1.0 + i * 0.1,
                          duration: 0.9,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full rounded-full"
                        style={{ background: opColor.color, opacity: 0.85 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
