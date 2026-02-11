import { Target, Flame, TrendingUp, BarChart3, type LucideIcon } from "lucide-react";

interface StatsSummaryProps {
  level: number;
  streak: number;
  avgAccuracy: number;
  totalSessions: number;
}

interface StatConfig {
  icon: LucideIcon;
  value: string | number;
  label: string;
  accent: string;
  accentGlow: string;
}

const getStats = (props: StatsSummaryProps): StatConfig[] => [
  {
    icon: TrendingUp,
    value: props.level,
    label: "Nível",
    accent: "linear-gradient(135deg, #2DD4BF, #14B8A6)",
    accentGlow: "rgba(45, 212, 191, 0.06)",
  },
  {
    icon: Flame,
    value: `${props.streak}`,
    label: "Dias seguidos",
    accent: "linear-gradient(135deg, #FDE047, #FACC15)",
    accentGlow: "rgba(253, 224, 71, 0.06)",
  },
  {
    icon: Target,
    value: `${Math.round(props.avgAccuracy)}%`,
    label: "Precisão",
    accent: "linear-gradient(135deg, #10B981, #059669)",
    accentGlow: "rgba(16, 185, 129, 0.06)",
  },
  {
    icon: BarChart3,
    value: props.totalSessions,
    label: "Treinos",
    accent: "linear-gradient(135deg, #FB923C, #F97316)",
    accentGlow: "rgba(251, 146, 60, 0.06)",
  },
];

export function StatsSummary(props: StatsSummaryProps) {
  const stats = getStats(props);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 dash-stagger" style={{ gap: "var(--stats-gap)" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="dash-card"
          style={{
            padding: "var(--card-padding)",
            "--card-accent": stat.accent,
            "--card-accent-glow": stat.accentGlow,
          } as React.CSSProperties}
        >
          <div className="relative z-10 flex flex-col" style={{ gap: "var(--space-md)" }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: stat.accent }}
            >
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-metric text-foreground dash-number-in">
                {stat.value}
              </span>
              <span
                className="block text-caption text-muted-foreground"
                style={{ marginTop: "var(--space-xs)" }}
              >
                {stat.label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
