"use client";

import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Heart, TrendingUp, TrendingDown, Minus } from "lucide-react";

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
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-2xl">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Autoconfiança
            </h3>
          </div>
          <p className="text-sm text-white/60">
            Após alguns treinos, vamos perguntar como você se sente com cálculos. Seu histórico aparecerá aqui.
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
  let trendColor = "text-white/40";
  let trendBg = "bg-white/10";
  if (surveys.length >= 2) {
    const prev = surveys[surveys.length - 2].score;
    if (latest.score > prev) {
      TrendIcon = TrendingUp;
      trendColor = "text-emerald-400";
      trendBg = "bg-emerald-500/20";
    } else if (latest.score < prev) {
      TrendIcon = TrendingDown;
      trendColor = "text-orange-400";
      trendBg = "bg-orange-500/20";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-2xl">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Autoconfiança
          </h3>
        </div>

        {/* Score display */}
        <div className="flex items-end gap-3 mb-6">
          <span
            className="text-5xl font-bold"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {latest.score}
          </span>
          <span className="text-lg text-white/40 mb-1">/10</span>
          <div className={`${trendBg} p-1.5 rounded-lg mb-1.5`}>
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          </div>
        </div>

        {/* Chart */}
        {surveys.length >= 2 && (
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }}
                  tickLine={false}
                  axisLine={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#f8fafc",
                    backdropFilter: "blur(16px)",
                  }}
                  formatter={(value) => [`${value}/10`, "Confiança"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#ec4899", stroke: "rgba(15,23,42,0.8)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {surveys.length === 1 && (
          <p className="text-xs text-white/50">
            Continue treinando para ver sua evolução de confiança aqui.
          </p>
        )}
      </div>
    </motion.div>
  );
}
