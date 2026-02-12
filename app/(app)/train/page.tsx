"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTrainingSession } from "@/hooks/useTrainingSession";
import { createClient } from "@/lib/supabase/client";
import { identifyWeakOperations } from "@/lib/engine";
import type { Operator } from "@/types";
import { ExerciseCard } from "@/components/training/ExerciseCard";
import { Timer } from "@/components/training/Timer";
import { X, Lock } from "lucide-react";
import { toast } from "sonner";

const TOTAL_EXERCISES = 10;

export default function TrainPage() {
  const router = useRouter();
  const { user, loading: authLoading, plan } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    exercises,
    currentIndex,
    isFinished,
    startSession,
    submitAnswer,
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

  // Start training session
  const handleStart = useCallback(() => {
    if (!user) return;

    setError(null);
    startSession(level, weakOperations, learnedTechniques);
    setStarted(true);
    setExerciseStartTime(Date.now());
  }, [user, level, weakOperations, learnedTechniques, startSession]);

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
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // ---------- Blocked by daily limit ----------

  if (isBlocked && !started) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full zoom-in-95 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Lock className="size-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-section-title text-foreground" style={{ marginBottom: 'var(--space-sm)' }}>
            Limite diário atingido
          </h2>
          <p className="text-body-primary text-muted-foreground" style={{ lineHeight: 'var(--leading-relaxed)' }}>
            No plano Free, você pode treinar 1 vez por dia.
            Assine o Pro para treinar sem limites!
          </p>
          <button
            onClick={() => router.push("/billing")}
            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium mt-6"
          >
            Assinar Pro
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full text-muted-foreground hover:text-foreground px-6 py-3 rounded-xl transition-colors mt-3 text-sm"
          >
            Voltar ao painel
          </button>
        </div>
      </div>
    );
  }

  // ---------- Pre-start ----------

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full zoom-in-95">
          <h2 className="text-section-title text-foreground" style={{ marginBottom: 'var(--card-section-gap)' }}>Treino Mental</h2>
          <p className="text-body-primary text-muted-foreground" style={{ marginBottom: 'var(--space-sm)', lineHeight: 'var(--leading-relaxed)' }}>
            São {TOTAL_EXERCISES} exercícios pensados pro seu nível
            atual ({level}). Vai no seu ritmo, sem pressa.
          </p>
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}
          <button
            onClick={handleStart}
            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium mt-6"
          >
            Bora treinar
          </button>
        </div>
      </div>
    );
  }

  // ---------- Saving ----------

  if (isFinished || isSaving) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">
              Salvando resultados...
            </p>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Training in progress ----------

  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-foreground">Treino</h3>
          <div className="flex items-center gap-4">
            <Timer running={started && !isFinished} />
            <button
              onClick={handleEndTraining}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg"
              title="Encerrar treino"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Exercise with progress */}
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
            className="w-full px-6 py-4 bg-muted text-foreground rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg text-center font-medium"
          />
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleSubmit}
          disabled={answer.trim() === ""}
          className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transition-all duration-300 min-h-[56px] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-md"
        >
          Essa é minha resposta
        </button>

        {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      </div>
    </div>
  );
}
