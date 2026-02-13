import { describe, it, expect } from "vitest";
import type { Exercise, Operator } from "@/types";

// ---------------------------------------------------------------------------
// Pure logic extracted from app/api/sessions/route.ts
// These functions mirror the inline computations in the API route so we can
// test them without touching Supabase.
// ---------------------------------------------------------------------------

function calculateAccuracy(correctCount: number, total: number): number {
  return (correctCount / total) * 100;
}

function calculateAvgTime(times: number[]): number {
  return times.reduce((sum, t) => sum + t, 0) / times.length;
}

function calculateStreak(
  profile: { streak: number; updated_at: string } | null,
  now: Date
): number {
  if (!profile) return 1;

  const lastUpdate = new Date(profile.updated_at);
  const lastDateStr = lastUpdate.toISOString().slice(0, 10);
  const yesterdayStr = new Date(now.getTime() - 86400000)
    .toISOString()
    .slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);

  if (lastDateStr === yesterdayStr) return profile.streak + 1;
  if (lastDateStr === todayStr) return profile.streak;
  return 1;
}

function mapExerciseLogs(
  exercises: Exercise[],
  answers: (number | null)[],
  times: number[],
  timedOut: boolean[] | undefined,
  sessionId: string,
  userId: string
) {
  return exercises.map((ex, i) => ({
    session_id: sessionId,
    user_id: userId,
    operand1: ex.operand1,
    operand2: ex.operand2,
    operator: ex.operator as Operator,
    correct_answer: ex.correctAnswer,
    user_answer: answers[i],
    time_spent: times[i],
    is_correct: answers[i] === ex.correctAnswer,
    timed_out: timedOut?.[i] ?? false,
    technique_slug: ex.techniqueSlug ?? null,
  }));
}

// ---------------------------------------------------------------------------
// Accuracy calculation
// ---------------------------------------------------------------------------

describe("calculateAccuracy", () => {
  it("returns 100 for 10/10", () => {
    expect(calculateAccuracy(10, 10)).toBe(100);
  });

  it("returns 70 for 7/10", () => {
    expect(calculateAccuracy(7, 10)).toBe(70);
  });

  it("returns 0 for 0/10", () => {
    expect(calculateAccuracy(0, 10)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Average time
// ---------------------------------------------------------------------------

describe("calculateAvgTime", () => {
  it("calculates sum / count", () => {
    expect(calculateAvgTime([2, 4, 6])).toBe(4);
  });

  it("handles single time value", () => {
    expect(calculateAvgTime([5.5])).toBe(5.5);
  });
});

// ---------------------------------------------------------------------------
// Streak logic
// ---------------------------------------------------------------------------

describe("calculateStreak", () => {
  it("yesterday → increment streak", () => {
    const now = new Date("2025-06-15T12:00:00Z");
    const profile = { streak: 5, updated_at: "2025-06-14T20:00:00Z" };
    expect(calculateStreak(profile, now)).toBe(6);
  });

  it("today → keep current streak", () => {
    const now = new Date("2025-06-15T18:00:00Z");
    const profile = { streak: 3, updated_at: "2025-06-15T10:00:00Z" };
    expect(calculateStreak(profile, now)).toBe(3);
  });

  it("older than yesterday → reset to 1", () => {
    const now = new Date("2025-06-15T12:00:00Z");
    const profile = { streak: 10, updated_at: "2025-06-10T12:00:00Z" };
    expect(calculateStreak(profile, now)).toBe(1);
  });

  it("null profile → 1", () => {
    expect(calculateStreak(null, new Date())).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Exercise log mapping
// ---------------------------------------------------------------------------

describe("mapExerciseLogs", () => {
  const exercises: Exercise[] = [
    { operand1: 3, operand2: 4, operator: "+", correctAnswer: 7 },
    {
      operand1: 10,
      operand2: 2,
      operator: "*",
      correctAnswer: 20,
      techniqueSlug: "mult-by-2",
    },
  ];

  it("maps exercises + answers + times to correct log shape", () => {
    const logs = mapExerciseLogs(
      exercises,
      [7, 15],
      [3.2, 5.1],
      [false, true],
      "session-1",
      "user-1"
    );

    expect(logs).toHaveLength(2);

    expect(logs[0]).toEqual({
      session_id: "session-1",
      user_id: "user-1",
      operand1: 3,
      operand2: 4,
      operator: "+",
      correct_answer: 7,
      user_answer: 7,
      time_spent: 3.2,
      is_correct: true,
      timed_out: false,
      technique_slug: null,
    });

    expect(logs[1]).toEqual({
      session_id: "session-1",
      user_id: "user-1",
      operand1: 10,
      operand2: 2,
      operator: "*",
      correct_answer: 20,
      user_answer: 15,
      time_spent: 5.1,
      is_correct: false,
      timed_out: true,
      technique_slug: "mult-by-2",
    });
  });

  it("defaults timed_out to false when timedOut is undefined", () => {
    const logs = mapExerciseLogs(
      exercises,
      [7, 20],
      [2, 3],
      undefined,
      "s1",
      "u1"
    );
    expect(logs[0].timed_out).toBe(false);
    expect(logs[1].timed_out).toBe(false);
  });
});
