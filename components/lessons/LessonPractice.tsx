"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/training/ProgressBar";
import { checkAnswer } from "@/lib/lessons/engine";
import { CheckCircle2, ArrowLeft, Send, Trophy, Target } from "lucide-react";
import type { LessonExerciseData } from "@/lib/lessons/types";

const OPERATOR_SYMBOLS: Record<string, string> = {
  "+": "+",
  "-": "\u2212",
  "*": "\u00d7",
  "/": "\u00f7",
};

interface LessonPracticeProps {
  exercises: LessonExerciseData[];
  technique: string;
  onBack: () => void;
}

export function LessonPractice({
  exercises,
  technique,
  onBack,
}: LessonPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showFeedback && !isFinished) {
      inputRef.current?.focus();
    }
  }, [currentIndex, showFeedback, isFinished]);

  const handleSubmit = useCallback(() => {
    const trimmed = userInput.trim();
    if (trimmed === "" || showFeedback) return;

    const numericAnswer = Number(trimmed);
    if (isNaN(numericAnswer)) return;

    const isCorrect = checkAnswer(exercises[currentIndex], numericAnswer);
    setLastCorrect(isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setUserInput("");
      if (currentIndex + 1 < exercises.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  }, [userInput, showFeedback, exercises, currentIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !showFeedback) {
        handleSubmit();
      }
    },
    [handleSubmit, showFeedback]
  );

  // Summary screen
  if (isFinished) {
    const accuracy = Math.round((correctCount / exercises.length) * 100);
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-6 lesson-phase-enter">
        {/* Trophy with glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30">
            <Trophy className="size-10 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-[var(--font-family-display)] text-2xl font-bold text-white">
            Treino feito!
          </h3>

          {/* Stats cards */}
          <div className="flex gap-3 justify-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3">
              <p className="text-2xl font-bold text-teal-400">{correctCount}/{exercises.length}</p>
              <p className="text-xs text-white/50">Acertos</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3">
              <p className="text-2xl font-bold text-cyan-400">{accuracy}%</p>
              <p className="text-xs text-white/50">Precisao</p>
            </div>
          </div>

          <p className="text-xs text-white/40">
            Tecnica: {technique}
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all text-sm font-medium"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const symbol = OPERATOR_SYMBOLS[exercise.operator] ?? exercise.operator;

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50 flex items-center gap-1.5">
            <Target className="size-3.5" />
            Exercicio {currentIndex + 1} de {exercises.length}
          </span>
          <span className="text-teal-400 font-medium">{correctCount} acertos</span>
        </div>
        <ProgressBar current={currentIndex + (showFeedback ? 1 : 0)} total={exercises.length} />
      </div>

      {/* Expression */}
      <div className="text-center py-2">
        <p className="font-[var(--font-family-display)] text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-wide">
          {exercise.operand1} {symbol} {exercise.operand2} = ?
        </p>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={
            lastCorrect
              ? "flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-4 text-sm font-medium text-emerald-400 lesson-step-in"
              : "flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-sm text-white/60 lesson-step-in"
          }
        >
          {lastCorrect ? (
            <>
              <CheckCircle2 className="size-4" />
              Boa, acertou!
            </>
          ) : (
            `A resposta era ${exercise.correctAnswer}`
          )}
        </div>
      )}

      {/* Input + Submit */}
      {!showFeedback && (
        <div className="flex gap-3">
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
    </div>
  );
}
