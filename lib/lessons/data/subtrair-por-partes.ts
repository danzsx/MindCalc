import type { LessonContent, LessonExerciseData } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a - b;
  const dezB = Math.floor(b / 10) * 10;
  const uniB = b % 10;
  const parcial = a - dezB;

  return {
    operand1: a,
    operand2: b,
    operator: "-",
    correctAnswer: answer,
    fullHint: `Quebre o ${b} em ${dezB} + ${uniB}. Primeiro: ${a} - ${dezB} = ${parcial}. Depois: ${parcial} - ${uniB} = ${answer}.`,
    partialHint: `Quebre ${b} em dezenas e unidades: ${dezB} + ${uniB}...`,
    stepByStep: [
      `Quebramos ${b} em ${dezB} + ${uniB}`,
      `Tiramos as dezenas: ${a} - ${dezB} = ${parcial}`,
      `Tiramos as unidades: ${parcial} - ${uniB} = ${answer}`,
    ],
  };
}

const subtrairPorPartes: LessonContent = {
  slug: "subtrair-por-partes",
  title: "Subtrair por partes",
  technique: "Subtrair por partes",
  operator: "-",
  difficulty: "beginner",

  intro: {
    explanation:
      "Quando o número que vamos subtrair tem dezenas e unidades, podemos quebrá-lo em partes. Subtraia primeiro as dezenas, depois as unidades. Passo a passo fica fácil!",
    example: {
      expression: "83 - 36",
      steps: [
        "Quebramos 36 em 30 + 6",
        "83 - 30 = 53",
        "53 - 6 = 47",
      ],
      answer: 47,
    },
  },

  exercises: {
    guided: generate(67, 24),
    semiGuided: generate(85, 38),
    free: generate(72, 45),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(40, 95);
      const b = randomInt(12, Math.min(a - 5, 49));
      exercises.push(generate(a, b));
    }
    return exercises;
  },
};

export default subtrairPorPartes;
