"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full"
      style={{ background: "rgba(141, 194, 255, 0.08)" }}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Progresso: ${current} de ${total}`}
    >
      <div
        className="relative h-full rounded-full transition-all duration-500 ease-out overflow-hidden"
        style={{
          width: `${percentage}%`,
          background: "linear-gradient(90deg, #3770bf 0%, #5a8fd4 50%, #cef26d 100%)",
          boxShadow: percentage > 0 ? "0 0 10px rgba(206, 242, 109, 0.25)" : "none",
        }}
      >
        {/* Shimmer pass */}
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
