"use client";

import { cn } from "@/lib/utils";
import { Lightbulb, Sparkles } from "lucide-react";
import type { HintLevel } from "@/lib/lessons/types";

interface LessonHintProps {
  hint: string;
  level: HintLevel;
}

export function LessonHint({ hint, level }: LessonHintProps) {
  if (level === "none") {
    return null;
  }

  const isFull = level === "full";

  return (
    <div className="relative group">
      {/* Subtle glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-10 blur-xl transition-opacity duration-500 group-hover:opacity-15",
          isFull
            ? "bg-gradient-to-br from-cyan-500 to-teal-500"
            : "bg-gradient-to-br from-amber-500 to-orange-500"
        )}
      />
      <div
        className={cn(
          "relative flex items-start gap-3 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300",
          isFull
            ? "bg-teal-500/8 border border-teal-500/20 border-l-4 border-l-teal-400"
            : "bg-amber-500/8 border border-amber-500/20 border-l-4 border-l-amber-400"
        )}
      >
        {/* Icon in gradient box */}
        <div
          className={cn(
            "flex items-center justify-center shrink-0 w-9 h-9 rounded-xl",
            isFull
              ? "bg-gradient-to-br from-teal-500 to-cyan-500"
              : "bg-gradient-to-br from-amber-500 to-orange-500"
          )}
        >
          {isFull ? (
            <Lightbulb className="size-4 text-white" />
          ) : (
            <Sparkles className="size-4 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider mb-1 text-white/40">
            {isFull ? "Dica completa" : "Uma pista"}
          </p>
          <p className="text-sm leading-relaxed text-white/80">{hint}</p>
        </div>
      </div>
    </div>
  );
}
