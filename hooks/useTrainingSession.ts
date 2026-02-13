"use client";

import { useState, useCallback } from "react";
import type { Exercise, Operator, TrainingMode } from "@/types";
import { generateExercises, generateMixedExercises } from "@/lib/engine";

export interface TrainingSession {
  exercises: Exercise[];
  currentIndex: number;
  answers: (number | null)[];
  times: number[];
  timedOut: boolean[];
  startTime: number | null;
  isFinished: boolean;
  mode: TrainingMode;
}

export function useTrainingSession() {
  const [session, setSession] = useState<TrainingSession>({
    exercises: [],
    currentIndex: 0,
    answers: [],
    times: [],
    timedOut: [],
    startTime: null,
    isFinished: false,
    mode: "normal",
  });

  const startSession = useCallback(
    (
      level: number,
      weakOperations?: Operator[],
      learnedTechniques?: string[],
      mode: TrainingMode = "normal"
    ) => {
      const exercises =
        learnedTechniques && learnedTechniques.length >= 3
          ? generateMixedExercises(10, level, learnedTechniques, weakOperations)
          : generateExercises(10, level, weakOperations, learnedTechniques);

      setSession({
        exercises,
        currentIndex: 0,
        answers: [],
        times: [],
        timedOut: [],
        startTime: Date.now(),
        isFinished: false,
        mode,
      });
    },
    []
  );

  const submitAnswer = useCallback(
    (value: number | null, timeSpent: number, wasTimedOut = false) => {
      setSession((prev) => {
        const newAnswers = [...prev.answers, value];
        const newTimes = [...prev.times, timeSpent];
        const newTimedOut = [...prev.timedOut, wasTimedOut];
        const nextIndex = prev.currentIndex + 1;
        const isFinished = nextIndex >= prev.exercises.length;

        return {
          ...prev,
          answers: newAnswers,
          times: newTimes,
          timedOut: newTimedOut,
          currentIndex: isFinished ? prev.currentIndex : nextIndex,
          isFinished,
        };
      });
    },
    []
  );

  const forceFinish = useCallback(() => {
    setSession((prev) => {
      const remaining = prev.exercises.length - prev.answers.length;
      if (remaining <= 0) return prev;

      const newAnswers = [...prev.answers];
      const newTimes = [...prev.times];
      const newTimedOut = [...prev.timedOut];

      for (let i = 0; i < remaining; i++) {
        newAnswers.push(null);
        newTimes.push(0);
        newTimedOut.push(true);
      }

      return {
        ...prev,
        answers: newAnswers,
        times: newTimes,
        timedOut: newTimedOut,
        isFinished: true,
      };
    });
  }, []);

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
          timedOut: session.timedOut,
          level,
          mode: session.mode,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save session");
      }

      const data = await res.json();
      return data.sessionId as string;
    },
    [session.exercises, session.answers, session.times, session.timedOut, session.mode]
  );

  return {
    exercises: session.exercises,
    currentIndex: session.currentIndex,
    answers: session.answers,
    times: session.times,
    timedOut: session.timedOut,
    startTime: session.startTime,
    isFinished: session.isFinished,
    mode: session.mode,
    startSession,
    submitAnswer,
    forceFinish,
    finishSession,
  };
}
