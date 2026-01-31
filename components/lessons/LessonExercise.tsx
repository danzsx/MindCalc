"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LessonHint } from "./LessonHint";
import { LessonStepByStep } from "./LessonStepByStep";
import { checkAnswer } from "@/lib/lessons/engine";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { LessonExerciseData, HintLevel } from "@/lib/lessons/types";

const OPERATOR_SYMBOLS: Record<string, string> = {
  "+": "+",
  "-": "\u2212",
  "*": "\u00d7",
  "/": "\u00f7",
};

const SUCCESS_MESSAGES = [
  "Isso mesmo!",
  "Muito bem!",
  "Perfeito!",
  "Excelente!",
  "Mandou bem!",
];

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetForRetry = useCallback(() => {
    setUserInput("");
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = userInput.trim();
    if (trimmed === "") return;

    const numericAnswer = Number(trimmed);
    if (isNaN(numericAnswer)) return;

    const isCorrect = checkAnswer(exercise, numericAnswer);

    if (isCorrect) {
      setSuccessMessage(
        SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
      );
      setFeedback("correct");
      setTimeout(() => onAnswer(true), 1500);
    } else {
      setFeedback("incorrect");
    }
  }, [userInput, exercise, onAnswer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && feedback === null) {
        handleSubmit();
      }
    },
    [handleSubmit, feedback]
  );

  const hint = hintLevel === "full" ? exercise.fullHint : exercise.partialHint;
  const symbol = OPERATOR_SYMBOLS[exercise.operator] ?? exercise.operator;

  return (
    <div className="space-y-6">
      {/* Expression */}
      <div className="text-center">
        <p className="text-3xl font-bold tracking-wide">
          {exercise.operand1} {symbol} {exercise.operand2} = ?
        </p>
      </div>

      {/* Hint */}
      <LessonHint hint={hint} level={hintLevel} />

      {/* Input + Submit */}
      {feedback !== "correct" && feedback !== "incorrect" && (
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
            Responder
          </Button>
        </div>
      )}

      {/* Correct feedback */}
      {feedback === "correct" && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <CheckCircle2 className="size-5 text-green-600" />
          <span className="font-medium text-green-700 dark:text-green-400">
            {successMessage}
          </span>
        </div>
      )}

      {/* Incorrect feedback — step by step */}
      {feedback === "incorrect" && (
        <LessonStepByStep
          steps={exercise.stepByStep}
          onRetry={resetForRetry}
        />
      )}
    </div>
  );
}
