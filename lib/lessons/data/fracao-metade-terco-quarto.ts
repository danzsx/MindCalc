import type { LessonContent, LessonExerciseData, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(divisor: number, base: number): LessonExerciseData {
  const answer = base / divisor;
  const fractionName =
    divisor === 2 ? "a metade" : divisor === 3 ? "um terço" : "um quarto";

  return {
    operand1: base,
    operand2: divisor,
    operator: "/",
    correctAnswer: answer,
    fullHint: `Para achar a fração, divida pelo denominador: ${base} ÷ ${divisor} = ${answer}.`,
    partialHint: `${fractionName} de ${base}... Divida ${base} por ${divisor}.`,
    stepByStep: [
      `Fração significa dividir em partes iguais`,
      `${fractionName} = dividir por ${divisor}`,
      `${base} ÷ ${divisor} = ${answer}`,
      `Então 1/${divisor} de ${base} = ${answer}`,
    ],
  };
}

function generateExercise(): LessonExerciseData {
  const divisors = [2, 3, 4];
  const divisor = divisors[randomInt(0, divisors.length - 1)];
  const base = randomInt(6, 40) * divisor;
  return generate(divisor, base);
}

const fracaoMetadeTercoQuarto: LessonContent = {
  slug: "fracao-metade-terco-quarto",
  title: "Frações: metade, terço e quarto",
  technique: "Frações como divisão",
  operator: "/",
  difficulty: "beginner",

  intro: {
    explanation:
      "Fração é dividir em partes iguais. Metade = dividir por 2, um terço = dividir por 3, um quarto = dividir por 4.",
    example: {
      expression: "1/3 de 60",
      steps: [
        "Um terço significa dividir por 3",
        "60 ÷ 3 = 20",
        "Então 1/3 de 60 = 20",
      ],
      answer: 20,
    },
  },

  exercises: {
    guided: generate(2, 84),
    semiGuided: generate(3, 96),
    free: generate(4, 100),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generateExercise());
    }
    return exercises;
  },

  interactive: {
    type: "fraction-pizza",
    introOperand1: 60,
    introOperand2: 3,
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const fractionName =
        operand2 === 2 ? "Metade" : operand2 === 3 ? "Um terço" : "Um quarto";
      return [
        {
          prompt: `${fractionName} = dividir por ?`,
          answer: operand2,
          hint: `${fractionName} significa dividir em ${operand2} partes iguais.`,
        },
        {
          prompt: `${operand1} ÷ ${operand2} = ?`,
          answer: correctAnswer,
          hint: `Divida ${operand1} por ${operand2}.`,
        },
      ];
    },
  },
};

export default fracaoMetadeTercoQuarto;
