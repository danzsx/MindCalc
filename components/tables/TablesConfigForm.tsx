"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Zap, Plus, Minus, X, Divide } from "lucide-react";
import type { TablesOperation, TablesMode, TablesRange, TablesConfig } from "@/types";

interface TablesConfigFormProps {
  onStart: (config: TablesConfig) => void;
}

// Numetria operation color mapping per spec
const operations: {
  value: TablesOperation;
  label: string;
  icon: typeof Plus;
  darkBg: string;
  darkBorder: string;
  textColor: string;
  glowColor: string;
  gradient: string;
}[] = [
  {
    value: "+",
    label: "+",
    icon: Plus,
    darkBg: "rgba(55, 112, 191, 0.12)",
    darkBorder: "rgba(55, 112, 191, 0.4)",
    textColor: "#5a8fd4",
    glowColor: "rgba(55, 112, 191, 0.3)",
    gradient: "linear-gradient(135deg, #2558a0, #3770bf)",
  },
  {
    value: "-",
    label: "−",
    icon: Minus,
    darkBg: "rgba(141, 194, 255, 0.08)",
    darkBorder: "rgba(141, 194, 255, 0.35)",
    textColor: "#8dc2ff",
    glowColor: "rgba(141, 194, 255, 0.25)",
    gradient: "linear-gradient(135deg, #5a8fd4, #8dc2ff)",
  },
  {
    value: "*",
    label: "×",
    icon: X,
    darkBg: "rgba(206, 242, 109, 0.08)",
    darkBorder: "rgba(206, 242, 109, 0.32)",
    textColor: "#cef26d",
    glowColor: "rgba(206, 242, 109, 0.28)",
    gradient: "linear-gradient(135deg, #a8cc47, #cef26d)",
  },
  {
    value: "/",
    label: "÷",
    icon: Divide,
    darkBg: "rgba(168, 204, 71, 0.08)",
    darkBorder: "rgba(168, 204, 71, 0.3)",
    textColor: "#a8cc47",
    glowColor: "rgba(168, 204, 71, 0.25)",
    gradient: "linear-gradient(135deg, #7a9e2a, #a8cc47)",
  },
];

const ranges: { value: TablesRange; label: string }[] = [
  { value: { min: 1, max: 5 }, label: "1 a 5" },
  { value: { min: 1, max: 10 }, label: "1 a 10" },
  { value: { min: 1, max: 12 }, label: "1 a 12" },
];

const modes: {
  value: TablesMode;
  label: string;
  description: string;
  icon: typeof BookOpen;
  darkBg: string;
  darkBorder: string;
  textColor: string;
  gradient: string;
}[] = [
  {
    value: "guided",
    label: "Guiado",
    description: "Sem tempo, com explicações",
    icon: BookOpen,
    darkBg: "rgba(55, 112, 191, 0.1)",
    darkBorder: "rgba(55, 112, 191, 0.35)",
    textColor: "#5a8fd4",
    gradient: "linear-gradient(135deg, #2558a0, #3770bf)",
  },
  {
    value: "free",
    label: "Treino livre",
    description: "Sequencial, com feedback",
    icon: Zap,
    darkBg: "rgba(206, 242, 109, 0.08)",
    darkBorder: "rgba(206, 242, 109, 0.3)",
    textColor: "#cef26d",
    gradient: "linear-gradient(135deg, #a8cc47, #cef26d)",
  },
];

const unselectedBase: React.CSSProperties = {
  background: "rgba(13, 29, 58, 0.4)",
  border: "1px solid rgba(141, 194, 255, 0.1)",
};

const unselectedHover: React.CSSProperties = {
  background: "rgba(13, 29, 58, 0.6)",
  border: "1px solid rgba(141, 194, 255, 0.22)",
};

