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
    <div className="w-full space-y-3">
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
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative">
                  {/* Glow ring on current */}
                  {isCurrent && (
                    <div
                      className="absolute -inset-2 rounded-full animate-pulse"
                      style={{ background: "rgba(206,242,109,0.15)", filter: "blur(6px)" }}
                    />
                  )}
                  <div
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all duration-500 w-9 h-9 sm:w-10 sm:h-10"
                    )}
                    style={
                      isCompleted
                        ? {
                            background: "rgba(206,242,109,0.15)",
                            border: "1.5px solid rgba(206,242,109,0.4)",
                            color: "#cef26d",
                          }
                        : isCurrent
                        ? {
                            background: "rgba(206,242,109,0.12)",
                            border: "1.5px solid #cef26d",
                            color: "#cef26d",
                            boxShadow: "0 0 12px rgba(206,242,109,0.25)",
                          }
                        : {
                            background: "rgba(13,29,58,0.8)",
                            border: "1.5px solid rgba(141,194,255,0.12)",
                            color: "#3a5070",
                          }
                    }
                  >
                    {isCompleted ? (
                      <Check className="size-4" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "hidden min-[380px]:block text-[10px] leading-none text-center whitespace-nowrap font-medium transition-colors duration-300"
                  )}
                  style={
                    isCurrent
                      ? { color: "#cef26d", fontWeight: 600 }
                      : isCompleted
                      ? { color: "#6b89b4" }
                      : { color: "#3a5070" }
                  }
                >
                  {config.label}
                </span>
              </div>

              {/* Connector line */}
              {index < PHASES.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 -mt-4">
                  <div
                    className="h-px w-full rounded-full overflow-hidden"
                    style={{ background: "rgba(141,194,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: index < currentIndex ? "100%" : "0%",
                        background: "linear-gradient(90deg, rgba(206,242,109,0.6) 0%, #cef26d 100%)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom progress bar */}
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(141,194,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
          style={{
            width: `${(currentIndex / (PHASES.length - 1)) * 100}%`,
            background: "linear-gradient(90deg, #3770bf 0%, #cef26d 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
