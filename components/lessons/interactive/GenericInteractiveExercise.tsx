"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Eye,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { checkAnswer } from "@/lib/lessons/engine";
import {
  getOperatorSymbol,
  isApproximatelyEqual,
  parseNumericInput,
} from "@/lib/lessons/utils";
import {
  ScreenProgress,
  MicroWin,
  FriendlyMessage,
  Confetti,
  SUCCESS_MESSAGES,
} from "./shared";
import type {
  LessonExerciseData,
  HintLevel,
  StrategyStep,
} from "@/lib/lessons/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface GenericInteractiveExerciseProps {
  exercise: LessonExerciseData;
  hintLevel: HintLevel;
  onAnswer: (correct: boolean) => void;
  strategySteps: StrategyStep[];
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function GenericInteractiveExercise({
  exercise,
  hintLevel,
  onAnswer,
  strategySteps,
}: GenericInteractiveExerciseProps) {
  if (hintLevel === "none") {
    return (
      <FreeExercise
        exercise={exercise}
        onAnswer={onAnswer}
        strategySteps={strategySteps}
      />
    );
  }

  return (
    <ScaffoldedExercise
      exercise={exercise}
      hintLevel={hintLevel}
      onAnswer={onAnswer}
      strategySteps={strategySteps}
    />
  );
}

// ---------------------------------------------------------------------------
// Scaffolded Exercise (guided & semi-guided)
// ---------------------------------------------------------------------------

