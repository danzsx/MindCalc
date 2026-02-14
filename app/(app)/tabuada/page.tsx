"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { motion } from "motion/react";
import { Grid3X3, Sparkles } from "lucide-react";
import { TablesConfigForm } from "@/components/tables/TablesConfigForm";
import type { TablesConfig } from "@/types";

export default function TabuadaPage() {
  const router = useRouter();

  const handleStart = useCallback(
    (config: TablesConfig) => {
      const params = new URLSearchParams({
        op: config.operation,
        min: String(config.range.min),
        max: String(config.range.max),
        mode: config.mode,
      });
      router.push(`/tabuada/session?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">Pratique no seu ritmo</span>
        </motion.div>

        <h1
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent mb-3"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Tabuada
        </h1>
        <p className="text-lg text-white/60 max-w-md mx-auto">
          Pratique as operações no seu ritmo, sem pressa.
        </p>
      </motion.div>

      {/* Config Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative group max-w-lg w-full"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-15 transition-opacity duration-500" />

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-2xl">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Configure seu treino
              </h2>
              <p className="text-sm text-white/50">Escolha operação, intervalo e modo</p>
            </div>
          </div>

          <TablesConfigForm onStart={handleStart} />
        </div>
      </motion.div>
    </div>
  );
}
