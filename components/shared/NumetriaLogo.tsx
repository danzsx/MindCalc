"use client";

/**
 * NumetriaLogo — Brand mark component
 *
 * Faithfully reproduces the Numetria visual identity from brand/Logotipo/ SVGs:
 *
 *   1. Rotated parallelogram (rhombus) — core icon shape
 *      Path extracted from the clip-path in brand/Logotipo/icone padrao.svg,
 *      normalised to a 30×30 viewport.
 *
 *   2. Diagonal accent stroke — the defining brand element.
 *      In every brand SVG (icone padrao, icone branco, Logo e icone) a diagonal
 *      line crosses through the rhombus at ≈30°.  Coordinates derived from the
 *      transform matrix in icone padrao.svg, mapped to the 30×30 viewport:
 *        start (−7, 4) → end (33, 28)   [upper-left → lower-right, "\" direction]
 *      Stroke width normalised to ~3.5 px at 30 px icon size.
 *
 *   3. "Numetria" wordmark in Oddval SemiBold (full variant only)
 *
 * Variants
 *   "mark"  — icon only (rhombus + diagonal accent)
 *   "full"  — icon + "Numetria" wordmark
 *
 * Color
 *   "light" — dark backgrounds: gradient icon (Blue Harbor→Ice Blue) + Sunny Herb accent + light text
 *   "dark"  — light backgrounds: solid Blue Harbor icon + black accent + deep navy text
 *             (matches "Logo e icone.svg" which uses #3b70bb fill + #000000 stroke)
 */

interface NumetriaLogoProps {
  variant?: "mark" | "full";
  size?: number;
  color?: "light" | "dark";
  className?: string;
}

export function NumetriaLogo({
  variant = "full",
  size = 32,
  color = "light",
  className = "",
}: NumetriaLogoProps) {
  const isLight = color === "light";
  const textColor = isLight ? "#f0f4ff" : "#080f1e";
  // Lime (Sunny Herb) for dark bg; black for light bg — matches brand files exactly
  const accentColor = isLight ? "#cef26d" : "#000000";
  const gradientId = `nm-grad-${variant}-${color}`;

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      // overflow:visible lets the diagonal accent extend slightly past the icon edges
      style={{ flexShrink: 0, overflow: "visible" }}
    >
      <defs>
        {/* Blue Harbor → Ice Blue gradient — from icone padrao.svg */}
        <linearGradient
          id={gradientId}
          x1="0"
          y1="30"
          x2="30"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3b70bb" />
          <stop offset="100%" stopColor="#8dc2ff" />
        </linearGradient>
      </defs>

      {/* Rhombus icon — tilted parallelogram, from brand/Logotipo/ clip-path */}
      <path
        fill={isLight ? `url(#${gradientId})` : "#3b70bb"}
        d="M24.168 0.988 L29.219 24.582 L5.625 29.633 L0.574 6.039 Z"
      />

      {/*
        Diagonal accent stroke — brand hallmark.
        Derived from icone padrao.svg transform matrix mapped to 30×30 viewport.
        Goes from upper-left to lower-right at ≈30°, crossing the full rhombus.
        strokeWidth ≈ 3.5 px matches the proportional stroke in both icone svgs.
      */}
      <line
        x1="-7"
        y1="4"
        x2="33"
        y2="28"
        stroke={accentColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "mark") {
    return (
      <span className={className} aria-label="Numetria">
        {mark}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="Numetria"
    >
      {mark}
      <span
        style={{
          fontFamily: "var(--font-family-display, 'Inter', sans-serif)",
          color: textColor,
          fontSize: `${Math.round(size * 0.65)}px`,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Numetria
      </span>
    </span>
  );
}
