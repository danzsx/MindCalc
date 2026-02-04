"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { LessonProgressIndicator } from "./LessonProgressIndicator";
import { LessonIntro } from "./LessonIntro";
import { LessonExercise } from "./LessonExercise";
import { LessonCompletion } from "./LessonCompletion";
import { LessonPractice } from "./LessonPractice";
import { getExerciseForPhase, generatePracticeExercises } from "@/lib/lessons/engine";
import type { LessonContent, LessonPhase, HintLevel, LessonExerciseData } from "@/lib/lessons/types";

const PHASE_ORDER: LessonPhase[] = ["intro", "guided", "semi-guided", "free", "completion"];

const HINT_LEVEL_MAP: Record<string, HintLevel> = {
  guided: "full",
  "semi-guided": "partial",
  free: "none",
};

interface LessonShellProps {
  lesson: LessonContent;
  onComplete: () => void;
}

export function LessonShell({ lesson, onComplete }: LessonShellProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [showPractice, setShowPractice] = useState(false);
  const [practiceExercises, setPracticeExercises] = useState<LessonExerciseData[]>([]);

  const advancePhase = useCallback(() => {
    const currentIdx = PHASE_ORDER.indexOf(phase);
    const nextPhase = PHASE_ORDER[currentIdx + 1];
    if (nextPhase) {
      setPhase(nextPhase);
      if (nextPhase === "completion") {
        onComplete();
        toast.success("Aula concluída! Esse truque já é seu.");
      }
    }
  }, [phase, onComplete]);

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

  const handleDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  // Stable exercise reference per phase to avoid re-generation on re-renders
  const currentExercise = useMemo(() => {
    if (phase === "guided" || phase === "semi-guided" || phase === "free") {
      return getExerciseForPhase(lesson, phase);
    }
    return null;
  }, [lesson, phase]);

  // Practice mode
  if (showPractice) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Mais um pouco</h2>
              <p className="text-sm text-muted-foreground">
                5 exercícios sem dica — pra deixar o truque automático.
              </p>
            </div>
            <LessonPractice
              exercises={practiceExercises}
              technique={lesson.technique}
              onBack={handleBackFromPractice}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Progress indicator */}
      <div className="flex justify-center">
        <LessonProgressIndicator currentPhase={phase} />
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Phase 1: Intro */}
          {phase === "intro" && (
            <LessonIntro
              title={lesson.title}
              explanation={lesson.intro.explanation}
              example={lesson.intro.example}
              onContinue={advancePhase}
            />
          )}

          {/* Phases 2-4: Exercises */}
          {(phase === "guided" || phase === "semi-guided" || phase === "free") &&
            currentExercise && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">
                    {phase === "guided" && "Com dica completa"}
                    {phase === "semi-guided" && "Com uma pista"}
                    {phase === "free" && "Agora é com você"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {phase === "guided" && "Use a dica abaixo pra pensar junto."}
                    {phase === "semi-guided" &&
                      "A dica mostra só o começo — tente chegar no resultado."}
                    {phase === "free" &&
                      "Sem dicas dessa vez. Confia no que você aprendeu."}
                  </p>
                </div>
                <LessonExercise
                  key={phase}
                  exercise={currentExercise}
                  hintLevel={HINT_LEVEL_MAP[phase]}
                  onAnswer={handleExerciseAnswer}
                />
              </div>
            )}

          {/* Phase 5: Completion */}
          {phase === "completion" && (
            <LessonCompletion
              technique={lesson.technique}
              onPracticeMore={handlePracticeMore}
              onDashboard={handleDashboard}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
