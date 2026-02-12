"use client";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// PizzaFraction — Animated SVG pizza that shows fractions visually
// ---------------------------------------------------------------------------

interface PizzaFractionProps {
  /** How many equal slices the pizza is divided into (1 = whole, 2 = halves, etc.) */
  slices: number;
  /** How many slices are highlighted/filled */
  highlighted?: number;
  /** Size in pixels */
  size?: number;
  /** Whether to animate the cut lines appearing */
  animateCuts?: boolean;
  /** Whether to animate highlighted slices popping out */
  animateHighlight?: boolean;
  /** Optional className */
  className?: string;
  /** Show the fraction label below */
  showLabel?: boolean;
  /** Custom label override */
  label?: string;
}

// Pizza colors
const CRUST_COLOR = "#D4A574";
const CRUST_DARK = "#B8895A";
const SAUCE_COLOR = "#E85D3A";
const CHEESE_COLOR = "#F5D76E";
const CHEESE_HIGHLIGHT = "#FBE89A";
const PEPPERONI_COLOR = "#C0392B";
const HIGHLIGHT_COLOR = "#22D3EE";
const HIGHLIGHT_GLOW = "#22D3EE40";
const DIM_OPACITY = 0.3;

function getSlicePath(
  cx: number,
  cy: number,
  r: number,
  sliceIndex: number,
  totalSlices: number
): string {
  const startAngle = (sliceIndex * 2 * Math.PI) / totalSlices - Math.PI / 2;
  const endAngle = ((sliceIndex + 1) * 2 * Math.PI) / totalSlices - Math.PI / 2;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const largeArc = totalSlices <= 2 ? 0 : 0;

  return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
}

// Generate pepperoni positions for a slice
function getPepperoniPositions(
  cx: number,
  cy: number,
  r: number,
  sliceIndex: number,
  totalSlices: number
): Array<{ x: number; y: number; size: number }> {
  const midAngle =
    ((sliceIndex + 0.5) * 2 * Math.PI) / totalSlices - Math.PI / 2;
  const positions: Array<{ x: number; y: number; size: number }> = [];

  // One pepperoni per slice, positioned at ~55% radius
  const dist = r * 0.55;
  positions.push({
    x: cx + dist * Math.cos(midAngle),
    y: cy + dist * Math.sin(midAngle),
    size: r * 0.08,
  });

  // For larger slices (halves), add a second pepperoni
  if (totalSlices <= 2) {
    const dist2 = r * 0.35;
    const offset = (0.3 * 2 * Math.PI) / totalSlices;
    positions.push({
      x: cx + dist2 * Math.cos(midAngle + offset),
      y: cy + dist2 * Math.sin(midAngle + offset),
      size: r * 0.07,
    });
    positions.push({
      x: cx + dist2 * Math.cos(midAngle - offset),
      y: cy + dist2 * Math.sin(midAngle - offset),
      size: r * 0.07,
    });
  }

  return positions;
}

