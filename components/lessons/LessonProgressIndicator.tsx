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
    <div className="w-full space-y-4">
      {/* Steps row */}
      <div className="flex items-center justify-between">
        {PHASES.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const config = PHASE_CONFIG[phase];
          const Icon = config.icon;

          return (
            <div key={phase} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {/* Glow ring on current */}
                  {isCurrent && (
                    <div className="absolute -inset-1.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full opacity-30 blur-md animate-pulse" />
                  )}
                  <div
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all duration-500",
                      "w-11 h-11 sm:w-14 sm:h-14",
                      isCompleted && "bg-gradient-to-br from-teal-500 to-cyan-500 text-white border-2 border-teal-400/50 shadow-lg shadow-teal-500/20",
                      isCurrent && "bg-gradient-to-br from-teal-500 to-cyan-500 text-white border-2 border-teal-400 shadow-lg shadow-teal-500/50",
                      !isCompleted && !isCurrent && "bg-white/5 text-white/40 border-2 border-white/20"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4 sm:size-5" />
                    ) : (
                      <Icon className="size-4 sm:size-5" />
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs leading-none text-center whitespace-nowrap font-medium transition-colors duration-300",
                    isCurrent && "text-teal-400",
                    isCompleted && "text-teal-400/80",
                    !isCompleted && !isCurrent && "text-white/40"
                  )}
                >
                  {config.label}
                </span>
              </div>

              {/* Connector line */}
              {index < PHASES.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 -mt-6">
                  <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        index < currentIndex
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 w-full"
                          : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom progress bar with shimmer */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 transition-all duration-700 relative"
          style={{ width: `${(currentIndex / (PHASES.length - 1)) * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
