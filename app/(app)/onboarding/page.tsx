"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Sparkles, ArrowRight, Plus, Minus, X, Divide } from "lucide-react";
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
  const a1a = randomInt(10, 20);
  const a1b = randomInt(3, 9);
  exercises.push({
    operand1: a1a,
    operand2: a1b,
    operator: "+",
    correctAnswer: a1a + a1b,
  });
  const a2a = randomInt(20, 49);
  const a2b = randomInt(15, 40);
  exercises.push({
    operand1: a2a,
    operand2: a2b,
    operator: "+",
    correctAnswer: a2a + a2b,
  });

  // --- 2 subtraction (moderate → harder) ---
  const s1a = randomInt(25, 49);
  const s1b = randomInt(5, 19);
  exercises.push({
    operand1: s1a,
    operand2: s1b,
    operator: "-",
    correctAnswer: s1a - s1b,
  });
  const s2a = randomInt(50, 90);
  const s2b = randomInt(15, s2a - 5);
  exercises.push({
    operand1: s2a,
    operand2: s2b,
    operator: "-",
    correctAnswer: s2a - s2b,
  });

  // --- 2 multiplication (times table → larger) ---
  const m1a = randomInt(4, 9);
  const m1b = randomInt(3, 9);
  exercises.push({
    operand1: m1a,
    operand2: m1b,
    operator: "*",
    correctAnswer: m1a * m1b,
  });
  const m2a = randomInt(10, 15);
  const m2b = randomInt(4, 9);
  exercises.push({
    operand1: m2a,
    operand2: m2b,
    operator: "*",
    correctAnswer: m2a * m2b,
  });

  // --- 2 division (exact integer results) ---
  const d1b = randomInt(3, 8);
  const d1q = randomInt(4, 9);
  exercises.push({
    operand1: d1b * d1q,
    operand2: d1b,
    operator: "/",
    correctAnswer: d1q,
  });
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

const operatorIcon: Record<Operator, typeof Plus> = {
  "+": Plus,
  "-": Minus,
  "*": X,
  "/": Divide,
};

const operatorGradient: Record<Operator, string> = {
  "+": "from-emerald-500 to-teal-500",
  "-": "from-orange-500 to-red-500",
  "*": "from-blue-500 to-purple-500",
  "/": "from-yellow-500 to-orange-500",
};

function operationLabel(index: number): string {
  if (index < 2) return "Soma";
  if (index < 4) return "Subtração";
  if (index < 6) return "Multiplicação";
  return "Divisão";
}

function operationGradient(index: number): string {
  if (index < 2) return "from-emerald-500 to-teal-500";
  if (index < 4) return "from-orange-500 to-red-500";
  if (index < 6) return "from-blue-500 to-purple-500";
  return "from-yellow-500 to-orange-500";
}

interface ExerciseResult {
  userAnswer: number;
  correctAnswer: number;
  timeSpent: number;
  isCorrect: boolean;
}

type Phase = "intro" | "test" | "saving";

// ---------------------------------------------------------------------------
// Intro items
// ---------------------------------------------------------------------------

const introItems = [
  { icon: Plus, label: "2 de somar", gradient: "from-emerald-500 to-teal-500" },
  { icon: Minus, label: "2 de diminuir", gradient: "from-orange-500 to-red-500" },
  { icon: X, label: "2 de multiplicar", gradient: "from-blue-500 to-purple-500" },
  { icon: Divide, label: "2 de dividir", gradient: "from-yellow-500 to-orange-500" },
];

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
        let baseLevel = 1;
        const pairs = [
          allResults.slice(0, 2),
          allResults.slice(2, 4),
          allResults.slice(4, 6),
          allResults.slice(6, 8),
        ];
        for (const pair of pairs) {
          if (pair.filter((r) => r.isCorrect).length >= 1) {
            baseLevel++;
          }
        }

        const answers = allResults.map((r) => r.userAnswer);
        const times = allResults.map((r) => r.timeSpent);

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  // ---------- Intro ----------
  if (phase === "intro") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group w-full max-w-md"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />

          {/* Card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-5 inline-flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl"
            >
              <Brain className="size-8 text-white" />
            </motion.div>

            <h1
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Vamos nos conhecer
            </h1>
            <p className="mt-3 text-white/60">
              Antes de tudo, quero entender como você pensa com números.
              São {TOTAL_EXERCISES} contas rápidas, sem pressão.
            </p>

            <div className="mt-6 space-y-3 text-left">
              {introItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`bg-gradient-to-br ${item.gradient} p-1.5 rounded-lg`}>
                      <Icon className="size-3.5 text-white" />
                    </div>
                    <span className="text-sm text-white/70">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-5 text-sm text-white/50">
              Com isso, vou montar um treino que faz sentido pra você.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={startTest}
                className="mt-6 w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 group/btn"
              >
                Bora começar
                <ArrowRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Saving ----------
  if (phase === "saving") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group w-full max-w-md"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
            <p className="mt-4 text-white/60">
              Preparando seu treino...
            </p>
            <div className="mt-3 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-teal-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Test ----------
  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  const progress = (currentIndex / TOTAL_EXERCISES) * 100;
  const currentGradient = operationGradient(currentIndex);
  const OpIcon = operatorIcon[exercise.operator];

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group w-full max-w-md"
      >
        {/* Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} rounded-3xl opacity-10 blur-2xl group-hover:opacity-15 transition-opacity duration-500`} />

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`bg-gradient-to-br ${currentGradient} p-1.5 rounded-lg`}>
                <OpIcon className="size-3.5 text-white" />
              </div>
              <p className="text-sm font-medium text-white/80">
                {currentIndex + 1} / {TOTAL_EXERCISES}
              </p>
            </div>
            <span className={`rounded-full bg-gradient-to-r ${currentGradient} px-3 py-1 text-xs font-medium text-white`}>
              {operationLabel(currentIndex)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5 mb-8">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${currentGradient} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>

          {/* Exercise display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-4 py-8 text-4xl md:text-5xl font-bold tracking-wide"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              <span className="text-white">{exercise.operand1}</span>
              <span className={`bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}>
                {operatorSymbol[exercise.operator]}
              </span>
              <span className="text-white">{exercise.operand2}</span>
              <span className="text-white/30">=</span>
              <span className="text-white/30">?</span>
            </motion.div>
          </AnimatePresence>

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
              className="w-full rounded-2xl border-2 border-white/10 bg-white/5 text-center text-lg text-white placeholder:text-white/30 focus:border-teal-500/50 backdrop-blur-sm"
              autoFocus
            />
            <button
              onClick={submitAnswer}
              disabled={answer.trim() === ""}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Essa é minha resposta
              <Sparkles className="size-5" />
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      </motion.div>
    </div>
  );
}
