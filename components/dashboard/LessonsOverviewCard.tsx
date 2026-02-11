"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

interface LessonsOverviewCardProps {
  completedCount: number;
  totalCount: number;
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#lessonGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="dash-ring-fill"
          style={{ "--ring-circumference": circumference } as React.CSSProperties}
        />
        <defs>
          <linearGradient id="lessonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-body-emphasis text-foreground">
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}

export function LessonsOverviewCard({ completedCount, totalCount }: LessonsOverviewCardProps) {
  return (
    <div
      className="dash-card flex flex-col"
      style={{
        padding: "var(--card-padding)",
        animationDelay: "80ms",
        "--card-accent": "linear-gradient(135deg, #2DD4BF, #14B8A6)",
        "--card-accent-glow": "rgba(45, 212, 191, 0.05)",
      } as React.CSSProperties}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div
          className="flex items-center"
          style={{ gap: "var(--card-header-gap)", marginBottom: "var(--card-section-gap)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2DD4BF, #14B8A6)" }}
          >
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-card-title text-foreground">Aulas Interativas</h2>
        </div>

        <div className="flex items-center" style={{ gap: "var(--space-xl)", marginBottom: "var(--card-section-gap)" }}>
          <ProgressRing completed={completedCount} total={totalCount} />
          <div>
            <p className="text-metric text-foreground">
              {completedCount}
              <span className="text-muted-foreground text-body-primary">/{totalCount}</span>
            </p>
            <p className="text-caption text-muted-foreground" style={{ marginTop: "var(--space-xs)" }}>
              aulas concluídas
            </p>
          </div>
        </div>

        <p className="text-body-primary text-muted-foreground" style={{ marginBottom: "var(--card-section-gap)" }}>
          Truques pra pensar mais rápido com números
        </p>

        <div className="mt-auto">
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-body-emphasis text-primary hover:text-[#14B8A6] transition-colors group"
          >
            Explorar aulas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
