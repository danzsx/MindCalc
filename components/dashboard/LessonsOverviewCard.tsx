"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookOpen, ArrowRight } from "lucide-react";

interface LessonsOverviewCardProps {
  completedCount: number;
  totalCount: number;
}

export function LessonsOverviewCard({ completedCount, totalCount }: LessonsOverviewCardProps) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="lg:col-span-2 relative group"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />

      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Aulas Interativas
              </h3>
              <p className="text-white/60">Aprenda técnicas de cálculo rápido</p>
            </div>
          </div>
        </div>

        {/* Progress sub-card */}
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60">Seu progresso</span>
            <span
              className="text-2xl font-bold text-teal-400"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {pct}%
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          <p className="text-xs text-white/50">
            {completedCount} de {totalCount} aulas concluídas
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/lessons"
          className="w-full mt-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 group/btn"
        >
          <span>Continuar aprendendo</span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
