"use client";

import type { Operator } from "@/types";
import { motion } from "motion/react";

const operatorSymbol: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

const operatorGradient: Record<Operator, string> = {
  "+": "from-emerald-500 to-teal-500",
  "-": "from-orange-500 to-red-500",
  "*": "from-blue-500 to-purple-500",
  "/": "from-yellow-500 to-orange-500",
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
  const gradient = operatorGradient[operator];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Counter badge */}
      <span className="text-xs font-medium text-white/40 bg-white/5 px-3 py-1 rounded-full" role="status">
        {current} / {total}
      </span>

      {/* Exercise display */}
      <motion.div
        key={`${operand1}-${operator}-${operand2}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center gap-5 py-8"
        aria-live="polite"
        aria-label={`Exercício: ${operand1} ${operatorSymbol[operator]} ${operand2}`}
      >
        <span
          className="text-5xl md:text-6xl font-bold text-white"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {operand1}
        </span>

        {/* Operator in gradient box */}
        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} text-white text-2xl font-bold shadow-lg`}>
          {operatorSymbol[operator]}
        </span>

        <span
          className="text-5xl md:text-6xl font-bold text-white"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {operand2}
        </span>

        <span className="text-3xl text-white/30 font-light">=</span>

        <span className="text-4xl text-white/20 font-light">?</span>
      </motion.div>
    </div>
  );
}
