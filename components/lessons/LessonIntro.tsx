"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground leading-relaxed">{explanation}</p>
      </div>

      {/* Visual example */}
      <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Exemplo:</p>
        <p className="text-xl font-bold text-center">{example.expression}</p>
        <ol className="space-y-1.5 pl-1">
          {example.steps.map((step, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {index + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-center text-lg font-semibold text-primary">
          = {example.answer}
        </p>
      </div>

      <Button onClick={onContinue} className="w-full" size="lg">
        Peguei o truque, bora praticar
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
