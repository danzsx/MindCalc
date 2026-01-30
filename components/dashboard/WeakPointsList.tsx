interface WeakPoint {
  operation: string;
  errorRate: number;
}

interface WeakPointsListProps {
  weakPoints: WeakPoint[];
}

export function WeakPointsList({ weakPoints }: WeakPointsListProps) {
  const sorted = [...weakPoints].sort((a, b) => b.errorRate - a.errorRate);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sem dados de erros ainda. Complete mais sessões para ver seus pontos fracos.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {sorted.map((wp) => {
        const pct = Math.round(wp.errorRate * 100);
        return (
          <li key={wp.operation} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{wp.operation}</span>
              <span className="text-muted-foreground">{pct}% de erro</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-destructive transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
