import type { LessonContent, LessonExerciseData } from "./types";

/**
 * Generates exercises specifically for a lesson, coherent with the technique
 * being taught. This is separate from `lib/engine.ts` which handles the
 * general training exercise generation.
 *
 * Each lesson data file already contains its own `practiceGenerator`, so this
 * module acts as a thin orchestration layer.
 */

/**
 * Returns the exercise for a given lesson phase.
 *
 * - "guided"      → lesson.exercises.guided
 * - "semi-guided" → lesson.exercises.semiGuided
 * - "free"        → lesson.exercises.free
 */
export function getExerciseForPhase(
  lesson: LessonContent,
  phase: "guided" | "semi-guided" | "free"
): LessonExerciseData {
  switch (phase) {
    case "guided":
      return lesson.exercises.guided;
    case "semi-guided":
      return lesson.exercises.semiGuided;
    case "free":
      return lesson.exercises.free;
  }
}

/**
 * Generates practice exercises for the post-lesson mini-training.
 * Uses the lesson's own `practiceGenerator` to ensure exercises are
 * coherent with the technique taught.
 */
export function generatePracticeExercises(
  lesson: LessonContent,
  count: number = 5
): LessonExerciseData[] {
  return lesson.practiceGenerator(count);
}

/**
 * Checks whether a numeric answer is correct for a given exercise.
 */
export function checkAnswer(
  exercise: LessonExerciseData,
  userAnswer: number
): boolean {
  return userAnswer === exercise.correctAnswer;
}
