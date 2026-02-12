import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(base: number): LessonExerciseData {
  const half = base / 2;
  const quarter = base / 4;
  const answer = half + quarter;

  return {
    operand1: half,
    operand2: quarter,
    operator: "+",
    correctAnswer: answer,
    fullHint: `Encontre cada fracao e some: ${base} / 2 = ${half} e ${base} / 4 = ${quarter}. Depois ${half} + ${quarter} = ${answer}.`,
    partialHint: `Calcule 1/2 e 1/4 de ${base}...`,
    stepByStep: [
      `Metade de ${base}: ${base} / 2 = ${half}`,
      `Um quarto de ${base}: ${base} / 4 = ${quarter}`,
      `Somando: ${half} + ${quarter} = ${answer}`,
    ],
  };
}

function generateDivisibleBy4(): number {
  return randomInt(8, 30) * 4;
}

const fracaoSomarSubtrair: LessonContent = {
  slug: "fracao-somar-subtrair",
  title: "Fracao: somar e subtrair fracoes simples",
  technique: "Somar fracoes encontrando as partes",
  operator: "+",
  difficulty: "beginner",

  intro: {
    explanation:
      "Para somar fracoes simples, encontre cada parte separadamente e depois some. Exemplo: 1/2 + 1/4 e a soma de metade e um quarto do mesmo valor.",
    example: {
      expression: "40 + 20",
      steps: [
        "Metade de 80: 80 / 2 = 40",
        "Um quarto de 80: 80 / 4 = 20",
        "Somando: 40 + 20 = 60",
      ],
      answer: 60,
    },
  },

  exercises: {
    guided: generate(80),
    semiGuided: generate(120),
    free: generate(160),
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
    introOperand1: 40,
    introOperand2: 20,
    introScreens: (() => {
      const base = 80;
      const half = 40, quarter = 20, answer = 60;
      return [
        { kind: "observe", message: "1/2 + 1/4 de 80: vamos encontrar cada parte e somar!", expressionLabel: "1/2 + 1/4 de 80" } as IntroScreen,
        { kind: "fill", question: `Metade de ${base}: ${base} / 2 = ?`, answer: half, winMsg: `Boa! Metade de ${base} = ${half}!`, equationHint: `${base} / 2 = ?` } as IntroScreen,
        { kind: "fill", question: `Um quarto de ${base}: ${base} / 4 = ?`, answer: quarter, winMsg: `Isso! Um quarto de ${base} = ${quarter}!`, equationHint: `${base} / 4 = ?` } as IntroScreen,
        { kind: "solve", message: "Agora some as partes:", equationDisplay: `${half} + ${quarter} = ?`, answer: answer, winMsg: "Somou as fracoes!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Metade de ${base}: ${base} / 2 = ${half}`, color: "cyan" as const },
          { text: `Um quarto de ${base}: ${base} / 4 = ${quarter}`, color: "amber" as const },
          { text: `Soma: ${half} + ${quarter} = ${answer} - pronto!`, color: "emerald" as const },
        ], closingMsg: "Encontre cada fracao separadamente e depois some!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const base = operand1 * 2;
      return [
        { prompt: `Metade de ${base}: ${base} / 2 = ?`, answer: operand1 },
        { prompt: `Um quarto de ${base}: ${base} / 4 = ?`, answer: operand2 },
        { prompt: `Some: ${operand1} + ${operand2} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default fracaoSomarSubtrair;
