import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a / 4;
  const metade = a / 2;

  return {
    operand1: a,
    operand2: 4,
    operator: "/",
    correctAnswer: answer,
    fullHint: `Divida por 2 primeiro: ${a} ÷ 2 = ${metade}. Agora divida por 2 de novo: ${metade} ÷ 2 = ${answer}.`,
    partialHint: `Comece dividindo por 2: ${a} ÷ 2 = ${metade}...`,
    stepByStep: [
      `Primeira metade: ${a} ÷ 2 = ${metade}`,
      `Segunda metade: ${metade} ÷ 2 = ${answer}`,
      `Então ${a} ÷ 4 = ${answer}`,
    ],
  };
}

/** Generates a number that is divisible by 4. */
function generateDivisibleBy4(): number {
  return randomInt(5, 30) * 4;
}

const dividirPor2E4: LessonContent = {
  slug: "dividir-por-2-e-4",
  title: "Dividir por 2 e por 4 (metade da metade)",
  technique: "Dividir por 2 e por 4 (metade da metade)",
  operator: "/",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Dividir por 4 pode parecer difícil, mas é só dividir por 2 duas vezes! A metade da metade é o mesmo que dividir por 4. Simples assim.",
    example: {
      expression: "84 ÷ 4",
      steps: [
        "Primeira metade: 84 ÷ 2 = 42",
        "Segunda metade: 42 ÷ 2 = 21",
        "Então 84 ÷ 4 = 21",
      ],
      answer: 21,
    },
  },

  exercises: {
    guided: generate(48),
    semiGuided: generate(72),
    free: generate(96),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(generateDivisibleBy4()));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 84,
    introOperand2: 4,
    introScreens: (() => {
      const a = 84;
      const metade = 42;
      const answer = 21;
      return [
        { kind: "observe", message: "84 dividido por 4... parece dificil? Tem um atalho simples!" } as IntroScreen,
        { kind: "action", message: "Dividir por 4 e o mesmo que dividir por 2 duas vezes! Porque 4 = 2 x 2.", buttonText: "Entendi!", resultMessage: `${a} / 4 = ${a} / 2 / 2`, resultHighlight: "Metade da metade!" } as IntroScreen,
        { kind: "fill", question: `Primeira metade: ${a} / 2 = ?`, answer: metade, winMsg: `Boa! ${a} / 2 = ${metade}!`, equationHint: `${a} / 2 = ?` } as IntroScreen,
        { kind: "solve", message: "Segunda metade:", equationDisplay: `${metade} / 2 = ?`, answer: answer, winMsg: "Dividiu por 4 fazendo metade duas vezes!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Dividir por 4 = metade da metade (4 = 2 x 2)`, color: "cyan" as const },
          { text: `Primeira metade: ${a} / 2 = ${metade}`, color: "amber" as const },
          { text: `Segunda metade: ${metade} / 2 = ${answer} — facil!`, color: "emerald" as const },
        ], closingMsg: "Sempre que dividir por 4, faca metade duas vezes!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1 } = exercise;
      const metade = operand1 / 2;
      const answer = operand1 / 4;
      return [
        { prompt: `Primeira metade: ${operand1} / 2 = ?`, answer: metade },
        { prompt: `Segunda metade: ${metade} / 2 = ?`, answer: answer },
      ];
    },
  },
};

export default dividirPor2E4;
