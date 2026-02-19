"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { useTablesSession } from "@/hooks/useTablesSession";
import { TablesQuestionCard } from "@/components/tables/TablesQuestionCard";
import { TablesFeedback } from "@/components/tables/TablesFeedback";
import { TablesProgressBar } from "@/components/tables/TablesProgressBar";
import { TablesBlockSummary } from "@/components/tables/TablesBlockSummary";
import { X, Grid3X3 } from "lucide-react";
import { toast } from "sonner";
import type { TablesConfig, TablesOperation, TablesMode } from "@/types";

function TabuadaSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    state,
    currentQuestion,
    blockProgress,
    lastAnswer,
    submitAnswer,
    nextQuestion,
    nextBlock,
    startSession,
    finishSession,
  } = useTablesSession();

  // Parse config from query params
  const config = useMemo((): TablesConfig | null => {
    const op = searchParams.get("op") as TablesOperation | null;
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const mode = searchParams.get("mode") as TablesMode | null;

    if (!op || !min || !max || !mode) return null;
    if (!["+", "-", "*", "/"].includes(op)) return null;
    if (!["guided", "free"].includes(mode)) return null;

    return {
      operation: op,
      range: { min: parseInt(min, 10), max: parseInt(max, 10) },
      mode,
    };
  }, [searchParams]);

  // Start session when config is ready
  useEffect(() => {
    if (!config || state) return;
    startSession(config);
  }, [config, state, startSession]);

  // Handle finish
  useEffect(() => {
    if (!state || state.phase !== "finished" || isSaving || !user) return;

    const save = async () => {
      setIsSaving(true);
      try {
        const result = await finishSession(user.id);
        toast.success("Sessão salva com sucesso!");
        router.push(`/tabuada/result/${result.sessionId}`);
      } catch {
        toast.error("Erro ao salvar sessão. Tente novamente.");
        setError("Erro ao salvar sessão. Tente novamente.");
        setIsSaving(false);
      }
    };

    save();
  }, [state, isSaving, user, finishSession, router]);

  const handleEndTraining = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Deseja realmente encerrar o treino?")) {
      router.push("/tabuada");
    }
  }, [router]);

  // Check if current question is a retry
  const isRetry = useMemo(() => {
    if (!state || !currentQuestion) return false;
    return (state.retryCount.get(currentQuestion.id) ?? 0) > 0;
  }, [state, currentQuestion]);

  // --- Loading / invalid state ---

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8dc2ff] border-t-transparent" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="relative group max-w-md w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl" />
          <div className="relative bg-[var(--color-surface-dark)] border border-white/10 rounded-[32px] p-8 text-center shadow-lg">
            <p className="text-[var(--color-text-secondary)] mb-6 font-medium">Configuração inválida.</p>
            <button
              onClick={() => router.push("/tabuada")}
              className="bg-gradient-to-r from-[#3770bf] to-[#8dc2ff] text-white px-6 py-4 rounded-2xl hover:opacity-90 hover:shadow-lg hover:shadow-[#3770bf]/25 transition-all duration-300 font-bold"
            >
              Voltar à configuração
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8dc2ff] border-t-transparent" />
      </div>
    );
  }

  // --- Saving state ---

  if (state.phase === "finished" || isSaving) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="relative group max-w-md w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl" />
          <div className="relative bg-[var(--color-surface-dark)] border border-white/10 rounded-[32px] p-8 shadow-lg">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8dc2ff] border-t-transparent" />
              <p className="text-[var(--color-text-secondary)] font-medium">Salvando resultados...</p>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Active session ---

  const currentBlock = state.blocks[state.currentBlockIndex];

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group max-w-md w-full"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-[40px] opacity-10 blur-3xl group-hover:opacity-15 transition-opacity duration-500" />

        {/* Card */}
        <div className="relative bg-[var(--color-surface-dark)] border border-white/10 rounded-[32px] p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#3770bf]/15 p-2.5 rounded-xl">
                <Grid3X3 className="w-5 h-5 text-[#8dc2ff]" />
              </div>
              <h3
                className="text-xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Tabuada
              </h3>
            </div>
            <button
              onClick={handleEndTraining}
              className="text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 p-2 rounded-xl border border-transparent hover:border-red-500/20"
              title="Encerrar treino"
            >
              <X size={20} />
            </button>
          </div>

          {/* Answering phase */}
          {state.phase === "answering" && currentQuestion && (
            <>
              <TablesProgressBar
                current={blockProgress.current}
                total={blockProgress.total}
                blockIndex={state.currentBlockIndex}
              />
              <TablesQuestionCard
                question={currentQuestion}
                onSubmit={submitAnswer}
                mode={state.config.mode}
                isRetry={isRetry}
              />
            </>
          )}

          {/* Feedback phase */}
          {state.phase === "feedback" && currentQuestion && lastAnswer && (
            <TablesFeedback
              question={currentQuestion}
              answer={lastAnswer}
              onContinue={nextQuestion}
            />
          )}

          {/* Block summary phase */}
          {state.phase === "block-summary" && currentBlock && (
            <TablesBlockSummary
              block={currentBlock}
              blockIndex={state.currentBlockIndex}
              canAdvance={currentBlock.accuracy >= 60}
              onContinue={nextBlock}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function TabuadaSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8dc2ff] border-t-transparent" />
        </div>
      }
    >
      <TabuadaSessionContent />
    </Suspense>
  );
}
