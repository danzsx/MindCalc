"use client";

import { cn } from "@/lib/utils";

interface BaseBlockVisualProps {
  a: number;
  b: number;
  /** Which strategy step is currently active (0-indexed) */
  currentStep: number;
}

const MAX_BLOCKS = 9;

/**
 * Montessori-style base-10 block visualization.
 * Cyan horizontal bars = tens (10 each)
 * Amber squares = units (1 each)
 */
export function BaseBlockVisual({ a, b, currentStep }: BaseBlockVisualProps) {
  const dezA = Math.min(Math.floor(a / 10), MAX_BLOCKS);
  const uniA = Math.min(a % 10, MAX_BLOCKS);
  const dezB = Math.min(Math.floor(b / 10), MAX_BLOCKS);
  const uniB = Math.min(b % 10, MAX_BLOCKS);

  const tensHighlighted = currentStep === 0;
  const unitsHighlighted = currentStep === 1;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3 select-none">
      <div className="flex gap-8 justify-center items-start">
        {/* Number A */}
        <BlockGroup
          label={a}
          tens={dezA}
          units={uniA}
          tensHighlighted={tensHighlighted}
          unitsHighlighted={unitsHighlighted}
          baseDelay={0}
        />

        {/* Plus */}
        <div className="flex items-center justify-center text-lg font-bold text-muted-foreground/60 pt-5">
          +
        </div>

        {/* Number B */}
        <BlockGroup
          label={b}
          tens={dezB}
          units={uniB}
          tensHighlighted={tensHighlighted}
          unitsHighlighted={unitsHighlighted}
          baseDelay={Math.max(dezA, uniA) * 40}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-[11px] text-muted-foreground font-medium">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-7 rounded-sm bg-cyan-400/60" />
          <span>dezena (10)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-amber-400/60" />
          <span>unidade (1)</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: BlockGroup
// ---------------------------------------------------------------------------

function BlockGroup({
  label,
  tens,
  units,
  tensHighlighted,
  unitsHighlighted,
  baseDelay,
}: {
  label: number;
  tens: number;
  units: number;
  tensHighlighted: boolean;
  unitsHighlighted: boolean;
  baseDelay: number;
}) {
  return (
    <div className="space-y-2 min-w-[60px]">
      {/* Number label */}
      <div className="text-center text-xs text-muted-foreground font-semibold">
        {label}
      </div>

      {/* Tens bars */}
      <div className="space-y-1">
        {Array.from({ length: tens }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 w-10 rounded-sm block-bar-pop transition-all duration-300",
              tensHighlighted
                ? "bg-cyan-500 shadow-[0_0_0_2px_rgba(6,182,212,0.35)]"
                : "bg-cyan-400/60"
            )}
            style={{ animationDelay: `${baseDelay + i * 40}ms` }}
          />
        ))}
      </div>

      {/* Units squares */}
      <div className="flex flex-wrap gap-0.5 max-w-[52px]">
        {Array.from({ length: units }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 w-3 rounded-sm block-bar-pop transition-all duration-300",
              unitsHighlighted
                ? "bg-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.35)]"
                : "bg-amber-400/60"
            )}
            style={{ animationDelay: `${baseDelay + i * 30}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
