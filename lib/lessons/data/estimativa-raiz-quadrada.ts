import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(n: number): LessonExerciseData {
  const raiz = Math.sqrt(n);
  const lower = Math.floor(raiz);
  const answer = lower;

  return {
    operand1: n,
    operand2: 0,
    operator: "/",
    correctAnswer: answer,
    fullHint: `${lower}² = ${lower * lower} e ${lower + 1}² = ${(lower + 1) * (lower + 1)}. Como ${lower * lower} ≤ ${n} < ${(lower + 1) * (lower + 1)}, a raiz esta entre ${lower} e ${lower + 1}. Responda ${lower}.`,
    partialHint: `Pense: qual quadrado perfeito fica logo abaixo de ${n}?`,
    stepByStep: [
      `${lower}² = ${lower * lower}`,
      `${lower + 1}² = ${(lower + 1) * (lower + 1)}`,
      `${lower * lower} ≤ ${n} < ${(lower + 1) * (lower + 1)}, entao √${n} ≈ ${lower}`,
    ],
  };
}

// Only non-perfect squares for estimation practice
function generateNonPerfect(): number {
  const perfect = new Set([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196]);
  let n: number;
  do {
    n = randomInt(5, 200);
  } while (perfect.has(n));
  return n;
}

const estimativaRaizQuadrada: LessonContent = {
  slug: "estimativa-raiz-quadrada",
  title: "Estimativa de raiz quadrada",
  technique: "Encontrar entre quais inteiros a raiz esta",
  operator: "/",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Para estimar a raiz quadrada de um numero, encontre entre quais quadrados perfeitos ele esta. Ex: √50 — como 7²=49 e 8²=64, √50 esta entre 7 e 8. Responda o inteiro menor (7).",
    example: {
      expression: "√50",
      steps: [
        "7² = 49",
        "8² = 64",
        "49 < 50 < 64, entao √50 ≈ 7",
      ],
      answer: 7,
    },
  },

  exercises: {
    guided: generate(50),
    semiGuided: generate(30),
    free: generate(150),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(generateNonPerfect()));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 50,
    introOperand2: 0,
    introScreens: (() => {
      return [
        { kind: "observe", message: "Raiz quadrada de 50? Sem calculadora, voce consegue estimar rapido!", expressionLabel: "√50" } as IntroScreen,
        { kind: "fill", question: "Quanto e 7 ao quadrado?", answer: 49, winMsg: "7² = 49. Perto de 50!", equationHint: "7² = ?" } as IntroScreen,
        { kind: "fill", question: "E 8 ao quadrado?", answer: 64, winMsg: "8² = 64. 50 esta entre 49 e 64!", equationHint: "8² = ?" } as IntroScreen,
        { kind: "solve", message: "√50 esta entre 7 e 8. Qual e o inteiro menor?", equationDisplay: "√50 ≈ ?", answer: 7, winMsg: "Isso! √50 esta entre 7 e 8, responda 7!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Encontre os quadrados perfeitos vizinhos", color: "cyan" as const },
          { text: "7² = 49 e 8² = 64", color: "amber" as const },
          { text: "49 < 50 < 64 → √50 ≈ 7", color: "emerald" as const },
        ], closingMsg: "Super util para provas! Memorize os quadrados de 1 a 15." } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, correctAnswer } = exercise;
      const lower = correctAnswer;
      return [
        { prompt: `${lower}² = ?`, answer: lower * lower },
        { prompt: `${lower + 1}² = ?`, answer: (lower + 1) * (lower + 1) },
        { prompt: `√${operand1} esta entre ${lower} e ${lower + 1}. Inteiro menor = ?`, answer: lower },
      ];
    },
  },
};

export default estimativaRaizQuadrada;
