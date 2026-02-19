"use client";

import { useState, useEffect, useRef } from "react";

interface CountdownTimerProps {
  totalSeconds: number;
  running: boolean;
  onExpire: () => void;
  /** Change this value to reset the timer (e.g. currentIndex) */
  resetKey: number;
}

export function CountdownTimer({
  totalSeconds,
  running,
  onExpire,
  resetKey,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset when key changes
  useEffect(() => {
    setRemaining(totalSeconds);
    expiredRef.current = false;
  }, [resetKey, totalSeconds]);

  // Countdown
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          setTimeout(() => onExpireRef.current(), 0);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [running, resetKey]);

  const fraction = remaining / totalSeconds;
  const displaySeconds = Math.ceil(remaining);

  // Numetria color progression: Blue Harbor → Ice Blue → Sunny Herb (inverted urgency)
  let strokeColor = "#3770bf"; // Blue Harbor — normal
  let glowColor = "rgba(55, 112, 191, 0.4)";
  let textColor = "#8dc2ff";
  if (fraction < 0.25) {
    strokeColor = "#cef26d"; // Sunny Herb — critical (lime, not aggressive red)
    glowColor = "rgba(206, 242, 109, 0.45)";
    textColor = "#cef26d";
  } else if (fraction < 0.5) {
    strokeColor = "#8dc2ff"; // Ice Blue — warning
    glowColor = "rgba(141, 194, 255, 0.4)";
    textColor = "#8dc2ff";
  }

  const size = 72;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - fraction);

  return (
    <div
      role="timer"
      aria-live={fraction < 0.25 ? "assertive" : "off"}
      aria-label={`Tempo restante: ${displaySeconds} segundos`}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(141, 194, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease",
            filter: `drop-shadow(0 0 6px ${glowColor})`,
          }}
        />
      </svg>
      <span
        className="absolute text-lg font-bold tabular-nums"
        style={{
          color: textColor,
          transition: "color 0.3s ease",
          fontFamily: "var(--font-family-display)",
        }}
      >
        {displaySeconds}
      </span>
    </div>
  );
}
