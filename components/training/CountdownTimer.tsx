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

  // Countdown interval
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          // Defer callback to avoid state update during render
          setTimeout(() => onExpireRef.current(), 0);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [running, resetKey]);

  const fraction = remaining / totalSeconds;
  const displaySeconds = Math.ceil(remaining);

  // Colors based on remaining fraction
  let strokeColor = "#2dd4bf"; // teal
  let glowColor = "rgba(45, 212, 191, 0.3)";
  if (fraction < 0.25) {
    strokeColor = "#ef4444"; // red
    glowColor = "rgba(239, 68, 68, 0.3)";
  } else if (fraction < 0.5) {
    strokeColor = "#eab308"; // yellow
    glowColor = "rgba(234, 179, 8, 0.3)";
  }

  // SVG circular progress
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
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
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
        className="absolute text-lg font-bold"
        style={{
          color: strokeColor,
          transition: "color 0.3s ease",
          fontFamily: "var(--font-family-display)",
        }}
      >
        {displaySeconds}
      </span>
    </div>
  );
}
