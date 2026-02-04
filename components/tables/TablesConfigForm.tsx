"use client";

import { useState } from "react";
import { BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TablesOperation, TablesMode, TablesRange, TablesConfig } from "@/types";

interface TablesConfigFormProps {
  onStart: (config: TablesConfig) => void;
}

const operations: { value: TablesOperation; label: string }[] = [
  { value: "+", label: "+" },
  { value: "-", label: "−" },
  { value: "*", label: "×" },
  { value: "/", label: "÷" },
];

const ranges: { value: TablesRange; label: string }[] = [
  { value: { min: 1, max: 5 }, label: "1 a 5" },
  { value: { min: 1, max: 10 }, label: "1 a 10" },
  { value: { min: 1, max: 12 }, label: "1 a 12" },
];

const modes: { value: TablesMode; label: string; description: string; icon: typeof BookOpen }[] = [
  {
    value: "guided",
    label: "Guiado",
    description: "Sem tempo, com explicações",
    icon: BookOpen,
  },
  {
    value: "free",
    label: "Treino livre",
    description: "Sequencial, com feedback",
    icon: Zap,
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
        <label className="text-sm font-medium text-foreground mb-2 block">
          Operação
        </label>
        <div className="grid grid-cols-4 gap-2">
          {operations.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={cn(
                "px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 border-2",
                operation === op.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted text-foreground border-transparent hover:border-primary/30 hover:shadow-sm"
              )}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Range selector */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Intervalo
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.value)}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2",
                range?.min === r.value.min && range?.max === r.value.max
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted text-foreground border-transparent hover:border-primary/30 hover:shadow-sm"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode selector */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Modo
        </label>
        <div className="grid grid-cols-1 gap-3">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 border-2",
                  mode === m.value
                    ? "bg-primary/10 border-primary shadow-md"
                    : "bg-muted border-transparent hover:border-primary/30 hover:shadow-sm"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    mode === m.value ? "bg-primary/20" : "bg-background"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      mode === m.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      mode === m.value
                        ? "text-foreground"
                        : "text-foreground"
                    )}
                  >
                    {m.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!canStart}
        className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-md"
      >
        Bora começar
      </button>
    </div>
  );
}
