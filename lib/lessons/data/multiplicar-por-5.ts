import type { LessonContent, LessonExerciseData } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a * 5;
  const vezes10 = a * 10;

  return {
    operand1: a,
    operand2: 5,
    operator: "*",
    correctAnswer: answer,
    fullHint: `Multiplique por 10 primeiro: ${a} × 10 = ${vezes10}. Agora divida por 2: ${vezes10} ÷ 2 = ${answer}.`,
    partialHint: `Pense: ${a} × 10 = ${vezes10}. Agora divida...`,
    stepByStep: [
      `Multiplicamos por 10: ${a} × 10 = ${vezes10}`,
      `Dividimos por 2: ${vezes10} ÷ 2 = ${answer}`,
      `Então ${a} × 5 = ${answer}`,
    ],
  };
}

const multiplicarPor5: LessonContent = {
  slug: "multiplicar-por-5",
  title: "Multiplicar por 5 (metade de 10x)",
  technique: "Multiplicar por 5 (metade de 10x)",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Multiplicar por 5 fica fácil com um truque: multiplique por 10 (basta colocar um zero) e depois divida por 2. Metade de 10 vezes é a mesma coisa que 5 vezes!",
    example: {
      expression: "14 × 5",
      steps: [
        "14 × 10 = 140",
        "140 ÷ 2 = 70",
        "Então 14 × 5 = 70",
      ],
      answer: 70,
    },
  },

  exercises: {
    guided: generate(12),
    semiGuided: generate(18),
    free: generate(24),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(randomInt(6, 30)));
    }
    return exercises;
  },
};

export default multiplicarPor5;
