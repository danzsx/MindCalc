"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MicroWin } from "./shared";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NumberSliderProps {
  question: string;
  /** Starting position of the slider (e.g. 53) */
  number: number;
  /** Target value — nearest decade (e.g. 50) */
  target: number;
  winMsg: string;
  onNext: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NumberSlider({
  question,
  number,
  target,
  winMsg,
  onNext,
}: NumberSliderProps) {
  const span = Math.abs(number - target);
  const extra = Math.max(3, Math.ceil(span * 0.4));
  const min = Math.min(number, target) - extra;
  const max = Math.max(number, target) + extra;

  const [value, setValue] = useState(number);
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (done) return;
    const v = parseInt(e.target.value, 10);
    setValue(v);
    if (Math.abs(v - target) <= 1) {
      setValue(target);
      setDone(true);
    }
  };

  const totalRange = max - min;
  const valuePct = ((value - min) / totalRange) * 100;
  const targetPct = ((target - min) / totalRange) * 100;
  const startPct = ((number - min) / totalRange) * 100;

  // Determine which side the fill goes from (number toward target)
  const fillLeft = Math.min(startPct, valuePct);
  const fillWidth = Math.abs(valuePct - startPct);

  return (
    <div className="space-y-6 interactive-fade-up">
      {/* Question */}
      <p className="text-sm text-muted-foreground text-center">{question}</p>

      {/* Big number display */}
      <div className="text-center">
        <span
          className={cn(
            "text-7xl font-bold transition-colors duration-300",
            done ? "text-success" : "text-foreground"
          )}
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {value}
        </span>
        {done && (
          <p className="text-sm font-medium text-success mt-1 interactive-fade-up">
            Dezena encontrada!
          </p>
        )}
      </div>

      {/* Slider track */}
      <div className="px-2 space-y-1.5">
        <div className="relative h-10">
          {/* All visual elements — no pointer events */}
          <div className="absolute inset-0 pointer-events-none flex items-center">
            {/* Track background */}
            <div className="relative w-full h-4 bg-muted rounded-full overflow-visible">
              {/* Fill from start to current */}
              <div
                className={cn(
                  "absolute top-0 h-full rounded-full transition-all duration-75",
                  done ? "bg-success/50" : "bg-primary/50"
                )}
                style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
              />

              {/* Starting position marker (subtle) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-muted-foreground/30"
                style={{ left: `${startPct}%` }}
              />

              {/* Target marker (decade) */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 bg-card transition-all duration-300",
                  done ? "border-success scale-110" : "border-cyan-500"
                )}
                style={{ left: `${targetPct}%` }}
              />

              {/* Visual thumb */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 shadow-md transition-all duration-75",
                  done
                    ? "border-success bg-success"
                    : "border-primary bg-card shadow-primary/20"
                )}
                style={{ left: `${valuePct}%` }}
              >
                {done && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Invisible interactive range input on top */}
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={handleChange}
            disabled={done}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default z-10"
          />
        </div>

        {/* Axis labels */}
        <div className="flex justify-between text-[11px] font-semibold">
          <span className="text-muted-foreground">{min}</span>
          <span
            className={cn(
              "transition-colors duration-300",
              done ? "text-success" : "text-cyan-500"
            )}
          >
            {target}
          </span>
          <span className="text-muted-foreground">{max}</span>
        </div>
      </div>

      {/* Hint while sliding */}
      {!done && (
        <p className="text-xs text-center text-muted-foreground">
          Deslize até o número{" "}
          <span className="font-bold text-cyan-500">{target}</span>
        </p>
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
