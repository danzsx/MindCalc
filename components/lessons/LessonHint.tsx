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
        "flex items-start gap-3 rounded-lg border p-4",
        level === "full"
          ? "border-primary/30 bg-primary/5"
          : "border-muted-foreground/20 bg-muted/50"
      )}
    >
      <Lightbulb className="size-5 shrink-0 text-primary mt-0.5" />
      <p className="text-sm leading-relaxed text-foreground">{hint}</p>
    </div>
  );
}
