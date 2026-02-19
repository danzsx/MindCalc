"use client";

import { useEffect, useState } from "react";
import { Dumbbell, ArrowRight, ArrowLeft, Sparkles, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

/* Numetria confetti palette */
const CONFETTI_COLORS = ["#cef26d", "#8dc2ff", "#3770bf", "#a8cc47", "#f0f4ff", "#5a8fd4"];

function CompletionConfetti() {
  return (
    <div className="confetti-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-5 + Math.random() * 15}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1.2 + Math.random() * 1.2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

interface LessonCompletionProps {
  technique: string;
  elapsedMinutes: number;
  nextLessonSlug?: string;
  phaseAttempts?: { guided: number; "semi-guided": number; free: number };
  onNextLesson: () => void;
  onPracticeMore: () => void;
  onBackToLessons: () => void;
}

export function LessonCompletion({
  technique,
  elapsedMinutes,
  nextLessonSlug,
  phaseAttempts,
  onNextLesson,
  onPracticeMore,
  onBackToLessons,
}: LessonCompletionProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const timeText = elapsedMinutes <= 0
    ? "menos de 1 min"
    : elapsedMinutes === 1
      ? "1 minuto"
      : `${elapsedMinutes} min`;

  const statsItems = [
    { icon: Sparkles, value: "+50", label: "XP" },
    { icon: Target, value: "100%", label: "Precisão" },
    { icon: Clock, value: timeText, label: "Tempo" },
  ];

  return (
    <div className="flex flex-col items-center text-center space-y-7 py-6 lesson-phase-enter">
      {showConfetti && <CompletionConfetti />}

      {/* Trophy icon */}
      <div className="relative lesson-step-in">
        <div
          className="absolute inset-0 rounded-full scale-150"
          style={{
            background: "radial-gradient(circle, rgba(206,242,109,0.2) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div className="relative text-7xl" style={{ animationDelay: "100ms" }}>
          🎉
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2.5 lesson-step-in" style={{ animationDelay: "200ms" }}>
        <h2
          className="text-3xl sm:text-4xl font-bold text-[#cef26d]"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Missão Cumprida!
        </h2>
        <p className="text-sm text-[#6b89b4] leading-relaxed max-w-xs mx-auto">
          Você pegou a técnica{" "}
          <span className="font-semibold text-[#a8c0e0]">&ldquo;{technique}&rdquo;</span>.
          Agora é só deixar ficar automático.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 lesson-step-in" style={{ animationDelay: "300ms" }}>
        {statsItems.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="rounded-2xl px-5 py-4 flex flex-col items-center gap-1 border"
            style={{
              background: "rgba(13,29,58,0.7)",
              borderColor: "rgba(141,194,255,0.12)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <Icon className="size-4 text-[#8dc2ff]" />
            <p
              className="text-xl font-bold text-[#f0f4ff]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {value}
            </p>
            <p className="text-xs text-[#6b89b4]">{label}</p>
          </div>
        ))}
      </div>

      {/* Per-phase attempt breakdown */}
      {phaseAttempts && (
        <div
          className="w-full rounded-2xl border p-4 space-y-2.5 lesson-step-in"
          style={{
            animationDelay: "350ms",
            background: "rgba(13,29,58,0.6)",
            borderColor: "rgba(141,194,255,0.1)",
          }}
        >
          <p className="text-xs font-semibold text-[#6b89b4] uppercase tracking-widest">
            Resultados por fase
          </p>
          <div className="space-y-2">
            {(
              [
                { label: "Guiada", key: "guided" as const },
                { label: "Semi-guiada", key: "semi-guided" as const },
                { label: "Livre", key: "free" as const },
              ] as const
            ).map(({ label, key }) => {
              const attempts = phaseAttempts[key];
              const text =
                attempts === 0
                  ? "—"
                  : attempts === 1
                    ? "Acertou de primeira!"
                    : `${attempts} tentativas`;
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-[#6b89b4]">{label}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: attempts === 0
                        ? "#3a5070"
                        : attempts === 1
                          ? "#cef26d"
                          : "#a8c0e0",
                    }}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full lesson-step-in" style={{ animationDelay: "400ms" }}>
        {nextLessonSlug && (
          <button
            onClick={onNextLesson}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-300 group"
            style={{
              background: "linear-gradient(135deg, #cef26d 0%, #a8cc47 100%)",
              color: "#080f1e",
              boxShadow: "0 4px 20px rgba(206,242,109,0.25)",
            }}
          >
            Próxima Aula
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        <button
          onClick={onPracticeMore}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium transition-all duration-200 border"
          style={
            nextLessonSlug
              ? {
                  background: "rgba(13,29,58,0.6)",
                  borderColor: "rgba(141,194,255,0.12)",
                  color: "#a8c0e0",
                }
              : {
                  background: "linear-gradient(135deg, #cef26d 0%, #a8cc47 100%)",
                  borderColor: "transparent",
                  color: "#080f1e",
                  boxShadow: "0 4px 20px rgba(206,242,109,0.25)",
                }
          }
        >
          <Dumbbell className="size-4" />
          Praticar mais
        </button>

        <button
          onClick={onBackToLessons}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: "#3a5070" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#6b89b4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#3a5070"; }}
        >
          <ArrowLeft className="size-4" />
          Voltar às aulas
        </button>
      </div>
    </div>
  );
}
