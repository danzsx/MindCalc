import type { LessonContent } from "./types";

import somarDezenas from "./data/somar-dezenas";
import somarArredondando from "./data/somar-arredondando";
import subtrairCompletando from "./data/subtrair-completando";
import subtrairPorPartes from "./data/subtrair-por-partes";
import multiplicarPor5 from "./data/multiplicar-por-5";
import multiplicarPor9 from "./data/multiplicar-por-9";
import dividirPor2E4 from "./data/dividir-por-2-e-4";
import dividirPensandoNaMultiplicacao from "./data/dividir-pensando-na-multiplicacao";
import porcentagem10 from "./data/porcentagem-10";
import porcentagemQuantoE from "./data/porcentagem-quanto-e";
import fracaoMetadeTercoQuarto from "./data/fracao-metade-terco-quarto";
import fracaoSomarSubtrair from "./data/fracao-somar-subtrair";
import regraDe3Proporcao from "./data/regra-de-3-proporcao";
import regraDe3Inversa from "./data/regra-de-3-inversa";

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
  porcentagem10,
  porcentagemQuantoE,
  fracaoMetadeTercoQuarto,
  fracaoSomarSubtrair,
  regraDe3Proporcao,
  regraDe3Inversa,
];

/**
 * Lookup a lesson by its slug. Returns `undefined` if not found.
 */
export function getLessonBySlug(slug: string): LessonContent | undefined {
  return allLessons.find((lesson) => lesson.slug === slug);
}

// Re-export types and engine for convenience
export type { LessonContent, LessonExerciseData, LessonPhase, HintLevel, LessonDifficulty, IntroScreen, StrategyStep, InteractiveLessonConfig } from "./types";
export { getExerciseForPhase, generatePracticeExercises, checkAnswer } from "./engine";
