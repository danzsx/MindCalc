"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, Play } from "lucide-react";
import { getStepColor } from "@/lib/lessons/utils";
import { cn } from "@/lib/utils";

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
      {/* Explanation block */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-primary/10">
          <Lightbulb className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-section-title mb-1">{title}</h2>
          <p className="text-body-primary text-muted-foreground" style={{ lineHeight: 'var(--leading-relaxed)' }}>
            {explanation}
          </p>
        </div>
      </div>

      {/* Central expression */}
      <div className="text-center py-4">
        <p className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground">
          {example.expression}
        </p>
      </div>

      {/* Progressive step revelation */}
      <div className="space-y-3">
        {example.steps.map((step, index) => {
          const isVisible = index < visibleSteps;
          const color = getStepColor(index, totalSteps);

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
                "flex items-start gap-3 rounded-lg border p-4",
                color.bg, color.border
              )}>
                <div className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  color.badge
                )}>
                  {index + 1}
                </div>
                <span className="text-body-primary leading-relaxed pt-0.5">
                  {step}
                </span>
              </div>
            </div>
          );
        })}

        {/* "Next step" button between steps */}
        {visibleSteps > 0 && visibleSteps < totalSteps && (
          <div className="flex justify-center py-1 lesson-step-in">
            <button
              onClick={revealNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all text-sm"
            >
              <span>Proximo passo</span>
              <Play className="size-3" />
            </button>
          </div>
        )}
      </div>

      {/* Final result with glow */}
      {showResult && (
        <div className="text-center py-4 lesson-step-in">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-success/20 rounded-full blur-xl" />
            <p className="relative text-2xl sm:text-3xl font-bold text-success">
              = {example.answer}
            </p>
          </div>
        </div>
      )}

      {/* CTA — only after all steps revealed */}
      {allRevealed && (
        <div className="lesson-step-in" style={{ animationDelay: '200ms' }}>
          <Button onClick={onContinue} className="w-full" size="lg">
            Entendi! Vamos praticar
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
