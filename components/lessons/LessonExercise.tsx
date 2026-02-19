"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { LessonHint } from "./LessonHint";
import { LessonStepByStep } from "./LessonStepByStep";
import { checkAnswer } from "@/lib/lessons/engine";
import { getOperatorSymbol } from "@/lib/lessons/utils";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Lightbulb, Play, RotateCcw, Send } from "lucide-react";
import type { LessonExerciseData, HintLevel } from "@/lib/lessons/types";

const SUCCESS_MESSAGES: Record<HintLevel, string[]> = {
  full: [
    "Boa. Esse truque já tá ficando natural.",
    "Isso! Pensou rápido.",
    "Aí sim. O caminho tava certo.",
  ],
  partial: [
    "Já tá fluindo. Boa.",
    "Acertou. Esse raciocínio economiza tempo.",
    "Isso aí! Quase sem ajuda.",
  ],
  none: [
    "Calculou de cabeça! Impressionante.",
    "Sem dica nenhuma e acertou. Mandou bem!",
    "Esse truque já é seu. Parabéns!",
  ],
};

/* Numetria confetti palette */
const CONFETTI_COLORS = ["#cef26d", "#8dc2ff", "#3770bf", "#a8cc47", "#f0f4ff", "#5a8fd4"];

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

function useIdleHint(active: boolean) {
  const [phase, setPhase] = useState<"hidden" | "nudge" | "visible">("hidden");

  useEffect(() => {
    if (!active) {
      setPhase("hidden");
      return;
    }
    setPhase("hidden");
    const nudgeTimer = setTimeout(
      () => setPhase((p) => (p === "hidden" ? "nudge" : p)),
      10_000
    );
    const revealTimer = setTimeout(() => setPhase("visible"), 20_000);
    return () => {
      clearTimeout(nudgeTimer);
      clearTimeout(revealTimer);
    };
  }, [active]);

  const show = useCallback(() => setPhase("visible"), []);
  return { phase, show };
}

interface LessonExerciseProps {
  exercise: LessonExerciseData;
  hintLevel: HintLevel;
  onAnswer: (correct: boolean) => void;
  onAttempt?: () => void;
}

