"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PartyPopper, Dumbbell, ArrowRight, ArrowLeft } from "lucide-react";

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
    <div className="flex flex-col items-center text-center space-y-6 py-6 lesson-phase-enter">
      {showConfetti && <CompletionConfetti />}

      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 lesson-step-in">
        <PartyPopper className="size-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Esse truque ja e seu!</h2>
        <p className="text-muted-foreground leading-relaxed">
          Voce pegou a tecnica <span className="font-medium text-foreground">&ldquo;{technique}&rdquo;</span>.
          Agora e so deixar ficar automatico.
        </p>
        <p className="text-caption text-muted-foreground">
          Voce completou em {timeText}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {/* Primary: Next lesson */}
        {nextLessonSlug && (
          <Button onClick={onNextLesson} size="lg" className="w-full">
            <ArrowRight className="size-4" />
            Proxima Aula
          </Button>
        )}

        {/* Secondary actions */}
        <Button onClick={onPracticeMore} variant={nextLessonSlug ? "outline" : "default"} size="lg" className="w-full">
          <Dumbbell className="size-4" />
          Praticar mais
        </Button>
        <Button onClick={onBackToLessons} variant="ghost" size="lg" className="w-full">
          <ArrowLeft className="size-4" />
          Voltar as aulas
        </Button>
      </div>
    </div>
  );
}
