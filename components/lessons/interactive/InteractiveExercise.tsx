"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  ArrowRightLeft,
  Eye,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberBar } from "./NumberBar";
import { checkAnswer } from "@/lib/lessons/engine";
import {
  getOperatorSymbol,
  isApproximatelyEqual,
  parseNumericInput,
} from "@/lib/lessons/utils";
import type { LessonExerciseData, HintLevel } from "@/lib/lessons/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ScaffoldStep = "identify" | "gap" | "transfer" | "answer";

const SCAFFOLD_STEPS: ScaffoldStep[] = ["identify", "gap", "transfer", "answer"];

const SUCCESS_MESSAGES: Record<HintLevel, string[]> = {
  full: [
    "Boa! Voce seguiu o caminho certinho.",
    "Mandou bem! Cada passo ficou claro.",
    "Exato! O truque ja ta ficando natural.",
  ],
  partial: [
    "Show! Ja ta pegando o ritmo.",
    "Quase sem ajuda e acertou!",
    "Isso ai! O caminho ja e automatico.",
  ],
  none: [
    "Calculou de cabeca! Impressionante.",
    "Sem dica nenhuma e acertou. Monstro!",
    "Esse truque ja e seu. Parabens!",
  ],
};

const CONFETTI_COLORS = [
  "#22d3ee",
  "#fbbf24",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface InteractiveExerciseProps {
  exercise: LessonExerciseData;
  hintLevel: HintLevel;
  onAnswer: (correct: boolean) => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function InteractiveExercise({
  exercise,
  hintLevel,
  onAnswer,
}: InteractiveExerciseProps) {
  // For "none" (free) mode, render the simplified direct-answer experience
  if (hintLevel === "none") {
    return (
      <FreeExercise exercise={exercise} onAnswer={onAnswer} />
    );
  }

  // For "full" (guided) or "partial" (semi-guided), render scaffolded
  return (
    <ScaffoldedExercise
      exercise={exercise}
      hintLevel={hintLevel}
      onAnswer={onAnswer}
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
}: InteractiveExerciseProps) {
  const { operand1, operand2, correctAnswer } = exercise;

  // Computed strategy values
  const targetTen = Math.ceil(operand2 / 10) * 10;
  const gap = targetTen - operand2;
  const adjustedOp1 = operand1 - gap;

  // State
  const [currentStep, setCurrentStep] = useState<ScaffoldStep>(
    hintLevel === "partial" ? "gap" : "identify"
  );
  const [selectedNumber, setSelectedNumber] = useState<number | null>(
    hintLevel === "partial" ? operand2 : null
  );
  const [identifyDone, setIdentifyDone] = useState(hintLevel === "partial");
  const [gapInput, setGapInput] = useState("");
  const [gapDone, setGapDone] = useState(false);
  const [transferDone, setTransferDone] = useState(false);
  const [answerInput, setAnswerInput] = useState("");
  const [answerCorrect, setAnswerCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const gapRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);

  const stepIndex = SCAFFOLD_STEPS.indexOf(currentStep);

  // Auto-focus inputs when steps change
  useEffect(() => {
    if (currentStep === "gap") {
      setTimeout(() => gapRef.current?.focus(), 300);
    }
    if (currentStep === "answer") {
      setTimeout(() => answerRef.current?.focus(), 300);
    }
  }, [currentStep]);

  const handleIdentify = useCallback(
    (chosen: number) => {
      setSelectedNumber(chosen);
      if (chosen === operand2) {
        setIdentifyDone(true);
        setTimeout(() => setCurrentStep("gap"), 800);
      }
    },
    [operand2]
  );

  const handleGapSubmit = useCallback(() => {
    const num = parseNumericInput(gapInput);
    if (num === null) return;
    if (isApproximatelyEqual(gap, num)) {
      setGapDone(true);
      setTimeout(() => setCurrentStep("transfer"), 800);
    } else {
      gapRef.current?.classList.add("shake");
      setTimeout(() => gapRef.current?.classList.remove("shake"), 500);
    }
  }, [gapInput, gap]);

  const handleTransfer = useCallback(() => {
    setTransferDone(true);
    setTimeout(() => setCurrentStep("answer"), 1000);
  }, []);

  const handleAnswerSubmit = useCallback(() => {
    const num = parseNumericInput(answerInput);
    if (num === null) return;
    if (isApproximatelyEqual(correctAnswer, num)) {
      const messages = SUCCESS_MESSAGES[hintLevel];
      setSuccessMessage(messages[Math.floor(Math.random() * messages.length)]);
      setAnswerCorrect(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(() => onAnswer(true), 1500);
    } else {
      answerRef.current?.classList.add("shake");
      setTimeout(() => answerRef.current?.classList.remove("shake"), 500);
    }
  }, [answerInput, correctAnswer, hintLevel, onAnswer]);

  const symbol = getOperatorSymbol(exercise.operator);

  return (
    <div className="space-y-5">
      {showConfetti && <Confetti intensity={hintLevel === "partial" ? 1.5 : 1} />}

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

      {/* Step progress dots */}
      <div className="flex items-center justify-center gap-1.5">
        {SCAFFOLD_STEPS.slice(hintLevel === "partial" ? 1 : 0).map(
          (step, i) => (
            <div
              key={step}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                SCAFFOLD_STEPS.indexOf(step) <= stepIndex
                  ? "bg-primary w-5"
                  : "bg-muted w-1.5"
              )}
            />
          )
        )}
      </div>

      {/* ── Step: Identify ── */}
      {currentStep === "identify" && (
        <div className="space-y-4 interactive-fade-up">
          <p className="text-sm text-muted-foreground text-center">
            Qual numero esta mais perto de uma dezena?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <NumberChoiceCard
              value={operand1}
              targetTen={Math.ceil(operand1 / 10) * 10}
              gap={Math.ceil(operand1 / 10) * 10 - operand1}
              color="teal"
              selected={selectedNumber === operand1}
              correct={false}
              onClick={() => handleIdentify(operand1)}
              disabled={identifyDone}
            />
            <NumberChoiceCard
              value={operand2}
              targetTen={targetTen}
              gap={gap}
              color="amber"
              selected={selectedNumber === operand2}
              correct={identifyDone}
              onClick={() => handleIdentify(operand2)}
              disabled={identifyDone}
            />
          </div>
          {selectedNumber === operand1 && !identifyDone && (
            <p className="text-xs text-center text-muted-foreground interactive-fade-up">
              O outro esta mais pertinho...
            </p>
          )}
        </div>
      )}

      {/* ── Step: Gap ── */}
      {currentStep === "gap" && (
        <div className="space-y-4 interactive-fade-up">
          {hintLevel === "partial" && (
            <div className="flex items-center gap-2 justify-center text-sm text-amber-600 dark:text-amber-400">
              <Lightbulb className="size-3.5" />
              <span>
                Dica: arredonde {operand2} para {targetTen}
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground text-center">
            Quanto falta pro {operand2} virar {targetTen}?
          </p>

          <div className="flex justify-center">
            <NumberBar
              value={operand2}
              color="amber"
              showGap
              gapFilled={gapDone ? gap : 0}
              size="sm"
            />
          </div>

          {!gapDone && (
            <div className="flex gap-3 max-w-[200px] mx-auto">
              <Input
                ref={gapRef}
                type="number"
                inputMode="numeric"
                value={gapInput}
                onChange={(e) => setGapInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGapSubmit()}
                placeholder="?"
                className="text-center text-lg"
              />
              <Button
                onClick={handleGapSubmit}
                disabled={gapInput.trim() === ""}
                size="sm"
              >
                OK
              </Button>
            </div>
          )}

          {gapDone && (
            <MicroWin message={`Isso! Falta ${gap}.`} />
          )}
        </div>
      )}

      {/* ── Step: Transfer ── */}
      {currentStep === "transfer" && (
        <div className="space-y-4 interactive-fade-up">
          <p className="text-sm text-muted-foreground text-center">
            {!transferDone
              ? `Transferimos ${gap} do ${operand1} pro ${operand2}:`
              : `Pronto! Agora e ${adjustedOp1} + ${targetTen}.`}
          </p>

          <div className="flex items-end justify-center gap-6 py-2">
            <NumberBar
              value={operand1}
              color="teal"
              highlightTransfer={gap}
              transferDone={transferDone}
              size="sm"
            />
            <div className="pb-6">
              <ArrowRightLeft
                className={cn(
                  "size-4 transition-colors",
                  transferDone
                    ? "text-emerald-500"
                    : "text-muted-foreground/50"
                )}
              />
            </div>
            <NumberBar
              value={operand2}
              color="amber"
              showGap
              gapFilled={transferDone ? gap : 0}
              size="sm"
            />
          </div>

          {!transferDone && (
            <Button
              onClick={handleTransfer}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <ArrowRightLeft className="size-3.5 mr-1.5" />
              Transferir {gap}
            </Button>
          )}

          {transferDone && (
            <MicroWin message={`${adjustedOp1} + ${targetTen} — facil!`} />
          )}
        </div>
      )}

      {/* ── Step: Answer ── */}
      {currentStep === "answer" && (
        <div className="space-y-4 interactive-fade-up">
          <div className="text-center">
            <p className="text-2xl font-bold">
              <span className="text-primary">{adjustedOp1}</span>
              <span className="text-muted-foreground mx-2">+</span>
              <span className="text-emerald-500">{targetTen}</span>
              <span className="text-muted-foreground mx-2">=</span>
              <span className="text-foreground">?</span>
            </p>
          </div>

          {!answerCorrect && (
            <div className="flex gap-3 max-w-[240px] mx-auto">
              <Input
                ref={answerRef}
                type="number"
                inputMode="numeric"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit()}
                placeholder="Resposta"
                className="text-center text-lg"
              />
              <Button
                onClick={handleAnswerSubmit}
                disabled={answerInput.trim() === ""}
              >
                Essa!
              </Button>
            </div>
          )}

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
}: {
  exercise: LessonExerciseData;
  onAnswer: (correct: boolean) => void;
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
  const targetTen = Math.ceil(operand2 / 10) * 10;
  const gap = targetTen - operand2;
  const adjustedOp1 = operand1 - gap;
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
      setSuccessMessage(messages[Math.floor(Math.random() * messages.length)]);
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
            <p className="text-5xl font-bold text-success">= {correctAnswer}</p>
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
            <Button onClick={resetForRetry} variant="outline" className="flex-1">
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
              <p>
                1. <strong>{operand2}</strong> esta pertinho de{" "}
                <strong>{targetTen}</strong> (falta {gap})
              </p>
              <p>
                2. Pega {gap} do {operand1} → fica{" "}
                <strong>{adjustedOp1}</strong>
              </p>
              <p>
                3. <strong>
                  {adjustedOp1} + {targetTen} = {correctAnswer}
                </strong>
              </p>
            </div>
          </div>
          <Button onClick={resetForRetry} variant="outline" className="w-full">
            <RotateCcw className="size-4 mr-1" />
            Quero tentar de novo
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NumberChoiceCard({
  value,
  targetTen,
  gap,
  color,
  selected,
  correct,
  onClick,
  disabled,
}: {
  value: number;
  targetTen: number;
  gap: number;
  color: "teal" | "amber";
  selected: boolean;
  correct: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-300",
        correct
          ? "border-emerald-400 bg-emerald-500/10 ring-4 ring-emerald-400/20"
          : selected
            ? "border-destructive/40 bg-destructive/5"
            : "border-border hover:border-primary/40 hover:bg-primary/5"
      )}
    >
      <span
        className={cn(
          "text-2xl font-bold",
          color === "teal" ? "text-primary" : "text-amber-500"
        )}
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        {value}
      </span>
      <span className="text-[11px] text-muted-foreground">
        falta {gap} pro {targetTen}
      </span>
    </button>
  );
}

function MicroWin({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 interactive-micro-win">
      <Sparkles className="size-3.5 text-emerald-500 shrink-0" />
      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
        {message}
      </span>
    </div>
  );
}

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
