"use client";

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  running: boolean;
}

export function Timer({ running }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!running) return;

    startRef.current = Date.now();
    setElapsed(0);

    const interval = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 100);

    return () => clearInterval(interval);
  }, [running]);

  const totalSeconds = elapsed / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${String(minutes).padStart(2, "0")}:${seconds
    .toFixed(1)
    .padStart(4, "0")}`;

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={`Tempo decorrido: ${formatted}`}
      className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl"
    >
      <Clock className="size-3.5 text-white/40" />
      <span className="font-mono text-sm font-semibold text-white/60 tabular-nums">
        {formatted}
      </span>
    </div>
  );
}