export function LessonExercise({
  exercise,
  hintLevel,
  onAnswer,
  onAttempt,
}: LessonExerciseProps) {
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFreeMode = hintLevel === "none";
  const { phase: hintNudge, show: showIdleHint } = useIdleHint(
    feedback === null && isFreeMode
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetForRetry = useCallback(() => {
    setUserInput("");
    setFeedback(null);
    setShowSteps(false);
    setAutoPlay(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = userInput.trim();
    if (trimmed === "") return;
    const numericAnswer = Number(trimmed);
    if (isNaN(numericAnswer)) return;

    onAttempt?.();
    const isCorrect = checkAnswer(exercise, numericAnswer);

    if (isCorrect) {
      const messages = SUCCESS_MESSAGES[hintLevel];
      setSuccessMessage(messages[Math.floor(Math.random() * messages.length)]);
      setFeedback("correct");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setFeedback("incorrect");
    }
  }, [userInput, exercise, hintLevel, onAttempt]);

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
  const confettiIntensity = hintLevel === "none" ? 2 : hintLevel === "partial" ? 1.5 : 1;

  return (
    <div className="space-y-5">
      {showConfetti && <Confetti intensity={confettiIntensity} />}

      {/* Real-world context */}
      {exercise.context && (
        <p className="text-sm text-[#6b89b4] text-center italic px-4 leading-relaxed lesson-step-in">
          {exercise.context}
        </p>
      )}

      {/* Expression — large, centered */}
      <div className="text-center py-5">
        <div className="relative inline-block">
          {hintLevel === "none" && (
            <div
              className="absolute -inset-6 rounded-3xl"
              style={{
                background: "radial-gradient(ellipse, rgba(55,112,191,0.08) 0%, transparent 70%)",
              }}
            />
          )}
          <p
            className={cn(
              "relative font-bold tracking-wide text-[#f0f4ff]",
              hintLevel === "none" ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
            )}
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {exercise.operand1} {symbol} {exercise.operand2} = ?
          </p>
        </div>
      </div>

      {/* Hint (guided / semi-guided only) */}
      <LessonHint hint={hint} level={hintLevel} />

      {/* Idle hint nudge — free mode */}
      {isFreeMode && feedback === null && hintNudge !== "hidden" && (
        <div className="lesson-step-in">
          {hintNudge === "nudge" ? (
            <button
              onClick={showIdleHint}
              className="flex items-center gap-2 mx-auto px-4 py-2.5 rounded-xl text-sm font-medium transition-all animate-pulse"
              style={{
                background: "rgba(55,112,191,0.1)",
                border: "1px solid rgba(55,112,191,0.25)",
                color: "#8dc2ff",
              }}
            >
              <Lightbulb className="size-4" />
              Precisa de uma dica?
            </button>
          ) : (
            <div
              className="rounded-xl border p-4 space-y-1 lesson-step-in"
              style={{
                background: "rgba(55,112,191,0.08)",
                borderColor: "rgba(55,112,191,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="size-4 text-[#8dc2ff]" />
                <span className="text-xs font-medium text-[#8dc2ff] uppercase tracking-wide">
                  Dica estratégica
                </span>
              </div>
              <p className="text-sm text-[#a8c0e0] leading-relaxed">
                {exercise.partialHint}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Input + Submit */}
      {feedback === null && (
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sua resposta"
              className="w-full text-center text-lg h-14 rounded-xl font-bold transition-all duration-200 outline-none"
              style={{
                background: "rgba(13,29,58,0.8)",
                border: "1px solid rgba(141,194,255,0.15)",
                color: "#f0f4ff",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#cef26d";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(206,242,109,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(141,194,255,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={userInput.trim() === ""}
            className="flex items-center gap-2 px-6 h-14 rounded-xl font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #3770bf 0%, #2558a0 100%)",
              color: "#f0f4ff",
              border: "1px solid rgba(55,112,191,0.4)",
              boxShadow: "0 4px 16px rgba(55,112,191,0.25)",
            }}
          >
            <Send className="size-4" />
            <span className="hidden sm:inline">Responder</span>
          </button>
        </div>
      )}

      {/* Correct feedback */}
      {feedback === "correct" && (
        <div className="space-y-3 lesson-step-in">
          <div
            className="relative flex items-center justify-center gap-3 rounded-2xl border p-5"
            style={{
              background: "rgba(206,242,109,0.08)",
              borderColor: "rgba(206,242,109,0.25)",
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ background: "rgba(206,242,109,0.2)" }}
            >
              <CheckCircle2 className="size-4 text-[#cef26d]" />
            </div>
            <span className="font-bold text-[#cef26d]">
              {successMessage}
            </span>
          </div>
          <button
            onClick={() => onAnswer(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #cef26d 0%, #a8cc47 100%)",
              color: "#080f1e",
              boxShadow: "0 4px 16px rgba(206,242,109,0.2)",
            }}
          >
            Continuar
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {/* Incorrect feedback */}
      {feedback === "incorrect" && !showSteps && (
        <div className="space-y-3 lesson-step-in">
          <div
            className="flex items-center justify-center gap-2 rounded-2xl border p-4"
            style={{
              background: "rgba(141,194,255,0.06)",
              borderColor: "rgba(141,194,255,0.18)",
            }}
          >
            <span className="text-sm font-bold text-[#8dc2ff]">
              Quase! Quer rever os passos?
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowSteps(true); setAutoPlay(true); }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(55,112,191,0.1)",
                border: "1px solid rgba(55,112,191,0.25)",
                color: "#8dc2ff",
              }}
            >
              <Play className="size-4" />
              Ver replay
            </button>
            <button
              onClick={resetForRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(141,194,255,0.06)",
                border: "1px solid rgba(141,194,255,0.15)",
                color: "#6b89b4",
              }}
            >
              <RotateCcw className="size-4" />
              Tentar de novo
            </button>
          </div>
        </div>
      )}

      {/* Step-by-step replay */}
      {feedback === "incorrect" && showSteps && (
        <LessonStepByStep
          steps={exercise.stepByStep}
          onRetry={resetForRetry}
          autoPlay={autoPlay}
        />
      )}
    </div>
  );
}
