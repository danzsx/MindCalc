"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Zap, Plus, Minus, X, Divide } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TablesOperation, TablesMode, TablesRange, TablesConfig } from "@/types";

interface TablesConfigFormProps {
  onStart: (config: TablesConfig) => void;
}

const operations: { value: TablesOperation; label: string; icon: typeof Plus; gradient: string; glowColor: string }[] = [
  { value: "+", label: "+", icon: Plus, gradient: "from-emerald-500 to-teal-500", glowColor: "shadow-emerald-500/30" },
  { value: "-", label: "−", icon: Minus, gradient: "from-orange-500 to-red-500", glowColor: "shadow-orange-500/30" },
  { value: "*", label: "×", icon: X, gradient: "from-blue-500 to-purple-500", glowColor: "shadow-blue-500/30" },
  { value: "/", label: "÷", icon: Divide, gradient: "from-yellow-500 to-orange-500", glowColor: "shadow-yellow-500/30" },
];

const ranges: { value: TablesRange; label: string }[] = [
  { value: { min: 1, max: 5 }, label: "1 a 5" },
  { value: { min: 1, max: 10 }, label: "1 a 10" },
  { value: { min: 1, max: 12 }, label: "1 a 12" },
];

const modes: { value: TablesMode; label: string; description: string; icon: typeof BookOpen; gradient: string }[] = [
  {
    value: "guided",
    label: "Guiado",
    description: "Sem tempo, com explicações",
    icon: BookOpen,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    value: "free",
    label: "Treino livre",
    description: "Sequencial, com feedback",
    icon: Zap,
    gradient: "from-orange-500 to-yellow-500",
  },
];

export function TablesConfigForm({ onStart }: TablesConfigFormProps) {
  const [operation, setOperation] = useState<TablesOperation | null>(null);
  const [range, setRange] = useState<TablesRange | null>(null);
  const [mode, setMode] = useState<TablesMode | null>(null);

  const canStart = operation !== null && range !== null && mode !== null;

  const handleStart = () => {
    if (!canStart) return;
    onStart({ operation: operation!, range: range!, mode: mode! });
  };

  return (
    <div className="space-y-6">
      {/* Operation selector */}
      <div>
        <label className="text-sm font-medium text-white/70 mb-3 block">
          Operação
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {operations.map((op, index) => {
            const Icon = op.icon;
            const isSelected = operation === op.value;
            return (
              <motion.button
                key={op.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setOperation(op.value)}
                className={cn(
                  "relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                  isSelected
                    ? `border-teal-400 bg-white/10 ${op.glowColor} shadow-lg`
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-xl transition-all duration-300",
                  isSelected
                    ? `bg-gradient-to-br ${op.gradient}`
                    : "bg-white/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isSelected ? "text-white" : "text-white/60"
                  )} />
                </div>
                <span className={cn(
                  "text-lg font-bold transition-colors",
                  isSelected ? "text-white" : "text-white/60"
                )}>
                  {op.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Range selector */}
      <div>
        <label className="text-sm font-medium text-white/70 mb-3 block">
          Intervalo
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ranges.map((r) => {
            const isSelected = range?.min === r.value.min && range?.max === r.value.max;
            return (
              <button
                key={r.label}
                onClick={() => setRange(r.value)}
                className={cn(
                  "px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 border-2",
                  isSelected
                    ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/20"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white"
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode selector */}
      <div>
        <label className="text-sm font-medium text-white/70 mb-3 block">
          Modo
        </label>
        <div className="grid grid-cols-1 gap-3">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={cn(
                  "relative flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 border-2",
                  isSelected
                    ? "border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl" />
                )}
                <div className={cn(
                  "relative p-3 rounded-xl transition-all duration-300",
                  isSelected
                    ? `bg-gradient-to-br ${m.gradient}`
                    : "bg-white/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    isSelected ? "text-white" : "text-white/60"
                  )} />
                </div>
                <div className="relative">
                  <p className={cn(
                    "font-semibold transition-colors",
                    isSelected ? "text-white" : "text-white/70"
                  )}>
                    {m.label}
                  </p>
                  <p className={cn(
                    "text-sm transition-colors",
                    isSelected ? "text-white/60" : "text-white/40"
                  )}>
                    {m.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <motion.button
        whileHover={{ scale: canStart ? 1.02 : 1 }}
        whileTap={{ scale: canStart ? 0.98 : 1 }}
        onClick={handleStart}
        disabled={!canStart}
        className={cn(
          "w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300",
          canStart
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400 hover:shadow-lg hover:shadow-blue-500/25"
            : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
        )}
      >
        Bora começar
      </motion.button>
    </div>
  );
}
