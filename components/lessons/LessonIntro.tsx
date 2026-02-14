"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, Play, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_GRADIENTS = [
  { bg: "from-teal-500/10 to-cyan-500/10", border: "border-teal-500/20", badge: "bg-gradient-to-br from-teal-500 to-cyan-500 text-white" },
  { bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20", badge: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white" },
  { bg: "from-blue-500/10 to-purple-500/10", border: "border-blue-500/20", badge: "bg-gradient-to-br from-blue-500 to-purple-500 text-white" },
  { bg: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/20", badge: "bg-gradient-to-br from-purple-500 to-pink-500 text-white" },
  { bg: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-500/20", badge: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" },
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

  // Auto-reveal first step after 600ms
  useEffect(() => {
    if (visibleSteps === 0) {
      const timer = setTimeout(() => setVisibleSteps(1), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Show result after all steps revealed
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
    <div className="space-y-6">
      {/* Explanation card — glassmorphism with gradient icon */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-50" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
              <Info className="size-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-[var(--font-family-display)] text-xl sm:text-2xl font-bold text-white mb-2">
                {title}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Central expression — large, gradient text */}
      <div className="text-center py-5">
        <p className="font-[var(--font-family-display)] text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent tracking-wide">
          {example.expression}
        </p>
      </div>

      {/* Progressive step revelation */}
      <div className="space-y-3">
        {example.steps.map((step, index) => {
          const isVisible = index < visibleSteps;
          const gradient = STEP_GRADIENTS[index % STEP_GRADIENTS.length];

          return (
            <div
              key={index}
              className={cn(
                "transition-all duration-400",
                isVisible ? "lesson-step-in" : "opacity-0 pointer-events-none h-0 overflow-hidden"
              )}
              style={isVisible ? { animationDelay: `${index * 100}ms` } : undefined}
            >
              <div className={cn(
                "flex items-start gap-3 rounded-xl border p-4 bg-gradient-to-r backdrop-blur-sm",
                gradient.bg, gradient.border
              )}>
                <div className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm",
                  gradient.badge
                )}>
                  {index + 1}
                </div>
                <span className="text-sm leading-relaxed text-white/80 pt-0.5">
                  {step}
                </span>
              </div>
            </div>
          );
        })}

        {/* "Next step" button */}
        {visibleSteps > 0 && visibleSteps < totalSteps && (
          <div className="flex justify-center py-2 lesson-step-in">
            <button
              onClick={revealNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium"
            >
              <span>Proximo passo</span>
              <Play className="size-3" />
            </button>
          </div>
        )}
      </div>

      {/* Final result with glow */}
      {showResult && (
        <div className="text-center py-5 lesson-step-in">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl" />
            <p className="relative font-[var(--font-family-display)] text-3xl sm:text-4xl font-bold text-emerald-400">
              = {example.answer}
            </p>
          </div>
        </div>
      )}

      {/* CTA — only after all steps revealed */}
      {allRevealed && (
        <div className="lesson-step-in" style={{ animationDelay: '200ms' }}>
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 group"
          >
            Entendi! Vamos praticar
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
