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

interface TablesCardProps {
  progress: TablesProgress[];
}

export function TablesCard({ progress }: TablesCardProps) {
  const best = progress.length > 0
    ? progress.reduce((a, b) => (a.masteredPercentage > b.masteredPercentage ? a : b))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="relative group"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />

      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl mb-4 w-fit">
          <Grid3X3 className="w-7 h-7 text-white" />
        </div>

        <h3
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Tabuada Turbo
        </h3>
        <p className="text-white/60 mb-4 text-sm">Treinos cronometrados de multiplicação</p>

        {/* Best score or empty */}
        {progress.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/10">
            <p className="text-sm text-white/50">Que tal começar?</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {best && (
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <p className="text-xs text-white/50">Melhor resultado</p>
                </div>
                <p className="font-semibold text-sm">
                  {operationLabels[best.operation] ?? best.operation} — {Math.round(best.masteredPercentage)}%
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {progress.map((p) => {
                const pct = Math.round(p.masteredPercentage);
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/60">
                        {operationLabels[p.operation] ?? p.operation} ({p.rangeMin}–{p.rangeMax})
                      </span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          pct >= 60
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : "bg-gradient-to-r from-orange-500 to-yellow-500"
                        }`}
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
          className="w-full mt-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
        >
          Iniciar treino
        </Link>
      </div>
    </motion.div>
  );
}
