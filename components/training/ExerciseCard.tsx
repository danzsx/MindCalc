"use client";

import type { Operator } from "@/types";

const operatorSymbol: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
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
  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--space-lg)' }}>
      <span className="text-body-emphasis text-muted-foreground">
        {current} / {total}
      </span>

      <div className="flex items-center justify-center text-metric-lg" style={{ gap: 'var(--space-lg)', paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
        <span>{operand1}</span>
        <span className="text-primary">{operatorSymbol[operator]}</span>
        <span>{operand2}</span>
        <span className="text-muted-foreground">=</span>
        <span className="text-muted-foreground">?</span>
      </div>
    </div>
  );
}
