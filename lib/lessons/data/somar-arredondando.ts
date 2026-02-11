import type { LessonContent, LessonExerciseData } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a + b;
  const unidadeB = b % 10;
  const arredondado = Math.ceil(b / 10) * 10;
  const ajuste = arredondado - b;
  const parcial = a + arredondado;

  return {
    operand1: a,
    operand2: b,
    operator: "+",
    correctAnswer: answer,
    fullHint: `Arredonde ${b} para ${arredondado}: ${a} + ${arredondado} = ${parcial}. Depois subtraia ${ajuste}: ${parcial} - ${ajuste} = ${answer}.`,
    partialHint: `Arredonde ${b} para ${arredondado} e depois ajuste...`,
    stepByStep: [
      `Arredondamos ${b} para ${arredondado} (somamos ${ajuste})`,
      `Somamos: ${a} + ${arredondado} = ${parcial}`,
      `Ajustamos: ${parcial} - ${ajuste} = ${answer}`,
    ],
  };
}

/** Generates a number whose units digit is between 6 and 9 (good for rounding up). */
function generateRoundableNumber(): number {
  const dez = randomInt(1, 4) * 10;
  const uni = randomInt(6, 9);
  return dez + uni;
}

const somarArredondando: LessonContent = {
  slug: "somar-arredondando",
  title: "Somar arredondando para 10",
  technique: "Somar arredondando para 10",
  operator: "+",
  difficulty: "beginner",

  intro: {
    explanation:
      "Quando um dos números está perto de uma dezena, podemos arredondá-lo para cima, somar, e depois tirar o que sobrou. Fica muito mais rápido!",
    example: {
      expression: "34 + 28",
      steps: [
        "Arredondamos 28 para 30",
        "34 + 30 = 64",
        "Ajustamos: 64 - 2 = 62",
      ],
      answer: 62,
    },
  },

  exercises: {
    guided: generate(33, 27),
    semiGuided: generate(56, 29),
    free: generate(43, 38),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(12, 59);
      const b = generateRoundableNumber();
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "round-to-ten",
    introOperand1: 34,
    introOperand2: 28,
  },
};

export default somarArredondando;
