"use client";

import { motion } from "motion/react";
import { Award, Lightbulb } from "lucide-react";

interface WeakPoint {
  operation: string;
  errorRate: number;
}

interface WeakPointsListProps {
  weakPoints: WeakPoint[];
}

const operationGradients: Record<string, string> = {
  "Adição (+)": "from-green-500 to-emerald-500",
  "Subtração (−)": "from-red-500 to-orange-500",
  "Multiplicação (×)": "from-blue-500 to-teal-500",
  "Divisão (÷)": "from-orange-500 to-yellow-500",
};

export function WeakPointsList({ weakPoints }: WeakPointsListProps) {
  const sorted = [...weakPoints].sort((a, b) => b.errorRate - a.errorRate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="relative group"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />

      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-2xl">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3
              className="text-xl md:text-2xl font-bold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Áreas para Melhorar
            </h3>
            <p className="text-sm text-white/60">Foque nestas operações para evoluir</p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="text-sm text-white/60">
            Ainda sem dados. Faça mais treinos e vou te mostrar onde focar.
          </p>
        ) : (
          <>
            {/* Tip card */}
            <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
              <div className="flex items-start gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/60">Dica personalizada</p>
              </div>
              <p className="text-sm text-white/90">
                O treino já ajusta os exercícios pra te ajudar a melhorar nessas operações.
              </p>
            </div>

            {/* Progress items grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {sorted.map((wp, i) => {
                const pct = Math.round(wp.errorRate * 100);
                const gradient =
                  operationGradients[wp.operation] || "from-gray-500 to-gray-400";

                return (
                  <motion.div
                    key={wp.operation}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{wp.operation}</span>
                      <span className="text-sm font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 1.0 + i * 0.1, duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
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
