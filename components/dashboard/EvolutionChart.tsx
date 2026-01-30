"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Session } from "@/types";

interface EvolutionChartProps {
  sessions: Session[];
}

export function EvolutionChart({ sessions }: EvolutionChartProps) {
  const data = sessions.map((s) => ({
    date: new Date(s.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    accuracy: Math.round(s.accuracy),
    avgTime: Number(s.avg_time.toFixed(1)),
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Nenhuma sessão registrada ainda.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          yAxisId="accuracy"
          domain={[0, 100]}
          stroke="hsl(var(--chart-1, 220 70% 50%))"
          fontSize={12}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          yAxisId="time"
          orientation="right"
          stroke="hsl(var(--chart-2, 160 60% 45%))"
          fontSize={12}
          tickFormatter={(v) => `${v}s`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--card-foreground))",
          }}
          formatter={(value, name) => {
            const v = value as number;
            return name === "Precisão" ? `${v}%` : `${v}s`;
          }}
        />
        <Legend />
        <Line
          yAxisId="accuracy"
          type="monotone"
          dataKey="accuracy"
          name="Precisão"
          stroke="hsl(var(--chart-1, 220 70% 50%))"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="time"
          type="monotone"
          dataKey="avgTime"
          name="Tempo Médio"
          stroke="hsl(var(--chart-2, 160 60% 45%))"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
