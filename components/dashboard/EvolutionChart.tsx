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
import { TrendingUp } from "lucide-react";
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
      <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] fade-in" style={{ animationDelay: "500ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Sua evolução</h2>
        </div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Ainda sem treinos por aqui. Que tal começar o primeiro?
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 fade-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Sua evolução</h2>
      </div>

      <div className="h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="date"
              stroke="rgba(148, 163, 184, 0.6)"
              fontSize={12}
            />
            <YAxis
              yAxisId="accuracy"
              domain={[0, 100]}
              stroke="#2DD4BF"
              fontSize={12}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              yAxisId="time"
              orientation="right"
              stroke="#10B981"
              fontSize={12}
              tickFormatter={(v) => `${v}s`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--card-foreground)",
              }}
              formatter={(value, name) => {
                const v = value as number;
                return name === "Precisão" ? `${v}%` : `${v}s`;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              yAxisId="accuracy"
              type="monotone"
              dataKey="accuracy"
              name="Precisão"
              stroke="#2DD4BF"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              yAxisId="time"
              type="monotone"
              dataKey="avgTime"
              name="Tempo Médio"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
