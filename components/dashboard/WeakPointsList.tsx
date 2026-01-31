import { AlertTriangle, Lightbulb } from "lucide-react";

interface WeakPoint {
  operation: string;
  errorRate: number;
}

interface WeakPointsListProps {
  weakPoints: WeakPoint[];
}

export function WeakPointsList({ weakPoints }: WeakPointsListProps) {
  const sorted = [...weakPoints].sort((a, b) => b.errorRate - a.errorRate);

  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-destructive/10 p-2 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Pontos Fracos</h2>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sem dados de erros ainda. Complete mais sessões para ver seus pontos fracos.
        </p>
      ) : (
        <>
          <ul className="space-y-5">
            {sorted.map((wp) => {
              const pct = Math.round(wp.errorRate * 100);
              const isHigh = pct > 40;
              const barColor = isHigh
                ? "bg-[#FB923C]"
                : "bg-[#10B981]";
              const textColor = isHigh
                ? "text-[#FB923C]"
                : "text-[#10B981]";

              return (
                <li key={wp.operation} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{wp.operation}</span>
                    <span className={`font-medium ${textColor}`}>{pct}% de erro</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 bg-primary/5 rounded-xl border border-primary/20 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Pratique mais as operações com maior taxa de erro. O treino ajusta
                automaticamente a dificuldade para focar nos seus pontos fracos.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
