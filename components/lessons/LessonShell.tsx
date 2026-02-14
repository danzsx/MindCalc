"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { LessonContent, LessonPhase, HintLevel, LessonExerciseData } from "@/lib/lessons/types";

const PHASE_ORDER: LessonPhase[] = ["intro", "guided", "semi-guided", "free", "completion"];

const HINT_LEVEL_MAP: Record<string, HintLevel> = {
  guided: "full",
  "semi-guided": "partial",
  free: "none",
};

const PHASE_TITLES: Record<string, string> = {
  guided: "Com dica completa",
  "semi-guided": "Com uma pista",
  free: "Agora e com voce",
};

const PHASE_INTERSTICIAL: Record<string, string> = {
  guided: "Agora vamos tentar juntos...",
  "semi-guided": "Dessa vez com menos ajuda...",
  free: "Confia no que voce aprendeu!",
  completion: "Parabens!",
};

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
  const startTimeRef = useRef<number>(Date.now());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const completeIfNeeded = useCallback((p: LessonPhase) => {
    if (p === "completion") {
      const mins = Math.round((Date.now() - startTimeRef.current) / 60000);
      setElapsedMinutes(mins);
      onComplete();
      toast.success("Aula concluida! Esse truque ja e seu.");
    }
  }, [onComplete]);

  const advancePhase = useCallback(() => {
    const currentIdx = PHASE_ORDER.indexOf(phase);
    const nextPhase = PHASE_ORDER[currentIdx + 1];
    if (!nextPhase) return;

    // Show interstitial message for non-completion phases
    const msg = PHASE_INTERSTICIAL[nextPhase];
    if (msg && nextPhase !== "completion") {
      setIsTransitioning(true);
      setInterstitialMsg(msg);
      setTimeout(() => {
        setInterstitialMsg(null);
        setPhase(nextPhase);
        setIsTransitioning(false);
      }, 800);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setPhase(nextPhase);
        setIsTransitioning(false);
        completeIfNeeded(nextPhase);
      }, 300);
    }
  }, [phase, completeIfNeeded]);

  const handleExerciseAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        advancePhase();
      }
    },
    [advancePhase]
  );

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

  // Stable exercise reference per phase
  const currentExercise = useMemo(() => {
    if (phase === "guided" || phase === "semi-guided" || phase === "free") {
      return getExerciseForPhase(lesson, phase);
    }
    return null;
  }, [lesson, phase]);

  // Practice mode
  if (showPractice) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-0">
        {/* Practice header */}
        <div className="space-y-2">
          <h2 className="font-[var(--font-family-display)] text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent">
            Mais um pouco
          </h2>
          <p className="text-sm text-white/60">
            5 exercicios sem dica — pra deixar o truque automatico.
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
    <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-0">
      {/* Header: Back button + lesson info */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackToLessons}
          className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-[var(--font-family-display)] text-xl sm:text-2xl font-bold text-white truncate">
            {lesson.title}
          </h1>
          <p className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
            <BookOpen className="size-3" />
            <span>Aula interativa</span>
            <span className="text-white/20">•</span>
            <Clock className="size-3" />
            <span>~5 minutos</span>
          </p>
        </div>
      </div>

      {/* Progress stepper */}
      <LessonProgressIndicator currentPhase={phase} />

      {/* Interstitial message */}
      {interstitialMsg && (
        <div className="flex items-center justify-center py-10 lesson-phase-enter">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-6">
              <p className="text-lg font-medium text-white/80 text-center">
                {interstitialMsg}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Phase content */}
      {!interstitialMsg && (
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

          {/* Phases 2-4: Exercises */}
          {(phase === "guided" || phase === "semi-guided" || phase === "free") &&
            currentExercise && (
              <div className="space-y-5">
                {/* Phase title card */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-lg" />
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                    <h2 className="font-[var(--font-family-display)] text-xl sm:text-2xl font-bold text-white mb-1">
                      {PHASE_TITLES[phase]}
                    </h2>
                    <p className="text-sm text-white/50">
                      {phase === "guided" && (
                        lesson.interactive
                          ? "Siga os passos — voce ja sabe o caminho."
                          : "Use a dica abaixo pra pensar junto."
                      )}
                      {phase === "semi-guided" && (
                        lesson.interactive
                          ? "Menos ajuda dessa vez — o truque ja e seu."
                          : "A dica mostra so o comeco — tente chegar no resultado."
                      )}
                      {phase === "free" && (
                        "Sem dicas dessa vez. Confia no que voce aprendeu."
                      )}
                    </p>
                  </div>
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
                  />
                ) : (
                  <LessonExercise
                    key={phase}
                    exercise={currentExercise}
                    hintLevel={HINT_LEVEL_MAP[phase]}
                    onAnswer={handleExerciseAnswer}
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
