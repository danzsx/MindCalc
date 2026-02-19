"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Info, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/* Numetria step color palette — no legacy teal/cyan/purple */
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
    bg: "rgba(206,242,109,0.06)",
    border: "rgba(206,242,109,0.16)",
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
    border: "rgba(141,194,255,0.15)",
    badgeBg: "#8dc2ff",
    badgeText: "#080f1e",
  },
];

interface LessonIntroProps {
  title: string;
  explanation: string;
  example: {
    expression: string;
    steps: string[];
    answer: number;
  };
  onContinue: () => void;
}

export function LessonIntro({
  title,
  explanation,
  example,
  onContinue,
}: LessonIntroProps) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const totalSteps = example.steps.length;

  useEffect(() => {
    if (visibleSteps === 0) {
      const timer = setTimeout(() => setVisibleSteps(1), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visibleSteps === totalSteps && !showResult) {
      const timer = setTimeout(() => setShowResult(true), 400);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, totalSteps, showResult]);

  const revealNext = useCallback(() => {
    setVisibleSteps((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const allRevealed = visibleSteps >= totalSteps && showResult;

  return (
    <div className="space-y-5">
      {/* Explanation card — glass dark */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "rgba(13,29,58,0.7)",
          borderColor: "rgba(141,194,255,0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex items-center justify-center shrink-0 w-9 h-9 rounded-xl"
            style={{
              background: "rgba(55,112,191,0.15)",
              border: "1px solid rgba(55,112,191,0.3)",
            }}
          >
            <Info className="size-4 text-[#8dc2ff]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-xl sm:text-2xl font-bold text-[#f0f4ff] mb-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {title}
            </h2>
            <p className="text-sm text-[#a8c0e0] leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Central expression */}
      <div className="text-center py-5">
        <p
          className="text-4xl sm:text-5xl font-bold text-[#f0f4ff] tracking-wide"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {example.expression}
        </p>
      </div>

      {/* Progressive step revelation */}
      <div className="space-y-2.5">
        {example.steps.map((step, index) => {
          const isVisible = index < visibleSteps;
          const style = STEP_STYLES[index % STEP_STYLES.length];

          return (
            <div
              key={index}
              className={cn(
                "transition-all duration-400",
                isVisible ? "lesson-step-in" : "opacity-0 pointer-events-none h-0 overflow-hidden"
              )}
              style={isVisible ? { animationDelay: `${index * 80}ms` } : undefined}
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
                <span className="text-sm leading-relaxed text-[#a8c0e0] pt-0.5 font-medium">
                  {step}
                </span>
              </div>
            </div>
          );
        })}

        {/* "Next step" button */}
        {visibleSteps > 0 && visibleSteps < totalSteps && (
          <div className="flex justify-center py-1 lesson-step-in">
            <button
              onClick={revealNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(55,112,191,0.1)",
                border: "1px solid rgba(55,112,191,0.25)",
                color: "#8dc2ff",
              }}
            >
              <span>Próximo passo</span>
              <Play className="size-3 fill-current" />
            </button>
          </div>
        )}
      </div>

      {/* Final result */}
      {showResult && (
        <div className="text-center py-4 lesson-step-in">
          <div className="inline-block relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(206,242,109,0.15) 0%, transparent 70%)",
                filter: "blur(16px)",
                transform: "scale(1.5)",
              }}
            />
            <p
              className="relative text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: "var(--font-family-display)",
                color: "#cef26d",
              }}
            >
              = {example.answer}
            </p>
          </div>
        </div>
      )}

      {/* CTA — only after all steps revealed */}
      {allRevealed && (
        <div className="lesson-step-in" style={{ animationDelay: "200ms" }}>
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-300 group"
            style={{
              background: "linear-gradient(135deg, #cef26d 0%, #a8cc47 100%)",
              color: "#080f1e",
              boxShadow: "0 4px 20px rgba(206,242,109,0.25)",
            }}
          >
            Entendi! Vamos praticar
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
