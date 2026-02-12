import type { LessonContent } from "./types";

import somarDezenas from "./data/somar-dezenas-primeiro";
import somarArredondando from "./data/somar-arredondando";
import subtrairCompletando from "./data/subtrair-completando";
import subtrairPorPartes from "./data/subtrair-por-partes";
import multiplicarPor5 from "./data/multiplicar-por-5";
import multiplicarPor9 from "./data/multiplicar-por-9";
import dividirPor2E4 from "./data/dividir-por-2-e-4";
import dividirPensandoNaMultiplicacao from "./data/dividir-pensando-na-multiplicacao";
import estimativasSimples from "./data/estimativas-simples";
import porcentagem10 from "./data/porcentagem-10";
import porcentagemQuantoE from "./data/porcentagem-quanto-e";
import fracaoMetadeTercoQuarto from "./data/fracao-metade-terco-quarto";
import fracaoSomarSubtrair from "./data/fracao-somar-subtrair";
import regraDe3Proporcao from "./data/regra-de-3-proporcao";
import regraDe3Inversa from "./data/regra-de-3-inversa";
import comparacaoDePrecos from "./data/comparacao-de-precos";
import jurosSimples from "./data/juros-simples";
import parcelamento from "./data/parcelamento";
import multiplicarPor11 from "./data/multiplicar-por-11";
import quadradoTerminadosEm5 from "./data/quadrado-terminados-em-5";
import multiplicarProximos100 from "./data/multiplicar-proximos-100";
import divisibilidadeRapida from "./data/divisibilidade-rapida";
import estimativaRaizQuadrada from "./data/estimativa-raiz-quadrada";
import potenciasDe2E3 from "./data/potencias-de-2-e-3";

/**
 * All available lessons ordered by `sort_order` (same as the seed data).
 */
export const allLessons: LessonContent[] = [
  // Basicas (sort_order 1-99)
  somarDezenas,
  somarArredondando,
  subtrairCompletando,
  subtrairPorPartes,
  multiplicarPor5,
  multiplicarPor9,
  dividirPor2E4,
  dividirPensandoNaMultiplicacao,
  estimativasSimples,
  // Dia a Dia (sort_order 100-199)
  porcentagem10,
  porcentagemQuantoE,
  fracaoMetadeTercoQuarto,
  fracaoSomarSubtrair,
  regraDe3Proporcao,
  regraDe3Inversa,
  comparacaoDePrecos,
  jurosSimples,
  parcelamento,
  // Vestibulares (sort_order 200-299)
  multiplicarPor11,
  quadradoTerminadosEm5,
  multiplicarProximos100,
  divisibilidadeRapida,
  estimativaRaizQuadrada,
  potenciasDe2E3,
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
