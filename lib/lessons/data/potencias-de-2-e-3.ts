import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const POWERS_OF_2: Record<number, number> = {
  1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256, 9: 512, 10: 1024,
};

const POWERS_OF_3: Record<number, number> = {
  1: 3, 2: 9, 3: 27, 4: 81, 5: 243, 6: 729,
};

function generate(base: number, exp: number): LessonExerciseData {
  const answer = Math.pow(base, exp);
  const prev = Math.pow(base, exp - 1);

  return {
    operand1: base,
    operand2: exp,
    operator: "*",
    correctAnswer: answer,
    fullHint: `${base}^${exp - 1} = ${prev}. Multiplique por ${base}: ${prev} × ${base} = ${answer}.`,
    partialHint: `Lembre: ${base}^${exp - 1} = ${prev}. Agora multiplique por ${base}...`,
    stepByStep: [
      `${base}^${exp - 1} = ${prev}`,
      `${prev} × ${base} = ${answer}`,
      `${base}^${exp} = ${answer}`,
    ],
  };
}

const potenciasDe2E3: LessonContent = {
  slug: "potencias-de-2-e-3",
  title: "Potencias de 2 e 3 de cor",
  technique: "Memorizacao estrategica de potencias",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Saber as potencias de 2 (2,4,8,16,32,64,128,256,512,1024) e de 3 (3,9,27,81,243,729) de cor e um superpoder em provas. O padrao: cada potencia e a anterior vezes a base.",
    example: {
      expression: "2^8",
      steps: [
        "2^7 = 128",
        "128 × 2 = 256",
        "Entao 2^8 = 256",
      ],
      answer: 256,
    },
  },

  exercises: {
    guided: generate(2, 6),
    semiGuided: generate(2, 9),
    free: generate(3, 5),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      if (i % 2 === 0) {
        exercises.push(generate(2, randomInt(2, 10)));
      } else {
        exercises.push(generate(3, randomInt(2, 6)));
      }
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 2,
    introOperand2: 8,
    introScreens: (() => {
      return [
        { kind: "observe", message: "2 elevado a 8... parece dificil? Vamos construir passo a passo!", expressionLabel: "2^8" } as IntroScreen,
        { kind: "action", message: "A sequencia de potencias de 2: cada uma e o dobro da anterior.", buttonText: "Vamos la!", resultMessage: "2, 4, 8, 16, 32, 64, 128...", resultHighlight: "Cada passo: × 2!" } as IntroScreen,
        { kind: "fill", question: "2^7 = 128. Quanto e 128 × 2?", answer: 256, winMsg: "2^8 = 256!", equationHint: "128 × 2 = ?" } as IntroScreen,
        { kind: "fill", question: "E as potencias de 3? 3^4 = 81. Quanto e 81 × 3?", answer: 243, winMsg: "3^5 = 243!", equationHint: "81 × 3 = ?" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Potencias de 2: 2,4,8,16,32,64,128,256,512,1024", color: "cyan" as const },
          { text: "Potencias de 3: 3,9,27,81,243,729", color: "amber" as const },
          { text: "O truque: cada potencia = anterior × base", color: "emerald" as const },
        ], closingMsg: "Memorize essas sequencias e voce ganha segundos preciosos em provas!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2 } = exercise;
      const prev = Math.pow(operand1, operand2 - 1);
      const answer = Math.pow(operand1, operand2);
      return [
        { prompt: `${operand1}^${operand2 - 1} = ?`, answer: prev },
        { prompt: `${prev} × ${operand1} = ?`, answer },
      ];
    },
  },
};

export default potenciasDe2E3;
