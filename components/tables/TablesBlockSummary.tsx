"use client";

import { CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import type { TablesBlock } from "@/types";

interface TablesBlockSummaryProps {
  block: TablesBlock;
  blockIndex: number;
  canAdvance: boolean;
  onContinue: () => void;
}

export function TablesBlockSummary({
  block,
  blockIndex,
  canAdvance,
  onContinue,
}: TablesBlockSummaryProps) {
  const correct = block.answers.filter((a) => a.isCorrect).length;
  const total = block.answers.length;
  const accuracy = block.accuracy;

  return (
    <div className="space-y-6 zoom-in-95">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Bloco {blockIndex + 1} concluído
        </h2>
      </div>

      {/* Stats */}
      <div className="text-center space-y-3">
        <p className="text-muted-foreground">
          Você acertou{" "}
          <span className="text-foreground font-semibold">{correct}</span> de{" "}
          <span className="text-foreground font-semibold">{total}</span>
        </p>

        {/* Accuracy bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-primary/20">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              accuracy >= 60
                ? "bg-gradient-to-r from-primary to-success"
                : "bg-[#FB923C]"
            }`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {Math.round(accuracy)}% de precisão
        </p>
      </div>

      {/* Message + action */}
      {!canAdvance ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Esse bloco merece mais uma rodada pra fixar.
          </p>
          <button
            onClick={onContinue}
            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Quero repetir
          </button>
        </div>
      ) : (
        <button
          onClick={onContinue}
          className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium flex items-center justify-center gap-2"
        >
          Bora pro próximo
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
