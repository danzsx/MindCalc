import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a - b;
  const dezB = Math.floor(b / 10) * 10;
  const uniB = b % 10;
  const parcial = a - dezB;

  return {
    operand1: a,
    operand2: b,
    operator: "-",
    correctAnswer: answer,
    fullHint: `Quebre o ${b} em ${dezB} + ${uniB}. Primeiro: ${a} - ${dezB} = ${parcial}. Depois: ${parcial} - ${uniB} = ${answer}.`,
    partialHint: `Quebre ${b} em dezenas e unidades: ${dezB} + ${uniB}...`,
    stepByStep: [
      `Quebramos ${b} em ${dezB} + ${uniB}`,
      `Tiramos as dezenas: ${a} - ${dezB} = ${parcial}`,
      `Tiramos as unidades: ${parcial} - ${uniB} = ${answer}`,
    ],
  };
}

const subtrairPorPartes: LessonContent = {
  slug: "subtrair-por-partes",
  title: "Subtrair por partes",
  technique: "Subtrair por partes",
  operator: "-",
  difficulty: "beginner",

  intro: {
    explanation:
      "Quando o número que vamos subtrair tem dezenas e unidades, podemos quebrá-lo em partes. Subtraia primeiro as dezenas, depois as unidades. Passo a passo fica fácil!",
    example: {
      expression: "83 - 36",
      steps: [
        "Quebramos 36 em 30 + 6",
        "83 - 30 = 53",
        "53 - 6 = 47",
      ],
      answer: 47,
    },
  },

  exercises: {
    guided: generate(67, 24),
    semiGuided: generate(85, 38),
    free: generate(72, 45),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(40, 95);
      const b = randomInt(12, Math.min(a - 5, 49));
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 83,
    introOperand2: 36,
    introScreens: (() => {
      const a = 83, b = 36;
      const dezB = 30, uniB = 6;
      const parcial = a - dezB; // 53
      const answer = parcial - uniB; // 47
      return [
        { kind: "observe", message: "Subtrair 36 de uma vez e dificil. Mas e se a gente quebrasse o 36 em pedacos?" } as IntroScreen,
        { kind: "action", message: "Vamos quebrar o 36 em dezenas e unidades!", buttonText: "Quebrar!", resultMessage: "36 = 30 + 6", resultHighlight: "Agora subtraimos uma parte de cada vez!" } as IntroScreen,
        { kind: "fill", question: `Primeiro tire as dezenas: ${a} - ${dezB} = ?`, answer: parcial, winMsg: `Boa! ${a} - ${dezB} = ${parcial}!`, equationHint: `${a} - ${dezB} = ?` } as IntroScreen,
        { kind: "solve", message: "Agora tire as unidades:", equationDisplay: `${parcial} - ${uniB} = ?`, answer: answer, winMsg: "Pronto! Subtraiu por partes!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Quebramos ${b} em ${dezB} + ${uniB}`, color: "cyan" as const },
          { text: `Tiramos as dezenas: ${a} - ${dezB} = ${parcial}`, color: "amber" as const },
          { text: `Tiramos as unidades: ${parcial} - ${uniB} = ${answer} — facil!`, color: "emerald" as const },
        ], closingMsg: "Quebrar em partes simplifica qualquer subtracao!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const dezB = Math.floor(operand2 / 10) * 10;
      const uniB = operand2 % 10;
      const parcial = operand1 - dezB;
      return [
        { prompt: `Tire as dezenas: ${operand1} - ${dezB} = ?`, answer: parcial },
        { prompt: `Tire as unidades: ${parcial} - ${uniB} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default subtrairPorPartes;
