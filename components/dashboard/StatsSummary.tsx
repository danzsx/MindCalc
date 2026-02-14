"use client";

import { motion } from "motion/react";
import { Target, Flame, TrendingUp, Zap, type LucideIcon } from "lucide-react";

interface StatsSummaryProps {
  level: number;
  streak: number;
  avgAccuracy: number;
  totalSessions: number;
}

interface StatConfig {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient: string;
}

const getStats = (props: StatsSummaryProps): StatConfig[] => [
  {
    icon: Flame,
    value: `${props.streak}`,
    label: "Dias de sequência",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Target,
    value: `${Math.round(props.avgAccuracy)}%`,
    label: "Precisão",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    value: props.level,
    label: "Nível",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    value: props.totalSessions,
    label: "Treinos",
    gradient: "from-yellow-500 to-orange-500",
  },
];

export function StatsSummary(props: StatsSummaryProps) {
  const stats = getStats(props);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
          className="relative group"
        >
          {/* Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300`}
          />
          {/* Card */}
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
            <div
              className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div
              className="text-4xl font-bold mb-1"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {stat.value}
            </div>
            <div className="text-sm text-white/70">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
