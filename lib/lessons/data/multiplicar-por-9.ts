import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a * 9;
  const vezes10 = a * 10;

  return {
    operand1: a,
    operand2: 9,
    operator: "*",
    correctAnswer: answer,
    fullHint: `Multiplique por 10: ${a} × 10 = ${vezes10}. Agora subtraia ${a}: ${vezes10} - ${a} = ${answer}.`,
    partialHint: `Pense: ${a} × 10 = ${vezes10}. Agora subtraia...`,
    stepByStep: [
      `Multiplicamos por 10: ${a} × 10 = ${vezes10}`,
      `Subtraímos o número original: ${vezes10} - ${a} = ${answer}`,
      `Então ${a} × 9 = ${answer}`,
    ],
  };
}

const multiplicarPor9: LessonContent = {
  slug: "multiplicar-por-9",
  title: "Multiplicar por 9 (10x - 1x)",
  technique: "Multiplicar por 9 (10x - 1x)",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Para multiplicar por 9, use este truque: multiplique o número por 10 e depois subtraia o próprio número. Como 9 = 10 - 1, funciona sempre!",
    example: {
      expression: "7 × 9",
      steps: [
        "7 × 10 = 70",
        "70 - 7 = 63",
        "Então 7 × 9 = 63",
      ],
      answer: 63,
    },
  },

  exercises: {
    guided: generate(6),
    semiGuided: generate(8),
    free: generate(13),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(randomInt(3, 25)));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 7,
    introOperand2: 9,
    introScreens: (() => {
      const a = 7;
      const vezes10 = 70;
      const answer = 63;
      return [
        { kind: "observe", message: "7 vezes 9... existe um truque genial! O 9 e quase 10." } as IntroScreen,
        { kind: "choice", question: "9 e quase quanto?", options: [
          { label: "8", value: "8" },
          { label: "10", value: "10" },
          { label: "11", value: "11" },
        ], correct: "10", wrongMsg: "Pense: 9 e so 1 a menos que...", winMsg: "Isso! 9 = 10 - 1!" } as IntroScreen,
        { kind: "fill", question: `Multiplique por 10: ${a} x 10 = ?`, answer: vezes10, winMsg: `Boa! ${a} x 10 = ${vezes10}!`, equationHint: `${a} x 10 = ?` } as IntroScreen,
        { kind: "solve", message: "Agora tire o numero original:", equationDisplay: `${vezes10} - ${a} = ?`, answer: answer, winMsg: "Multiplicou por 9 sem decorar tabuada!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `9 = 10 - 1 — entao x9 = x10 - x1`, color: "cyan" as const },
          { text: `Multiplicamos por 10: ${a} x 10 = ${vezes10}`, color: "amber" as const },
          { text: `Subtraimos: ${vezes10} - ${a} = ${answer} — genial!`, color: "emerald" as const },
        ], closingMsg: "Funciona com qualquer numero vezes 9!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1 } = exercise;
      const vezes10 = operand1 * 10;
      const answer = operand1 * 9;
      return [
        { prompt: `x 10: ${operand1} x 10 = ?`, answer: vezes10 },
        { prompt: `Subtraia: ${vezes10} - ${operand1} = ?`, answer: answer },
      ];
    },
  },
};

export default multiplicarPor9;
