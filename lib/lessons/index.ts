import type { LessonContent } from "./types";

import somarDezenas from "./data/somar-dezenas";
import somarArredondando from "./data/somar-arredondando";
import subtrairCompletando from "./data/subtrair-completando";
import subtrairPorPartes from "./data/subtrair-por-partes";
import multiplicarPor5 from "./data/multiplicar-por-5";
import multiplicarPor9 from "./data/multiplicar-por-9";
import dividirPor2E4 from "./data/dividir-por-2-e-4";
import dividirPensandoNaMultiplicacao from "./data/dividir-pensando-na-multiplicacao";

/**
 * All available lessons ordered by `sort_order` (same as the seed data).
 */
export const allLessons: LessonContent[] = [
  somarDezenas,
  somarArredondando,
  subtrairCompletando,
  subtrairPorPartes,
  multiplicarPor5,
  multiplicarPor9,
  dividirPor2E4,
  dividirPensandoNaMultiplicacao,
];

/**
 * Lookup a lesson by its slug. Returns `undefined` if not found.
 */
export function getLessonBySlug(slug: string): LessonContent | undefined {
  return allLessons.find((lesson) => lesson.slug === slug);
}

// Re-export types and engine for convenience
export type { LessonContent, LessonExerciseData, LessonPhase, HintLevel, LessonDifficulty } from "./types";
export { getExerciseForPhase, generatePracticeExercises, checkAnswer } from "./engine";
