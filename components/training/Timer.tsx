"use client";

import { useState, useEffect, useRef } from "react";

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
    <div className="text-center font-mono text-2xl font-semibold text-muted-foreground">
      {formatted}
    </div>
  );
}
