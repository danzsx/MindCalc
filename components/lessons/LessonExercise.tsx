"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LessonHint } from "./LessonHint";
import { LessonStepByStep } from "./LessonStepByStep";
import { checkAnswer } from "@/lib/lessons/engine";
import { getOperatorSymbol } from "@/lib/lessons/utils";
import { cn } from "@/lib/utils";
import { CheckCircle2, Eye, RotateCcw, Send } from "lucide-react";
import type { LessonExerciseData, HintLevel } from "@/lib/lessons/types";

const SUCCESS_MESSAGES: Record<HintLevel, string[]> = {
  full: [
    "Boa. Esse truque ja ta ficando natural.",
    "Isso! Pensou rapido.",
    "Ai sim. O caminho tava certo.",
  ],
  partial: [
    "Ja ta fluindo. Boa.",
    "Acertou. Esse raciocinio economiza tempo.",
    "Isso ai! Quase sem ajuda.",
  ],
  none: [
    "Calculou de cabeca! Impressionante.",
    "Sem dica nenhuma e acertou. Mandou bem!",
    "Esse truque ja e seu. Parabens!",
  ],
};

const CONFETTI_COLORS = ["#22d3ee", "#fbbf24", "#34d399", "#a78bfa", "#f472b6", "#fb923c"];

function Confetti({ intensity = 1 }: { intensity?: number }) {
  const count = Math.round(20 * intensity);

  return (
    <div className="confetti-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 + Math.random() * 20}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random() * 1}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

interface LessonExerciseProps {
  exercise: LessonExerciseData;
  hintLevel: HintLevel;
  onAnswer: (correct: boolean) => void;
}

export function LessonExercise({
  exercise,
  hintLevel,
  onAnswer,
}: LessonExerciseProps) {
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetForRetry = useCallback(() => {
    setUserInput("");
    setFeedback(null);
    setShowSteps(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = userInput.trim();
    if (trimmed === "") return;

    const numericAnswer = Number(trimmed);
    if (isNaN(numericAnswer)) return;

    const isCorrect = checkAnswer(exercise, numericAnswer);

    if (isCorrect) {
      const messages = SUCCESS_MESSAGES[hintLevel];
      setSuccessMessage(messages[Math.floor(Math.random() * messages.length)]);
      setFeedback("correct");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(() => onAnswer(true), 1500);
    } else {
      setFeedback("incorrect");
    }
  }, [userInput, exercise, hintLevel, onAnswer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && feedback === null) {
        handleSubmit();
      }
    },
    [handleSubmit, feedback]
  );

  const hint = hintLevel === "full" ? exercise.fullHint : exercise.partialHint;
  const symbol = getOperatorSymbol(exercise.operator);

  // Confetti intensity: higher for free mode
  const confettiIntensity = hintLevel === "none" ? 2 : hintLevel === "partial" ? 1.5 : 1;

  return (
    <div className="space-y-6">
      {/* Confetti overlay */}
      {showConfetti && <Confetti intensity={confettiIntensity} />}

      {/* Expression — large, centered, gradient */}
      <div className="text-center py-4">
        <div className="relative inline-block">
          {hintLevel === "none" && (
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />
          )}
          <p className={cn(
            "relative font-[var(--font-family-display)] font-bold tracking-wide bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent",
            hintLevel === "none" ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
          )}>
            {exercise.operand1} {symbol} {exercise.operand2} = ?
          </p>
        </div>
      </div>

      {/* Hint */}
      <LessonHint hint={hint} level={hintLevel} />

      {/* Input + Submit — before any feedback */}
      {feedback === null && (
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sua resposta"
              className="text-center text-lg h-12 bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl focus:border-teal-500/50 focus:ring-teal-500/20"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={userInput.trim() === ""}
            className="flex items-center gap-2 px-6 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-medium shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Send className="size-4" />
            <span className="hidden sm:inline">Responder</span>
          </button>
        </div>
      )}

      {/* Correct feedback */}
      {feedback === "correct" && (
        <div className="relative lesson-step-in">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
          <div className="relative flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
              <CheckCircle2 className="size-4 text-white" />
            </div>
            <span className="font-medium text-emerald-400">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Incorrect feedback — gentle, with opt-in step-by-step */}
      {feedback === "incorrect" && !showSteps && (
        <div className="space-y-4 lesson-step-in">
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/8 backdrop-blur-sm p-4">
            <span className="text-sm text-amber-400">
              Quase! Quer rever os passos?
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSteps(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all text-sm font-medium"
            >
              <Eye className="size-4" />
              Ver passos
            </button>
            <button
              onClick={resetForRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all text-sm font-medium"
            >
              <RotateCcw className="size-4" />
              Tentar de novo
            </button>
          </div>
        </div>
      )}

      {/* Step-by-step (opt-in) */}
      {feedback === "incorrect" && showSteps && (
        <LessonStepByStep
          steps={exercise.stepByStep}
          onRetry={resetForRetry}
        />
      )}
    </div>
  );
}
