"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTrainingSession } from "@/hooks/useTrainingSession";
import { createClient } from "@/lib/supabase/client";
import { identifyWeakOperations, getStandardTime } from "@/lib/engine";
import type { Operator, TrainingMode } from "@/types";
import { ExerciseCard } from "@/components/training/ExerciseCard";
import { Timer } from "@/components/training/Timer";
import { CountdownTimer } from "@/components/training/CountdownTimer";
import { ProgressBar } from "@/components/training/ProgressBar";
import { X, Lock, Clock, Smile, Zap, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

const TOTAL_EXERCISES = 10;

export default function TrainPage() {
  const router = useRouter();
  const { user, loading: authLoading, plan } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    exercises,
    currentIndex,
    isFinished,
    mode: sessionMode,
    startSession,
    submitAnswer,
    forceFinish,
    finishSession,
  } = useTrainingSession();

  const [level, setLevel] = useState<number>(1);
  const [weakOperations, setWeakOperations] = useState<Operator[]>([]);
  const [learnedTechniques, setLearnedTechniques] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [exerciseStartTime, setExerciseStartTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [started, setStarted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [selectedMode, setSelectedMode] = useState<TrainingMode>("normal");

  // Timed mode: session-level countdown
  const questionTime = getStandardTime(level);
  const sessionTotalTime = questionTime * TOTAL_EXERCISES;
  const [sessionTimeLeft, setSessionTimeLeft] = useState(sessionTotalTime);

  // Fetch user level and weak operations on mount
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const supabase = createClient();

      const [{ data: profileData }, { data: errorLogs }, { data: techniquesData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("level")
          .eq("id", user.id)
          .single(),
        supabase
          .from("exercise_logs")
          .select("operator")
          .eq("user_id", user.id)
          .eq("is_correct", false)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("learned_techniques")
          .select("lessons(slug)")
          .eq("user_id", user.id),
      ]);

      if (profileData) {
        setLevel(profileData.level);
      }

      if (errorLogs) {
        setWeakOperations(identifyWeakOperations(errorLogs));
      }

      if (techniquesData) {
        const slugs = techniquesData
          .map((t: Record<string, unknown>) => {
            const lesson = t.lessons as { slug: string } | null;
            return lesson?.slug;
          })
          .filter((s): s is string => Boolean(s));
        setLearnedTechniques(slugs);
      }

      // Check daily session limit
      try {
        const res = await fetch("/api/sessions/check");
        const data = await res.json();
        if (!data.canTrain) {
          setIsBlocked(true);
        }
      } catch {
        // If check fails, allow training (fail open)
      } finally {
        setCheckingLimit(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Session-level countdown for timed mode
  useEffect(() => {
    if (!started || isFinished || sessionMode !== "timed") return;

    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0) {
          clearInterval(interval);
          forceFinish();
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [started, isFinished, sessionMode, forceFinish]);

  // Start training session
  const handleStart = useCallback(() => {
    if (!user) return;

    setError(null);
    const qTime = getStandardTime(level);
    setSessionTimeLeft(qTime * TOTAL_EXERCISES);
    startSession(level, weakOperations, learnedTechniques, selectedMode);
    setStarted(true);
    setExerciseStartTime(Date.now());
  }, [user, level, weakOperations, learnedTechniques, selectedMode, startSession]);

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
        toast.success("Sessao salva com sucesso!");
        router.push(`/results/${sessionId}`);
      } catch {
        toast.error("Erro ao salvar sessao. Tente novamente.");
        setError("Erro ao salvar sessão. Tente novamente.");
        setIsSaving(false);
      }
    };

    save();
  }, [isFinished, isSaving, user, level, finishSession, router]);

  // Handle countdown expiration for a single question (timed mode)
  const handleQuestionExpire = useCallback(() => {
    const timeSpent = questionTime;
    submitAnswer(null, timeSpent, true);
    setAnswer("");
    setExerciseStartTime(Date.now());
  }, [questionTime, submitAnswer]);

  // Submit the current answer
  const handleSubmit = useCallback(() => {
    if (answer.trim() === "") return;

    const timeSpent = (Date.now() - exerciseStartTime) / 1000;
    const userAnswer = parseFloat(answer);

    // Shake animation on wrong answer
    const ex = exercises[currentIndex];
    if (ex) {
      let correctAnswer = 0;
      switch (ex.operator) {
        case "+": correctAnswer = ex.operand1 + ex.operand2; break;
        case "-": correctAnswer = ex.operand1 - ex.operand2; break;
        case "*": correctAnswer = ex.operand1 * ex.operand2; break;
        case "/": correctAnswer = ex.operand1 / ex.operand2; break;
      }
      if (userAnswer !== correctAnswer) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }

    submitAnswer(userAnswer, timeSpent);
    setAnswer("");
    setExerciseStartTime(Date.now());
  }, [answer, exerciseStartTime, submitAnswer, exercises, currentIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // End training early
  const handleEndTraining = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Deseja realmente encerrar o treino?")) {
      router.push("/dashboard");
    }
  }, [router]);

  // ---------- Loading states ----------

  if (authLoading || checkingLimit) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          <p className="text-white/60 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // ---------- Blocked by daily limit ----------

  if (isBlocked && !started) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-md w-full"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl opacity-10 blur-2xl" />

          {/* Card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500"
            >
              <Lock className="size-7 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-family-display)" }}>
              Limite diário atingido
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              No plano Free, você pode treinar 1 vez por dia.
              Assine o Pro para treinar sem limites!
            </p>

            <button
              onClick={() => router.push("/billing")}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-semibold text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-400 hover:to-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Assinar Pro
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-white/50 hover:text-white/80 px-6 py-3 rounded-xl transition-colors mt-3 text-sm"
            >
              Voltar ao painel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Pre-start ----------

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl w-full"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl" />

          {/* Card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500"
              >
                <Zap className="size-7 text-white" />
              </motion.div>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Treino Mental
              </h2>
              <p className="text-white/60 text-base">
                {TOTAL_EXERCISES} exercícios pensados pro seu nível atual ({level}). Escolha o modo:
              </p>
            </div>

            {/* Mode selector */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Normal mode */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                onClick={() => setSelectedMode("normal")}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  selectedMode === "normal"
                    ? "border-teal-400 bg-teal-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                {selectedMode === "normal" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl opacity-10 blur-xl" />
                )}
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-2xl mb-4 ${
                    selectedMode === "normal"
                      ? "bg-gradient-to-br from-teal-500 to-cyan-500"
                      : "bg-white/10"
                  }`}>
                    <Smile className="size-6 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-family-display)" }}
                  >
                    Tranquilo
                  </h3>
                  <p className="text-white/50 text-sm">Sem limite de tempo — foque na precisão</p>
                </div>
              </motion.button>

              {/* Timed mode */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => setSelectedMode("timed")}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  selectedMode === "timed"
                    ? "border-orange-400 bg-orange-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                {selectedMode === "timed" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl opacity-10 blur-xl" />
                )}
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-2xl mb-4 ${
                    selectedMode === "timed"
                      ? "bg-gradient-to-br from-orange-500 to-red-500"
                      : "bg-white/10"
                  }`}>
                    <Clock className="size-6 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-family-display)" }}
                  >
                    Cronometrado
                  </h3>
                  <p className="text-white/50 text-sm">{questionTime.toFixed(0)}s por questão — desafie-se</p>
                </div>
              </motion.button>
            </div>

            {error && (
              <p className="text-sm text-orange-400 mb-4 text-center">{error}</p>
            )}

            {/* Start button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-5 rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-400 hover:to-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              Bora treinar
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Saving ----------

  if (isFinished || isSaving) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-md w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
              <p className="text-white/60">
                Salvando resultados...
              </p>
              {error && (
                <p className="text-sm text-orange-400">{error}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Training in progress ----------

  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-lg w-full"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-[0.07] blur-2xl" />

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                <Zap className="size-4 text-white" />
              </div>
              <h3
                className="text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Treino
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {sessionMode === "timed" ? (
                <div className="flex items-center gap-3">
                  {/* Session time left */}
                  <span className="text-xs text-white/50 font-mono tabular-nums bg-white/5 px-2 py-1 rounded-lg">
                    {Math.floor(sessionTimeLeft / 60)}:{String(Math.floor(sessionTimeLeft % 60)).padStart(2, "0")}
                  </span>
                  {/* Per-question countdown */}
                  <CountdownTimer
                    totalSeconds={questionTime}
                    running={started && !isFinished}
                    onExpire={handleQuestionExpire}
                    resetKey={currentIndex}
                  />
                </div>
              ) : (
                <Timer running={started && !isFinished} />
              )}
              <button
                onClick={handleEndTraining}
                className="text-white/40 hover:text-white/80 transition-colors p-2 hover:bg-white/10 rounded-xl"
                title="Encerrar treino"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <ProgressBar current={currentIndex} total={TOTAL_EXERCISES} />
          </div>

          {/* Exercise */}
          <ExerciseCard
            operand1={exercise.operand1}
            operand2={exercise.operand2}
            operator={exercise.operator}
            current={currentIndex + 1}
            total={TOTAL_EXERCISES}
          />

          {/* Answer Input */}
          <div className={`mb-6 mt-8 ${isShaking ? "shake" : ""}`}>
            <input
              ref={inputRef}
              type="number"
              inputMode="decimal"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sua resposta"
              autoFocus
              className="w-full px-6 py-4 bg-white/5 text-white rounded-2xl border-2 border-white/10 focus:border-teal-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 text-lg text-center font-semibold placeholder:text-white/30"
            />
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            disabled={answer.trim() === ""}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:from-teal-500 disabled:hover:to-cyan-500"
          >
            Essa é minha resposta
          </button>

          {error && <p className="text-sm text-orange-400 mt-4 text-center">{error}</p>}
        </div>
      </motion.div>
    </div>
  );
}
