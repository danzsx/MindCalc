import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(totalWork: number, newAmount: number): LessonExerciseData {
  const answer = totalWork / newAmount;

  return {
    operand1: totalWork,
    operand2: newAmount,
    operator: "/",
    correctAnswer: answer,
    fullHint: `Em regra de 3 inversa, mantenha o trabalho constante: ${totalWork} / ${newAmount} = ${answer}.`,
    partialHint: `Divida ${totalWork} por ${newAmount}...`,
    stepByStep: [
      "Trabalho total fixo",
      `${totalWork} / ${newAmount} = ${answer}`,
      "Mais gente, menos tempo",
    ],
  };
}

function generateExercise(): LessonExerciseData {
  const people1 = randomInt(2, 6);
  const time1 = randomInt(4, 10);
  const totalWork = people1 * time1;

  const divisors = [2, 3, 4, 5, 6, 8, 10, 12];
  const possible = divisors.filter((d) => totalWork % d === 0);
  const newAmount =
    possible.length > 0
      ? possible[randomInt(0, possible.length - 1)]
      : people1 * 2;

  return generate(totalWork, newAmount);
}

const regraDe3Inversa: LessonContent = {
  slug: "regra-de-3-inversa",
  title: "Regra de 3: problemas inversos",
  technique: "Regra de 3 inversa (trabalho constante)",
  operator: "/",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Na regra de 3 inversa, quando um valor aumenta, o outro diminui. Pense no trabalho total: pessoas x tempo.",
    example: {
      expression: "18 / 6",
      steps: [
        "Trabalho total: 3 pessoas x 6 horas = 18",
        "Com 6 pessoas: 18 / 6 = 3",
        "Logo, 6 pessoas fazem em 3 horas",
      ],
      answer: 3,
    },
  },

  exercises: {
    guided: generate(18, 6),
    semiGuided: generate(24, 4),
    free: generate(30, 5),
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
    introOperand1: 18,
    introOperand2: 6,
    introScreens: (() => {
      const totalWork = 18, newPeople = 6, answer = 3;
      return [
        { kind: "observe", message: "3 pessoas fazem em 6 horas. Com 6 pessoas, quanto tempo? Na inversa: mais gente = menos tempo!", expressionLabel: "3 pes x 6h -> 6 pes x ?h" } as IntroScreen,
        { kind: "fill", question: "Primeiro ache o trabalho total: 3 x 6 = ?", answer: totalWork, winMsg: `Isso! O trabalho total e ${totalWork}!`, equationHint: "3 x 6 = ?" } as IntroScreen,
        { kind: "solve", message: "Agora divida pelas novas pessoas:", equationDisplay: `${totalWork} / ${newPeople} = ?`, answer: answer, winMsg: `Com ${newPeople} pessoas, sao ${answer} horas!` } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Na regra de 3 inversa, o trabalho total e constante", color: "cyan" as const },
          { text: `Trabalho total: 3 x 6 = ${totalWork}`, color: "amber" as const },
          { text: `${totalWork} / ${newPeople} = ${answer} horas - mais gente, menos tempo!`, color: "emerald" as const },
        ], closingMsg: "Ache o trabalho total e divida pela nova quantidade!" } as IntroScreen,
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

export default regraDe3Inversa;
