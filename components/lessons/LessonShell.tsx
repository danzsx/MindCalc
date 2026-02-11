"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
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
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h2 className="text-section-title">Mais um pouco</h2>
          <p className="text-body-primary text-muted-foreground">
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
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header: Back button + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToLessons}
          className="shrink-0"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline ml-1">Aulas</span>
        </Button>
        <h1 className="text-section-title truncate flex-1">
          {lesson.title}
        </h1>
      </div>

      {/* Progress stepper */}
      <LessonProgressIndicator currentPhase={phase} />

      {/* Interstitial message */}
      {interstitialMsg && (
        <div className="flex items-center justify-center py-8 lesson-phase-enter">
          <p className="text-body-emphasis text-muted-foreground text-center">
            {interstitialMsg}
          </p>
        </div>
      )}

      {/* Phase content */}
      {!interstitialMsg && (
        <div className={isTransitioning ? "lesson-phase-exit" : "lesson-phase-enter"}>
          {/* Phase 1: Intro */}
          {phase === "intro" && (
            lesson.interactive?.type === "round-to-ten" ? (
              <InteractiveLessonIntro
                title={lesson.title}
                operand1={lesson.interactive.introOperand1}
                operand2={lesson.interactive.introOperand2}
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
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-section-title">
                    {PHASE_TITLES[phase]}
                  </h2>
                  <p className="text-body-primary text-muted-foreground">
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
                {lesson.interactive?.type === "round-to-ten" ? (
                  <InteractiveExercise
                    key={phase}
                    exercise={currentExercise}
                    hintLevel={HINT_LEVEL_MAP[phase]}
                    onAnswer={handleExerciseAnswer}
                  />
                ) : lesson.interactive?.type === "step-discovery" && lesson.interactive.buildExerciseSteps ? (
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
