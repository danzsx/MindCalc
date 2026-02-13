"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
      <div className="rounded-[20px] bg-card shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]" style={{ padding: 'var(--card-padding)' }}>
        <h3 className="text-card-title text-foreground" style={{ marginBottom: 'var(--card-header-gap)' }}>
          Autoconfianca
        </h3>
        <p className="text-body-primary text-muted-foreground">
          Apos alguns treinos, vamos perguntar como voce se sente com calculos. Seu historico aparecera aqui.
        </p>
      </div>
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

  // Trend
  let TrendIcon = Minus;
  let trendColor = "text-muted-foreground";
  if (surveys.length >= 2) {
    const prev = surveys[surveys.length - 2].score;
    if (latest.score > prev) {
      TrendIcon = TrendingUp;
      trendColor = "text-success";
    } else if (latest.score < prev) {
      TrendIcon = TrendingDown;
      trendColor = "text-destructive";
    }
  }

  return (
    <div className="rounded-[20px] bg-card shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]" style={{ padding: 'var(--card-padding)' }}>
      <h3 className="text-card-title text-foreground" style={{ marginBottom: 'var(--card-header-gap)' }}>
        Autoconfianca
      </h3>

      {/* Current score + trend */}
      <div className="flex items-end gap-3 mb-4">
        <span className="text-metric-lg text-foreground">{latest.score}</span>
        <span className="text-caption text-muted-foreground mb-1">/10</span>
        <TrendIcon className={`size-5 mb-1 ${trendColor}`} />
      </div>

      {/* Chart (only if 2+ surveys) */}
      {surveys.length >= 2 && (
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={24}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value}/10`, "Confianca"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-primary)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {surveys.length === 1 && (
        <p className="text-caption text-muted-foreground">
          Continue treinando para ver sua evolucao de confianca aqui.
        </p>
      )}
    </div>
  );
}
