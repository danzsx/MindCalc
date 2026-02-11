"use client";

import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import type { HintLevel } from "@/lib/lessons/types";

interface LessonHintProps {
  hint: string;
  level: HintLevel;
}

export function LessonHint({ hint, level }: LessonHintProps) {
  if (level === "none") {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg p-4",
        level === "full"
          ? "border-l-4 border-l-cyan-400 bg-primary/5 border border-l-0 border-cyan-400/20"
          : "border-l-4 border-l-amber-400 bg-muted/30 border border-l-0 border-amber-400/20"
      )}
    >
      <Lightbulb
        className={cn(
          "size-5 shrink-0 mt-0.5",
          level === "full" ? "text-cyan-500" : "text-amber-500"
        )}
      />
      <p className="text-sm leading-relaxed text-foreground">{hint}</p>
    </div>
  );
}
