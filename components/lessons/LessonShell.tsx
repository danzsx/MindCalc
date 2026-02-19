"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Lightbulb, XCircle } from "lucide-react";
import { LessonProgressIndicator } from "./LessonProgressIndicator";
import { LessonIntro } from "./LessonIntro";
import { LessonExercise } from "./LessonExercise";
import { LessonCompletion } from "./LessonCompletion";
import { LessonPractice } from "./LessonPractice";
import { InteractiveLessonIntro } from "./interactive/InteractiveLessonIntro";
import { InteractiveExercise } from "./interactive/InteractiveExercise";
import { GenericInteractiveIntro } from "./interactive/GenericInteractiveIntro";
import { GenericInteractiveExercise } from "./interactive/GenericInteractiveExercise";
import { FractionPizzaIntro } from "./interactive/FractionPizzaIntro";
import { PriceComparisonIntro } from "./interactive/PriceComparisonIntro";
import { ParcelamentoIntro } from "./interactive/ParcelamentoIntro";
import { getExerciseForPhase, generatePracticeExercises } from "@/lib/lessons/engine";
import type { LessonContent, LessonPhase, HintLevel, LessonExerciseData, ComprehensionCheck } from "@/lib/lessons/types";

const PHASE_ORDER: LessonPhase[] = ["intro", "guided", "semi-guided", "free", "completion"];

const HINT_LEVEL_MAP: Record<string, HintLevel> = {
  guided: "full",
  "semi-guided": "partial",
  free: "none",
};

const PHASE_TITLES: Record<string, string> = {
  guided: "Com dica completa",
  "semi-guided": "Com uma pista",
  free: "Agora é com você",
};

const PHASE_INTERSTICIAL: Record<string, string> = {
  guided: "Agora vamos tentar juntos...",
  "semi-guided": "Dessa vez com menos ajuda...",
  free: "Confia no que você aprendeu!",
  completion: "Parabéns!",
};

// ---------------------------------------------------------------------------
// Comprehension check screen
// ---------------------------------------------------------------------------

