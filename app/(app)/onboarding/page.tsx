"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Minus, X, Divide, ArrowRight, Sparkles } from "lucide-react";
import type { Exercise, Operator } from "@/types";

// ---------------------------------------------------------------------------
// Exercise generation for the diagnostic test
// ---------------------------------------------------------------------------

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDiagnosticExercises(): Exercise[] {
  const exercises: Exercise[] = [];

  const a1a = randomInt(10, 20);
  const a1b = randomInt(3, 9);
  exercises.push({ operand1: a1a, operand2: a1b, operator: "+", correctAnswer: a1a + a1b });

  const a2a = randomInt(20, 49);
  const a2b = randomInt(15, 40);
  exercises.push({ operand1: a2a, operand2: a2b, operator: "+", correctAnswer: a2a + a2b });

  const s1a = randomInt(25, 49);
  const s1b = randomInt(5, 19);
  exercises.push({ operand1: s1a, operand2: s1b, operator: "-", correctAnswer: s1a - s1b });

  const s2a = randomInt(50, 90);
  const s2b = randomInt(15, s2a - 5);
  exercises.push({ operand1: s2a, operand2: s2b, operator: "-", correctAnswer: s2a - s2b });

  const m1a = randomInt(4, 9);
  const m1b = randomInt(3, 9);
  exercises.push({ operand1: m1a, operand2: m1b, operator: "*", correctAnswer: m1a * m1b });

  const m2a = randomInt(10, 15);
  const m2b = randomInt(4, 9);
  exercises.push({ operand1: m2a, operand2: m2b, operator: "*", correctAnswer: m2a * m2b });

  const d1b = randomInt(3, 8);
  const d1q = randomInt(4, 9);
  exercises.push({ operand1: d1b * d1q, operand2: d1b, operator: "/", correctAnswer: d1q });

  const d2b = randomInt(5, 12);
  const d2q = randomInt(6, 14);
  exercises.push({ operand1: d2b * d2q, operand2: d2b, operator: "/", correctAnswer: d2q });

  return exercises;
}

// ---------------------------------------------------------------------------
// Design tokens per operator — Numetria palette
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

// Numetria operator color remapping
const operatorColors: Record<Operator, { bg: string; border: string; text: string; label: string }> = {
  "+": {
    bg: "rgba(55, 112, 191, 0.15)",
    border: "rgba(55, 112, 191, 0.3)",
    text: "#8dc2ff",
    label: "Soma",
  },
  "-": {
    bg: "rgba(141, 194, 255, 0.1)",
    border: "rgba(141, 194, 255, 0.25)",
    text: "#8dc2ff",
    label: "Subtração",
  },
  "*": {
    bg: "rgba(206, 242, 109, 0.1)",
    border: "rgba(206, 242, 109, 0.25)",
    text: "#cef26d",
    label: "Multiplicação",
  },
  "/": {
    bg: "rgba(168, 204, 71, 0.1)",
    border: "rgba(168, 204, 71, 0.25)",
    text: "#a8cc47",
    label: "Divisão",
  },
};

function indexOperator(index: number): Operator {
  if (index < 2) return "+";
  if (index < 4) return "-";
  if (index < 6) return "*";
  return "/";
}

// Intro items for the "what to expect" grid
const introItems = [
  { icon: Plus, label: "2 de somar", op: "+" as Operator },
  { icon: Minus, label: "2 de diminuir", op: "-" as Operator },
  { icon: X, label: "2 de multiplicar", op: "*" as Operator },
  { icon: Divide, label: "2 de dividir", op: "/" as Operator },
];

interface ExerciseResult {
  userAnswer: number;
  correctAnswer: number;
  timeSpent: number;
  isCorrect: boolean;
}

type Phase = "intro" | "test" | "saving";

// ---------------------------------------------------------------------------
// Shared glass card style
// ---------------------------------------------------------------------------

