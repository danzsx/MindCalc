"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTablesSession } from "@/hooks/useTablesSession";
import { TablesQuestionCard } from "@/components/tables/TablesQuestionCard";
import { TablesFeedback } from "@/components/tables/TablesFeedback";
import { TablesProgressBar } from "@/components/tables/TablesProgressBar";
import { TablesBlockSummary } from "@/components/tables/TablesBlockSummary";
import { X } from "lucide-react";
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
    if (window.confirm("Deseja realmente encerrar o treino?")) {
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
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full text-center">
          <p className="text-muted-foreground mb-4">
            Configuração inválida.
          </p>
          <button
            onClick={() => router.push("/tabuada")}
            className="bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transition-all duration-300 min-h-[56px] font-medium"
          >
            Voltar à configuração
          </button>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // --- Saving state ---

  if (state.phase === "finished" || isSaving) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Salvando resultados...</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // --- Active session ---

  const currentBlock = state.blocks[state.currentBlockIndex];

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground font-medium">Tabuada</h3>
          <button
            onClick={handleEndTraining}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg"
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
    </div>
  );
}

export default function TabuadaSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <TabuadaSessionContent />
    </Suspense>
  );
}
