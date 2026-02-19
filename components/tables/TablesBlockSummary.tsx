"use client";

import { motion } from "motion/react";
import { CheckCircle2, RotateCcw, ArrowRight, TrendingUp } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#3770bf]/15 p-3 rounded-xl">
          <CheckCircle2 className="h-6 w-6 text-[#8dc2ff]" />
        </div>
        <h2
          className="text-2xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Bloco {blockIndex + 1} concluído
        </h2>
      </div>

      {/* Stats */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8dc2ff]" />
          <p className="text-[var(--color-text-secondary)] font-medium">
            Você acertou{" "}
            <span className="text-[var(--color-text-primary)] font-bold text-lg">{correct}</span>{" "}
            <span className="text-[var(--color-text-muted)]">de</span>{" "}
            <span className="text-[var(--color-text-primary)] font-bold text-lg">{total}</span>
          </p>
        </div>

        {/* Accuracy bar */}
        <div className="bg-white/5 rounded-[20px] p-6 border border-white/10">
          <div className="h-4 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full relative overflow-hidden ${accuracy >= 60
                  ? "bg-gradient-to-r from-[#3770bf] to-[#8dc2ff]"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mt-3 font-medium">
            <span className={`font-bold text-lg ${accuracy >= 60 ? "text-[#8dc2ff]" : "text-orange-400"}`}>
              {Math.round(accuracy)}%
            </span>{" "}
            de precisão
          </p>
        </div>
      </div>

      {/* Message + action */}
      {!canAdvance ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)] font-medium text-center">
            Esse bloco merece mais uma rodada pra fixar.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:from-orange-400 hover:to-red-400 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <RotateCcw className="h-5 w-5" />
            Quero repetir
          </motion.button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-[#3770bf] to-[#8dc2ff] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-[#3770bf]/25"
        >
          Bora pro próximo
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      )}
    </motion.div>
  );
}
