import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(capital: number, ratePercent: number, time: number): LessonExerciseData {
  const juros = capital * ratePercent * time / 100;
  const combinedFactor = ratePercent * time;

  return {
    operand1: capital,
    operand2: combinedFactor,
    operator: "*",
    correctAnswer: juros,
    fullHint: `J = C x i x t. Aqui: ${capital} x ${ratePercent}% x ${time} = ${capital} x ${combinedFactor}/100 = ${juros}.`,
    partialHint: `Taxa x tempo = ${ratePercent} x ${time} = ${combinedFactor}. Agora: ${capital} x ${combinedFactor} / 100 = ...`,
    stepByStep: [
      `Taxa x tempo: ${ratePercent} x ${time} = ${combinedFactor}`,
      `Capital x fator: ${capital} x ${combinedFactor} = ${capital * combinedFactor}`,
      `Divida por 100: ${capital * combinedFactor} / 100 = ${juros}`,
    ],
  };
}

function generateExercise(): LessonExerciseData {
  const capital = randomInt(5, 50) * 100;
  const ratePercent = randomInt(2, 10);
  const time = randomInt(1, 5);
  return generate(capital, ratePercent, time);
}

const jurosSimples: LessonContent = {
  slug: "juros-simples",
  title: "Juros simples: quanto voce vai pagar?",
  technique: "J = C x i x t (formula de juros simples)",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Juros simples e quando voce paga uma porcentagem fixa todo mes sobre o valor original. A formula e: Juros = Capital x Taxa x Tempo.",
    example: {
      expression: "1000 x 10",
      steps: [
        "Capital: R$1000, Taxa: 2% ao mes, Tempo: 5 meses",
        "Taxa x Tempo = 2 x 5 = 10",
        "Juros = 1000 x 10 / 100 = R$100",
      ],
      answer: 100,
    },
  },

  exercises: {
    guided: generate(1000, 5, 2),
    semiGuided: generate(2000, 3, 4),
    free: generate(3000, 4, 3),
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
    introOperand1: 1000,
    introOperand2: 10,
    introScreens: (() => {
      const capital = 1000, rate = 2, time = 5, factor = 10, juros = 100;
      return [
        { kind: "observe", message: "Voce emprestou R$1000 a 2% ao mes por 5 meses. Quanto vai pagar de juros?", expressionLabel: "J = 1000 x 2% x 5" } as IntroScreen,
        { kind: "action", message: "A formula: Juros = Capital x Taxa x Tempo. Primeiro, multiplique taxa pelo tempo!", buttonText: "Entendi!", resultMessage: `Taxa x Tempo = ${rate} x ${time} = ${factor}`, resultHighlight: "Depois multiplique pelo capital e divida por 100!" } as IntroScreen,
        { kind: "fill", question: `Taxa x Tempo: ${rate} x ${time} = ?`, equationHint: `${rate} x ${time} = ?`, answer: factor, winMsg: `Isso! O fator e ${factor}!` } as IntroScreen,
        { kind: "solve", message: `Agora: ${capital} x ${factor} / 100 = ?`, equationDisplay: `${capital} x ${factor} / 100 = ?`, answer: juros, winMsg: `Os juros sao R$${juros}!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "J = Capital x Taxa x Tempo", color: "cyan" as const },
          { text: `Taxa x Tempo: ${rate} x ${time} = ${factor}`, color: "amber" as const },
          { text: `${capital} x ${factor} / 100 = R$${juros} de juros`, color: "emerald" as const },
        ], closingMsg: "Agora voce sabe calcular juros de cabeca!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const rateDecimal = operand2 / 100;
      return [
        { prompt: `Fator (taxa x tempo) / 100 = ${operand2} / 100 = ${rateDecimal}`, answer: rateDecimal },
        { prompt: `Juros: ${operand1} x ${rateDecimal} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default jurosSimples;
