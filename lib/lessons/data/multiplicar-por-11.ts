import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a * 11;
  const d1 = Math.floor(a / 10);
  const d2 = a % 10;
  const meio = d1 + d2;

  const isSimple = meio < 10;

  return {
    operand1: a,
    operand2: 11,
    operator: "*",
    correctAnswer: answer,
    fullHint: isSimple
      ? `Digitos: ${d1} e ${d2}. Some: ${d1} + ${d2} = ${meio}. Coloque no meio: ${d1}${meio}${d2} = ${answer}.`
      : `Digitos: ${d1} e ${d2}. Some: ${d1} + ${d2} = ${meio}. Vai um: ${d1 + 1}${meio % 10}${d2} = ${answer}.`,
    partialHint: `Some os digitos: ${d1} + ${d2} = ${meio}. Coloque no meio...`,
    stepByStep: isSimple
      ? [
          `Separe os digitos: ${d1} e ${d2}`,
          `Some: ${d1} + ${d2} = ${meio}`,
          `Coloque no meio: ${answer}`,
        ]
      : [
          `Separe os digitos: ${d1} e ${d2}`,
          `Some: ${d1} + ${d2} = ${meio} (vai 1)`,
          `Resultado: ${answer}`,
        ],
  };
}

const multiplicarPor11: LessonContent = {
  slug: "multiplicar-por-11",
  title: "Multiplicar por 11 em segundos",
  technique: "Multiplicar por 11 — digitos somam o meio",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Para multiplicar um numero de 2 digitos por 11, separe os digitos e coloque a soma deles no meio. Ex: 36 x 11 → 3_(3+6)_6 = 396.",
    example: {
      expression: "36 × 11",
      steps: [
        "Separe: 3 e 6",
        "Some: 3 + 6 = 9",
        "Coloque no meio: 396",
      ],
      answer: 396,
    },
  },

  exercises: {
    guided: generate(27),
    semiGuided: generate(45),
    free: generate(63),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(randomInt(11, 89)));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 36,
    introOperand2: 11,
    introScreens: (() => {
      return [
        { kind: "observe", message: "36 vezes 11... parece dificil? Existe um truque instantaneo!" } as IntroScreen,
        { kind: "action", message: "Separe os digitos do numero: 3 e 6", buttonText: "Separei!", resultMessage: "Agora some eles!", resultHighlight: "3 + 6 = 9" } as IntroScreen,
        { kind: "fill", question: "Some os digitos: 3 + 6 = ?", answer: 9, winMsg: "Perfeito! Agora coloque o 9 no meio!", equationHint: "3 + 6 = ?" } as IntroScreen,
        { kind: "solve", message: "Coloque a soma no meio dos digitos: 3_9_6 = ?", equationDisplay: "36 × 11 = ?", answer: 396, winMsg: "Incrivel! 36 x 11 = 396!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Separe os digitos: 3 e 6", color: "cyan" as const },
          { text: "Some: 3 + 6 = 9", color: "amber" as const },
          { text: "Coloque no meio: 396 — instantaneo!", color: "emerald" as const },
        ], closingMsg: "Funciona com qualquer numero de 2 digitos vezes 11!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1 } = exercise;
      const d1 = Math.floor(operand1 / 10);
      const d2 = operand1 % 10;
      const soma = d1 + d2;
      const answer = operand1 * 11;
      return [
        { prompt: `Some os digitos: ${d1} + ${d2} = ?`, answer: soma },
        { prompt: `Monte o resultado: ${operand1} × 11 = ?`, answer },
      ];
    },
  },
};

export default multiplicarPor11;
