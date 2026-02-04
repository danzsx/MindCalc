import { Target, Flame, TrendingUp, BarChart3 } from "lucide-react";

interface StatsSummaryProps {
  level: number;
  streak: number;
  avgAccuracy: number;
  totalSessions: number;
}

const stats = (props: StatsSummaryProps) => [
  {
    icon: TrendingUp,
    value: props.level,
    label: "Nível",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    icon: Flame,
    value: `${props.streak} dias`,
    label: "Sequência",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  {
    icon: Target,
    value: `${Math.round(props.avgAccuracy)}%`,
    label: "Acertos",
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    icon: BarChart3,
    value: props.totalSessions,
    label: "Treinos",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
];

export function StatsSummary(props: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats(props).map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`${stat.iconBg} p-3 rounded-full`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <span className="text-foreground text-2xl font-bold">{stat.value}</span>
            <span className="text-muted-foreground text-sm">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
