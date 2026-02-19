"use client";

interface NumberLineProps {
  /** Starting number (e.g. 53) */
  from: number;
  /** Intermediate decade (e.g. 50) */
  decade: number;
  /** Final answer (e.g. 36) */
  to: number;
  /** Amount of first jump: from → decade */
  step1: number;
  /** Amount of second jump: decade → to */
  step2: number;
  /** 0 = first step active, 1 = second step active, 2 = all done */
  currentStep: number;
}

/**
 * SVG animated number line for subtraction-to-decade lessons.
 *
 *   answer←────────────────decade←─from
 *    36   ←── −14 ──────  50   ←3  53
 */
export function NumberLine({
  from,
  decade,
  to,
  step1,
  step2,
  currentStep,
}: NumberLineProps) {
  const W = 300;
  const H = 90;
  const lineY = 58;
  const margin = 28;

  // Evenly spaced positions for visual clarity (not proportional to value)
  const xFrom = W - margin;   // rightmost (53)
  const xDecade = 160;         // middle-right (50)
  const xTo = margin;          // leftmost (36)

  // Arc heights above the line
  const arc1H = 22;            // small jump (from → decade)
  const arc2H = 38;            // big jump (decade → to)

  const CYAN  = "#06b6d4";
  const AMBER = "#f59e0b";
  const EMERALD = "#10b981";

  const showArc1 = currentStep >= 0;   // first arc visible from the start
  const showArc2 = currentStep >= 1;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-1 select-none">
      <p className="text-[11px] text-center text-muted-foreground font-medium">
        Linha numérica
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxHeight: 90, overflow: "visible" }}
        aria-hidden
      >
        {/* Horizontal number line */}
        <line
          x1={margin - 8}
          y1={lineY}
          x2={W - margin + 8}
          y2={lineY}
          stroke="#9ca3af"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Arc 1: from → decade (small first jump, cyan) */}
        {showArc1 && (
          <g className="interactive-fade-up">
            <path
              d={arc(xFrom, lineY, xDecade, lineY, arc1H)}
              fill="none"
              stroke={CYAN}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="5 3"
            />
            {/* Arrowhead at decade */}
            <Arrowhead cx={xDecade} cy={lineY} color={CYAN} />
            {/* Jump label */}
            <text
              x={(xFrom + xDecade) / 2}
              y={lineY - arc1H - 6}
              textAnchor="middle"
              fill={CYAN}
              fontSize={11}
              fontWeight={700}
            >
              −{step1}
            </text>
          </g>
        )}

        {/* Arc 2: decade → to (bigger second jump, amber) */}
        {showArc2 && (
          <g className="interactive-fade-up">
            <path
              d={arc(xDecade, lineY, xTo, lineY, arc2H)}
              fill="none"
              stroke={AMBER}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="5 3"
            />
            <Arrowhead cx={xTo} cy={lineY} color={AMBER} />
            <text
              x={(xDecade + xTo) / 2}
              y={lineY - arc2H - 6}
              textAnchor="middle"
              fill={AMBER}
              fontSize={11}
              fontWeight={700}
            >
              −{step2}
            </text>
          </g>
        )}

        {/* Tick marks and labels */}
        {[
          { x: xTo,     val: to,     color: currentStep >= 2 ? EMERALD : "#6b7280" },
          { x: xDecade, val: decade, color: CYAN },
          { x: xFrom,   val: from,   color: "#6b7280" },
        ].map(({ x, val, color }) => (
          <g key={val}>
            <line
              x1={x} y1={lineY - 7}
              x2={x} y2={lineY + 7}
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <circle
              cx={x} cy={lineY} r={4}
              fill={color}
            />
            <text
              x={x}
              y={lineY + 22}
              textAnchor="middle"
              fill={color}
              fontSize={12}
              fontWeight={700}
            >
              {val}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns SVG path for a quadratic Bézier arc between two points. */
function arc(
  x1: number, y1: number,
  x2: number, y2: number,
  height: number
): string {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - height;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

/** Small downward-pointing arrowhead at (cx, cy). */
function Arrowhead({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const size = 5;
  return (
    <polygon
      points={`${cx},${cy + size} ${cx - size},${cy - size} ${cx + size},${cy - size}`}
      fill={color}
    />
  );
}