function ComprehensionCheckScreen({
  check,
  onContinue,
}: {
  check: ComprehensionCheck;
  onContinue: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const hasAnswered = selected !== null;
  const isCorrect = selected === check.correctIndex;

  return (
    <div className="space-y-4 lesson-phase-enter">
      <div
        className="rounded-2xl border p-5 space-y-4"
        style={{
          background: "rgba(13,29,58,0.7)",
          borderColor: "rgba(141,194,255,0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
            style={{
              background: "rgba(55,112,191,0.15)",
              border: "1px solid rgba(55,112,191,0.3)",
            }}
          >
            <Lightbulb className="size-4 text-[#8dc2ff]" />
          </div>
          <p className="text-xs font-semibold text-[#6b89b4] uppercase tracking-widest">
            Verificação rápida
          </p>
        </div>

        {/* Question */}
        <p className="text-base font-semibold text-[#f0f4ff] leading-snug">
          {check.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {check.options.map((opt, i) => {
            const isThisCorrect = i === check.correctIndex;
            const isThisSelected = i === selected;

            return (
              <button
                key={i}
                onClick={() => !hasAnswered && setSelected(i)}
                disabled={hasAnswered}
                className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200"
                style={
                  hasAnswered && isThisCorrect
                    ? {
                        borderColor: "rgba(206,242,109,0.4)",
                        background: "rgba(206,242,109,0.08)",
                        color: "#cef26d",
                      }
                    : hasAnswered && isThisSelected && !isThisCorrect
                    ? {
                        borderColor: "rgba(141,194,255,0.3)",
                        background: "rgba(141,194,255,0.06)",
                        color: "#8dc2ff",
                      }
                    : hasAnswered
                    ? {
                        borderColor: "rgba(141,194,255,0.06)",
                        background: "transparent",
                        color: "#3a5070",
                        opacity: 0.6,
                      }
                    : {
                        borderColor: "rgba(141,194,255,0.12)",
                        background: "rgba(13,29,58,0.4)",
                        color: "#a8c0e0",
                      }
                }
                onMouseEnter={(e) => {
                  if (!hasAnswered) {
                    e.currentTarget.style.borderColor = "rgba(55,112,191,0.4)";
                    e.currentTarget.style.background = "rgba(55,112,191,0.08)";
                    e.currentTarget.style.color = "#f0f4ff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasAnswered) {
                    e.currentTarget.style.borderColor = "rgba(141,194,255,0.12)";
                    e.currentTarget.style.background = "rgba(13,29,58,0.4)";
                    e.currentTarget.style.color = "#a8c0e0";
                  }
                }}
              >
                <span className="text-[#6b89b4] mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt.label}
                {hasAnswered && isThisCorrect && (
                  <CheckCircle2 className="inline ml-2 size-4 text-[#cef26d]" />
                )}
                {hasAnswered && isThisSelected && !isThisCorrect && (
                  <XCircle className="inline ml-2 size-4 text-[#8dc2ff]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {hasAnswered && (
          <div
            className="rounded-xl p-3 text-sm leading-relaxed lesson-step-in border"
            style={
              isCorrect
                ? {
                    background: "rgba(206,242,109,0.06)",
                    borderColor: "rgba(206,242,109,0.2)",
                    color: "#cef26d",
                  }
                : {
                    background: "rgba(55,112,191,0.08)",
                    borderColor: "rgba(55,112,191,0.2)",
                    color: "#8dc2ff",
                  }
            }
          >
            {isCorrect
              ? check.feedback
              : `A resposta certa era: "${check.options[check.correctIndex].label}". ${check.feedback}`}
          </div>
        )}
      </div>

      {hasAnswered && (
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-200 lesson-step-in"
          style={{
            background: "linear-gradient(135deg, #cef26d 0%, #a8cc47 100%)",
            color: "#080f1e",
            boxShadow: "0 4px 16px rgba(206,242,109,0.2)",
          }}
        >
          Continuar
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main shell
// ---------------------------------------------------------------------------

interface LessonShellProps {
  lesson: LessonContent;
  onComplete: () => void;
  nextLessonSlug?: string;
}

export function LessonShell({ lesson, onComplete, nextLessonSlug }: LessonShellProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [showPractice, setShowPractice] = useState(false);
  const [practiceExercises, setPracticeExercises] = useState<LessonExerciseData[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [interstitialMsg, setInterstitialMsg] = useState<string | null>(null);
  const [showComprehensionCheck, setShowComprehensionCheck] = useState(false);

  const pendingPhaseRef = useRef<LessonPhase | null>(null);
  const interstitialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const phaseAttemptsRef = useRef<{ guided: number; "semi-guided": number; free: number }>({
    guided: 0,
    "semi-guided": 0,
    free: 0,
  });
  const [finalAttempts, setFinalAttempts] = useState<{
    guided: number;
    "semi-guided": number;
    free: number;
  } | null>(null);

  const completeIfNeeded = useCallback((p: LessonPhase) => {
    if (p === "completion") {
      const mins = Math.round((Date.now() - startTimeRef.current) / 60000);
      setElapsedMinutes(mins);
      setFinalAttempts({ ...phaseAttemptsRef.current });
      onComplete();
      toast.success("Aula concluída! Esse truque já é seu.");
    }
  }, [onComplete]);

  const dismissInterstitial = useCallback(() => {
    if (interstitialTimerRef.current) {
      clearTimeout(interstitialTimerRef.current);
      interstitialTimerRef.current = null;
    }
    const next = pendingPhaseRef.current;
    if (next) {
      pendingPhaseRef.current = null;
      setInterstitialMsg(null);
      setPhase(next);
      setIsTransitioning(false);
      completeIfNeeded(next);
    }
  }, [completeIfNeeded]);

  const advancePhase = useCallback(() => {
    const currentIdx = PHASE_ORDER.indexOf(phase);
    const nextPhase = PHASE_ORDER[currentIdx + 1];
    if (!nextPhase) return;

    const msg = PHASE_INTERSTICIAL[nextPhase];
    if (msg && nextPhase !== "completion") {
      setIsTransitioning(true);
      setInterstitialMsg(msg);
      pendingPhaseRef.current = nextPhase;
      interstitialTimerRef.current = setTimeout(dismissInterstitial, 1500);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setPhase(nextPhase);
        setIsTransitioning(false);
        completeIfNeeded(nextPhase);
      }, 300);
    }
  }, [phase, completeIfNeeded, dismissInterstitial]);

  const handleComprehensionComplete = useCallback(() => {
    setShowComprehensionCheck(false);
    advancePhase();
  }, [advancePhase]);

  const handleExerciseAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        if (phase === "guided" && lesson.comprehensionCheck) {
          setShowComprehensionCheck(true);
        } else {
          advancePhase();
        }
      }
    },
    [advancePhase, phase, lesson.comprehensionCheck]
  );

  const handleAttempt = useCallback(() => {
    const p = phase as keyof typeof phaseAttemptsRef.current;
    if (p === "guided" || p === "semi-guided" || p === "free") {
      phaseAttemptsRef.current[p]++;
    }
  }, [phase]);

  const handlePracticeMore = useCallback(() => {
    const exercises = generatePracticeExercises(lesson, 5);
    setPracticeExercises(exercises);
    setShowPractice(true);
  }, [lesson]);

  const handleBackFromPractice = useCallback(() => {
    setShowPractice(false);
  }, []);

  const handleBackToLessons = useCallback(() => {
    router.push("/lessons");
  }, [router]);

  const handleNextLesson = useCallback(() => {
    if (nextLessonSlug) {
      router.push(`/lessons/${nextLessonSlug}`);
    }
  }, [router, nextLessonSlug]);

  const currentExercise = useMemo(() => {
    if (phase === "guided" || phase === "semi-guided" || phase === "free") {
      return getExerciseForPhase(lesson, phase);
    }
    return null;
  }, [lesson, phase]);

  // Practice mode
  if (showPractice) {
    return (
      <div className="mx-auto max-w-2xl space-y-5 px-4 sm:px-0 pb-20 sm:pb-6">
        <div className="space-y-1.5">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#f0f4ff]"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Mais um pouco
          </h2>
          <p className="text-sm text-[#6b89b4]">
            5 exercícios sem dica — pra deixar o truque automático.
          </p>
        </div>
        <LessonPractice
          exercises={practiceExercises}
          technique={lesson.technique}
          onBack={handleBackFromPractice}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 sm:px-0 pb-20 sm:pb-6">
      {/* Header: Back + lesson info */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackToLessons}
          className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl transition-all duration-200"
          style={{
            background: "rgba(13,29,58,0.7)",
            border: "1px solid rgba(141,194,255,0.12)",
            color: "#6b89b4",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(141,194,255,0.25)";
            e.currentTarget.style.color = "#f0f4ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(141,194,255,0.12)";
            e.currentTarget.style.color = "#6b89b4";
          }}
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1
            className="text-xl sm:text-2xl font-bold text-[#f0f4ff] truncate"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {lesson.title}
          </h1>
          <p className="text-xs text-[#6b89b4] flex items-center gap-1.5 mt-0.5">
            <BookOpen className="size-3" />
            <span>Aula interativa</span>
            <span className="text-[#3a5070]">•</span>
            <Clock className="size-3" />
            <span>~5 minutos</span>
          </p>
        </div>
      </div>

      {/* Progress stepper */}
      <LessonProgressIndicator currentPhase={phase} />

      {/* Interstitial message */}
      {interstitialMsg && (
        <div className="flex flex-col items-center justify-center py-8 gap-4 lesson-phase-enter">
          <div
            className="relative w-full max-w-sm rounded-2xl px-8 py-6 text-center border"
            style={{
              background: "rgba(13,29,58,0.8)",
              borderColor: "rgba(141,194,255,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(55,112,191,0.1) 0%, transparent 70%)",
              }}
            />
            <p className="relative text-lg font-semibold text-[#f0f4ff]">
              {interstitialMsg}
            </p>
          </div>
          <button
            onClick={dismissInterstitial}
            className="w-full max-w-sm flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #cef26d 0%, #a8cc47 100%)",
              color: "#080f1e",
              boxShadow: "0 4px 16px rgba(206,242,109,0.2)",
            }}
          >
            Pronto
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {/* Comprehension check */}
      {showComprehensionCheck && lesson.comprehensionCheck && !interstitialMsg && (
        <ComprehensionCheckScreen
          check={lesson.comprehensionCheck}
          onContinue={handleComprehensionComplete}
        />
      )}

      {/* Phase content */}
      {!interstitialMsg && !showComprehensionCheck && (
        <div className={isTransitioning ? "lesson-phase-exit" : "lesson-phase-enter"}>
          {/* Phase 1: Intro */}
          {phase === "intro" && (
            lesson.interactive?.type === "parcelamento" ? (
              <ParcelamentoIntro
                title={lesson.title}
                cashPrice={1200}
                installmentValue={lesson.interactive.introOperand1}
                installmentCount={lesson.interactive.introOperand2}
                onContinue={advancePhase}
              />
            ) : lesson.interactive?.type === "round-to-ten" ? (
              <InteractiveLessonIntro
                title={lesson.title}
                operand1={lesson.interactive.introOperand1}
                operand2={lesson.interactive.introOperand2}
                onContinue={advancePhase}
              />
            ) : lesson.interactive?.type === "fraction-pizza" ? (
              <FractionPizzaIntro
                title={lesson.title}
                onContinue={advancePhase}
              />
            ) : lesson.interactive?.type === "price-comparison" ? (
              <PriceComparisonIntro
                title={lesson.title}
                onContinue={advancePhase}
              />
            ) : lesson.interactive?.type === "step-discovery" && lesson.interactive.introScreens ? (
              <GenericInteractiveIntro
                title={lesson.title}
                operand1={lesson.interactive.introOperand1}
                operand2={lesson.interactive.introOperand2}
                operator={lesson.operator}
                screens={lesson.interactive.introScreens}
                onContinue={advancePhase}
              />
            ) : (
              <LessonIntro
                title={lesson.title}
                explanation={lesson.intro.explanation}
                example={lesson.intro.example}
                onContinue={advancePhase}
              />
            )
          )}

          {/* Phases 2–4: Exercises */}
          {(phase === "guided" || phase === "semi-guided" || phase === "free") &&
            currentExercise && (
              <div className="space-y-4">
                {/* Phase title card */}
                <div
                  className="rounded-2xl p-4 border"
                  style={{
                    background: "rgba(13,29,58,0.6)",
                    borderColor: "rgba(141,194,255,0.1)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <h2
                    className="text-xl sm:text-2xl font-bold text-[#f0f4ff] mb-1"
                    style={{ fontFamily: "var(--font-family-display)" }}
                  >
                    {PHASE_TITLES[phase]}
                  </h2>
                  <p className="text-sm text-[#6b89b4]">
                    {phase === "guided" && (
                      lesson.interactive
                        ? "Siga os passos — você já sabe o caminho."
                        : "Use a dica abaixo pra pensar junto."
                    )}
                    {phase === "semi-guided" && (
                      lesson.interactive
                        ? "Menos ajuda dessa vez — o truque já é seu."
                        : "A dica mostra só o começo — tente chegar no resultado."
                    )}
                    {phase === "free" && (
                      "Sem dicas dessa vez. Confia no que você aprendeu."
                    )}
                  </p>
                </div>

                {lesson.interactive?.type === "round-to-ten" ? (
                  <InteractiveExercise
                    key={phase}
                    exercise={currentExercise}
                    hintLevel={HINT_LEVEL_MAP[phase]}
                    onAnswer={handleExerciseAnswer}
                  />
                ) : (lesson.interactive?.type === "step-discovery" || lesson.interactive?.type === "fraction-pizza" || lesson.interactive?.type === "price-comparison" || lesson.interactive?.type === "parcelamento") && lesson.interactive.buildExerciseSteps ? (
                  <GenericInteractiveExercise
                    key={phase}
                    exercise={currentExercise}
                    hintLevel={HINT_LEVEL_MAP[phase]}
                    onAnswer={handleExerciseAnswer}
                    strategySteps={lesson.interactive.buildExerciseSteps(currentExercise)}
                    visual={lesson.interactive.visual}
                    onAttempt={handleAttempt}
                  />
                ) : (
                  <LessonExercise
                    key={phase}
                    exercise={currentExercise}
                    hintLevel={HINT_LEVEL_MAP[phase]}
                    onAnswer={handleExerciseAnswer}
                    onAttempt={handleAttempt}
                  />
                )}
              </div>
            )}

          {/* Phase 5: Completion */}
          {phase === "completion" && (
            <LessonCompletion
              technique={lesson.technique}
              elapsedMinutes={elapsedMinutes}
              nextLessonSlug={nextLessonSlug}
              phaseAttempts={finalAttempts ?? undefined}
              onNextLesson={handleNextLesson}
              onPracticeMore={handlePracticeMore}
              onBackToLessons={handleBackToLessons}
            />
          )}
        </div>
      )}
    </div>
  );
}
