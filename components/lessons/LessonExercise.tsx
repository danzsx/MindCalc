"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LessonHint } from "./LessonHint";
import { LessonStepByStep } from "./LessonStepByStep";
import { checkAnswer } from "@/lib/lessons/engine";
import { getOperatorSymbol } from "@/lib/lessons/utils";
import { cn } from "@/lib/utils";
import { CheckCircle2, Eye } from "lucide-react";
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

      {/* Expression */}
      <div className="text-center">
        <p className={cn(
          "font-bold tracking-wide",
          hintLevel === "none" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        )}>
          {exercise.operand1} {symbol} {exercise.operand2} = ?
        </p>
      </div>

      {/* Hint */}
      <LessonHint hint={hint} level={hintLevel} />

      {/* Input + Submit — before any feedback */}
      {feedback === null && (
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
            Essa e minha resposta
          </Button>
        </div>
      )}

      {/* Correct feedback */}
      {feedback === "correct" && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 lesson-step-in">
          <CheckCircle2 className="size-5 text-green-600" />
          <span className="font-medium text-green-700 dark:text-green-400">
            {successMessage}
          </span>
        </div>
      )}

      {/* Incorrect feedback — gentle, with opt-in step-by-step */}
      {feedback === "incorrect" && !showSteps && (
        <div className="space-y-4 lesson-step-in">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <span className="text-sm text-amber-700 dark:text-amber-400">
              Quase! Quer rever os passos?
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSteps(true)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="size-4 mr-1" />
              Ver passos
            </Button>
            <Button
              onClick={resetForRetry}
              variant="outline"
              className="flex-1"
            >
              Tentar de novo
            </Button>
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
