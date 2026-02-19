"use client";

import { motion } from "motion/react";
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

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="dash-tooltip"
      style={{
        background: "rgba(8, 15, 30, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(141, 194, 255, 0.15)",
        borderRadius: "1rem",
        padding: "12px 16px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-6 mb-1"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {entry.name}
            </span>
          </div>
          <span
            className="text-sm font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {entry.dataKey === "accuracy" ? `${entry.value}%` : `${entry.value}s`}
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

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="h-full"
      >
        <div
          className="h-full flex flex-col items-center justify-center text-center p-10 rounded-[32px] min-h-[300px]"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "var(--glass-blur)",
            WebkitBackdropFilter: "var(--glass-blur)",
            boxShadow: "var(--glass-shadow)",
          }}
        >
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{
              background: "rgba(55, 112, 191, 0.12)",
              border: "1px solid rgba(55, 112, 191, 0.25)",
            }}
          >
            <TrendingUp
              className="w-7 h-7"
              style={{ color: "#5a8fd4" }}
              strokeWidth={1.5}
            />
          </div>
          <h3
            className="text-xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Sua evolução
          </h3>
          <p className="text-sm max-w-[200px]" style={{ color: "var(--color-text-muted)" }}>
            Ainda sem treinos. Comece o primeiro para ver sua curva de desempenho.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="h-full"
    >
      <div
        className="h-full p-7 rounded-[32px]"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
          boxShadow: "var(--glass-shadow)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(141,194,255,0.25)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-2xl"
              style={{
                background: "rgba(55, 112, 191, 0.15)",
                border: "1px solid rgba(55, 112, 191, 0.25)",
              }}
            >
              <TrendingUp
                className="w-5 h-5"
                style={{ color: "#5a8fd4" }}
                strokeWidth={2}
              />
            </div>
            <div>
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: "var(--font-family-display)",
                  color: "var(--color-text-primary)",
                }}
              >
                Sua evolução
              </h3>
              <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                Histórico de desempenho
              </p>
            </div>
          </div>

          {/* Legend */}
          <div
            className="hidden sm:flex items-center gap-4 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(13, 29, 58, 0.6)",
              border: "1px solid rgba(141, 194, 255, 0.08)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#3770bf" }}
              />
              <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                Precisão
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#8dc2ff" }}
              />
              <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                Tempo
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradAccuracyNM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3770bf" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3770bf" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTimeNM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8dc2ff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8dc2ff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(141, 194, 255, 0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="transparent"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
                tick={{ fill: "#6b89b4", fontWeight: 500 }}
              />
              <YAxis
                yAxisId="accuracy"
                domain={[0, 100]}
                stroke="transparent"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b89b4", fontWeight: 500 }}
              />
              <YAxis
                yAxisId="time"
                orientation="right"
                stroke="transparent"
                fontSize={11}
                tickFormatter={(v) => `${v}s`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b89b4", fontWeight: 500 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(141,194,255,0.15)", strokeWidth: 1.5, strokeDasharray: "4 4" }}
              />
              <Area
                yAxisId="accuracy"
                type="monotone"
                dataKey="accuracy"
                name="Precisão"
                stroke="#3770bf"
                strokeWidth={2.5}
                fill="url(#gradAccuracyNM)"
                dot={{ r: 3.5, fill: "#080f1e", stroke: "#3770bf", strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: "#3770bf", stroke: "#080f1e", strokeWidth: 2 }}
                animationDuration={1200}
              />
              <Area
                yAxisId="time"
                type="monotone"
                dataKey="avgTime"
                name="Tempo Médio"
                stroke="#8dc2ff"
                strokeWidth={2.5}
                fill="url(#gradTimeNM)"
                dot={{ r: 3.5, fill: "#080f1e", stroke: "#8dc2ff", strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: "#8dc2ff", stroke: "#080f1e", strokeWidth: 2 }}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
