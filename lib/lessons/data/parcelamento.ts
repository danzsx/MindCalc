import type { LessonContent, LessonExerciseData, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(parcela: number, numParcelas: number): LessonExerciseData {
  const total = parcela * numParcelas;

  return {
    operand1: parcela,
    operand2: numParcelas,
    operator: "*",
    correctAnswer: total,
    fullHint: `Multiplique a parcela pelo numero de vezes: ${parcela} x ${numParcelas} = ${total}.`,
    partialHint: `Total parcelado: ${parcela} x ${numParcelas} = ...`,
    stepByStep: [
      "Para saber o total parcelado, multiplique a parcela pelo numero de parcelas",
      `${parcela} x ${numParcelas} = ${total}`,
      `O total parcelado e R$${total}`,
    ],
  };
}

function generateExercise(): LessonExerciseData {
  const parcela = randomInt(5, 50) * 10;
  const options = [3, 6, 10, 12];
  const numParcelas = options[randomInt(0, options.length - 1)];
  return generate(parcela, numParcelas);
}

const parcelamento: LessonContent = {
  slug: "parcelamento",
  title: "Parcelamento: quanto voce realmente paga?",
  technique: "Total parcelado = parcela x numero de parcelas",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Quando voce parcela uma compra, o total pode ser bem mais caro que a vista. Para descobrir, multiplique o valor da parcela pelo numero de vezes.",
    example: {
      expression: "150 x 10",
      steps: [
        "Produto a vista: R$1200. Parcelado: 10x de R$150",
        "Total parcelado: 150 x 10 = R$1500",
        "Voce pagaria R$300 a mais parcelando!",
      ],
      answer: 1500,
    },
  },

  exercises: {
    guided: generate(120, 6),
    semiGuided: generate(250, 10),
    free: generate(180, 12),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generateExercise());
    }
    return exercises;
  },

  interactive: {
    type: "parcelamento",
    introOperand1: 150,
    introOperand2: 10,
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      return [
        { prompt: `Total parcelado: ${operand1} x ${operand2} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default parcelamento;