function ScaffoldedExercise({
  exercise,
  hintLevel,
  onAnswer,
  strategySteps,
}: GenericInteractiveExerciseProps) {
  const { operand1, operand2, correctAnswer } = exercise;
  const symbol = getOperatorSymbol(exercise.operator);

  // In semi-guided mode, skip the first step (show it as a hint) and start from the next
  const skipFirst = hintLevel === "partial" && strategySteps.length > 1;
  const visibleSteps = skipFirst ? strategySteps.slice(1) : strategySteps;

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [inputs, setInputs] = useState<string[]>(
    new Array(visibleSteps.length).fill("")
  );
  const [stepDone, setStepDone] = useState<boolean[]>(
    new Array(visibleSteps.length).fill(false)
  );
  const [finalInput, setFinalInput] = useState("");
  const [answerCorrect, setAnswerCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);
  const [stepAttempts, setStepAttempts] = useState<number[]>(
    new Array(visibleSteps.length).fill(0)
  );
  const [finalAttempts, setFinalAttempts] = useState(0);
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);

  const stepInputRef = useRef<HTMLInputElement>(null);
  const finalInputRef = useRef<HTMLInputElement>(null);

  // Total progress: visible strategy steps + final answer
  const totalProgressSteps = visibleSteps.length + 1;
  const currentProgress = answerCorrect
    ? totalProgressSteps
    : currentStepIdx < visibleSteps.length
      ? currentStepIdx
      : visibleSteps.length;

  const allStepsDone = stepDone.every(Boolean);
  const currentStep = visibleSteps[currentStepIdx];

  // Auto-focus
  useEffect(() => {
    if (currentStepIdx < visibleSteps.length && !stepDone[currentStepIdx]) {
      setTimeout(() => stepInputRef.current?.focus(), 300);
    }
  }, [currentStepIdx, visibleSteps.length, stepDone]);

  useEffect(() => {
    if (allStepsDone) {
      setTimeout(() => finalInputRef.current?.focus(), 300);
    }
  }, [allStepsDone]);

  const handleStepSubmit = useCallback(() => {
    const val = parseNumericInput(inputs[currentStepIdx] ?? "");
    if (val === null) return;
    if (isApproximatelyEqual(currentStep.answer, val)) {
      setStepFeedback(null);
      setStepDone((prev) => {
        const next = [...prev];
        next[currentStepIdx] = true;
        return next;
      });
      // Auto-advance to next step
      if (currentStepIdx + 1 < visibleSteps.length) {
        setTimeout(() => setCurrentStepIdx((i) => i + 1), 800);
      }
    } else {
      const nextAttempts = [...stepAttempts];
      nextAttempts[currentStepIdx] = (nextAttempts[currentStepIdx] ?? 0) + 1;
      setStepAttempts(nextAttempts);
      setStepFeedback(
        nextAttempts[currentStepIdx] >= 2
          ? currentStep.hint ?? "Dica: releia o enunciado deste passo."
          : "Ainda não. Tente novamente."
      );
      stepInputRef.current?.classList.add("shake");
      setTimeout(
        () => stepInputRef.current?.classList.remove("shake"),
        500
      );
    }
  }, [currentStep, currentStepIdx, inputs, stepAttempts, visibleSteps.length]);

  const handleFinalSubmit = useCallback(() => {
    const num = parseNumericInput(finalInput);
    if (num === null) return;
    if (isApproximatelyEqual(correctAnswer, num)) {
      const messages = SUCCESS_MESSAGES[hintLevel];
      setSuccessMessage(
        messages[Math.floor(Math.random() * messages.length)]
      );
      setAnswerCorrect(true);
      setFinalFeedback(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(() => onAnswer(true), 1500);
    } else {
      const nextAttempts = finalAttempts + 1;
      setFinalAttempts(nextAttempts);
      setFinalFeedback(
        nextAttempts >= 2
          ? "Confira os passos acima e refaça a conta final."
          : "Quase. Tente de novo."
      );
      finalInputRef.current?.classList.add("shake");
      setTimeout(
        () => finalInputRef.current?.classList.remove("shake"),
        500
      );
    }
  }, [correctAnswer, finalAttempts, finalInput, hintLevel, onAnswer]);

  return (
    <div className="space-y-5">
      {showConfetti && (
        <Confetti intensity={hintLevel === "partial" ? 1.5 : 1} />
      )}

      {/* Expression header */}
      <div className="text-center py-2">
        <p className="text-3xl sm:text-4xl font-bold tracking-wide">
          <span className="text-primary">{operand1}</span>
          <span className="text-muted-foreground mx-2">{symbol}</span>
          <span className="text-amber-500">{operand2}</span>
          <span className="text-muted-foreground mx-2">=</span>
          <span className="text-foreground">?</span>
        </p>
      </div>

      {/* Progress dots */}
      <ScreenProgress current={currentProgress} total={totalProgressSteps} />

      {/* Semi-guided hint: show first step's answer */}
      {skipFirst && (
        <div className="flex items-center gap-2 justify-center text-sm text-amber-600 dark:text-amber-400">
          <Lightbulb className="size-3.5" />
          <span>
            Dica: {strategySteps[0].prompt.replace("?", String(strategySteps[0].answer))}
          </span>
        </div>
      )}

      {/* Strategy steps */}
      <div className="space-y-3">
        {visibleSteps.map((step, i) => {
          if (i > currentStepIdx) return null;

          return (
            <div key={i} className="interactive-fade-up">
              {stepDone[i] ? (
                /* Completed step */
                <div className="flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-sm text-foreground">
                    {step.prompt.replace("?", String(step.answer))}
                  </span>
                </div>
              ) : (
                /* Active step */
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    {step.prompt.replace(
                      / = \?$/,
                      " = ?"
                    )}
                  </p>
                  {step.hint && hintLevel === "full" && (
                    <p className="text-xs text-center text-muted-foreground/70">
                      {step.hint}
                    </p>
                  )}
                  <div className="flex gap-3 max-w-[220px] mx-auto">
                    <Input
                      ref={stepInputRef}
                      type="number"
                      inputMode="numeric"
                      value={inputs[i]}
                      onChange={(e) =>
                        setInputs((prev) => {
                          const next = [...prev];
                          next[i] = e.target.value;
                          return next;
                        })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleStepSubmit()
                      }
                      placeholder="?"
                      className="text-center text-lg"
                    />
                    <Button
                      onClick={handleStepSubmit}
                      disabled={inputs[i]?.trim() === ""}
                      size="sm"
                    >
                      OK
                    </Button>
                  </div>
                  {stepFeedback && i === currentStepIdx && (
                    <p className="text-xs text-center text-muted-foreground">
                      {stepFeedback}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final answer */}
      {allStepsDone && !answerCorrect && (
        <div className="space-y-3 interactive-fade-up">
          <MicroWin message="Otimo! Agora o resultado final:" />
          <div className="text-center">
            <p className="text-2xl font-bold">
              <span className="text-primary">{operand1}</span>
              <span className="text-muted-foreground mx-2">{symbol}</span>
              <span className="text-amber-500">{operand2}</span>
              <span className="text-muted-foreground mx-2">=</span>
              <span className="text-foreground">?</span>
            </p>
          </div>
          <div className="flex gap-3 max-w-[240px] mx-auto">
            <Input
              ref={finalInputRef}
              type="number"
              inputMode="numeric"
              value={finalInput}
              onChange={(e) => setFinalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFinalSubmit()}
              placeholder="Resposta"
              className="text-center text-lg"
            />
            <Button
              onClick={handleFinalSubmit}
              disabled={finalInput.trim() === ""}
            >
              Essa!
            </Button>
          </div>
          {finalFeedback && (
            <p className="text-xs text-center text-muted-foreground">
              {finalFeedback}
            </p>
          )}
        </div>
      )}

      {/* Correct answer */}
      {answerCorrect && (
        <div className="space-y-3">
          <div className="text-center interactive-number-reveal">
            <p className="text-4xl font-bold text-success">
              = {correctAnswer}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 interactive-fade-up">
            <CheckCircle2 className="size-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {successMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Free Exercise (no scaffolding)
// ---------------------------------------------------------------------------

function FreeExercise({
  exercise,
  onAnswer,
  strategySteps,
}: {
  exercise: LessonExerciseData;
  onAnswer: (correct: boolean) => void;
  strategySteps: StrategyStep[];
}) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStrategy, setShowStrategy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { operand1, operand2, correctAnswer } = exercise;
  const symbol = getOperatorSymbol(exercise.operator);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetForRetry = useCallback(() => {
    setInput("");
    setFeedback(null);
    setShowStrategy(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseNumericInput(input);
    if (num === null) return;

    if (checkAnswer(exercise, num)) {
      const messages = SUCCESS_MESSAGES.none;
      setSuccessMessage(
        messages[Math.floor(Math.random() * messages.length)]
      );
      setFeedback("correct");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      setTimeout(() => onAnswer(true), 1500);
    } else {
      setFeedback("incorrect");
    }
  }, [input, exercise, onAnswer]);

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti intensity={2} />}

      {/* Big expression */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-1">
          <Zap className="size-5 text-amber-500" />
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Sem dica — confia no truque!
          </span>
        </div>
        <p className="text-4xl sm:text-5xl font-bold tracking-wide mt-3">
          {operand1} {symbol} {operand2} = ?
        </p>
      </div>

      {/* Input */}
      {feedback === null && (
        <div className="flex gap-3 max-w-sm mx-auto">
          <Input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Sua resposta"
            className="text-center text-xl"
          />
          <Button
            onClick={handleSubmit}
            disabled={input.trim() === ""}
            size="lg"
          >
            Essa!
          </Button>
        </div>
      )}

      {/* Correct */}
      {feedback === "correct" && (
        <div className="space-y-3">
          <div className="text-center interactive-number-reveal">
            <p className="text-5xl font-bold text-success">
              = {correctAnswer}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 interactive-fade-up">
            <CheckCircle2 className="size-5 text-green-600" />
            <span className="font-medium text-green-700 dark:text-green-400">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Incorrect — gentle, with strategy replay option */}
      {feedback === "incorrect" && !showStrategy && (
        <div className="space-y-4 interactive-fade-up">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <span className="text-sm text-amber-700 dark:text-amber-400">
              Quase! Quer rever a estrategia?
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowStrategy(true)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="size-4 mr-1" />
              Rever estrategia
            </Button>
            <Button
              onClick={resetForRetry}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="size-4 mr-1" />
              Tentar de novo
            </Button>
          </div>
        </div>
      )}

      {/* Strategy replay */}
      {feedback === "incorrect" && showStrategy && (
        <div className="space-y-4 interactive-fade-up">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lightbulb className="size-4 text-primary" />
              Lembra do truque:
            </p>
            <div className="space-y-2 text-sm">
              {strategySteps.map((step, i) => (
                <p key={i}>
                  {i + 1}. {step.prompt.replace("?", String(step.answer))}
                </p>
              ))}
            </div>
          </div>
          <Button
            onClick={resetForRetry}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="size-4 mr-1" />
            Quero tentar de novo
          </Button>
        </div>
      )}
    </div>
  );
}
