import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

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
    type: "step-discovery",
    introOperand1: 24,
    introOperand2: 6,
    introScreens: (() => {
      const totalPrice = 24, quantity = 6, unitPrice = 4;
      return [
        { kind: "observe", message: "No mercado: Pacote A custa R$24 com 6 unidades. Pacote B custa R$20 com 4 unidades. Qual e melhor?", expressionLabel: "R$24 por 6 und vs R$20 por 4 und" } as IntroScreen,
        { kind: "action", message: "O truque: divida o preco pela quantidade para achar o preco por unidade!", buttonText: "Ver o truque!", resultMessage: "Preco unitario = preco / quantidade", resultHighlight: "Quem tem menor preco unitario vence!" } as IntroScreen,
        { kind: "fill", question: "Pacote A: quanto custa cada unidade?", equationHint: `${totalPrice} / ${quantity} = ?`, answer: unitPrice, winMsg: `Cada unidade do Pacote A custa R$${unitPrice}!` } as IntroScreen,
        { kind: "solve", message: "Pacote B: R$20 / 4 = R$5 cada. Qual pacote e mais barato por unidade?", equationDisplay: `${totalPrice} / ${quantity} = ?`, answer: unitPrice, winMsg: `Pacote A (R$${unitPrice}) ganha do Pacote B (R$5)!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Divida preco pela quantidade = preco unitario", color: "cyan" as const },
          { text: `Pacote A: ${totalPrice} / ${quantity} = R$${unitPrice} cada`, color: "amber" as const },
          { text: "Compare os precos unitarios e escolha o menor!", color: "emerald" as const },
        ], closingMsg: "Agora voce nunca mais paga caro no mercado!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      return [
        { prompt: `Preco unitario: ${operand1} / ${operand2} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default comparacaoDePrecos;
