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
import { X, Lock, Clock, Smile, Zap, Play } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

const TOTAL_EXERCISES = 10;

// ── Shared glass card style ──────────────────────────────────────────────────
const glassCard: React.CSSProperties = {
  background: "rgba(13, 29, 58, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(141, 194, 255, 0.12)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
};

// ── Loading ──────────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(55, 112, 191, 0.3)", borderTopColor: "#3770bf" }}
        />
        <p
          className="text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Carregando...
        </p>
      </div>
    </div>
  );
}

// ── Blocked ──────────────────────────────────────────────────────────────────
function BlockedState({ onUpgrade, onBack }: { onUpgrade: () => void; onBack: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-sm w-full"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 rounded-[32px] blur-2xl opacity-20"
          style={{ background: "radial-gradient(ellipse, #3770bf 0%, transparent 70%)" }}
        />

        <div className="relative rounded-[28px] p-8 text-center" style={glassCard}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
            className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(141, 194, 255, 0.1)",
              border: "1px solid rgba(141, 194, 255, 0.25)",
            }}
          >
            <Lock className="size-7" style={{ color: "#8dc2ff" }} />
          </motion.div>

          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Limite diário atingido
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            No plano Free, você pode treinar 1 vez por dia.
            Assine o Pro para treinar sem limites.
          </p>

          <button
            onClick={onUpgrade}
            className="w-full px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 mb-3"
            style={{
              background: "#cef26d",
              color: "#080f1e",
              boxShadow: "0 4px 24px rgba(206, 242, 109, 0.3)",
              fontFamily: "var(--font-family-display)",
            }}
          >
            Assinar Pro
          </button>
          <button
            onClick={onBack}
            className="w-full px-6 py-3 rounded-xl text-sm transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-text-muted)")
            }
          >
            Voltar ao painel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Saving ───────────────────────────────────────────────────────────────────
