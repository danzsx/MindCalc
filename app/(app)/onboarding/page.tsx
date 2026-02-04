"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import type { Exercise, Operator } from "@/types";

// ---------------------------------------------------------------------------
// Exercise generation for the diagnostic test
// ---------------------------------------------------------------------------

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates the fixed sequence of 8 diagnostic exercises with progressive
 * difficulty: 2 addition, 2 subtraction, 2 multiplication, 2 division.
 * Each pair increases in difficulty (second exercise harder than first).
 */
function generateDiagnosticExercises(): Exercise[] {
  const exercises: Exercise[] = [];

  // --- 2 addition (easy → moderate) ---
  // #1: single-digit + teens  (e.g. 12 + 7)
  const a1a = randomInt(10, 20);
  const a1b = randomInt(3, 9);
  exercises.push({
    operand1: a1a,
    operand2: a1b,
    operator: "+",
    correctAnswer: a1a + a1b,
  });
  // #2: two-digit + two-digit  (e.g. 34 + 27)
  const a2a = randomInt(20, 49);
  const a2b = randomInt(15, 40);
  exercises.push({
    operand1: a2a,
    operand2: a2b,
    operator: "+",
    correctAnswer: a2a + a2b,
  });

  // --- 2 subtraction (moderate → harder) ---
  // #3: two-digit − single-digit  (e.g. 43 − 9)
  const s1a = randomInt(25, 49);
  const s1b = randomInt(5, 19);
  exercises.push({
    operand1: s1a,
    operand2: s1b,
    operator: "-",
    correctAnswer: s1a - s1b,
  });
  // #4: larger two-digit − two-digit  (e.g. 72 − 38)
  const s2a = randomInt(50, 90);
  const s2b = randomInt(15, s2a - 5);
  exercises.push({
    operand1: s2a,
    operand2: s2b,
    operator: "-",
    correctAnswer: s2a - s2b,
  });

  // --- 2 multiplication (times table → larger) ---
  // #5: basic times table  (e.g. 7 × 8)
  const m1a = randomInt(4, 9);
  const m1b = randomInt(3, 9);
  exercises.push({
    operand1: m1a,
    operand2: m1b,
    operator: "*",
    correctAnswer: m1a * m1b,
  });
  // #6: two-digit × single-digit  (e.g. 12 × 6)
  const m2a = randomInt(10, 15);
  const m2b = randomInt(4, 9);
  exercises.push({
    operand1: m2a,
    operand2: m2b,
    operator: "*",
    correctAnswer: m2a * m2b,
  });

  // --- 2 division (exact integer results) ---
  // #7: basic division  (e.g. 48 ÷ 6)
  const d1b = randomInt(3, 8);
  const d1q = randomInt(4, 9);
  exercises.push({
    operand1: d1b * d1q,
    operand2: d1b,
    operator: "/",
    correctAnswer: d1q,
  });
  // #8: larger division  (e.g. 96 ÷ 8)
  const d2b = randomInt(5, 12);
  const d2q = randomInt(6, 14);
  exercises.push({
    operand1: d2b * d2q,
    operand2: d2b,
    operator: "/",
    correctAnswer: d2q,
  });

  return exercises;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TOTAL_EXERCISES = 8;

const operatorSymbol: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

function operationLabel(index: number): string {
  if (index < 2) return "Soma";
  if (index < 4) return "Subtração";
  if (index < 6) return "Multiplicação";
  return "Divisão";
}

interface ExerciseResult {
  userAnswer: number;
  correctAnswer: number;
  timeSpent: number; // seconds
  isCorrect: boolean;
}

type Phase = "intro" | "test" | "saving";

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [exerciseStartTime, setExerciseStartTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Generate exercises once on mount
  useEffect(() => {
    setExercises(generateDiagnosticExercises());
  }, []);

  // Auto-focus input when a new exercise is shown
  useEffect(() => {
    if (phase === "test" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentIndex]);

  // ------- Actions -------

  const startTest = useCallback(() => {
    setPhase("test");
    setCurrentIndex(0);
    setResults([]);
    setAnswer("");
    setError(null);
    setExerciseStartTime(Date.now());
  }, []);

  const saveAndRedirect = useCallback(
    async (allResults: ExerciseResult[]) => {
      setPhase("saving");

      try {
        // Determine a base level from progressive difficulty performance.
        // Each pair of exercises represents a harder tier.
        // Getting at least 1 right per pair bumps the base level.
        let baseLevel = 1;
        const pairs = [
          allResults.slice(0, 2), // addition
          allResults.slice(2, 4), // subtraction
          allResults.slice(4, 6), // multiplication
          allResults.slice(6, 8), // division
        ];
        for (const pair of pairs) {
          if (pair.filter((r) => r.isCorrect).length >= 1) {
            baseLevel++;
          }
        }

        // Transform results to the format expected by the API
        const answers = allResults.map((r) => r.userAnswer);
        const times = allResults.map((r) => r.timeSpent);

        // Persist via the server-side API (handles session, exercise logs,
        // level calculation, streak, and profile update)
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user!.id,
            exercises,
            answers,
            times,
            level: baseLevel,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao salvar resultado.");
        }

        router.push("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao salvar resultado."
        );
        setPhase("test");
      }
    },
    [user, exercises, router]
  );

  const submitAnswer = useCallback(() => {
    if (answer.trim() === "") return;

    const timeSpent = (Date.now() - exerciseStartTime) / 1000;
    const userAnswer = parseFloat(answer);
    const exercise = exercises[currentIndex];
    const isCorrect = userAnswer === exercise.correctAnswer;

    const result: ExerciseResult = {
      userAnswer,
      correctAnswer: exercise.correctAnswer,
      timeSpent,
      isCorrect,
    };

    const newResults = [...results, result];
    setResults(newResults);
    setAnswer("");

    if (currentIndex + 1 >= exercises.length) {
      saveAndRedirect(newResults);
    } else {
      setCurrentIndex(currentIndex + 1);
      setExerciseStartTime(Date.now());
    }
  }, [
    answer,
    currentIndex,
    exercises,
    exerciseStartTime,
    results,
    saveAndRedirect,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitAnswer();
      }
    },
    [submitAnswer]
  );

  // ------- Render -------

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // ---------- Intro ----------
  if (phase === "intro") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[20px] bg-card p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Brain className="size-7 text-primary" />
          </div>
          <h1 className="text-foreground">Vamos nos conhecer</h1>
          <p className="mt-2 text-muted-foreground">
            Antes de tudo, quero entender como você pensa com números.
            São {TOTAL_EXERCISES} contas rápidas, sem pressão.
          </p>

          <div className="mt-6 space-y-2 text-left">
            {[
              "2 de somar",
              "2 de diminuir",
              "2 de multiplicar",
              "2 de dividir",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="size-1.5 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Com isso, vou montar um treino que faz sentido pra você.
          </p>

          <Button
            onClick={startTest}
            className="mt-6 w-full min-h-[56px]"
            size="xl"
          >
            Bora começar
          </Button>
        </div>
      </div>
    );
  }

  // ---------- Saving ----------
  if (phase === "saving") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[20px] bg-card p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">
            Preparando seu treino...
          </p>
        </div>
      </div>
    );
  }

  // ---------- Test ----------
  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  const progress = (currentIndex / TOTAL_EXERCISES) * 100;

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[20px] bg-card p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {currentIndex + 1} / {TOTAL_EXERCISES}
          </p>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {operationLabel(currentIndex)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-primary/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Exercise display */}
        <div className="flex items-center justify-center gap-4 py-10 text-4xl font-bold tracking-wide lg:text-5xl">
          <span className="text-foreground">{exercise.operand1}</span>
          <span className="text-primary">
            {operatorSymbol[exercise.operator]}
          </span>
          <span className="text-foreground">{exercise.operand2}</span>
          <span className="text-muted-foreground">=</span>
          <span className="text-muted-foreground">?</span>
        </div>

        {/* Answer input + confirm */}
        <div className="space-y-3">
          <Input
            ref={inputRef}
            type="number"
            inputMode="decimal"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Sua resposta"
            className="w-full rounded-xl border-2 border-primary/30 bg-muted text-center text-lg focus:border-primary"
            autoFocus
          />
          <Button
            onClick={submitAnswer}
            disabled={answer.trim() === ""}
            className="w-full min-h-[56px]"
            size="xl"
          >
            Essa é minha resposta
          </Button>
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
