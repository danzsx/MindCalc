import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(unitValue: number, quantity: number): LessonExerciseData {
  const answer = unitValue * quantity;

  return {
    operand1: unitValue,
    operand2: quantity,
    operator: "*",
    correctAnswer: answer,
    fullHint: `Primeiro encontre o valor unitÃ¡rio e depois multiplique. Aqui: ${unitValue} Ã— ${quantity} = ${answer}.`,
    partialHint: `Multiplique ${unitValue} por ${quantity}...`,
    stepByStep: [
      `Valor unitÃ¡rio definido`,
      `${unitValue} Ã— ${quantity} = ${answer}`,
      `Esse Ã© o total para a nova quantidade`,
    ],
  };
}

function generateExercise(): LessonExerciseData {
  const unitValue = randomInt(3, 12);
  const quantity = randomInt(4, 9);
  return generate(unitValue, quantity);
}

const regraDe3Proporcao: LessonContent = {
  slug: "regra-de-3-proporcao",
  title: "Regra de 3: resolver problemas de proporÃ§Ã£o",
  technique: "Regra de 3 direta (valor unitÃ¡rio)",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Regra de 3 direta funciona assim: descubra o valor de 1 unidade e depois multiplique pela nova quantidade.",
    example: {
      expression: "5 Ã— 5",
      steps: [
        "Se 2 unidades custam 10, cada unidade custa 10 Ã· 2 = 5",
        "Para 5 unidades: 5 Ã— 5 = 25",
        "Logo, 5 unidades custam 25",
      ],
      answer: 25,
    },
  },

  exercises: {
    guided: generate(6, 5),
    semiGuided: generate(7, 6),
    free: generate(8, 4),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generateExercise());
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 5,
    introOperand2: 5,
    introScreens: (() => {
      // Context: 2 unidades custam 10. Quanto custam 5?
      const unitValue = 5, quantity = 5, answer = 25;
      return [
        { kind: "observe", message: "Se 2 unidades custam 10, quanto custam 5? A regra de 3 resolve!", expressionLabel: "2 und = 10 → 5 und = ?" } as IntroScreen,
        { kind: "action", message: "O segredo: descubra o valor de 1 unidade primeiro!", buttonText: "Descobrir!", resultMessage: "10 / 2 = 5 por unidade", resultHighlight: "Com o valor unitario, tudo fica facil!" } as IntroScreen,
        { kind: "solve", message: "Agora multiplique pelo que voce quer:", equationDisplay: `${unitValue} x ${quantity} = ?`, answer: answer, winMsg: `5 unidades custam ${answer}!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Descubra o valor de 1 unidade (divida)", color: "cyan" as const },
          { text: `Valor unitario: 10 / 2 = ${unitValue}`, color: "amber" as const },
          { text: `Multiplique: ${unitValue} x ${quantity} = ${answer}!`, color: "emerald" as const },
        ], closingMsg: "Regra de 3 direta: ache o unitario e multiplique!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      return [
        { prompt: `Multiplique: ${operand1} x ${operand2} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default regraDe3Proporcao;
