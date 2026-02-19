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
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  accentGlow: string;
}

const getStats = (props: StatsSummaryProps): StatConfig[] => [
  {
    icon: Flame,
    value: `${props.streak}`,
    label: "Dias de sequência",
    iconColor: "#cef26d",
    iconBg: "rgba(206, 242, 109, 0.12)",
    iconBorder: "rgba(206, 242, 109, 0.2)",
    accentGlow: "linear-gradient(135deg, rgba(206,242,109,0.06), transparent)",
  },
  {
    icon: Target,
    value: `${Math.round(props.avgAccuracy)}%`,
    label: "Precisão média",
    iconColor: "#8dc2ff",
    iconBg: "rgba(141, 194, 255, 0.12)",
    iconBorder: "rgba(141, 194, 255, 0.2)",
    accentGlow: "linear-gradient(135deg, rgba(141,194,255,0.06), transparent)",
  },
  {
    icon: TrendingUp,
    value: props.level,
    label: "Nível atual",
    iconColor: "#5a8fd4",
    iconBg: "rgba(55, 112, 191, 0.15)",
    iconBorder: "rgba(55, 112, 191, 0.25)",
    accentGlow: "linear-gradient(135deg, rgba(55,112,191,0.08), transparent)",
  },
  {
    icon: Zap,
    value: props.totalSessions,
    label: "Sessões de treino",
    iconColor: "#8dc2ff",
    iconBg: "rgba(141, 194, 255, 0.08)",
    iconBorder: "rgba(141, 194, 255, 0.15)",
    accentGlow: "linear-gradient(135deg, rgba(141,194,255,0.05), transparent)",
  },
];

export function StatsSummary(props: StatsSummaryProps) {
  const stats = getStats(props);

  return (
    <div className="dash-stagger grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="relative overflow-hidden rounded-[28px] p-6 cursor-default group"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "var(--glass-blur)",
              WebkitBackdropFilter: "var(--glass-blur)",
              boxShadow: "var(--glass-shadow)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(141,194,255,0.28)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(141,194,255,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--glass-shadow)";
            }}
          >
            {/* Accent glow overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[28px]"
              style={{ background: stat.accentGlow }}
            />

            {/* Icon */}
            <div
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-5"
              style={{
                background: stat.iconBg,
                border: `1px solid ${stat.iconBorder}`,
              }}
            >
              <stat.icon
                className="w-5 h-5"
                style={{ color: stat.iconColor }}
                strokeWidth={2}
              />
            </div>

            {/* Value */}
            <div
              className="relative dash-number-in text-4xl md:text-5xl font-bold mb-1 leading-none"
              style={{
                fontFamily: "var(--font-family-display)",
                color: "var(--color-text-primary)",
              }}
            >
              {stat.value}
            </div>

            {/* Label */}
            <div
              className="relative text-xs font-medium tracking-wide uppercase mt-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
