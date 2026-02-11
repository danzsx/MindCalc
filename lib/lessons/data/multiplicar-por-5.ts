import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a * 5;
  const vezes10 = a * 10;

  return {
    operand1: a,
    operand2: 5,
    operator: "*",
    correctAnswer: answer,
    fullHint: `Multiplique por 10 primeiro: ${a} × 10 = ${vezes10}. Agora divida por 2: ${vezes10} ÷ 2 = ${answer}.`,
    partialHint: `Pense: ${a} × 10 = ${vezes10}. Agora divida...`,
    stepByStep: [
      `Multiplicamos por 10: ${a} × 10 = ${vezes10}`,
      `Dividimos por 2: ${vezes10} ÷ 2 = ${answer}`,
      `Então ${a} × 5 = ${answer}`,
    ],
  };
}

const multiplicarPor5: LessonContent = {
  slug: "multiplicar-por-5",
  title: "Multiplicar por 5 (metade de 10x)",
  technique: "Multiplicar por 5 (metade de 10x)",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Multiplicar por 5 fica fácil com um truque: multiplique por 10 (basta colocar um zero) e depois divida por 2. Metade de 10 vezes é a mesma coisa que 5 vezes!",
    example: {
      expression: "14 × 5",
      steps: [
        "14 × 10 = 140",
        "140 ÷ 2 = 70",
        "Então 14 × 5 = 70",
      ],
      answer: 70,
    },
  },

  exercises: {
    guided: generate(12),
    semiGuided: generate(18),
    free: generate(24),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(randomInt(6, 30)));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 14,
    introOperand2: 5,
    introScreens: (() => {
      const a = 14;
      const vezes10 = 140;
      const answer = 70;
      return [
        { kind: "observe", message: "14 vezes 5... parece chato? Tem um truque genial pra multiplicar por 5!" } as IntroScreen,
        { kind: "choice", question: "5 e a metade de qual numero?", options: [
          { label: "8", value: "8" },
          { label: "10", value: "10" },
          { label: "15", value: "15" },
        ], correct: "10", wrongMsg: "Pense bem: a metade de qual numero da 5?", winMsg: "Isso! 5 e a metade de 10!" } as IntroScreen,
        { kind: "fill", question: `Multiplique por 10 (so colocar um zero!): ${a} x 10 = ?`, answer: vezes10, winMsg: `Boa! ${a} x 10 = ${vezes10}!`, equationHint: `${a} x 10 = ?` } as IntroScreen,
        { kind: "solve", message: "Agora divida por 2:", equationDisplay: `${vezes10} / 2 = ?`, answer: answer, winMsg: "Multiplicou por 5 sem esforco!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `5 e metade de 10 — entao x5 = x10 / 2`, color: "cyan" as const },
          { text: `Multiplicamos por 10: ${a} x 10 = ${vezes10}`, color: "amber" as const },
          { text: `Dividimos por 2: ${vezes10} / 2 = ${answer} — rapido!`, color: "emerald" as const },
        ], closingMsg: "Esse truque funciona com qualquer numero vezes 5!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1 } = exercise;
      const vezes10 = operand1 * 10;
      const answer = operand1 * 5;
      return [
        { prompt: `x 10: ${operand1} x 10 = ?`, answer: vezes10 },
        { prompt: `/ 2: ${vezes10} / 2 = ?`, answer: answer },
      ];
    },
  },
};

export default multiplicarPor5;
