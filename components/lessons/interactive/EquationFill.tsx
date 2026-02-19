"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MicroWin } from "./shared";
import { isApproximatelyEqual, parseNumericInput } from "@/lib/lessons/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EquationFillProps {
  question: string;
  /** Left side of the equation, e.g. "30 + 40 =" */
  equationLeft: string;
  /** Optional right side after blank, e.g. "+ 5" */
  equationRight?: string;
  answer: number;
  winMsg: string;
  wrongMsg?: string;
  onNext: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EquationFill({
  question,
  equationLeft,
  equationRight,
  answer,
  winMsg,
  wrongMsg,
  onNext,
}: EquationFillProps) {
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseNumericInput(input);
    if (num === null) return;
    if (isApproximatelyEqual(answer, num)) {
      setDone(true);
      setFeedback(null);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setFeedback(
        next >= 2
          ? wrongMsg ?? "Releia a conta e tente de novo."
          : "Ainda não. Tente mais uma vez."
      );
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [answer, attempts, input, wrongMsg]);

  return (
    <div className="space-y-5 interactive-fade-up">
      {/* Question */}
      <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/15 p-4">
        <p className="text-body-primary text-foreground leading-relaxed">{question}</p>
      </div>

      {/* Visual equation with inline blank */}
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="flex items-center justify-center gap-2 flex-wrap gap-y-3">
          {/* Left side */}
          <span
            className="text-3xl sm:text-4xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {equationLeft}
          </span>

          {/* Blank / answer */}
          {!done ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder=" "
                className={cn(
                  "w-24 h-14 text-center rounded-2xl border-2 border-dashed",
                  "text-3xl font-bold text-foreground",
                  "bg-primary/5 border-primary/40",
                  "focus:outline-none focus:border-primary focus:bg-primary/10",
                  "transition-all duration-200",
                  "[appearance:textfield]",
                  "[&::-webkit-outer-spin-button]:appearance-none",
                  "[&::-webkit-inner-spin-button]:appearance-none"
                )}
              />
              {/* Pulsing cursor when empty */}
              {!input && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="inline-block w-0.5 h-7 bg-primary/50 animate-pulse rounded-full" />
                </span>
              )}
            </div>
          ) : (
            <span
              className="text-3xl sm:text-4xl font-bold text-success number-bounce-reveal"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {answer}
            </span>
          )}

          {/* Optional right side */}
          {equationRight && (
            <span
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {equationRight}
            </span>
          )}
        </div>
      </div>

      {/* Submit button */}
      {!done && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={input.trim() === ""}
            size="lg"
            className="min-w-[120px]"
          >
            Isso!
          </Button>
        </div>
      )}

      {/* Wrong feedback */}
      {feedback && !done && (
        <p className="text-center text-sm text-muted-foreground">{feedback}</p>
      )}

      {/* Success */}
      {done && (
        <div className="space-y-4 interactive-fade-up">
          <MicroWin message={winMsg} />
          <Button onClick={onNext} className="w-full" size="lg">
            Continuar
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
