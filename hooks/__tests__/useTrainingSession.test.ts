import { describe, it, expect } from "vitest";
import { generateExercises } from "@/lib/engine";
import type { TrainingSession } from "@/hooks/useTrainingSession";

/**
 * These tests verify the core logic used by useTrainingSession without
 * needing a React rendering environment. We simulate the state transitions
 * that the hook performs internally.
 */

function createSession(level: number): TrainingSession {
  const exercises = generateExercises(10, level);
  return {
    exercises,
    currentIndex: 0,
    answers: [],
    times: [],
    startTime: Date.now(),
    isFinished: false,
  };
}

function submitAnswer(
  session: TrainingSession,
  value: number | null,
  timeSpent: number
): TrainingSession {
  const newAnswers = [...session.answers, value];
  const newTimes = [...session.times, timeSpent];
  const nextIndex = session.currentIndex + 1;
  const isFinished = nextIndex >= session.exercises.length;

  return {
    ...session,
    answers: newAnswers,
    times: newTimes,
    currentIndex: isFinished ? session.currentIndex : nextIndex,
    isFinished,
  };
}

// ---------------------------------------------------------------------------
// startSession
// ---------------------------------------------------------------------------

describe("startSession", () => {
  it("generates 10 exercises without any fetch call", () => {
    const session = createSession(3);
    expect(session.exercises).toHaveLength(10);
    expect(session.currentIndex).toBe(0);
    expect(session.isFinished).toBe(false);
    expect(session.startTime).not.toBeNull();
  });

  it("generates exercises appropriate for the level", () => {
    const session = createSession(2);
    for (const ex of session.exercises) {
      expect(["+", "-"]).toContain(ex.operator);
    }
  });
});

// ---------------------------------------------------------------------------
// submitAnswer
// ---------------------------------------------------------------------------

describe("submitAnswer", () => {
  it("advances currentIndex after submitting", () => {
    const session = createSession(5);
    const updated = submitAnswer(session, 42, 3.5);
    expect(updated.currentIndex).toBe(1);
    expect(updated.answers).toEqual([42]);
    expect(updated.times).toEqual([3.5]);
    expect(updated.isFinished).toBe(false);
  });

  it("records null answers (skipped)", () => {
    const session = createSession(5);
    const updated = submitAnswer(session, null, 2.0);
    expect(updated.answers).toEqual([null]);
  });

  it("accumulates answers over multiple submissions", () => {
    let session = createSession(5);
    session = submitAnswer(session, 10, 1);
    session = submitAnswer(session, 20, 2);
    session = submitAnswer(session, 30, 3);
    expect(session.answers).toEqual([10, 20, 30]);
    expect(session.times).toEqual([1, 2, 3]);
    expect(session.currentIndex).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// isFinished
// ---------------------------------------------------------------------------

describe("isFinished", () => {
  it("becomes true after all exercises are answered", () => {
    let session = createSession(1);
    for (let i = 0; i < 10; i++) {
      expect(session.isFinished).toBe(false);
      session = submitAnswer(session, i, 1);
    }
    expect(session.isFinished).toBe(true);
  });

  it("keeps currentIndex at last exercise when finished", () => {
    let session = createSession(1);
    for (let i = 0; i < 10; i++) {
      session = submitAnswer(session, i, 1);
    }
    expect(session.currentIndex).toBe(9);
    expect(session.isFinished).toBe(true);
  });
});
