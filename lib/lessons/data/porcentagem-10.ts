import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a / 10;

  return {
    operand1: a,
    operand2: 10,
    operator: "/",
    correctAnswer: answer,
    fullHint: `10% Ã© dividir por 10. EntÃ£o ${a} Ã· 10 = ${answer}.`,
    partialHint: `Divida por 10: ${a} Ã· 10 = ...`,
    stepByStep: [
      `10% Ã© o mesmo que dividir por 10`,
      `FaÃ§a ${a} Ã· 10 = ${answer}`,
      `Logo, 10% de ${a} Ã© ${answer}`,
    ],
  };
}

/** Generates a number divisible by 10. */
function generateDivisibleBy10(): number {
  return randomInt(5, 99) * 10;
}

const porcentagem10: LessonContent = {
  slug: "porcentagem-10",
  title: "Porcentagem: o jeito fÃ¡cil de calcular 10%",
  technique: "Calcular 10% dividindo por 10",
  operator: "/",
  difficulty: "beginner",

  intro: {
    explanation:
      "Calcular 10% Ã© simples: basta dividir por 10 (ou tirar o Ãºltimo zero). A partir daÃ­, vocÃª calcula outras porcentagens com facilidade.",
    example: {
      expression: "250 Ã· 10",
      steps: [
        "10% Ã© dividir por 10",
        "250 Ã· 10 = 25",
        "Logo, 10% de 250 Ã© 25",
      ],
      answer: 25,
    },
  },

  exercises: {
    guided: generate(180),
    semiGuided: generate(430),
    free: generate(760),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(generateDivisibleBy10()));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 250,
    introOperand2: 10,
    introScreens: (() => {
      const a = 250;
      const answer = 25;
      return [
        { kind: "observe", message: "10% de 250... porcentagem parece complicado? Na verdade e super facil!", expressionLabel: "10% de 250" } as IntroScreen,
        { kind: "action", message: "10% e o mesmo que dividir por 10. So tirar o ultimo zero!", buttonText: "Entendi!", resultMessage: "10% = dividir por 10", resultHighlight: "O truque mais util da matematica!" } as IntroScreen,
        { kind: "solve", message: "Divida por 10:", equationDisplay: `${a} / 10 = ?`, answer: answer, winMsg: `Isso! 10% de ${a} = ${answer}!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "10% = dividir por 10 (tirar um zero)", color: "cyan" as const },
          { text: `${a} / 10 = ${answer}`, color: "amber" as const },
          { text: `Logo, 10% de ${a} = ${answer} — simples!`, color: "emerald" as const },
        ], closingMsg: "A partir de 10% voce calcula qualquer porcentagem!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, correctAnswer } = exercise;
      return [
        { prompt: `10% = dividir por 10: ${operand1} / 10 = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default porcentagem10;
