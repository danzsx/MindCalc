import type { LessonContent, LessonExerciseData } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a / 4;
  const metade = a / 2;

  return {
    operand1: a,
    operand2: 4,
    operator: "/",
    correctAnswer: answer,
    fullHint: `Divida por 2 primeiro: ${a} ÷ 2 = ${metade}. Agora divida por 2 de novo: ${metade} ÷ 2 = ${answer}.`,
    partialHint: `Comece dividindo por 2: ${a} ÷ 2 = ${metade}...`,
    stepByStep: [
      `Primeira metade: ${a} ÷ 2 = ${metade}`,
      `Segunda metade: ${metade} ÷ 2 = ${answer}`,
      `Então ${a} ÷ 4 = ${answer}`,
    ],
  };
}

/** Generates a number that is divisible by 4. */
function generateDivisibleBy4(): number {
  return randomInt(5, 30) * 4;
}

const dividirPor2E4: LessonContent = {
  slug: "dividir-por-2-e-4",
  title: "Dividir por 2 e por 4 (metade da metade)",
  technique: "Dividir por 2 e por 4 (metade da metade)",
  operator: "/",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Dividir por 4 pode parecer difícil, mas é só dividir por 2 duas vezes! A metade da metade é o mesmo que dividir por 4. Simples assim.",
    example: {
      expression: "84 ÷ 4",
      steps: [
        "Primeira metade: 84 ÷ 2 = 42",
        "Segunda metade: 42 ÷ 2 = 21",
        "Então 84 ÷ 4 = 21",
      ],
      answer: 21,
    },
  },

  exercises: {
    guided: generate(48),
    semiGuided: generate(72),
    free: generate(96),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(generateDivisibleBy4()));
    }
    return exercises;
  },
};

export default dividirPor2E4;
