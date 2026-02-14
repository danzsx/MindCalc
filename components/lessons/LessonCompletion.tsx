"use client";

import { useEffect, useState } from "react";
import { Dumbbell, ArrowRight, ArrowLeft, Sparkles, Clock, Target } from "lucide-react";

const CONFETTI_COLORS = ["#22d3ee", "#fbbf24", "#34d399", "#a78bfa", "#f472b6", "#fb923c"];

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
  onNextLesson: () => void;
  onPracticeMore: () => void;
  onBackToLessons: () => void;
}

export function LessonCompletion({
  technique,
  elapsedMinutes,
  nextLessonSlug,
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
    ? "menos de 1 minuto"
    : elapsedMinutes === 1
      ? "1 minuto"
      : `${elapsedMinutes} minutos`;

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8 lesson-phase-enter">
      {showConfetti && <CompletionConfetti />}

      {/* Large emoji with spring effect */}
      <div className="relative lesson-step-in">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-full blur-3xl scale-150" />
        <div className="relative text-8xl" style={{ animationDelay: '100ms' }}>
          🎉
        </div>
      </div>

      {/* Title — Space Grotesk, gradient */}
      <div className="space-y-3 lesson-step-in" style={{ animationDelay: '200ms' }}>
        <h2 className="font-[var(--font-family-display)] text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent">
          Missao Cumprida!
        </h2>
        <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
          Voce pegou a tecnica <span className="font-medium text-teal-400">&ldquo;{technique}&rdquo;</span>.
          Agora e so deixar ficar automatico.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 lesson-step-in" style={{ animationDelay: '300ms' }}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center gap-1">
            <Sparkles className="size-5 text-emerald-400" />
            <p className="font-[var(--font-family-display)] text-2xl font-bold text-white">+50</p>
            <p className="text-xs text-white/40">XP</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center gap-1">
            <Target className="size-5 text-cyan-400" />
            <p className="font-[var(--font-family-display)] text-2xl font-bold text-white">100%</p>
            <p className="text-xs text-white/40">Precisao</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center gap-1">
            <Clock className="size-5 text-amber-400" />
            <p className="font-[var(--font-family-display)] text-2xl font-bold text-white">{timeText}</p>
            <p className="text-xs text-white/40">Tempo</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full lesson-step-in" style={{ animationDelay: '400ms' }}>
        {/* Primary: Next lesson */}
        {nextLessonSlug && (
          <button
            onClick={onNextLesson}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 group"
          >
            Proxima Aula
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Secondary: Practice more */}
        <button
          onClick={onPracticeMore}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
            nextLessonSlug
              ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-teal-500/25"
          }`}
        >
          <Dumbbell className="size-4" />
          Praticar mais
        </button>

        {/* Tertiary: Back to lessons */}
        <button
          onClick={onBackToLessons}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white/40 hover:text-white/70 transition-all text-sm"
        >
          <ArrowLeft className="size-4" />
          Voltar as aulas
        </button>
      </div>
    </div>
  );
}