function SavingState({ error }: { error: string | null }) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-sm w-full"
      >
        <div
          className="absolute inset-0 rounded-[32px] blur-2xl opacity-15"
          style={{ background: "radial-gradient(ellipse, #cef26d 0%, transparent 70%)" }}
        />
        <div className="relative rounded-[28px] p-8" style={glassCard}>
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: "rgba(206, 242, 109, 0.25)",
                borderTopColor: "#cef26d",
              }}
            />
            <p style={{ color: "var(--color-text-muted)" }}>Salvando resultados...</p>
            {error && (
              <p className="text-sm text-center" style={{ color: "#8dc2ff" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Pre-start ────────────────────────────────────────────────────────────────
function PreStartState({
  level,
  questionTime,
  selectedMode,
  onModeChange,
  onStart,
  error,
}: {
  level: number;
  questionTime: number;
  selectedMode: TrainingMode;
  onModeChange: (m: TrainingMode) => void;
  onStart: () => void;
  error: string | null;
}) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-xl w-full"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-[40px] blur-3xl opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #3770bf 0%, #cef26d 60%, transparent 80%)",
          }}
        />

        <div className="relative rounded-[32px] p-8 md:p-10" style={glassCard}>
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 220 }}
              className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl"
              style={{
                background: "rgba(55, 112, 191, 0.14)",
                border: "1px solid rgba(55, 112, 191, 0.35)",
              }}
            >
              <Zap className="size-7" style={{ color: "#5a8fd4" }} />
            </motion.div>

            <h2
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{
                fontFamily: "var(--font-family-display)",
                color: "var(--color-text-primary)",
              }}
            >
              Treino Mental
            </h2>
            <p style={{ color: "var(--color-text-muted)" }}>
              {TOTAL_EXERCISES} exercícios calibrados para o nível{" "}
              <span
                className="font-semibold"
                style={{ color: "#8dc2ff" }}
              >
                {level}
              </span>
              . Escolha o modo:
            </p>
          </div>

          {/* Mode selector */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Tranquilo */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => onModeChange("normal")}
              className="relative p-7 rounded-2xl text-left transition-all duration-300"
              style={
                selectedMode === "normal"
                  ? {
                      background: "rgba(55, 112, 191, 0.14)",
                      border: "2px solid rgba(55, 112, 191, 0.45)",
                      boxShadow: "0 0 24px rgba(55, 112, 191, 0.15)",
                    }
                  : {
                      background: "rgba(141, 194, 255, 0.04)",
                      border: "1px solid rgba(141, 194, 255, 0.1)",
                    }
              }
            >
              <div
                className="inline-flex p-3 rounded-xl mb-4"
                style={
                  selectedMode === "normal"
                    ? {
                        background: "rgba(55, 112, 191, 0.18)",
                        border: "1px solid rgba(55, 112, 191, 0.4)",
                      }
                    : {
                        background: "rgba(141, 194, 255, 0.07)",
                        border: "1px solid rgba(141, 194, 255, 0.12)",
                      }
                }
              >
                <Smile
                  className="size-6"
                  style={{
                    color:
                      selectedMode === "normal" ? "#5a8fd4" : "var(--color-text-muted)",
                  }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-family-display)",
                  color:
                    selectedMode === "normal"
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                }}
              >
                Tranquilo
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Sem limite de tempo — foque na precisão
              </p>

              {selectedMode === "normal" && (
                <div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full"
                  style={{ background: "#5a8fd4", boxShadow: "0 0 8px #3770bf" }}
                />
              )}
            </motion.button>

            {/* Cronometrado */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => onModeChange("timed")}
              className="relative p-7 rounded-2xl text-left transition-all duration-300"
              style={
                selectedMode === "timed"
                  ? {
                      background: "rgba(206, 242, 109, 0.08)",
                      border: "2px solid rgba(206, 242, 109, 0.38)",
                      boxShadow: "0 0 24px rgba(206, 242, 109, 0.1)",
                    }
                  : {
                      background: "rgba(141, 194, 255, 0.04)",
                      border: "1px solid rgba(141, 194, 255, 0.1)",
                    }
              }
            >
              <div
                className="inline-flex p-3 rounded-xl mb-4"
                style={
                  selectedMode === "timed"
                    ? {
                        background: "rgba(206, 242, 109, 0.1)",
                        border: "1px solid rgba(206, 242, 109, 0.3)",
                      }
                    : {
                        background: "rgba(141, 194, 255, 0.07)",
                        border: "1px solid rgba(141, 194, 255, 0.12)",
                      }
                }
              >
                <Clock
                  className="size-6"
                  style={{
                    color:
                      selectedMode === "timed" ? "#cef26d" : "var(--color-text-muted)",
                  }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-family-display)",
                  color:
                    selectedMode === "timed"
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                }}
              >
                Cronometrado
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {questionTime.toFixed(0)}s por questão — desafie-se
              </p>

              {selectedMode === "timed" && (
                <div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full"
                  style={{ background: "#cef26d", boxShadow: "0 0 8px rgba(206,242,109,0.6)" }}
                />
              )}
            </motion.button>
          </div>

          {error && (
            <p
              className="text-sm text-center mb-4"
              style={{ color: "#8dc2ff" }}
            >
              {error}
            </p>
          )}

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            onClick={onStart}
            className="w-full px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            style={{
              background: "#cef26d",
              color: "#080f1e",
              boxShadow: "0 4px 28px rgba(206, 242, 109, 0.32)",
              fontFamily: "var(--font-family-display)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 40px rgba(206, 242, 109, 0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 28px rgba(206, 242, 109, 0.32)";
            }}
          >
            <Play className="size-5 fill-current" />
            Iniciar Treino
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TrainPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
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

  const questionTime = getStandardTime(level);
  const sessionTotalTime = questionTime * TOTAL_EXERCISES;
  const [sessionTimeLeft, setSessionTimeLeft] = useState(sessionTotalTime);

  // Fetch user data
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const supabase = createClient();

      const [{ data: profileData }, { data: errorLogs }, { data: techniquesData }] =
        await Promise.all([
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

      if (profileData) setLevel(profileData.level);
      if (errorLogs) setWeakOperations(identifyWeakOperations(errorLogs));
      if (techniquesData) {
        const slugs = techniquesData
          .map((t: Record<string, unknown>) => {
            const lesson = t.lessons as { slug: string } | null;
            return lesson?.slug;
          })
          .filter((s): s is string => Boolean(s));
        setLearnedTechniques(slugs);
      }

      try {
        const res = await fetch("/api/sessions/check");
        const data = await res.json();
        if (!data.canTrain) setIsBlocked(true);
      } catch {
        // fail open
      } finally {
        setCheckingLimit(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Session countdown (timed mode)
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

  const handleStart = useCallback(() => {
    if (!user) return;
    setError(null);
    const qTime = getStandardTime(level);
    setSessionTimeLeft(qTime * TOTAL_EXERCISES);
    startSession(level, weakOperations, learnedTechniques, selectedMode);
    setStarted(true);
    setExerciseStartTime(Date.now());
  }, [user, level, weakOperations, learnedTechniques, selectedMode, startSession]);

  // Auto-focus input
  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [started, currentIndex]);

  // Save on finish
  useEffect(() => {
    if (!isFinished || isSaving || !user) return;

    const save = async () => {
      setIsSaving(true);
      try {
        const sessionId = await finishSession(user.id, level);
        toast.success("Sessão salva com sucesso!");
        router.push(`/results/${sessionId}`);
      } catch {
        toast.error("Erro ao salvar sessão. Tente novamente.");
        setError("Erro ao salvar sessão. Tente novamente.");
        setIsSaving(false);
      }
    };

    save();
  }, [isFinished, isSaving, user, level, finishSession, router]);

  const handleQuestionExpire = useCallback(() => {
    submitAnswer(null, questionTime, true);
    setAnswer("");
    setExerciseStartTime(Date.now());
  }, [questionTime, submitAnswer]);

  const handleSubmit = useCallback(() => {
    if (answer.trim() === "") return;

    const timeSpent = (Date.now() - exerciseStartTime) / 1000;
    const userAnswer = parseFloat(answer);

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

  const handleEndTraining = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Deseja realmente encerrar o treino?")) {
      router.push("/dashboard");
    }
  }, [router]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (authLoading || checkingLimit) return <LoadingState />;

  if (isBlocked && !started)
    return (
      <BlockedState
        onUpgrade={() => router.push("/billing")}
        onBack={() => router.push("/dashboard")}
      />
    );

  if (!started)
    return (
      <PreStartState
        level={level}
        questionTime={questionTime}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        onStart={handleStart}
        error={error}
      />
    );

  if (isFinished || isSaving) return <SavingState error={error} />;

  // ── Training in progress ───────────────────────────────────────────────────
  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-lg w-full"
      >
        {/* Ambient glow behind card */}
        <div
          className="absolute inset-0 rounded-[36px] blur-3xl opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #3770bf 0%, #cef26d 80%, transparent 100%)",
          }}
        />

        {/* Main card */}
        <div className="relative rounded-[32px] overflow-hidden" style={glassCard}>
          {/* Top progress bar — slim, full-width */}
          <div className="px-0">
            <ProgressBar current={currentIndex} total={TOTAL_EXERCISES} />
          </div>

          <div className="p-8">
            {/* Header row */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div
                  className="inline-flex p-2 rounded-lg"
                  style={{
                    background: "rgba(55, 112, 191, 0.1)",
                    border: "1px solid rgba(55, 112, 191, 0.22)",
                  }}
                >
                  <Zap className="size-4" style={{ color: "#5a8fd4" }} />
                </div>
                <span
                  className="text-base font-bold"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Treino
                </span>
              </div>

              <div className="flex items-center gap-3">
                {sessionMode === "timed" ? (
                  <div className="flex items-center gap-3">
                    {/* Session time remaining pill */}
                    <span
                      className="font-mono text-xs font-bold tabular-nums px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(55, 112, 191, 0.1)",
                        border: "1px solid rgba(55, 112, 191, 0.2)",
                        color: "#8dc2ff",
                      }}
                    >
                      {Math.floor(sessionTimeLeft / 60)}:
                      {String(Math.floor(sessionTimeLeft % 60)).padStart(2, "0")}
                    </span>
                    {/* Per-question ring timer */}
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
                  className="p-2 rounded-xl transition-all duration-200"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(141, 194, 255, 0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-text-muted)";
                  }}
                  title="Encerrar treino"
                  aria-label="Encerrar treino"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Exercise equation */}
            <div className="py-4">
              <ExerciseCard
                operand1={exercise.operand1}
                operand2={exercise.operand2}
                operator={exercise.operator}
                current={currentIndex + 1}
                total={TOTAL_EXERCISES}
              />
            </div>

            {/* Answer input */}
            <div
              className={`mt-10 mb-5 ${isShaking ? "shake" : ""}`}
            >
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Resposta"
                autoFocus
                className="w-full px-6 py-5 text-center text-2xl font-bold rounded-2xl transition-all duration-200 outline-none"
                style={{
                  background: "rgba(13, 29, 58, 0.8)",
                  border: "1px solid rgba(141, 194, 255, 0.15)",
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-family-display)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "2px solid rgba(206, 242, 109, 0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 4px rgba(206, 242, 109, 0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(141, 194, 255, 0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={answer.trim() === ""}
              className="w-full px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: answer.trim() ? "#cef26d" : "rgba(206, 242, 109, 0.12)",
                color: answer.trim() ? "#080f1e" : "var(--color-text-muted)",
                boxShadow: answer.trim()
                  ? "0 4px 20px rgba(206, 242, 109, 0.28)"
                  : "none",
                fontFamily: "var(--font-family-display)",
              }}
            >
              Confirmar
            </button>

            {error && (
              <p
                className="text-sm text-center mt-4"
                style={{ color: "#8dc2ff" }}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
