"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { motion } from "motion/react";
import { Grid3X3 } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            background: "rgba(141, 194, 255, 0.08)",
            border: "1px solid rgba(141, 194, 255, 0.2)",
          }}
        >
          <Grid3X3 className="w-4 h-4" style={{ color: "#8dc2ff" }} />
          <span className="text-sm font-bold" style={{ color: "#8dc2ff" }}>
            Pratique no seu ritmo
          </span>
        </motion.div>

        <h1
          className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          style={{
            fontFamily: "var(--font-family-display)",
            color: "#f0f4ff",
          }}
        >
          Tabuada
        </h1>
        <p className="text-lg max-w-md mx-auto font-medium" style={{ color: "#6b89b4" }}>
          Domine as operações básicas com calma e consistência.
        </p>
      </motion.div>

      {/* Config Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative max-w-lg w-full"
      >
        {/* Atmospheric glow */}
        <div
          className="absolute inset-0 rounded-[36px] -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(55, 112, 191, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Glass Card */}
        <div
          className="relative rounded-[32px] p-8 transition-all duration-300"
          style={{
            background: "rgba(13, 29, 58, 0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(141, 194, 255, 0.12)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(141, 194, 255, 0.06)",
          }}
        >
          {/* Card header */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="p-3.5 rounded-2xl"
              style={{
                background: "rgba(55, 112, 191, 0.15)",
                border: "1px solid rgba(55, 112, 191, 0.3)",
                boxShadow: "0 0 20px rgba(55, 112, 191, 0.2)",
              }}
            >
              <Grid3X3 className="w-6 h-6" style={{ color: "#5a8fd4" }} />
            </div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{
                  fontFamily: "var(--font-family-display)",
                  color: "#f0f4ff",
                }}
              >
                Configure seu treino
              </h2>
              <p className="text-sm font-medium" style={{ color: "#6b89b4" }}>
                Escolha operação, intervalo e modo
              </p>
            </div>
          </div>

          <TablesConfigForm onStart={handleStart} />
        </div>
      </motion.div>
    </div>
  );
}
