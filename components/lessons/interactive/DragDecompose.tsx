"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MicroWin } from "./shared";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DragDecomposeProps {
  /** The number to decompose, e.g. 37 → tens=30, units=7 */
  number: number;
  winMsg: string;
  onNext: () => void;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DragDecompose({ number, winMsg, onNext }: DragDecomposeProps) {
  const tens = Math.floor(number / 10) * 10;
  const units = number % 10;

  const [selectedTile, setSelectedTile] = useState<"tens" | "units" | null>(null);
  const [tensPlaced, setTensPlaced] = useState(false);
  const [unitsPlaced, setUnitsPlaced] = useState(false);
  const [shakingZone, setShakingZone] = useState<"dezenas" | "unidades" | null>(null);
  const [done, setDone] = useState(false);

  const handleTileClick = useCallback(
    (tile: "tens" | "units") => {
      if (tile === "tens" && tensPlaced) return;
      if (tile === "units" && unitsPlaced) return;
      setSelectedTile((prev) => (prev === tile ? null : tile));
    },
    [tensPlaced, unitsPlaced]
  );

  const handleZoneClick = useCallback(
    (zone: "dezenas" | "unidades") => {
      if (!selectedTile) return;

      const isCorrect =
        (zone === "dezenas" && selectedTile === "tens") ||
        (zone === "unidades" && selectedTile === "units");

      if (isCorrect) {
        const willComplete =
          (zone === "dezenas" && unitsPlaced) ||
          (zone === "unidades" && tensPlaced);

        if (zone === "dezenas") setTensPlaced(true);
        else setUnitsPlaced(true);

        setSelectedTile(null);
        if (willComplete) setDone(true);
      } else {
        setShakingZone(zone);
        setSelectedTile(null);
        setTimeout(() => setShakingZone(null), 500);
      }
    },
    [selectedTile, tensPlaced, unitsPlaced]
  );

  return (
    <div className="space-y-6 interactive-fade-up">
      {/* Number display */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-primary/10 border-2 border-primary/30">
          <span
            className="text-5xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {number}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Separe as partes deste número
        </p>
      </div>

      {/* Source tiles */}
      <div className="space-y-2">
        <p className="text-xs text-center text-muted-foreground">
          Toque para selecionar:
        </p>
        <div className="flex gap-4 justify-center min-h-[88px] items-center">
          {!unitsPlaced && (
            <Tile
              value={units}
              selected={selectedTile === "units"}
              onClick={() => handleTileClick("units")}
              color="amber"
            />
          )}
          {!tensPlaced && (
            <Tile
              value={tens}
              selected={selectedTile === "tens"}
              onClick={() => handleTileClick("tens")}
              color="cyan"
            />
          )}
        </div>
      </div>

      {/* Drop zones */}
      <div className="grid grid-cols-2 gap-4">
        <DropZone
          label="Dezenas"
          value={tensPlaced ? tens : null}
          active={selectedTile !== null && !tensPlaced}
          shaking={shakingZone === "dezenas"}
          color="cyan"
          onClick={() => handleZoneClick("dezenas")}
        />
        <DropZone
          label="Unidades"
          value={unitsPlaced ? units : null}
          active={selectedTile !== null && !unitsPlaced}
          shaking={shakingZone === "unidades"}
          color="amber"
          onClick={() => handleZoneClick("unidades")}
        />
      </div>

      {/* Prompt while tile is selected */}
      {selectedTile && !done && (
        <p className="text-xs text-center text-primary animate-pulse">
          Agora toque na caixa correta ↑
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

// ---------------------------------------------------------------------------
// Tile
// ---------------------------------------------------------------------------

const TILE_COLORS = {
  cyan: {
    base: "border-cyan-300/50 bg-cyan-50 dark:bg-cyan-950/30",
    selected:
      "border-cyan-500 bg-cyan-100 dark:bg-cyan-900/50 shadow-[0_0_0_4px_rgba(6,182,212,0.2)] scale-105",
    text: "text-cyan-700 dark:text-cyan-300",
  },
  amber: {
    base: "border-amber-300/50 bg-amber-50 dark:bg-amber-950/30",
    selected:
      "border-amber-500 bg-amber-100 dark:bg-amber-900/50 shadow-[0_0_0_4px_rgba(245,158,11,0.2)] scale-105",
    text: "text-amber-700 dark:text-amber-300",
  },
} as const;

function Tile({
  value,
  selected,
  onClick,
  color,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
  color: "cyan" | "amber";
}) {
  const c = TILE_COLORS[color];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-24 h-20 rounded-2xl border-2 transition-all duration-200 select-none",
        "hover:scale-105 active:scale-95",
        selected ? c.selected : c.base
      )}
    >
      <span className={cn("text-3xl font-bold", c.text)}>{value}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// DropZone
// ---------------------------------------------------------------------------

const ZONE_COLORS = {
  cyan: {
    empty: "border-cyan-200 dark:border-cyan-800",
    active: "border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20",
    filled: "border-cyan-400 bg-cyan-100/70 dark:bg-cyan-900/40",
    text: "text-cyan-700 dark:text-cyan-300",
    label: "text-cyan-600 dark:text-cyan-400",
  },
  amber: {
    empty: "border-amber-200 dark:border-amber-800",
    active: "border-amber-400 bg-amber-50/50 dark:bg-amber-950/20",
    filled: "border-amber-400 bg-amber-100/70 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-300",
    label: "text-amber-600 dark:text-amber-400",
  },
} as const;

function DropZone({
  label,
  value,
  active,
  shaking,
  color,
  onClick,
}: {
  label: string;
  value: number | null;
  active: boolean;
  shaking: boolean;
  color: "cyan" | "amber";
  onClick: () => void;
}) {
  const c = ZONE_COLORS[color];
  const isFilled = value !== null;

  return (
    <button
      onClick={onClick}
      disabled={isFilled}
      className={cn(
        "flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed transition-all duration-200",
        isFilled ? c.filled : active ? c.active : c.empty,
        shaking && "shake",
        active && !isFilled && "cursor-pointer"
      )}
    >
      <span className={cn("text-[11px] font-semibold mb-1.5 uppercase tracking-wide", c.label)}>
        {label}
      </span>
      {isFilled ? (
        <div className="flex items-center gap-1.5 number-bounce-reveal">
          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
          <span className={cn("text-2xl font-bold", c.text)}>{value}</span>
        </div>
      ) : (
        <span className="text-2xl text-muted-foreground/30 font-bold">___</span>
      )}
    </button>
  );
}
