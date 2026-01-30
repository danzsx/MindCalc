"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTrainingSession } from "@/hooks/useTrainingSession";
import { createClient } from "@/lib/supabase/client";
import { ExerciseCard } from "@/components/training/ExerciseCard";
import { Timer } from "@/components/training/Timer";
import { ProgressBar } from "@/components/training/ProgressBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const TOTAL_EXERCISES = 10;

export default function TrainPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    exercises,
    currentIndex,
    isLoading,
    isFinished,
    startSession,
    submitAnswer,
    finishSession,
  } = useTrainingSession();

  const [level, setLevel] = useState<number>(1);
  const [answer, setAnswer] = useState("");
  const [exerciseStartTime, setExerciseStartTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [started, setStarted] = useState(false);

  // Fetch user level on mount
  useEffect(() => {
    if (!user) return;

    const fetchLevel = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", user.id)
        .single();

      if (data) {
        setLevel(data.level);
      }
    };

    fetchLevel();
  }, [user]);

  // Start training session
  const handleStart = useCallback(async () => {
    if (!user) return;

    setError(null);
    try {
      await startSession(user.id, level);
      setStarted(true);
      setExerciseStartTime(Date.now());
    } catch {
      setError("Erro ao gerar exercícios. Tente novamente.");
    }
  }, [user, level, startSession]);

  // Auto-focus input when exercise changes
  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [started, currentIndex]);

  // Handle finishing the session
  useEffect(() => {
    if (!isFinished || isSaving || !user) return;

    const save = async () => {
      setIsSaving(true);
      try {
        const sessionId = await finishSession(user.id, level);
        router.push(`/results/${sessionId}`);
      } catch {
        setError("Erro ao salvar sessão. Tente novamente.");
        setIsSaving(false);
      }
    };

    save();
  }, [isFinished, isSaving, user, level, finishSession, router]);

  // Submit the current answer
  const handleSubmit = useCallback(() => {
    if (answer.trim() === "") return;

    const timeSpent = (Date.now() - exerciseStartTime) / 1000;
    const userAnswer = parseFloat(answer);

    submitAnswer(userAnswer, timeSpent);
    setAnswer("");
    setExerciseStartTime(Date.now());
  }, [answer, exerciseStartTime, submitAnswer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // ---------- Loading states ----------

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // ---------- Pre-start / Loading exercises ----------

  if (!started || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Treino Mental</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground">
                  Gerando exercícios personalizados...
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Você receberá {TOTAL_EXERCISES} exercícios adaptados ao seu
                  nível atual ({level}). Responda o mais rápido e corretamente
                  que puder.
                </p>
                <Button
                  onClick={handleStart}
                  className="w-full"
                  size="lg"
                >
                  Iniciar treino
                </Button>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Saving ----------

  if (isFinished || isSaving) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">
              Salvando resultados...
            </p>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Training in progress ----------

  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Treino</CardTitle>
            <Timer running={started && !isFinished} />
          </div>
          <ProgressBar current={currentIndex} total={TOTAL_EXERCISES} />
        </CardHeader>

        <CardContent className="space-y-6">
          <ExerciseCard
            operand1={exercise.operand1}
            operand2={exercise.operand2}
            operator={exercise.operator}
            current={currentIndex + 1}
            total={TOTAL_EXERCISES}
          />

          <div className="flex gap-3">
            <Input
              ref={inputRef}
              type="number"
              inputMode="decimal"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sua resposta"
              className="text-center text-lg"
              autoFocus
            />
            <Button
              onClick={handleSubmit}
              disabled={answer.trim() === ""}
            >
              Confirmar
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
