"use client";

import type { Operator } from "@/types";
import { motion, AnimatePresence } from "motion/react";

const operatorSymbol: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

// Numetria operation colors — remapped per spec
const operatorColors: Record<
  Operator,
  { bg: string; border: string; text: string; glow: string }
> = {
  "+": {
    bg: "rgba(55, 112, 191, 0.15)",
    border: "rgba(55, 112, 191, 0.45)",
    text: "#5a8fd4",
    glow: "rgba(55, 112, 191, 0.35)",
  },
  "-": {
    bg: "rgba(141, 194, 255, 0.12)",
    border: "rgba(141, 194, 255, 0.38)",
    text: "#8dc2ff",
    glow: "rgba(141, 194, 255, 0.3)",
  },
  "*": {
    bg: "rgba(206, 242, 109, 0.1)",
    border: "rgba(206, 242, 109, 0.35)",
    text: "#cef26d",
    glow: "rgba(206, 242, 109, 0.35)",
  },
  "/": {
    bg: "rgba(168, 204, 71, 0.1)",
    border: "rgba(168, 204, 71, 0.32)",
    text: "#a8cc47",
    glow: "rgba(168, 204, 71, 0.3)",
  },
};

interface ExerciseCardProps {
  operand1: number;
  operand2: number;
  operator: Operator;
  current: number;
  total: number;
}

export function ExerciseCard({
  operand1,
  operand2,
  operator,
  current,
  total,
}: ExerciseCardProps) {
  const colors = operatorColors[operator];

  return (
    <div className="flex flex-col items-center">
      {/* Counter label */}
      <span
        className="text-xs font-semibold uppercase tracking-widest mb-10"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.18em" }}
        role="status"
      >
        Questão {current} / {total}
      </span>

      {/* Equation with slide transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${operand1}-${operator}-${operand2}`}
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -48 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 md:gap-6"
          aria-live="polite"
          aria-label={`Exercício: ${operand1} ${operatorSymbol[operator]} ${operand2}`}
        >
          {/* Operand 1 */}
          <span
            className="text-5xl md:text-6xl font-bold tabular-nums select-none"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "var(--color-text-primary)",
              lineHeight: 1,
            }}
          >
            {operand1}
          </span>

          {/* Operator badge */}
          <span
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl text-2xl md:text-3xl font-bold flex-shrink-0 select-none"
            style={{
              background: colors.bg,
              border: `2px solid ${colors.border}`,
              color: colors.text,
              boxShadow: `0 0 24px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
              fontFamily: "var(--font-family-display)",
            }}
            aria-hidden
          >
            {operatorSymbol[operator]}
          </span>

          {/* Operand 2 */}
          <span
            className="text-5xl md:text-6xl font-bold tabular-nums select-none"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "var(--color-text-primary)",
              lineHeight: 1,
            }}
          >
            {operand2}
          </span>

          {/* Equals */}
          <span
            className="text-4xl md:text-5xl font-light select-none"
            style={{ color: "var(--color-text-muted)", opacity: 0.6 }}
            aria-hidden
          >
            =
          </span>

          {/* Question mark */}
          <span
            className="text-4xl md:text-5xl font-bold select-none"
            style={{
              color: colors.text,
              opacity: 0.45,
              fontFamily: "var(--font-family-display)",
            }}
            aria-hidden
          >
            ?
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
