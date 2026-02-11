"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Lightbulb, HelpCircle, Zap, Trophy, Check } from "lucide-react";
import type { LessonPhase } from "@/lib/lessons/types";

const PHASES: LessonPhase[] = ["intro", "guided", "semi-guided", "free", "completion"];

const PHASE_CONFIG: Record<LessonPhase, { label: string; icon: typeof BookOpen }> = {
  intro: { label: "Conceito", icon: BookOpen },
  guided: { label: "Guiado", icon: Lightbulb },
  "semi-guided": { label: "Pista", icon: HelpCircle },
  free: { label: "Sozinho", icon: Zap },
  completion: { label: "Pronto!", icon: Trophy },
};

interface LessonProgressIndicatorProps {
  currentPhase: LessonPhase;
}

export function LessonProgressIndicator({ currentPhase }: LessonProgressIndicatorProps) {
  const currentIndex = PHASES.indexOf(currentPhase);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {PHASES.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const config = PHASE_CONFIG[phase];
          const Icon = config.icon;

          return (
            <div key={phase} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-300",
                    "w-9 h-9 sm:w-10 sm:h-10",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] leading-none text-center whitespace-nowrap",
                    isCurrent ? "text-foreground font-semibold" : "text-muted-foreground",
                    isCompleted && "text-success"
                  )}
                >
                  {config.label}
                </span>
              </div>

              {/* Connector line */}
              {index < PHASES.length - 1 && (
                <div className="flex-1 mx-1.5 sm:mx-2 -mt-5">
                  <div className="h-0.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        index < currentIndex ? "bg-success w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Animated progress bar below */}
      <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-700"
          style={{ width: `${(currentIndex / (PHASES.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
