import type { LessonContent, LessonExerciseData } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a + b;
  const dezA = Math.floor(a / 10) * 10;
  const uniA = a % 10;
  const dezB = Math.floor(b / 10) * 10;
  const uniB = b % 10;
  const somaDez = dezA + dezB;
  const somaUni = uniA + uniB;

  return {
    operand1: a,
    operand2: b,
    operator: "+",
    correctAnswer: answer,
    fullHint: `Separe as dezenas: ${dezA} + ${dezB} = ${somaDez}. Depois some as unidades: ${uniA} + ${uniB} = ${somaUni}. Por fim, ${somaDez} + ${somaUni} = ${answer}.`,
    partialHint: `Comece pelas dezenas: ${dezA} + ${dezB} = ${somaDez}...`,
    stepByStep: [
      `Separamos as dezenas: ${dezA} + ${dezB} = ${somaDez}`,
      `Separamos as unidades: ${uniA} + ${uniB} = ${somaUni}`,
      `Juntamos tudo: ${somaDez} + ${somaUni} = ${answer}`,
    ],
  };
}

const somarDezenas: LessonContent = {
  slug: "somar-dezenas-primeiro",
  title: "Somar dezenas primeiro",
  technique: "Somar dezenas primeiro",
  operator: "+",
  difficulty: "beginner",

  intro: {
    explanation:
      "Quando somamos dois números, fica mais fácil separar as dezenas e as unidades. Primeiro somamos as dezenas, depois as unidades, e no final juntamos tudo.",
    example: {
      expression: "37 + 48",
      steps: [
        "Dezenas: 30 + 40 = 70",
        "Unidades: 7 + 8 = 15",
        "Juntando: 70 + 15 = 85",
      ],
      answer: 85,
    },
  },

  exercises: {
    guided: generate(25, 43),
    semiGuided: generate(56, 38),
    free: generate(47, 36),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(12, 49);
      const b = randomInt(12, 49);
      exercises.push(generate(a, b));
    }
    return exercises;
  },
};

export default somarDezenas;
