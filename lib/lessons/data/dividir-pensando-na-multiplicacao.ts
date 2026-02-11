import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(answer: number, divisor: number): LessonExerciseData {
  const a = answer * divisor;

  return {
    operand1: a,
    operand2: divisor,
    operator: "/",
    correctAnswer: answer,
    fullHint: `Pense ao contrário: "Qual número vezes ${divisor} dá ${a}?" — ${answer} × ${divisor} = ${a}. Então ${a} ÷ ${divisor} = ${answer}.`,
    partialHint: `Pense: "? × ${divisor} = ${a}"...`,
    stepByStep: [
      `Transformamos em multiplicação: "? × ${divisor} = ${a}"`,
      `Sabemos que ${answer} × ${divisor} = ${a}`,
      `Então ${a} ÷ ${divisor} = ${answer}`,
    ],
  };
}

const dividirPensandoNaMultiplicacao: LessonContent = {
  slug: "dividir-pensando-na-multiplicacao",
  title: "Dividir pensando na multiplicação",
  technique: "Dividir pensando na multiplicação",
  operator: "/",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Toda divisão tem uma multiplicação escondida. Em vez de pensar \"quanto é 72 ÷ 8?\", pergunte \"qual número vezes 8 dá 72?\". Fica muito mais natural!",
    example: {
      expression: "72 ÷ 8",
      steps: [
        'Perguntamos: "? × 8 = 72"',
        "Sabemos que 9 × 8 = 72",
        "Então 72 ÷ 8 = 9",
      ],
      answer: 9,
    },
  },

  exercises: {
    guided: generate(7, 6),
    semiGuided: generate(8, 7),
    free: generate(12, 8),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const divisor = randomInt(3, 12);
      const answer = randomInt(3, 15);
      exercises.push(generate(answer, divisor));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 72,
    introOperand2: 8,
    introScreens: (() => {
      const a = 72, b = 8, answer = 9;
      return [
        { kind: "observe", message: "72 dividido por 8... e se a gente pensasse ao contrario?" } as IntroScreen,
        { kind: "action", message: "Toda divisao tem uma multiplicacao escondida! Em vez de dividir, pergunte: qual numero vezes 8 da 72?", buttonText: "Inverter!", resultMessage: `? x ${b} = ${a}`, resultHighlight: "Agora e so lembrar a tabuada!" } as IntroScreen,
        { kind: "solve", message: `Qual numero vezes ${b} da ${a}?`, equationDisplay: `? x ${b} = ${a}`, answer: answer, winMsg: `Isso! ${answer} x ${b} = ${a}!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Transforme a divisao em multiplicacao`, color: "cyan" as const },
          { text: `Pergunte: ? x ${b} = ${a}`, color: "amber" as const },
          { text: `${answer} x ${b} = ${a}, entao ${a} / ${b} = ${answer}!`, color: "emerald" as const },
        ], closingMsg: "Pensar na multiplicacao torna a divisao muito mais natural!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      return [
        { prompt: `Pense: ? x ${operand2} = ${operand1}. Qual e o numero?`, answer: correctAnswer },
      ];
    },
  },
};

export default dividirPensandoNaMultiplicacao;