export function TablesConfigForm({ onStart }: TablesConfigFormProps) {
  const [operation, setOperation] = useState<TablesOperation | null>(null);
  const [range, setRange] = useState<TablesRange | null>(null);
  const [mode, setMode] = useState<TablesMode | null>(null);
  const [hoveredOp, setHoveredOp] = useState<string | null>(null);
  const [hoveredRange, setHoveredRange] = useState<string | null>(null);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const canStart = operation !== null && range !== null && mode !== null;

  const handleStart = () => {
    if (!canStart) return;
    onStart({ operation: operation!, range: range!, mode: mode! });
  };

  return (
    <div className="space-y-8">
      {/* Operation selector */}
      <div>
        <label
          className="text-xs font-bold mb-4 block uppercase tracking-widest"
          style={{ color: "#6b89b4", letterSpacing: "0.14em" }}
        >
          Operação
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {operations.map((op, index) => {
            const Icon = op.icon;
            const isSelected = operation === op.value;
            const isHovered = hoveredOp === op.value;

            return (
              <motion.button
                key={op.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setOperation(op.value)}
                onMouseEnter={() => setHoveredOp(op.value)}
                onMouseLeave={() => setHoveredOp(null)}
                className="relative p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-200"
                style={{
                  background: isSelected
                    ? op.darkBg
                    : isHovered
                    ? "rgba(13, 29, 58, 0.6)"
                    : "rgba(13, 29, 58, 0.4)",
                  border: isSelected
                    ? `1px solid ${op.darkBorder}`
                    : isHovered
                    ? "1px solid rgba(141, 194, 255, 0.22)"
                    : "1px solid rgba(141, 194, 255, 0.1)",
                  boxShadow: isSelected
                    ? `0 0 20px ${op.glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`
                    : "none",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div
                  className="p-3 rounded-xl transition-all duration-200"
                  style={{
                    background: isSelected ? op.gradient : "rgba(141, 194, 255, 0.06)",
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(141, 194, 255, 0.1)",
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{
                      color: isSelected ? "#080f1e" : op.textColor,
                    }}
                  />
                </div>
                <span
                  className="text-lg font-bold transition-colors"
                  style={{
                    color: isSelected ? op.textColor : "#6b89b4",
                  }}
                >
                  {op.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Range selector */}
      <div>
        <label
          className="text-xs font-bold mb-4 block uppercase tracking-widest"
          style={{ color: "#6b89b4", letterSpacing: "0.14em" }}
        >
          Intervalo
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ranges.map((r) => {
            const isSelected =
              range?.min === r.value.min && range?.max === r.value.max;
            const isHovered = hoveredRange === r.label;
            return (
              <button
                key={r.label}
                onClick={() => setRange(r.value)}
                onMouseEnter={() => setHoveredRange(r.label)}
                onMouseLeave={() => setHoveredRange(null)}
                className="px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-200"
                style={{
                  background: isSelected
                    ? "#cef26d"
                    : isHovered
                    ? "rgba(13, 29, 58, 0.6)"
                    : "rgba(13, 29, 58, 0.4)",
                  border: isSelected
                    ? "1px solid rgba(206, 242, 109, 0.5)"
                    : isHovered
                    ? "1px solid rgba(141, 194, 255, 0.22)"
                    : "1px solid rgba(141, 194, 255, 0.1)",
                  color: isSelected ? "#080f1e" : isHovered ? "#a8c0e0" : "#6b89b4",
                  boxShadow: isSelected
                    ? "0 4px 16px rgba(206, 242, 109, 0.25)"
                    : "none",
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode selector */}
      <div>
        <label
          className="text-xs font-bold mb-4 block uppercase tracking-widest"
          style={{ color: "#6b89b4", letterSpacing: "0.14em" }}
        >
          Modo
        </label>
        <div className="grid grid-cols-1 gap-3">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.value;
            const isHovered = hoveredMode === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                onMouseEnter={() => setHoveredMode(m.value)}
                onMouseLeave={() => setHoveredMode(null)}
                className="relative flex items-start gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                style={{
                  background: isSelected
                    ? m.darkBg
                    : isHovered
                    ? "rgba(13, 29, 58, 0.6)"
                    : "rgba(13, 29, 58, 0.4)",
                  border: isSelected
                    ? `1px solid ${m.darkBorder}`
                    : isHovered
                    ? "1px solid rgba(141, 194, 255, 0.22)"
                    : "1px solid rgba(141, 194, 255, 0.1)",
                  boxShadow: isSelected
                    ? `0 0 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)`
                    : "none",
                }}
              >
                <div
                  className="relative p-3 rounded-xl transition-all duration-200 shrink-0"
                  style={{
                    background: isSelected
                      ? m.gradient
                      : "rgba(141, 194, 255, 0.06)",
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(141, 194, 255, 0.1)",
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{
                      color: isSelected ? "#080f1e" : m.textColor,
                    }}
                  />
                </div>
                <div className="relative pt-1">
                  <p
                    className="font-bold text-base transition-colors"
                    style={{
                      color: isSelected ? "#f0f4ff" : "#a8c0e0",
                    }}
                  >
                    {m.label}
                  </p>
                  <p
                    className="text-sm transition-colors mt-0.5 font-medium"
                    style={{
                      color: isSelected ? m.textColor : "#6b89b4",
                    }}
                  >
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
        className="w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300"
        style={
          canStart
            ? {
                background: "#cef26d",
                color: "#080f1e",
                boxShadow: "0 8px 30px rgba(206, 242, 109, 0.3)",
              }
            : {
                background: "rgba(141, 194, 255, 0.05)",
                color: "#4a6580",
                border: "1px solid rgba(141, 194, 255, 0.08)",
                cursor: "not-allowed",
              }
        }
      >
        Bora começar
      </motion.button>
    </div>
  );
}
