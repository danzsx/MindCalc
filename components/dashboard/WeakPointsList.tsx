import { Target, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

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
    <div
      className="dash-card h-full flex flex-col"
      style={{
        padding: "var(--card-padding)",
        animationDelay: "240ms",
        "--card-accent": "linear-gradient(135deg, #FB923C, #F97316)",
        "--card-accent-glow": "rgba(251, 146, 60, 0.04)",
      } as React.CSSProperties}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div
          className="flex items-center"
          style={{ gap: "var(--card-header-gap)", marginBottom: "var(--card-section-gap)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FB923C, #F97316)" }}
          >
            <Target className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-card-title text-foreground">Pontos fracos</h2>
        </div>

        {sorted.length === 0 ? (
          <p className="text-body-primary text-muted-foreground">
            Ainda sem dados. Faça mais treinos e vou te mostrar onde focar.
          </p>
        ) : (
          <>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {sorted.map((wp) => {
                const pct = Math.round(wp.errorRate * 100);
                const isHigh = pct > 40;
                const StatusIcon = isHigh ? AlertTriangle : CheckCircle2;
                const barGradient = isHigh
                  ? "linear-gradient(90deg, #FB923C, #F97316)"
                  : "linear-gradient(90deg, #10B981, #059669)";
                const statusColor = isHigh ? "#FB923C" : "#10B981";

                return (
                  <li key={wp.operation}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                      <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                        <StatusIcon
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: statusColor }}
                        />
                        <span className="text-caption-medium text-foreground">
                          {wp.operation}
                        </span>
                      </div>
                      <span
                        className="text-caption-medium"
                        style={{ color: statusColor }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full dash-progress-fill"
                        style={{ width: `${pct}%`, background: barGradient }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto" style={{ paddingTop: "var(--space-lg)" }}>
              <div
                className="rounded-xl"
                style={{
                  padding: "var(--space-md)",
                  background: "rgba(45, 212, 191, 0.06)",
                  border: "1px solid rgba(45, 212, 191, 0.15)",
                }}
              >
                <div className="flex items-start" style={{ gap: "var(--space-sm)" }}>
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p
                    className="text-caption text-muted-foreground"
                    style={{ lineHeight: "var(--leading-relaxed)" }}
                  >
                    O treino já ajusta os exercícios pra te ajudar a melhorar nessas operações.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
