"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookOpen, ArrowRight, Layers } from "lucide-react";

interface LessonsOverviewCardProps {
  completedCount: number;
  totalCount: number;
}

export function LessonsOverviewCard({ completedCount, totalCount }: LessonsOverviewCardProps) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="lg:col-span-2 h-full"
    >
      <div
        className="relative overflow-hidden h-full p-7 rounded-[32px] flex flex-col"
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
        {/* Ambient glow top-right */}
        <div
          className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(55,112,191,0.1) 0%, transparent 70%)",
            transform: "translate(20%, -20%)",
          }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between mb-7">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
              style={{
                background: "rgba(55, 112, 191, 0.15)",
                border: "1px solid rgba(55, 112, 191, 0.3)",
              }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#5a8fd4" }} strokeWidth={2} />
            </div>
            <div>
              <h3
                className="text-xl md:text-2xl font-bold mb-0.5"
                style={{
                  fontFamily: "var(--font-family-display)",
                  color: "var(--color-text-primary)",
                }}
              >
                Aulas Interativas
              </h3>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                Aprenda técnicas de cálculo rápido
              </p>
            </div>
          </div>

          {/* Lessons count pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
            style={{
              background: "rgba(13, 29, 58, 0.6)",
              border: "1px solid rgba(141, 194, 255, 0.1)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Layers className="w-3 h-3" strokeWidth={2} />
            {totalCount} aulas
          </div>
        </div>

        {/* Progress sub-card */}
        <div
          className="relative mb-7 p-5 rounded-2xl"
          style={{
            background: "rgba(13, 29, 58, 0.5)",
            border: "1px solid rgba(141, 194, 255, 0.08)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Seu progresso
            </span>
            <span
              className="text-3xl font-bold leading-none"
              style={{
                fontFamily: "var(--font-family-display)",
                color: "#cef26d",
              }}
            >
              {pct}%
            </span>
          </div>

          {/* Progress track */}
          <div
            className="h-3 rounded-full overflow-hidden mb-3"
            style={{ background: "rgba(141, 194, 255, 0.06)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background: "linear-gradient(90deg, #3770bf, #cef26d)",
              }}
            >
              {/* Shimmer */}
              <div
                className="absolute inset-0 animate-shimmer"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                }}
              />
            </motion.div>
          </div>

          <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            {completedCount} de {totalCount} aulas concluídas
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/lessons"
          className="relative mt-auto flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group overflow-hidden"
          style={{
            background: "#cef26d",
            color: "#080f1e",
            boxShadow: "0 4px 20px rgba(206, 242, 109, 0.2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 8px 30px rgba(206, 242, 109, 0.35)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 20px rgba(206, 242, 109, 0.2)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          }}
        >
          <span>Continuar aprendendo</span>
          <ArrowRight
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </Link>
      </div>
    </motion.div>
  );
}
