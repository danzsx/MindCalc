"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { Session } from "@/types";

interface EvolutionChartProps {
  sessions: Session[];
}

interface TooltipPayloadEntry {
  dataKey?: string;
  name?: string;
  value?: number;
  color?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="dash-tooltip"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <p
        className="text-caption-medium text-muted-foreground"
        style={{ marginBottom: 8 }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between"
          style={{ gap: 16, marginBottom: 2 }}
        >
          <div className="flex items-center" style={{ gap: 6 }}>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-caption text-muted-foreground">
              {entry.name}
            </span>
          </div>
          <span className="text-caption-medium text-foreground">
            {entry.dataKey === "accuracy"
              ? `${entry.value}%`
              : `${entry.value}s`}
          </span>
        </div>
      ))}
    </div>
  );
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

  const emptyState = (
    <div
      className="dash-card h-full"
      style={{
        padding: "var(--card-padding)",
        "--card-accent": "linear-gradient(135deg, #2DD4BF, #10B981)",
        "--card-accent-glow": "rgba(45, 212, 191, 0.04)",
      } as React.CSSProperties}
    >
      <div className="relative z-10">
        <div
          className="flex items-center"
          style={{ gap: "var(--card-header-gap)", marginBottom: "var(--card-section-gap)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2DD4BF, #10B981)" }}
          >
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-card-title text-foreground">Sua evolução</h2>
        </div>
        <div className="flex items-center justify-center h-[280px] text-body-primary text-muted-foreground">
          Ainda sem treinos por aqui. Que tal começar o primeiro?
        </div>
      </div>
    </div>
  );

  if (data.length === 0) return emptyState;

  return (
    <div
      className="dash-card h-full"
      style={{
        padding: "var(--card-padding)",
        animationDelay: "160ms",
        "--card-accent": "linear-gradient(135deg, #2DD4BF, #10B981)",
        "--card-accent-glow": "rgba(45, 212, 191, 0.04)",
      } as React.CSSProperties}
    >
      <div className="relative z-10">
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: "var(--card-section-gap)" }}
        >
          <div className="flex items-center" style={{ gap: "var(--card-header-gap)" }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2DD4BF, #10B981)" }}
            >
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-card-title text-foreground">Sua evolução</h2>
          </div>
          <div className="flex items-center" style={{ gap: "var(--space-lg)" }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#2DD4BF" }} />
              <span className="text-caption text-muted-foreground">Precisão</span>
            </div>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#10B981" }} />
              <span className="text-caption text-muted-foreground">Tempo</span>
            </div>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
              <defs>
                <linearGradient id="gradAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.1)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(148, 163, 184, 0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                yAxisId="accuracy"
                domain={[0, 100]}
                stroke="rgba(148, 163, 184, 0.3)"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                dx={-4}
              />
              <YAxis
                yAxisId="time"
                orientation="right"
                stroke="rgba(148, 163, 184, 0.3)"
                fontSize={11}
                tickFormatter={(v) => `${v}s`}
                tickLine={false}
                axisLine={false}
                dx={4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="accuracy"
                type="monotone"
                dataKey="accuracy"
                name="Precisão"
                stroke="#2DD4BF"
                strokeWidth={2.5}
                fill="url(#gradAccuracy)"
                dot={{ r: 4, fill: "#2DD4BF", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#2DD4BF", stroke: "#fff", strokeWidth: 2 }}
              />
              <Area
                yAxisId="time"
                type="monotone"
                dataKey="avgTime"
                name="Tempo Médio"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#gradTime)"
                dot={{ r: 3, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
