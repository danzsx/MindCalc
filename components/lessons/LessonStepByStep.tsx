"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play } from "lucide-react";
import { getStepColor } from "@/lib/lessons/utils";
import { cn } from "@/lib/utils";

interface LessonStepByStepProps {
  steps: string[];
  onRetry: () => void;
}

export function LessonStepByStep({ steps, onRetry }: LessonStepByStepProps) {
  const [visibleSteps, setVisibleSteps] = useState(1); // Start with first step visible
  const totalSteps = steps.length;

  const revealNext = useCallback(() => {
    setVisibleSteps((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const allRevealed = visibleSteps >= totalSteps;

  return (
    <div className="space-y-4">
      <p className="text-body-primary text-muted-foreground">
        Vamos rever juntos? Cada passo fica mais claro.
      </p>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isVisible = index < visibleSteps;
          const color = getStepColor(index, totalSteps);

          if (!isVisible) return null;

          return (
            <div
              key={index}
              className="lesson-step-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={cn(
                "flex items-start gap-3 rounded-lg border p-3",
                color.bg, color.border
              )}>
                <div className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  color.badge
                )}>
                  {index + 1}
                </div>
                <span className="text-sm leading-relaxed pt-0.5">{step}</span>
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all text-sm"
          >
            <span>Proximo passo</span>
            <Play className="size-3" />
          </button>
        </div>
      )}

      {allRevealed && (
        <Button onClick={onRetry} variant="outline" className="w-full lesson-step-in">
          <RotateCcw className="size-4" />
          Quero tentar de novo
        </Button>
      )}
    </div>
  );
}
