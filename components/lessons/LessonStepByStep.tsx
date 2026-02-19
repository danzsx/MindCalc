"use client";

import { useState, useCallback, useEffect } from "react";
import { RotateCcw, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/* Numetria step palette */
const STEP_STYLES = [
  {
    bg: "rgba(55,112,191,0.08)",
    border: "rgba(55,112,191,0.2)",
    badgeBg: "#3770bf",
    badgeText: "#f0f4ff",
  },
  {
    bg: "rgba(141,194,255,0.06)",
    border: "rgba(141,194,255,0.18)",
    badgeBg: "#5a8fd4",
    badgeText: "#f0f4ff",
  },
  {
    bg: "rgba(206,242,109,0.05)",
    border: "rgba(206,242,109,0.15)",
    badgeBg: "#a8cc47",
    badgeText: "#080f1e",
  },
  {
    bg: "rgba(55,112,191,0.06)",
    border: "rgba(55,112,191,0.15)",
    badgeBg: "#2558a0",
    badgeText: "#f0f4ff",
  },
  {
    bg: "rgba(141,194,255,0.05)",
    border: "rgba(141,194,255,0.12)",
    badgeBg: "#8dc2ff",
    badgeText: "#080f1e",
  },
];

interface LessonStepByStepProps {
  steps: string[];
  onRetry: () => void;
  autoPlay?: boolean;
}

export function LessonStepByStep({ steps, onRetry, autoPlay = false }: LessonStepByStepProps) {
  const [visibleSteps, setVisibleSteps] = useState(autoPlay ? 0 : 1);
  const totalSteps = steps.length;

  useEffect(() => {
    if (!autoPlay) return;
    const timers = Array.from({ length: totalSteps }, (_, i) =>
      setTimeout(() => setVisibleSteps(i + 1), (i + 1) * 1400)
    );
    return () => timers.forEach(clearTimeout);
  }, [autoPlay, totalSteps]);

  const revealNext = useCallback(() => {
    setVisibleSteps((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const allRevealed = visibleSteps >= totalSteps;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm text-[#6b89b4]">
          {autoPlay ? "Replay automático — veja o raciocínio completo." : "Vamos rever juntos? Cada passo fica mais claro."}
        </p>
        {autoPlay && !allRevealed && (
          <span className="flex gap-0.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#3770bf", animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#3770bf", animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#3770bf", animationDelay: "300ms" }} />
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isVisible = index < visibleSteps;
          const style = STEP_STYLES[index % STEP_STYLES.length];

          if (!isVisible) return null;

          return (
            <div
              key={index}
              className="lesson-step-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className="flex items-start gap-3 rounded-xl border p-4"
                style={{
                  background: style.bg,
                  borderColor: style.border,
                }}
              >
                <div
                  className="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ background: style.badgeBg, color: style.badgeText }}
                >
                  {index + 1}
                </div>
                <span className="text-sm leading-relaxed text-[#a8c0e0] pt-0.5">{step}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal next step */}
      {!allRevealed && !autoPlay && (
        <div className="flex justify-center lesson-step-in">
          <button
            onClick={revealNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(55,112,191,0.08)",
              border: "1px solid rgba(55,112,191,0.2)",
              color: "#8dc2ff",
            }}
          >
            <span>Próximo passo</span>
            <Play className="size-3" />
          </button>
        </div>
      )}

      {allRevealed && (
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all lesson-step-in"
          style={{
            background: "rgba(141,194,255,0.06)",
            border: "1px solid rgba(141,194,255,0.15)",
            color: "#6b89b4",
          }}
        >
          <RotateCcw className="size-4" />
          Quero tentar de novo
        </button>
      )}
    </div>
  );
}
