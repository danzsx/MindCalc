"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberDecompositionVisualProps {
  /** First operand */
  a: number;
  /** Second operand */
  b: number;
  /** Which strategy step is currently active (0-indexed). -1 = no steps started yet */
  currentStep: number;
  /** Whether all steps are done (shows final synthesis) */
  allDone?: boolean;
}

/**
 * Visual decomposition tree for addition lessons (somar-dezenas-primeiro).
 * Shows both numbers split into tens + units and progressively reveals sums.
 *
 *   25         43
 *  ┌──┬──┐  ┌──┬──┐
 *  │20│ 5│  │40│ 3│
 *  └──┴──┘  └──┴──┘
 *  ✓ 20 + 40 = 60    (after step 0 done)
 *  ✓ 5 + 3 = 8       (after step 1 done)
 */
export function NumberDecompositionVisual({
  a,
  b,
  currentStep,
  allDone = false,
}: NumberDecompositionVisualProps) {
  const dezA = Math.floor(a / 10) * 10;
  const uniA = a % 10;
  const dezB = Math.floor(b / 10) * 10;
  const uniB = b % 10;
  const somaDez = dezA + dezB;
  const somaUni = uniA + uniB;

  // Highlights: which column is currently being worked on
  const tensActive = currentStep === 0;
  const unitsActive = currentStep === 1;

  // What has been answered so far
  const tensAnswered = currentStep >= 1 || allDone;
  const unitsAnswered = currentStep >= 2 || allDone;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3 select-none">
      {/* Decomposition cards for a and b */}
      <div className="flex items-stretch justify-center gap-3">
        {/* Card: a */}
        <DecompCard
          number={a}
          tens={dezA}
          units={uniA}
          tensActive={tensActive}
          unitsActive={unitsActive}
        />

        {/* Plus connector */}
        <div className="flex items-center pb-0.5 text-xl font-bold text-muted-foreground/60 shrink-0">
          +
        </div>

        {/* Card: b */}
        <DecompCard
          number={b}
          tens={dezB}
          units={uniB}
          tensActive={tensActive}
          unitsActive={unitsActive}
        />
      </div>

      {/* Column labels */}
      <div className="flex justify-center gap-6 text-[11px] font-medium">
        <span className="text-cyan-600 dark:text-cyan-400">dezenas</span>
        <span className="text-amber-600 dark:text-amber-400">unidades</span>
      </div>

      {/* Progressively revealed sums */}
      {(tensAnswered || unitsAnswered) && (
        <div className="space-y-1.5 pt-1 border-t border-border/50">
          {tensAnswered && (
            <div className="interactive-fade-up flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 px-3 py-2">
              <CheckCircle2 className="size-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                {dezA} + {dezB} = {somaDez}
              </span>
            </div>
          )}
          {unitsAnswered && (
            <div className="interactive-fade-up flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-400/20 px-3 py-2">
              <CheckCircle2 className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {uniA} + {uniB} = {somaUni}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: DecompCard
// ---------------------------------------------------------------------------

function DecompCard({
  number,
  tens,
  units,
  tensActive,
  unitsActive,
}: {
  number: number;
  tens: number;
  units: number;
  tensActive: boolean;
  unitsActive: boolean;
}) {
  return (
    <div className="flex-1 max-w-[130px] rounded-xl border border-border bg-muted/20 overflow-hidden">
      {/* Header: full number */}
      <div className="text-center py-1.5 text-base font-bold text-foreground border-b border-border">
        {number}
      </div>

      {/* Split: tens | units */}
      <div className="flex">
        {/* Tens cell */}
        <div
          className={cn(
            "flex-1 text-center py-2 text-sm font-bold transition-all duration-300",
            "text-cyan-700 dark:text-cyan-400",
            tensActive
              ? "bg-cyan-500/20 ring-inset ring-2 ring-cyan-400"
              : "bg-cyan-500/5"
          )}
        >
          {tens}
        </div>

        {/* Divider */}
        <div className="w-px bg-border" />

        {/* Units cell */}
        <div
          className={cn(
            "flex-1 text-center py-2 text-sm font-bold transition-all duration-300",
            "text-amber-700 dark:text-amber-400",
            unitsActive
              ? "bg-amber-500/20 ring-inset ring-2 ring-amber-400"
              : "bg-amber-500/5"
          )}
        >
          {units}
        </div>
      </div>
    </div>
  );
}
