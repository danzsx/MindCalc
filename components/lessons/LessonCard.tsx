"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, Plus, Minus, X, Divide, Play, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export type LessonStatus = "completed" | "available" | "locked";

const OPERATOR_ICONS: Record<string, typeof Plus> = {
  "+": Plus,
  "-": Minus,
  "*": X,
  "/": Divide,
};

/* Numetria operation color remapping */
const OPERATOR_COLORS: Record<string, {
  iconBg: string;
  iconText: string;
  glow: string;
}> = {
  "+": {
    iconBg: "rgba(55,112,191,0.15)",
    iconText: "#8dc2ff",
    glow: "rgba(55,112,191,0.12)",
  },
  "-": {
    iconBg: "rgba(141,194,255,0.1)",
    iconText: "#8dc2ff",
    glow: "rgba(141,194,255,0.08)",
  },
  "*": {
    iconBg: "rgba(206,242,109,0.1)",
    iconText: "#cef26d",
    glow: "rgba(206,242,109,0.08)",
  },
  "/": {
    iconBg: "rgba(168,204,71,0.1)",
    iconText: "#a8cc47",
    glow: "rgba(168,204,71,0.08)",
  },
};

const DIFFICULTY_STYLES: Record<string, { label: string; style: React.CSSProperties }> = {
  easy: {
    label: "Fácil",
    style: {
      background: "rgba(55,112,191,0.12)",
      border: "1px solid rgba(55,112,191,0.25)",
      color: "#8dc2ff",
    },
  },
  medium: {
    label: "Médio",
    style: {
      background: "rgba(206,242,109,0.08)",
      border: "1px solid rgba(206,242,109,0.2)",
      color: "#cef26d",
    },
  },
  hard: {
    label: "Difícil",
    style: {
      background: "rgba(141,194,255,0.08)",
      border: "1px solid rgba(141,194,255,0.2)",
      color: "#8dc2ff",
    },
  },
};

interface LessonCardProps {
  lesson: {
    slug: string;
    title: string;
    description: string;
    operator: string;
    sort_order: number;
    difficulty: string;
  };
  status: LessonStatus;
  index: number;
  total: number;
  onClick: () => void;
}

export function LessonCard({ lesson, status, index, total, onClick }: LessonCardProps) {
  const OperatorIcon = OPERATOR_ICONS[lesson.operator] ?? Plus;
  const isClickable = status !== "locked";
  const colors = OPERATOR_COLORS[lesson.operator] ?? OPERATOR_COLORS["+"];
  const diff = DIFFICULTY_STYLES[lesson.difficulty] ?? DIFFICULTY_STYLES.easy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 1 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      whileHover={isClickable ? { y: -4 } : {}}
      className={cn("relative group h-full", status === "locked" && "opacity-50")}
      aria-disabled={status === "locked"}
      tabIndex={status === "locked" ? -1 : undefined}
    >
      <div
        className={cn(
          "relative rounded-[2rem] overflow-hidden h-full flex flex-col border transition-all duration-300",
          isClickable && "cursor-pointer"
        )}
        style={{
          background: status === "completed"
            ? "rgba(13,29,58,0.75)"
            : "rgba(13,29,58,0.6)",
          borderColor: status === "completed"
            ? "rgba(206,242,109,0.25)"
            : "rgba(141,194,255,0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: status === "completed"
            ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(206,242,109,0.1)"
            : "0 8px 32px rgba(0,0,0,0.4)",
        }}
        onClick={isClickable ? onClick : undefined}
      >
        {/* Completed glow border overlay */}
        {status === "completed" && (
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{
              boxShadow: "inset 0 0 40px rgba(206,242,109,0.04)",
            }}
          />
        )}

        {/* Operator Icon Header */}
        <div
          className="relative h-36 flex items-center justify-center overflow-hidden"
          style={{ background: colors.glow }}
        >
          {/* Radial backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.iconBg} 0%, transparent 70%)`,
            }}
          />

          {/* Icon container */}
          <div
            className="relative flex items-center justify-center w-16 h-16 rounded-[1.25rem] transition-transform duration-500 group-hover:scale-110"
            style={{
              background: colors.iconBg,
              border: `1px solid ${colors.iconText}30`,
            }}
          >
            <OperatorIcon className="w-8 h-8" style={{ color: colors.iconText }} />
          </div>

          {/* Status badge (top right) */}
          {status === "completed" && (
            <div
              className="absolute top-3.5 right-3.5 flex items-center justify-center w-8 h-8 rounded-full"
              style={{
                background: "rgba(206,242,109,0.15)",
                border: "1px solid rgba(206,242,109,0.3)",
              }}
            >
              <CheckCircle2 className="w-4 h-4 text-[#cef26d]" />
            </div>
          )}

          {status === "locked" && (
            <div
              className="absolute top-3.5 right-3.5 flex items-center justify-center w-8 h-8 rounded-full"
              style={{
                background: "rgba(141,194,255,0.06)",
                border: "1px solid rgba(141,194,255,0.12)",
              }}
            >
              <Lock className="w-4 h-4 text-[#6b89b4]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide"
              style={diff.style}
            >
              {diff.label}
            </span>
            <span className="text-xs text-[#6b89b4] font-medium ml-auto">
              {index + 1}/{total}
            </span>
          </div>

          <h3
            className="text-lg font-bold mb-2 leading-tight text-[#f0f4ff]"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {lesson.title}
          </h3>
          <p className="text-sm text-[#6b89b4] mb-5 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>

          {/* CTA Button */}
          <button
            disabled={status === "locked"}
            onClick={isClickable ? (e) => { e.stopPropagation(); onClick(); } : undefined}
            aria-disabled={status === "locked"}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 mt-auto text-sm"
            style={
              status === "locked"
                ? {
                    background: "rgba(141,194,255,0.04)",
                    border: "1px solid rgba(141,194,255,0.08)",
                    color: "#3a5070",
                    cursor: "not-allowed",
                  }
                : status === "completed"
                ? {
                    background: "rgba(206,242,109,0.08)",
                    border: "1px solid rgba(206,242,109,0.2)",
                    color: "#cef26d",
                  }
                : {
                    background: "linear-gradient(135deg, #3770bf 0%, #2558a0 100%)",
                    border: "1px solid rgba(55,112,191,0.4)",
                    color: "#f0f4ff",
                    boxShadow: "0 4px 16px rgba(55,112,191,0.25)",
                  }
            }
          >
            {status === "locked" ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Bloqueada</span>
              </>
            ) : status === "completed" ? (
              <>
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Praticar Novamente</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Começar Aula</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