const glassCard = {
  background: "rgba(13, 29, 58, 0.75)",
  border: "1px solid rgba(141, 194, 255, 0.12)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
} as const;

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

  useEffect(() => {
    setExercises(generateDiagnosticExercises());
  }, []);

  useEffect(() => {
    if (phase === "test" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentIndex]);

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
          if (pair.filter((r) => r.isCorrect).length >= 1) baseLevel++;
        }

        const answers = allResults.map((r) => r.userAnswer);
        const times = allResults.map((r) => r.timeSpent);

        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user!.id, exercises, answers, times, level: baseLevel }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao salvar resultado.");
        }

        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar resultado.");
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

    const result: ExerciseResult = { userAnswer, correctAnswer: exercise.correctAnswer, timeSpent, isCorrect };
    const newResults = [...results, result];
    setResults(newResults);
    setAnswer("");

    if (currentIndex + 1 >= exercises.length) {
      saveAndRedirect(newResults);
    } else {
      setCurrentIndex(currentIndex + 1);
      setExerciseStartTime(Date.now());
    }
  }, [answer, currentIndex, exercises, exerciseStartTime, results, saveAndRedirect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitAnswer();
      }
    },
    [submitAnswer]
  );

  // ── Auth loading ──
  if (authLoading) {
    return (
      <div
        className="flex min-h-[100dvh] items-center justify-center"
        style={{ background: "#080f1e" }}
      >
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: "rgba(55, 112, 191, 0.3)", borderTopColor: "transparent" }}
        >
          <div
            className="absolute inset-0 rounded-full border-[3px] border-t-transparent animate-spin"
            style={{ borderColor: "#3770bf", borderTopColor: "transparent", animationDuration: "0.6s" }}
          />
        </div>
      </div>
    );
  }

  // ── Intro ──
  if (phase === "intro") {
    return (
      <div
        className="flex min-h-[100dvh] items-center justify-center p-4"
        style={{ background: "#080f1e" }}
      >
        {/* Ambient glow */}
        <div
          className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none -z-0"
          style={{
            background: "radial-gradient(circle, rgba(55, 112, 191, 0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="rounded-[32px] p-8 md:p-10 text-center" style={glassCard}>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
              className="mx-auto mb-7 inline-flex items-center justify-center rounded-2xl p-4"
              style={{
                background: "rgba(55, 112, 191, 0.15)",
                border: "1px solid rgba(55, 112, 191, 0.3)",
              }}
            >
              <Sparkles className="size-10" style={{ color: "#8dc2ff" }} />
            </motion.div>

            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
            >
              Vamos nos conhecer
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "#6b89b4" }}>
              Antes de tudo, quero entender como você pensa com números.
              São{" "}
              <span className="font-semibold" style={{ color: "#a8c0e0" }}>
                {TOTAL_EXERCISES} contas rápidas
              </span>
              , sem pressão.
            </p>

            {/* Operation grid */}
            <div className="grid grid-cols-2 gap-3 text-left mb-8">
              {introItems.map((item, i) => {
                const Icon = item.icon;
                const colors = operatorColors[item.op];
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    <div
                      className="p-1.5 rounded-lg shrink-0"
                      style={{ background: "rgba(8, 15, 30, 0.5)" }}
                    >
                      <Icon className="size-4" style={{ color: colors.text }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: colors.text }}>
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <p className="text-sm mb-8" style={{ color: "#3d5a80" }}>
              Com isso, vou montar um treino que faz sentido pra você.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(206, 242, 109, 0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={startTest}
                className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                style={{ background: "#cef26d", color: "#080f1e" }}
              >
                Bora começar
                <ArrowRight className="size-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Saving ──
  if (phase === "saving") {
    return (
      <div
        className="flex min-h-[100dvh] items-center justify-center p-4"
        style={{ background: "#080f1e" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <div className="rounded-[32px] p-10" style={glassCard}>
            {/* Circular spinner */}
            <div className="relative mx-auto w-14 h-14 mb-7">
              <div
                className="absolute inset-0 rounded-full border-[3px]"
                style={{ borderColor: "rgba(55, 112, 191, 0.2)" }}
              />
              <div
                className="absolute inset-0 rounded-full border-[3px] border-t-transparent animate-spin"
                style={{ borderColor: "#3770bf", borderTopColor: "transparent" }}
              />
              <div
                className="absolute inset-[6px] rounded-full border-[2px] border-t-transparent animate-spin"
                style={{
                  borderColor: "#cef26d",
                  borderTopColor: "transparent",
                  animationDirection: "reverse",
                  animationDuration: "0.8s",
                }}
              />
            </div>

            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
            >
              Analisando suas respostas...
            </h2>
            <p className="text-sm" style={{ color: "#6b89b4" }}>
              Preparando seu plano de treino personalizado.
            </p>

            <div className="mt-7 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#3770bf" }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Test ──
  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  const progress = (currentIndex / TOTAL_EXERCISES) * 100;
  const currentOp = indexOperator(currentIndex);
  const opColors = operatorColors[currentOp];
  const OpIcon = operatorIcon[currentOp];

  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center p-4"
      style={{ background: "#080f1e" }}
    >
      {/* Ambient operator glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, ${opColors.bg.replace("0.1", "0.06").replace("0.15", "0.06")} 0%, transparent 60%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="rounded-[32px] p-8 md:p-10" style={glassCard}>

          {/* Header row */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ background: opColors.bg, border: `1px solid ${opColors.border}` }}
              >
                <OpIcon className="size-5" style={{ color: opColors.text }} />
              </div>
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "#6b89b4" }}
              >
                {currentIndex + 1} / {TOTAL_EXERCISES}
              </p>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: opColors.bg, border: `1px solid ${opColors.border}`, color: opColors.text }}
            >
              {opColors.label}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 w-full overflow-hidden rounded-full mb-10"
            style={{ background: "rgba(141, 194, 255, 0.08)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: opColors.text }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mb-10">
            {Array.from({ length: TOTAL_EXERCISES }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex ? "20px" : "6px",
                  height: "6px",
                  background:
                    i < currentIndex
                      ? opColors.text
                      : i === currentIndex
                      ? opColors.text
                      : "rgba(141, 194, 255, 0.12)",
                  opacity: i < currentIndex ? 0.5 : 1,
                }}
              />
            ))}
          </div>

          {/* Exercise display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center gap-4 py-6 text-5xl md:text-6xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-family-display)", color: "#f0f4ff" }}
            >
              <span>{exercise.operand1}</span>
              <span style={{ color: opColors.text }}>{operatorSymbol[exercise.operator]}</span>
              <span>{exercise.operand2}</span>
              <span style={{ color: "rgba(141, 194, 255, 0.2)" }}>=</span>
              <span style={{ color: "rgba(141, 194, 255, 0.15)" }}>?</span>
            </motion.div>
          </AnimatePresence>

          {/* Answer input */}
          <div className="space-y-3 mt-2">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua resposta..."
              className="w-full h-20 rounded-2xl text-center text-3xl font-bold placeholder:text-sm outline-none transition-all duration-300"
              style={{
                background: "rgba(8, 15, 30, 0.6)",
                border: `2px solid ${answer.trim() ? opColors.border : "rgba(141, 194, 255, 0.1)"}`,
                color: "#f0f4ff",
                caretColor: opColors.text,
                fontFamily: "var(--font-family-display)",
              }}
              autoFocus
            />

            <motion.button
              whileHover={
                answer.trim()
                  ? { scale: 1.02, boxShadow: "0 8px 32px rgba(206, 242, 109, 0.3)" }
                  : {}
              }
              whileTap={answer.trim() ? { scale: 0.97 } : {}}
              onClick={submitAnswer}
              disabled={answer.trim() === ""}
              className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{
                background: answer.trim() ? "#cef26d" : "rgba(206, 242, 109, 0.06)",
                color: answer.trim() ? "#080f1e" : "#2a4060",
                border: answer.trim() ? "none" : "1px solid rgba(206, 242, 109, 0.1)",
              }}
            >
              Responder
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl text-sm font-medium text-center"
              style={{
                background: "rgba(141, 194, 255, 0.06)",
                border: "1px solid rgba(141, 194, 255, 0.15)",
                color: "#8dc2ff",
              }}
            >
              {error}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
