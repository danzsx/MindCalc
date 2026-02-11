import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a + b;
  const dezA = Math.floor(a / 10) * 10;
  const uniA = a % 10;
  const dezB = Math.floor(b / 10) * 10;
  const uniB = b % 10;
  const somaDez = dezA + dezB;
  const somaUni = uniA + uniB;

  return {
    operand1: a,
    operand2: b,
    operator: "+",
    correctAnswer: answer,
    fullHint: `Separe as dezenas: ${dezA} + ${dezB} = ${somaDez}. Depois some as unidades: ${uniA} + ${uniB} = ${somaUni}. Por fim, ${somaDez} + ${somaUni} = ${answer}.`,
    partialHint: `Comece pelas dezenas: ${dezA} + ${dezB} = ${somaDez}...`,
    stepByStep: [
      `Separamos as dezenas: ${dezA} + ${dezB} = ${somaDez}`,
      `Separamos as unidades: ${uniA} + ${uniB} = ${somaUni}`,
      `Juntamos tudo: ${somaDez} + ${somaUni} = ${answer}`,
    ],
  };
}

const somarDezenas: LessonContent = {
  slug: "somar-dezenas-primeiro",
  title: "Somar dezenas primeiro",
  technique: "Somar dezenas primeiro",
  operator: "+",
  difficulty: "beginner",

  intro: {
    explanation:
      "Quando somamos dois números, fica mais fácil separar as dezenas e as unidades. Primeiro somamos as dezenas, depois as unidades, e no final juntamos tudo.",
    example: {
      expression: "37 + 48",
      steps: [
        "Dezenas: 30 + 40 = 70",
        "Unidades: 7 + 8 = 15",
        "Juntando: 70 + 15 = 85",
      ],
      answer: 85,
    },
  },

  exercises: {
    guided: generate(25, 43),
    semiGuided: generate(56, 38),
    free: generate(47, 36),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(12, 49);
      const b = randomInt(12, 49);
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 37,
    introOperand2: 48,
    introScreens: (() => {
      const a = 37, b = 48;
      const dezA = 30, uniA = 7, dezB = 40, uniB = 8;
      const somaDez = 70, somaUni = 15;
      return [
        { kind: "observe", message: "Olha esses dois numeros. Parece dificil somar de cabeca? Tem um jeito esperto!" } as IntroScreen,
        { kind: "action", message: "E se a gente separasse as dezenas das unidades?", buttonText: "Separar!", resultMessage: `${a} = ${dezA} + ${uniA}  e  ${b} = ${dezB} + ${uniB}`, resultHighlight: "Agora cada parte fica facil!" } as IntroScreen,
        { kind: "fill", question: `Quanto e ${dezA} + ${dezB}?`, answer: somaDez, winMsg: `Isso! ${dezA} + ${dezB} = ${somaDez}!`, equationHint: `${dezA} + ${dezB} = ?` } as IntroScreen,
        { kind: "fill", question: `Agora as unidades: ${uniA} + ${uniB}?`, answer: somaUni, winMsg: `Boa! ${uniA} + ${uniB} = ${somaUni}!`, equationHint: `${uniA} + ${uniB} = ?` } as IntroScreen,
        { kind: "solve", message: "Agora junta tudo:", equationDisplay: `${somaDez} + ${somaUni} = ?`, answer: 85, winMsg: "Voce resolveu separando em partes!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Separamos as dezenas: ${dezA} + ${dezB} = ${somaDez}`, color: "cyan" as const },
          { text: `Separamos as unidades: ${uniA} + ${uniB} = ${somaUni}`, color: "amber" as const },
          { text: `Juntamos: ${somaDez} + ${somaUni} = 85 — facil!`, color: "emerald" as const },
        ], closingMsg: "Esse truque funciona com qualquer soma de dois numeros!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const dezA = Math.floor(operand1 / 10) * 10;
      const uniA = operand1 % 10;
      const dezB = Math.floor(operand2 / 10) * 10;
      const uniB = operand2 % 10;
      const somaDez = dezA + dezB;
      const somaUni = uniA + uniB;
      return [
        { prompt: `Dezenas: ${dezA} + ${dezB} = ?`, answer: somaDez },
        { prompt: `Unidades: ${uniA} + ${uniB} = ?`, answer: somaUni },
        { prompt: `Juntando: ${somaDez} + ${somaUni} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default somarDezenas;
