"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/training/ProgressBar";
import { checkAnswer } from "@/lib/lessons/engine";
import { CheckCircle2, ArrowLeft } from "lucide-react";
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
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        <CheckCircle2 className="size-12 text-primary" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Treino feito!</h3>
          <p className="text-muted-foreground">
            Você acertou{" "}
            <span className="font-semibold text-foreground">
              {correctCount} de {exercises.length}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Técnica: {technique}
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="w-full">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const symbol = OPERATOR_SYMBOLS[exercise.operator] ?? exercise.operator;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Exercício {currentIndex + 1} de {exercises.length}</span>
          <span>{correctCount} acertos</span>
        </div>
        <ProgressBar current={currentIndex + (showFeedback ? 1 : 0)} total={exercises.length} />
      </div>

      {/* Expression */}
      <div className="text-center">
        <p className="text-3xl font-bold tracking-wide">
          {exercise.operand1} {symbol} {exercise.operand2} = ?
        </p>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={
            lastCorrect
              ? "flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm font-medium text-green-700 dark:text-green-400"
              : "flex items-center justify-center gap-2 rounded-lg border border-muted-foreground/20 bg-muted/50 p-3 text-sm text-muted-foreground"
          }
        >
          {lastCorrect
            ? "Boa, acertou!"
            : `A resposta era ${exercise.correctAnswer}`}
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
            className="text-center text-lg"
          />
          <Button onClick={handleSubmit} disabled={userInput.trim() === ""}>
            Essa é minha resposta
          </Button>
        </div>
      )}
    </div>
  );
}
