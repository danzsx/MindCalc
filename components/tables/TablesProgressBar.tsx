"use client";

import { motion } from "motion/react";

interface TablesProgressBarProps {
  current: number;
  total: number;
  blockIndex: number;
}

export function TablesProgressBar({
  current,
  total,
  blockIndex,
}: TablesProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50 font-medium">
          Bloco {blockIndex + 1}
        </p>
        <p className="text-sm font-semibold text-white/70">
          {current + 1} <span className="text-white/40">de</span> {total}
        </p>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
