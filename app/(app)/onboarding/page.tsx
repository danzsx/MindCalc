"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // ---------- Intro ----------
  if (phase === "intro") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Teste Diagn&oacute;stico</CardTitle>
            <CardDescription>
              Vamos avaliar seu n&iacute;vel de c&aacute;lculo mental com{" "}
              {TOTAL_EXERCISES} exerc&iacute;cios r&aacute;pidos. Responda o
              mais r&aacute;pido e corretamente que puder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>2 exerc&iacute;cios de soma</li>
              <li>2 exerc&iacute;cios de subtra&ccedil;&atilde;o</li>
              <li>2 exerc&iacute;cios de multiplica&ccedil;&atilde;o</li>
              <li>2 exerc&iacute;cios de divis&atilde;o</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              O resultado definir&aacute; seu n&iacute;vel inicial (1&ndash;10)
              para treinos personalizados.
            </p>
            <Button onClick={startTest} className="w-full" size="lg">
              Come&ccedil;ar teste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Saving ----------
  if (phase === "saving") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">
              Calculando seu n&iacute;vel...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Test ----------
  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  const progress = (currentIndex / TOTAL_EXERCISES) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Exerc&iacute;cio {currentIndex + 1} de {TOTAL_EXERCISES}
            </CardTitle>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {operationLabel(currentIndex)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Exercise display */}
          <div className="flex items-center justify-center gap-4 py-8 text-5xl font-bold tracking-wide">
            <span>{exercise.operand1}</span>
            <span className="text-primary">
              {operatorSymbol[exercise.operator]}
            </span>
            <span>{exercise.operand2}</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-muted-foreground">?</span>
          </div>

          {/* Answer input + confirm */}
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
              onClick={submitAnswer}
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