export function PizzaFraction({
  slices,
  highlighted = slices,
  size = 180,
  animateCuts = false,
  animateHighlight = false,
  className,
  showLabel = false,
  label,
}: PizzaFractionProps) {
  const svgSize = size;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const outerR = svgSize * 0.45;
  const innerR = outerR * 0.88;

  const effectiveSlices = Math.max(1, slices);
  const effectiveHighlighted = Math.min(highlighted, effectiveSlices);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="drop-shadow-lg"
      >
        <defs>
          {/* Pizza gradient */}
          <radialGradient id={`cheese-grad-${slices}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor={CHEESE_HIGHLIGHT} />
            <stop offset="100%" stopColor={CHEESE_COLOR} />
          </radialGradient>

          {/* Highlight glow */}
          <filter id={`glow-${slices}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor={HIGHLIGHT_COLOR} floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Crust (outer circle) */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill={CRUST_COLOR}
          stroke={CRUST_DARK}
          strokeWidth="1.5"
        />

        {/* Sauce base */}
        <circle cx={cx} cy={cy} r={innerR} fill={SAUCE_COLOR} />

        {/* Cheese base */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR * 0.95}
          fill={`url(#cheese-grad-${slices})`}
        />

        {/* Slices */}
        {effectiveSlices === 1 ? (
          // Whole pizza — just the circle with toppings
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i * Math.PI * 2) / 6 + 0.3;
              const dist = innerR * (0.35 + (i % 3) * 0.18);
              return (
                <circle
                  key={i}
                  cx={cx + dist * Math.cos(angle)}
                  cy={cy + dist * Math.sin(angle)}
                  r={innerR * 0.07}
                  fill={PEPPERONI_COLOR}
                  opacity={0.9}
                />
              );
            })}
          </g>
        ) : (
          // Sliced pizza
          Array.from({ length: effectiveSlices }).map((_, i) => {
            const isHighlighted = i < effectiveHighlighted;
            const pepperonis = getPepperoniPositions(
              cx,
              cy,
              innerR * 0.95,
              i,
              effectiveSlices
            );

            return (
              <g
                key={i}
                className={cn(
                  animateHighlight && isHighlighted && "pizza-slice-pop"
                )}
                style={
                  animateHighlight && isHighlighted
                    ? { animationDelay: `${i * 150}ms` }
                    : undefined
                }
              >
                {/* Slice cheese overlay for highlighting */}
                <path
                  d={getSlicePath(cx, cy, innerR * 0.95, i, effectiveSlices)}
                  fill={`url(#cheese-grad-${slices})`}
                  opacity={isHighlighted ? 1 : DIM_OPACITY}
                  stroke={
                    isHighlighted ? HIGHLIGHT_COLOR : "transparent"
                  }
                  strokeWidth={isHighlighted ? 2 : 0}
                  filter={
                    isHighlighted && animateHighlight
                      ? `url(#glow-${slices})`
                      : undefined
                  }
                  className="transition-all duration-500"
                />

                {/* Pepperoni on this slice */}
                {pepperonis.map((p, pi) => (
                  <circle
                    key={pi}
                    cx={p.x}
                    cy={p.y}
                    r={p.size}
                    fill={PEPPERONI_COLOR}
                    opacity={isHighlighted ? 0.9 : DIM_OPACITY}
                    className="transition-opacity duration-500"
                  />
                ))}
              </g>
            );
          })
        )}

        {/* Cut lines */}
        {effectiveSlices > 1 &&
          Array.from({ length: effectiveSlices }).map((_, i) => {
            const angle =
              (i * 2 * Math.PI) / effectiveSlices - Math.PI / 2;
            const x2 = cx + innerR * Math.cos(angle);
            const y2 = cy + innerR * Math.sin(angle);

            return (
              <line
                key={`cut-${i}`}
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke={CRUST_DARK}
                strokeWidth="2"
                strokeLinecap="round"
                className={cn(
                  animateCuts && "pizza-cut-line"
                )}
                style={
                  animateCuts
                    ? { animationDelay: `${i * 300}ms` }
                    : undefined
                }
              />
            );
          })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill={CRUST_DARK} opacity="0.4" />
      </svg>

      {/* Fraction label */}
      {showLabel && (
        <div className="text-center interactive-fade-up">
          <span
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {label ??
              (effectiveHighlighted === effectiveSlices
                ? effectiveSlices === 1
                  ? "1 inteira"
                  : `${effectiveHighlighted}/${effectiveSlices}`
                : `${effectiveHighlighted}/${effectiveSlices}`)}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PizzaRow — Shows multiple mini pizzas in a row (for grouping exercises)
// ---------------------------------------------------------------------------

interface PizzaRowProps {
  count: number;
  slicesPerPizza?: number;
  highlightedPerPizza?: number;
  pizzaSize?: number;
  className?: string;
  /** Animate pizzas appearing one by one */
  stagger?: boolean;
  /** Highlight groups (e.g., for showing division into groups) */
  groupSize?: number;
  groupColors?: string[];
}

const GROUP_COLORS = [
  "#22D3EE", // cyan
  "#F59E0B", // amber
  "#10B981", // emerald
  "#8B5CF6", // violet
];

export function PizzaRow({
  count,
  slicesPerPizza = 1,
  highlightedPerPizza,
  pizzaSize = 48,
  className,
  stagger = false,
  groupSize,
  groupColors = GROUP_COLORS,
}: PizzaRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => {
        const groupIndex = groupSize ? Math.floor(i / groupSize) : -1;
        const borderColor =
          groupSize && groupIndex >= 0
            ? groupColors[groupIndex % groupColors.length]
            : undefined;

        return (
          <div
            key={i}
            className={cn(
              "rounded-full",
              stagger && "pizza-slice-pop",
              groupSize && "ring-2 ring-offset-1"
            )}
            style={{
              animationDelay: stagger ? `${i * 80}ms` : undefined,
              ["--tw-ring-color" as string]: borderColor,
            }}
          >
            <PizzaFraction
              slices={slicesPerPizza}
              highlighted={highlightedPerPizza ?? slicesPerPizza}
              size={pizzaSize}
            />
          </div>
        );
      })}
    </div>
  );
}
