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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
      <p className="text-xs font-medium text-white/50 mb-2">{label}</p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-4 mb-0.5"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-white/60">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-white">
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

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative group h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Sua evolução
            </h3>
          </div>
          <div className="flex items-center justify-center h-[280px] text-sm text-white/50">
            Ainda sem treinos por aqui. Que tal começar o primeiro?
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="relative group h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Sua evolução
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span className="text-xs text-white/50">Precisão</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-white/50">Tempo</span>
            </div>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
              <defs>
                <linearGradient id="gradAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255, 255, 255, 0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                yAxisId="accuracy"
                domain={[0, 100]}
                stroke="rgba(255, 255, 255, 0.2)"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                dx={-4}
              />
              <YAxis
                yAxisId="time"
                orientation="right"
                stroke="rgba(255, 255, 255, 0.2)"
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
                dot={{ r: 4, fill: "#2DD4BF", stroke: "rgba(15,23,42,0.8)", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#2DD4BF", stroke: "rgba(15,23,42,0.8)", strokeWidth: 2 }}
              />
              <Area
                yAxisId="time"
                type="monotone"
                dataKey="avgTime"
                name="Tempo Médio"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#gradTime)"
                dot={{ r: 3, fill: "#10B981", stroke: "rgba(15,23,42,0.8)", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#10B981", stroke: "rgba(15,23,42,0.8)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
