"use client";

import { cn } from "@/lib/utils";
import { getOperatorSymbol } from "@/lib/lessons/utils";
import { CheckCircle2, Lock, Plus, Minus, X, Divide, Play, Clock } from "lucide-react";
import { motion } from "motion/react";

export type LessonStatus = "completed" | "available" | "locked";

const OPERATOR_ICONS: Record<string, typeof Plus> = {
  "+": Plus,
  "-": Minus,
  "*": X,
  "/": Divide,
};

const OPERATOR_GRADIENTS: Record<string, string> = {
  "+": "from-emerald-500 to-teal-500",
  "-": "from-orange-500 to-red-500",
  "*": "from-blue-500 to-purple-500",
  "/": "from-yellow-500 to-orange-500",
};

const DIFFICULTY_STYLES: Record<string, { label: string; className: string }> = {
  easy: { label: "Facil", className: "text-emerald-400 bg-emerald-400/10" },
  medium: { label: "Medio", className: "text-yellow-400 bg-yellow-400/10" },
  hard: { label: "Dificil", className: "text-red-400 bg-red-400/10" },
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
  const gradient = OPERATOR_GRADIENTS[lesson.operator] ?? "from-teal-500 to-cyan-500";
  const diff = DIFFICULTY_STYLES[lesson.difficulty] ?? DIFFICULTY_STYLES.easy;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: status === "locked" ? 1 : 1.02, y: status === "locked" ? 0 : -4 }}
      className={cn("relative group", status === "locked" && "opacity-60")}
    >
      {/* Glow Effect */}
      {status !== "locked" && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500",
          gradient
        )} />
      )}

      <div className={cn(
        "relative bg-white/5 backdrop-blur-md border rounded-3xl overflow-hidden transition-all duration-300",
        status === "completed" ? "border-teal-500/30" : "border-white/10",
        isClickable && "cursor-pointer"
      )}
        onClick={isClickable ? onClick : undefined}
      >
        {/* Icon Header */}
        <div className="relative h-32 flex items-center justify-center overflow-hidden">
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", gradient)} />
          <div className={cn("relative bg-gradient-to-br p-5 rounded-3xl shadow-2xl", gradient)}>
            <OperatorIcon className="w-10 h-10 text-white" />
          </div>

          {status === "completed" && (
            <div className="absolute top-4 right-4 bg-teal-500 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          )}

          {status === "locked" && (
            <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-sm">
              <Lock className="w-5 h-5 text-white/60" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("text-xs px-3 py-1 rounded-full font-medium", diff.className)}>
              {diff.label}
            </span>
            <span className="text-xs text-white/50 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Aula {index + 1}/{total}
            </span>
          </div>

          <h3
            className="text-xl font-bold mb-2 leading-tight text-white"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {lesson.title}
          </h3>
          <p className="text-sm text-white/60 mb-4 line-clamp-2">
            {lesson.description}
          </p>

          <button
            disabled={status === "locked"}
            onClick={isClickable ? (e) => { e.stopPropagation(); onClick(); } : undefined}
            className={cn(
              "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300",
              status === "locked" && "bg-white/5 text-white/40 cursor-not-allowed",
              status === "completed" && "bg-white/10 hover:bg-white/15 text-white",
              status === "available" && `bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:shadow-teal-500/20`
            )}
          >
            {status === "locked" ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Bloqueada</span>
              </>
            ) : status === "completed" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Revisar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Comecar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
