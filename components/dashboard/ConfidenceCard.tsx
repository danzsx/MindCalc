"use client";

import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ConfidenceSurvey {
  score: number;
  created_at: string;
}

interface ConfidenceCardProps {
  surveys: ConfidenceSurvey[];
}

export function ConfidenceCard({ surveys }: ConfidenceCardProps) {
  if (surveys.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="h-full"
      >
        <div
          className="h-full flex flex-col items-center justify-center text-center p-10 rounded-[32px] min-h-[220px]"
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
            <Brain
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
            Autoconfiança
          </h3>
          <p className="text-sm max-w-[280px]" style={{ color: "var(--color-text-muted)" }}>
            Após alguns treinos, vamos perguntar como você se sente. Seu histórico aparecerá aqui.
          </p>
        </div>
      </motion.div>
    );
  }

  const latest = surveys[surveys.length - 1];
  const chartData = surveys.map((s, i) => ({
    index: i + 1,
    score: s.score,
    date: new Date(s.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }),
  }));

  let TrendIcon = Minus;
  let trendColor = "var(--color-text-muted)";
  let trendBg = "rgba(141,194,255,0.08)";
  let trendBorder = "rgba(141,194,255,0.12)";

  if (surveys.length >= 2) {
    const prev = surveys[surveys.length - 2].score;
    if (latest.score > prev) {
      TrendIcon = TrendingUp;
      trendColor = "#cef26d";
      trendBg = "rgba(206,242,109,0.1)";
      trendBorder = "rgba(206,242,109,0.2)";
    } else if (latest.score < prev) {
      TrendIcon = TrendingDown;
      trendColor = "#8dc2ff";
      trendBg = "rgba(141,194,255,0.1)";
      trendBorder = "rgba(141,194,255,0.2)";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
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
        <div className="flex items-center gap-3 mb-7">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-2xl"
            style={{
              background: "rgba(55, 112, 191, 0.12)",
              border: "1px solid rgba(55, 112, 191, 0.25)",
            }}
          >
            <Brain className="w-5 h-5" style={{ color: "#5a8fd4" }} strokeWidth={2} />
          </div>
          <h3
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Autoconfiança
          </h3>
        </div>

        {/* Score display */}
        <div className="flex items-end gap-3 mb-7">
          <span
            className="text-6xl font-bold leading-none"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "var(--color-text-primary)",
            }}
          >
            {latest.score}
          </span>
          <div className="flex flex-col mb-1.5">
            <span
              className="text-xl font-bold"
              style={{ color: "var(--color-text-muted)" }}
            >
              /10
            </span>
          </div>
          {surveys.length >= 2 && (
            <div
              className="ml-2 px-2.5 py-1.5 rounded-xl flex items-center gap-1 mb-2"
              style={{
                background: trendBg,
                border: `1px solid ${trendBorder}`,
              }}
            >
              <TrendIcon className="w-4 h-4" style={{ color: trendColor }} strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Chart */}
        {surveys.length >= 2 ? (
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="confidenceGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3770bf" />
                    <stop offset="100%" stopColor="#cef26d" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#6b89b4" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 10, fill: "#6b89b4" }}
                  tickLine={false}
                  axisLine={false}
                  width={22}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(8, 15, 30, 0.95)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(141,194,255,0.15)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#f0f4ff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                  }}
                  labelStyle={{ color: "#6b89b4", marginBottom: "4px" }}
                  formatter={(value) => [`${value}/10`, "Confiança"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#confidenceGrad)"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "#080f1e", stroke: "#3770bf", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "#cef26d", stroke: "#080f1e", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            className="p-4 rounded-2xl"
            style={{
              background: "rgba(13, 29, 58, 0.5)",
              border: "1px solid rgba(141,194,255,0.06)",
            }}
          >
            <p
              className="text-xs font-medium text-center"
              style={{ color: "var(--color-text-muted)" }}
            >
              Continue treinando para ver sua evolução de confiança aqui.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
