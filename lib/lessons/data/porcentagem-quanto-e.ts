import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(part: number, total: number): LessonExerciseData {
  const percent = Math.round((part * 100) / total);
  const scaled = part * 100;

  return {
    operand1: scaled,
    operand2: total,
    operator: "/",
    correctAnswer: percent,
    fullHint: `Multiplique a parte por 100: ${part} x 100 = ${scaled}. Depois divida pelo total: ${scaled} / ${total} = ${percent}.`,
    partialHint: `Primeiro faca ${part} x 100 = ${scaled}...`,
    stepByStep: [
      `Parte x 100: ${part} x 100 = ${scaled}`,
      `Divida pelo total: ${scaled} / ${total} = ${percent}`,
      `Logo, ${part} e ${percent}% de ${total}`,
    ],
  };
}

function generatePair(): { part: number; total: number } {
  const percents = [10, 20, 25, 30, 40, 50];
  const percent = percents[randomInt(0, percents.length - 1)];
  let total: number;

  if (percent === 25) {
    total = randomInt(8, 30) * 4;
  } else {
    total = randomInt(10, 50) * 10;
  }

  const part = (total * percent) / 100;
  return { part, total };
}

const porcentagemQuantoE: LessonContent = {
  slug: "porcentagem-quanto-e",
  title: "Porcentagem: encontrar quanto % e um valor",
  technique: "Encontrar porcentagem (parte x 100 / total)",
  operator: "/",
  difficulty: "beginner",

  intro: {
    explanation:
      "Para descobrir que porcentagem um valor representa, multiplique a parte por 100 e divida pelo total. E a forma direta de achar o percentual.",
    example: {
      expression: "3000 / 120",
      steps: [
        "Multiplique a parte por 100: 30 x 100 = 3000",
        "Divida pelo total: 3000 / 120 = 25",
        "Logo, 30 e 25% de 120",
      ],
      answer: 25,
    },
  },

  exercises: {
    guided: generate(30, 120),
    semiGuided: generate(50, 200),
    free: generate(40, 160),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const { part, total } = generatePair();
      exercises.push(generate(part, total));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 3000,
    introOperand2: 120,
    introScreens: (() => {
      const part = 30, total = 120;
      const scaled = 3000;
      const answer = 25;
      return [
        { kind: "observe", message: "30 e quanto por cento de 120? Vamos descobrir com uma formula simples!", expressionLabel: "30 e ?% de 120" } as IntroScreen,
        { kind: "action", message: "A formula e: parte x 100, depois divide pelo total.", buttonText: "Mostrar!", resultMessage: `${part} x 100 / ${total}`, resultHighlight: "Sempre funciona!" } as IntroScreen,
        { kind: "fill", question: `Primeiro: ${part} x 100 = ?`, answer: scaled, winMsg: `Boa! ${part} x 100 = ${scaled}!`, equationHint: `${part} x 100 = ?` } as IntroScreen,
        { kind: "solve", message: "Agora divida pelo total:", equationDisplay: `${scaled} / ${total} = ?`, answer: answer, winMsg: `${part} e ${answer}% de ${total}!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Formula: parte x 100 / total", color: "cyan" as const },
          { text: `${part} x 100 = ${scaled}`, color: "amber" as const },
          { text: `${scaled} / ${total} = ${answer}% - descobriu!`, color: "emerald" as const },
        ], closingMsg: "Essa formula funciona para encontrar qualquer porcentagem!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      return [
        { prompt: `Parte x 100 ja esta: ${operand1}. Divida: ${operand1} / ${operand2} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default porcentagemQuantoE;
