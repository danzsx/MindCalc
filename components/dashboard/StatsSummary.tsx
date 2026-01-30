import { Card, CardContent } from "@/components/ui/card";
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
  },
  {
    icon: Flame,
    value: `${props.streak} dias`,
    label: "Sequência",
  },
  {
    icon: Target,
    value: `${Math.round(props.avgAccuracy)}%`,
    label: "Precisão Média",
  },
  {
    icon: BarChart3,
    value: props.totalSessions,
    label: "Sessões",
  },
];

export function StatsSummary(props: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats(props).map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex flex-col items-center gap-2 pt-6">
            <stat.icon className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
