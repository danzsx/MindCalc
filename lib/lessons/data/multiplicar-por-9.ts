import type { LessonContent, LessonExerciseData } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a * 9;
  const vezes10 = a * 10;

  return {
    operand1: a,
    operand2: 9,
    operator: "*",
    correctAnswer: answer,
    fullHint: `Multiplique por 10: ${a} × 10 = ${vezes10}. Agora subtraia ${a}: ${vezes10} - ${a} = ${answer}.`,
    partialHint: `Pense: ${a} × 10 = ${vezes10}. Agora subtraia...`,
    stepByStep: [
      `Multiplicamos por 10: ${a} × 10 = ${vezes10}`,
      `Subtraímos o número original: ${vezes10} - ${a} = ${answer}`,
      `Então ${a} × 9 = ${answer}`,
    ],
  };
}

const multiplicarPor9: LessonContent = {
  slug: "multiplicar-por-9",
  title: "Multiplicar por 9 (10x - 1x)",
  technique: "Multiplicar por 9 (10x - 1x)",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Para multiplicar por 9, use este truque: multiplique o número por 10 e depois subtraia o próprio número. Como 9 = 10 - 1, funciona sempre!",
    example: {
      expression: "7 × 9",
      steps: [
        "7 × 10 = 70",
        "70 - 7 = 63",
        "Então 7 × 9 = 63",
      ],
      answer: 63,
    },
  },

  exercises: {
    guided: generate(6),
    semiGuided: generate(8),
    free: generate(13),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(randomInt(3, 25)));
    }
    return exercises;
  },
};

export default multiplicarPor9;
