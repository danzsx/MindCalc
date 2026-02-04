"use client";

interface TablesProgressBarProps {
  current: number;
  total: number;
  blockIndex: number;
}

export function TablesProgressBar({
  current,
  total,
  blockIndex,
}: TablesProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-2 mb-6">
      <p className="text-sm text-muted-foreground font-medium">
        Bloco {blockIndex + 1} — {current + 1} de {total}
      </p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-primary/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
