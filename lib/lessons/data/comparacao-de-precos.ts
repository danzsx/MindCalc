import type { LessonContent, LessonExerciseData, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(totalPrice: number, quantity: number): LessonExerciseData {
  const unitPrice = totalPrice / quantity;

  return {
    operand1: totalPrice,
    operand2: quantity,
    operator: "/",
    correctAnswer: unitPrice,
    fullHint: `Divida o preco total pela quantidade: ${totalPrice} / ${quantity} = ${unitPrice}.`,
    partialHint: `Preco por unidade: ${totalPrice} / ${quantity} = ...`,
    stepByStep: [
      "Para comparar precos, encontre o preco por unidade",
      `Divida: ${totalPrice} / ${quantity} = ${unitPrice}`,
      `O preco unitario e ${unitPrice}`,
    ],
  };
}

function generateExercise(): LessonExerciseData {
  const quantity = randomInt(2, 12);
  const unitPrice = randomInt(2, 20);
  const totalPrice = unitPrice * quantity;
  return generate(totalPrice, quantity);
}

const comparacaoDePrecos: LessonContent = {
  slug: "comparacao-de-precos",
  title: "Comparacao de precos: qual vale mais a pena?",
  technique: "Preco por unidade (dividir total pela quantidade)",
  operator: "/",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Para saber qual produto e mais barato, divida o preco total pela quantidade. O menor preco por unidade e o melhor negocio!",
    example: {
      expression: "24 / 6",
      steps: [
        "Pacote A: 24 reais por 6 unidades",
        "Preco por unidade: 24 / 6 = 4 reais cada",
        "Compare com outro pacote para achar o melhor preco!",
      ],
      answer: 4,
    },
  },

  exercises: {
    guided: generate(36, 6),
    semiGuided: generate(56, 8),
    free: generate(84, 7),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generateExercise());
    }
    return exercises;
  },

  interactive: {
    type: "price-comparison",
    introOperand1: 24,
    introOperand2: 6,
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      return [
        { prompt: `Preco unitario: ${operand1} / ${operand2} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default comparacaoDePrecos;
