import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(divisor: number, base: number): LessonExerciseData {
  const answer = base / divisor;

  return {
    operand1: base,
    operand2: divisor,
    operator: "/",
    correctAnswer: answer,
    fullHint: `Para achar a fraÃ§Ã£o, divida pelo denominador: ${base} Ã· ${divisor} = ${answer}.`,
    partialHint: `Divida ${base} por ${divisor}...`,
    stepByStep: [
      `FraÃ§Ã£o significa dividir em partes iguais`,
      `${base} Ã· ${divisor} = ${answer}`,
      `EntÃ£o 1/${divisor} de ${base} Ã© ${answer}`,
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
  title: "FraÃ§Ã£o: entendendo metade, um terÃ§o e um quarto",
  technique: "FraÃ§Ãµes como divisÃ£o",
  operator: "/",
  difficulty: "beginner",

  intro: {
    explanation:
      "FraÃ§Ã£o Ã© sÃ³ dividir em partes iguais. Metade = dividir por 2, um terÃ§o = dividir por 3, um quarto = dividir por 4.",
    example: {
      expression: "60 Ã· 3",
      steps: [
        "Um terÃ§o Ã© dividir por 3",
        "60 Ã· 3 = 20",
        "Logo, 1/3 de 60 Ã© 20",
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
    type: "step-discovery",
    introOperand1: 60,
    introOperand2: 3,
    introScreens: (() => {
      const base = 60, divisor = 3, answer = 20;
      return [
        { kind: "observe", message: "1/3 de 60... fracao parece complicado? Na verdade e so uma divisao!", expressionLabel: "1/3 de 60" } as IntroScreen,
        { kind: "choice", question: "Um terco significa dividir por quanto?", options: [
          { label: "2", value: "2", sublabel: "metade" },
          { label: "3", value: "3", sublabel: "terco" },
          { label: "4", value: "4", sublabel: "quarto" },
        ], correct: "3", wrongMsg: "Terco vem de tres partes iguais...", winMsg: "Isso! Terco = dividir por 3!" } as IntroScreen,
        { kind: "solve", message: "Entao divida:", equationDisplay: `${base} / ${divisor} = ?`, answer: answer, winMsg: `1/${divisor} de ${base} = ${answer}!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Fracao = dividir em partes iguais", color: "cyan" as const },
          { text: `Terco = dividir por 3`, color: "amber" as const },
          { text: `${base} / ${divisor} = ${answer} — so isso!`, color: "emerald" as const },
        ], closingMsg: "Metade = /2, terco = /3, quarto = /4. Simples!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      return [
        { prompt: `Divida: ${operand1} / ${operand2} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default fracaoMetadeTercoQuarto;
