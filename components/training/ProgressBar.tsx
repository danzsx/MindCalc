"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-white/5"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Progresso: ${current} de ${total}`}
    >
      <div
        className="relative h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500 ease-out overflow-hidden"
        style={{ width: `${percentage}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}
