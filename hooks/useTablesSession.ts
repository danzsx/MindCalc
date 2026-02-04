"use client";

import { useState, useCallback, useRef } from "react";
import type {
  TablesConfig,
  TablesQuestion,
  TablesAnswer,
  TablesBlock,
  TablesSessionState,
  TablesSessionResult,
} from "@/types";
import {
  generateCombinations,
  generateBlock,
  getDifficultyTier,
} from "@/lib/tables/engine";

export function useTablesSession() {
  const [state, setState] = useState<TablesSessionState | null>(null);
  const allCombinationsRef = useRef<TablesQuestion[]>([]);
  const usedIdsRef = useRef<Set<string>>(new Set());
  const difficultCombinationsRef = useRef<TablesQuestion[]>([]);

  const startSession = useCallback((config: TablesConfig) => {
    const allCombinations = generateCombinations(config.operation, config.range);
    allCombinationsRef.current = allCombinations;
    usedIdsRef.current = new Set();

    const retryQueue: TablesQuestion[] = [];
    const firstBlock = generateBlock(
      allCombinations,
      usedIdsRef.current,
      retryQueue,
      "low",
      config.range
    );

    setState({
      config,
      blocks: [{ questions: firstBlock, answers: [], accuracy: 0 }],
      currentBlockIndex: 0,
      currentQuestionIndex: 0,
      retryQueue: [],
      retryCount: new Map(),
      phase: "answering",
      isFinished: false,
    });
  }, []);

  const currentQuestion: TablesQuestion | null =
    state && state.phase !== "finished"
      ? state.blocks[state.currentBlockIndex]?.questions[
          state.currentQuestionIndex
        ] ?? null
      : null;

  const blockProgress = state
    ? {
        current: state.currentQuestionIndex,
        total: state.blocks[state.currentBlockIndex]?.questions.length ?? 6,
      }
    : { current: 0, total: 6 };

  const overallProgress = state
    ? {
        blocksCompleted: state.blocks.filter((b) => b.answers.length === b.questions.length).length,
        totalCorrect: state.blocks.reduce(
          (sum, b) => sum + b.answers.filter((a) => a.isCorrect).length,
          0
        ),
        totalAnswered: state.blocks.reduce(
          (sum, b) => sum + b.answers.length,
          0
        ),
      }
    : { blocksCompleted: 0, totalCorrect: 0, totalAnswered: 0 };

  const submitAnswer = useCallback(
    (answer: number) => {
      setState((prev) => {
        if (!prev || !prev.blocks[prev.currentBlockIndex]) return prev;

        const block = prev.blocks[prev.currentBlockIndex];
        const question = block.questions[prev.currentQuestionIndex];
        if (!question) return prev;

        const isCorrect = answer === question.correctAnswer;
        const existingAnswer = block.answers.find(
          (a) => a.questionId === question.id
        );
        const attempts = existingAnswer ? existingAnswer.attempts + 1 : 1;

        const newAnswer: TablesAnswer = {
          questionId: question.id,
          userAnswer: answer,
          isCorrect,
          attempts,
        };

        const newAnswers = [...block.answers, newAnswer];
        const newBlocks = [...prev.blocks];
        newBlocks[prev.currentBlockIndex] = {
          ...block,
          answers: newAnswers,
          accuracy: 0,
        };

        const newRetryQueue = [...prev.retryQueue];
        const newRetryCount = new Map(prev.retryCount);

        if (!isCorrect) {
          const currentRetries = newRetryCount.get(question.id) ?? 0;
          if (currentRetries < 2) {
            newRetryQueue.push(question);
            newRetryCount.set(question.id, currentRetries + 1);
          } else {
            difficultCombinationsRef.current = [
              ...difficultCombinationsRef.current.filter(
                (q) => q.id !== question.id
              ),
              question,
            ];
          }
        }

        // In free mode + correct: auto-advance (stay in answering phase, move to next)
        if (isCorrect && prev.config.mode === "free") {
          const nextIndex = prev.currentQuestionIndex + 1;
          if (nextIndex >= block.questions.length) {
            const correctCount = newAnswers.filter((a) => a.isCorrect).length;
            const accuracy = (correctCount / newAnswers.length) * 100;
            newBlocks[prev.currentBlockIndex] = {
              ...newBlocks[prev.currentBlockIndex],
              accuracy,
            };
            return {
              ...prev,
              blocks: newBlocks,
              retryQueue: newRetryQueue,
              retryCount: newRetryCount,
              phase: "block-summary" as const,
            };
          }
          return {
            ...prev,
            blocks: newBlocks,
            currentQuestionIndex: nextIndex,
            retryQueue: newRetryQueue,
            retryCount: newRetryCount,
            phase: "answering" as const,
          };
        }

        // Guided mode (correct or incorrect) or free mode incorrect: show feedback
        return {
          ...prev,
          blocks: newBlocks,
          retryQueue: newRetryQueue,
          retryCount: newRetryCount,
          phase: "feedback" as const,
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;

      const block = prev.blocks[prev.currentBlockIndex];
      if (!block) return prev;

      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex >= block.questions.length) {
        const correctCount = block.answers.filter((a) => a.isCorrect).length;
        const accuracy = (correctCount / block.answers.length) * 100;
        const newBlocks = [...prev.blocks];
        newBlocks[prev.currentBlockIndex] = { ...block, accuracy };
        return {
          ...prev,
          blocks: newBlocks,
          phase: "block-summary" as const,
        };
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        phase: "answering" as const,
      };
    });
  }, []);

  const nextBlock = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;

      const currentBlock = prev.blocks[prev.currentBlockIndex];
      if (!currentBlock) return prev;

      // If accuracy < 60%, repeat the block
      if (currentBlock.accuracy < 60) {
        const retryQueue = [...prev.retryQueue];
        const repeatedBlock = generateBlock(
          allCombinationsRef.current,
          new Set(), // allow reusing questions for repeat
          retryQueue,
          getDifficultyTier(prev.currentBlockIndex),
          prev.config.range
        );

        const newBlocks = [...prev.blocks];
        newBlocks.push({
          questions: repeatedBlock,
          answers: [],
          accuracy: 0,
        });

        return {
          ...prev,
          blocks: newBlocks,
          currentBlockIndex: newBlocks.length - 1,
          currentQuestionIndex: 0,
          retryQueue: retryQueue,
          phase: "answering" as const,
        };
      }

      // Check if we should finish
      const nextBlockIndex = prev.currentBlockIndex + 1;
      const nextTier = getDifficultyTier(nextBlockIndex);
      const currentTier = getDifficultyTier(prev.currentBlockIndex);

      // Finished if: already went through high tier OR no more unused combinations
      const unusedCount = allCombinationsRef.current.filter(
        (q) => !usedIdsRef.current.has(q.id)
      ).length;

      if (
        (currentTier === "high" && nextTier === "high" && nextBlockIndex >= 6) ||
        unusedCount === 0
      ) {
        return {
          ...prev,
          phase: "finished" as const,
          isFinished: true,
        };
      }

      // Generate next block
      const retryQueue = [...prev.retryQueue];
      const newBlock = generateBlock(
        allCombinationsRef.current,
        usedIdsRef.current,
        retryQueue,
        nextTier,
        prev.config.range
      );

      if (newBlock.length === 0) {
        return {
          ...prev,
          phase: "finished" as const,
          isFinished: true,
        };
      }

      const newBlocks = [...prev.blocks];
      newBlocks.push({ questions: newBlock, answers: [], accuracy: 0 });

      return {
        ...prev,
        blocks: newBlocks,
        currentBlockIndex: newBlocks.length - 1,
        currentQuestionIndex: 0,
        retryQueue: retryQueue,
        phase: "answering" as const,
      };
    });
  }, []);

  const finishSession = useCallback(
    async (userId: string): Promise<TablesSessionResult> => {
      if (!state) throw new Error("No active session");

      const totalQuestions = state.blocks.reduce(
        (sum, b) => sum + b.answers.length,
        0
      );
      const correctAnswers = state.blocks.reduce(
        (sum, b) => sum + b.answers.filter((a) => a.isCorrect).length,
        0
      );
      const accuracy =
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const blocksCompleted = state.blocks.filter(
        (b) => b.answers.length === b.questions.length
      ).length;

      const res = await fetch("/api/tables/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          config: state.config,
          blocks: state.blocks,
          difficultCombinations: difficultCombinationsRef.current,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save session");
      }

      const data = await res.json();

      return {
        sessionId: data.sessionId,
        config: state.config,
        totalQuestions,
        correctAnswers,
        accuracy,
        blocksCompleted,
        difficultCombinations: difficultCombinationsRef.current,
      };
    },
    [state]
  );

  const lastAnswer: TablesAnswer | null =
    state && state.blocks[state.currentBlockIndex]
      ? state.blocks[state.currentBlockIndex].answers[
          state.blocks[state.currentBlockIndex].answers.length - 1
        ] ?? null
      : null;

  return {
    state,
    currentQuestion,
    blockProgress,
    overallProgress,
    lastAnswer,
    submitAnswer,
    nextQuestion,
    nextBlock,
    startSession,
    finishSession,
  };
}
