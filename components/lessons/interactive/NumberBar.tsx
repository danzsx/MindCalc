"use client";

import { cn } from "@/lib/utils";

interface NumberBarProps {
  /** The number to visualize */
  value: number;
  /** Color scheme */
  color: "teal" | "amber";
  /** Show empty slots to the next ten */
  showGap?: boolean;
  /** How many units to highlight as "transferring out" (pulsing) */
  highlightTransfer?: number;
  /** Whether the transfer has completed (those units disappear) */
  transferDone?: boolean;
  /** How many gap slots to show as "filled in" (received transfer) */
  gapFilled?: number;
  /** Show label below the bar */
  label?: string;
  /** Size variant */
  size?: "sm" | "md";
}

const COLOR_MAP = {
  teal: {
    filled: "bg-primary",
    highlight: "bg-amber-400 ring-2 ring-amber-300 interactive-block-pulse",
    gap: "border-2 border-dashed border-muted-foreground/25",
    gapFilled: "bg-emerald-400 interactive-block-pop",
    text: "text-primary",
  },
  amber: {
    filled: "bg-amber-400",
    highlight: "bg-amber-400 ring-2 ring-amber-300 interactive-block-pulse",
    gap: "border-2 border-dashed border-muted-foreground/25",
    gapFilled: "bg-emerald-400 interactive-block-pop",
    text: "text-amber-500",
  },
};

export function NumberBar({
  value,
  color,
  showGap = false,
  highlightTransfer = 0,
  transferDone = false,
  gapFilled = 0,
  label,
  size = "md",
}: NumberBarProps) {
  const tens = Math.floor(value / 10);
  const units = value % 10;
  const gapToTen = units > 0 ? 10 - units : 0;
  const colors = COLOR_MAP[color];

  const blockSize = size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5";
  const blockGap = size === "sm" ? "gap-0.5" : "gap-1";
  const rowGap = size === "sm" ? "gap-0.5" : "gap-1";

  // Determine which units to highlight for transfer
  const effectiveUnits = transferDone ? units - highlightTransfer : units;
  const displayUnits = Math.max(0, effectiveUnits);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* The number itself */}
      <span
        className={cn(
          "font-bold tabular-nums",
          size === "sm" ? "text-2xl" : "text-3xl sm:text-4xl",
          colors.text
        )}
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        {transferDone ? value - highlightTransfer : value}
      </span>

      {/* Unit bar visualization */}
      <div className={cn("flex flex-col items-center", rowGap)}>
        {/* Tens indicator (compact) */}
        {tens > 0 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: tens }).map((_, i) => (
              <div
                key={`ten-${i}`}
                className={cn(
                  "flex rounded-md overflow-hidden",
                  blockGap
                )}
              >
                <div
                  className={cn(
                    blockSize,
                    "rounded-sm",
                    colors.filled,
                    "opacity-40"
                  )}
                  style={{ width: size === "sm" ? "20px" : "28px" }}
                />
              </div>
            ))}
            <span className="text-[10px] text-muted-foreground ml-0.5">
              {tens}0
            </span>
          </div>
        )}

        {/* Units row */}
        <div className={cn("flex items-center", blockGap)}>
          {/* Regular units */}
          {Array.from({ length: displayUnits }).map((_, i) => (
            <div
              key={`unit-${i}`}
              className={cn(
                blockSize,
                "rounded-sm transition-all duration-300",
                colors.filled
              )}
            />
          ))}

          {/* Highlight units (about to transfer out) */}
          {!transferDone &&
            highlightTransfer > 0 &&
            Array.from({ length: highlightTransfer }).map((_, i) => (
              <div
                key={`transfer-${i}`}
                className={cn(blockSize, "rounded-sm", colors.highlight)}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}

          {/* Gap slots */}
          {showGap &&
            gapToTen > 0 &&
            Array.from({ length: gapToTen }).map((_, i) => (
              <div
                key={`gap-${i}`}
                className={cn(
                  blockSize,
                  "rounded-sm",
                  i < gapFilled ? colors.gapFilled : colors.gap
                )}
                style={
                  i < gapFilled
                    ? { animationDelay: `${i * 120}ms` }
                    : undefined
                }
              />
            ))}
        </div>
      </div>

      {/* Label */}
      {label && (
        <span className="text-caption text-muted-foreground mt-1">
          {label}
        </span>
      )}
    </div>
  );
}
