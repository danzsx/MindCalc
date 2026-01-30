"use client";

import { useState, useCallback } from "react";
import type { Exercise, Operator } from "@/types";
import { generateExercises } from "@/lib/engine";

export interface TrainingSession {
  exercises: Exercise[];
  currentIndex: number;
  answers: (number | null)[];
  times: number[];
  startTime: number | null;
  isFinished: boolean;
}

export function useTrainingSession() {
  const [session, setSession] = useState<TrainingSession>({
    exercises: [],
    currentIndex: 0,
    answers: [],
    times: [],
    startTime: null,
    isFinished: false,
  });

  const startSession = useCallback(
    (level: number, weakOperations?: Operator[]) => {
      const exercises = generateExercises(10, level, weakOperations);

      setSession({
        exercises,
        currentIndex: 0,
        answers: [],
        times: [],
        startTime: Date.now(),
        isFinished: false,
      });
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
    isFinished: session.isFinished,
    startSession,
    submitAnswer,
    finishSession,
  };
}
