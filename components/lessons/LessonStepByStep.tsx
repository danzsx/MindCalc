"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface LessonStepByStepProps {
  steps: string[];
  onRetry: () => void;
}

export function LessonStepByStep({ steps, onRetry }: LessonStepByStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Quase. Vamos pensar juntos por outro caminho:
      </p>

      <ol className="space-y-2 pl-1">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      <Button onClick={onRetry} variant="outline" className="w-full">
        <RotateCcw className="size-4" />
        Quero tentar de novo
      </Button>
    </div>
  );
}
