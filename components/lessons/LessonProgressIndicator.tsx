"use client";

import { cn } from "@/lib/utils";
import type { LessonPhase } from "@/lib/lessons/types";

const PHASES: LessonPhase[] = ["intro", "guided", "semi-guided", "free", "completion"];

const PHASE_LABELS: Record<LessonPhase, string> = {
  intro: "Intro",
  guided: "Guiado",
  "semi-guided": "Semi-guiado",
  free: "Livre",
  completion: "Conclusão",
};

interface LessonProgressIndicatorProps {
  currentPhase: LessonPhase;
}

export function LessonProgressIndicator({ currentPhase }: LessonProgressIndicatorProps) {
  const currentIndex = PHASES.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-2">
      {PHASES.map((phase, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={phase} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "size-3 rounded-full transition-colors",
                  isCompleted && "bg-primary",
                  isCurrent && "bg-primary ring-2 ring-primary/30",
                  !isCompleted && !isCurrent && "bg-muted"
                )}
              />
              <span
                className={cn(
                  "text-[10px] leading-none hidden sm:block",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {PHASE_LABELS[phase]}
              </span>
            </div>
            {index < PHASES.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 -mt-4 sm:-mt-0.5",
                  index < currentIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
