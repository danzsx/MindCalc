"use client";

import { useState, useCallback } from "react";
import type { Exercise } from "@/types";

interface TrainingSession {
  exercises: Exercise[];
  currentIndex: number;
  answers: (number | null)[];
  times: number[];
  startTime: number | null;
  isLoading: boolean;
  isFinished: boolean;
}

export function useTrainingSession() {
  const [session, setSession] = useState<TrainingSession>({
    exercises: [],
    currentIndex: 0,
    answers: [],
    times: [],
    startTime: null,
    isLoading: false,
    isFinished: false,
  });

  const startSession = useCallback(
    async (userId: string, level: number) => {
      setSession((prev) => ({ ...prev, isLoading: true }));

      try {
        const res = await fetch("/api/generate-exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, level }),
        });

        if (!res.ok) {
          throw new Error("Failed to generate exercises");
        }

        const exercises: Exercise[] = await res.json();

        setSession({
          exercises,
          currentIndex: 0,
          answers: [],
          times: [],
          startTime: Date.now(),
          isLoading: false,
          isFinished: false,
        });
      } catch (error) {
        console.error("startSession error:", error);
        setSession((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    []
  );

  const submitAnswer = useCallback(
    (value: number | null, timeSpent: number) => {
      setSession((prev) => {
        const newAnswers = [...prev.answers, value];
        const newTimes = [...prev.times, timeSpent];
        const nextIndex = prev.currentIndex + 1;
        const isFinished = nextIndex >= prev.exercises.length;

        return {
          ...prev,
          answers: newAnswers,
          times: newTimes,
          currentIndex: isFinished ? prev.currentIndex : nextIndex,
          isFinished,
        };
      });
    },
    []
  );

  const finishSession = useCallback(
    async (userId: string, level: number): Promise<string> => {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          exercises: session.exercises,
          answers: session.answers,
          times: session.times,
          level,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save session");
      }

      const data = await res.json();
      return data.sessionId as string;
    },
    [session.exercises, session.answers, session.times]
  );

  return {
    exercises: session.exercises,
    currentIndex: session.currentIndex,
    answers: session.answers,
    times: session.times,
    startTime: session.startTime,
    isLoading: session.isLoading,
    isFinished: session.isFinished,
    startSession,
    submitAnswer,
    finishSession,
  };
}
