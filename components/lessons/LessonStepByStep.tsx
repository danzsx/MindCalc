"use client";

import { useState, useCallback } from "react";
import { RotateCcw, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_GRADIENTS = [
  { bg: "from-teal-500/10 to-cyan-500/10", border: "border-teal-500/20", badge: "bg-gradient-to-br from-teal-500 to-cyan-500 text-white" },
  { bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20", badge: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white" },
  { bg: "from-blue-500/10 to-purple-500/10", border: "border-blue-500/20", badge: "bg-gradient-to-br from-blue-500 to-purple-500 text-white" },
  { bg: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/20", badge: "bg-gradient-to-br from-purple-500 to-pink-500 text-white" },
  { bg: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-500/20", badge: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" },
];

interface LessonStepByStepProps {
  steps: string[];
  onRetry: () => void;
}

export function LessonStepByStep({ steps, onRetry }: LessonStepByStepProps) {
  const [visibleSteps, setVisibleSteps] = useState(1);
  const totalSteps = steps.length;

  const revealNext = useCallback(() => {
    setVisibleSteps((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const allRevealed = visibleSteps >= totalSteps;

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">
        Vamos rever juntos? Cada passo fica mais claro.
      </p>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isVisible = index < visibleSteps;
          const gradient = STEP_GRADIENTS[index % STEP_GRADIENTS.length];

          if (!isVisible) return null;

          return (
            <div
              key={index}
              className="lesson-step-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={cn(
                "flex items-start gap-3 rounded-xl border p-4 bg-gradient-to-r backdrop-blur-sm",
                gradient.bg, gradient.border
              )}>
                <div className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm",
                  gradient.badge
                )}>
                  {index + 1}
                </div>
                <span className="text-sm leading-relaxed text-white/80 pt-0.5">{step}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal next step button */}
      {!allRevealed && (
        <div className="flex justify-center lesson-step-in">
          <button
            onClick={revealNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium"
          >
            <span>Proximo passo</span>
            <Play className="size-3" />
          </button>
        </div>
      )}

      {allRevealed && (
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all text-sm font-medium lesson-step-in"
        >
          <RotateCcw className="size-4" />
          Quero tentar de novo
        </button>
      )}
    </div>
  );
}
