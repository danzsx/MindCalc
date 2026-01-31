import type { Operator } from "@/types";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type LessonPhase =
  | "intro"
  | "guided"
  | "semi-guided"
  | "free"
  | "completion";

export type HintLevel = "full" | "partial" | "none";

export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

// ---------------------------------------------------------------------------
// Lesson exercise data (used for guided / semi-guided / free phases)
// ---------------------------------------------------------------------------

export interface LessonExerciseData {
  operand1: number;
  operand2: number;
  operator: Operator;
  correctAnswer: number;
  fullHint: string;
  partialHint: string;
  stepByStep: string[];
}

// ---------------------------------------------------------------------------
// Full lesson content (static data stored in lib/lessons/data/)
// ---------------------------------------------------------------------------

export interface LessonContent {
  slug: string;
  title: string;
  technique: string;
  operator: Operator;
  difficulty: LessonDifficulty;

  intro: {
    explanation: string;
    example: {
      expression: string;
      steps: string[];
      answer: number;
    };
  };

  exercises: {
    guided: LessonExerciseData;
    semiGuided: LessonExerciseData;
    free: LessonExerciseData;
  };

  practiceGenerator: (count: number) => LessonExerciseData[];
}
