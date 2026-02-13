import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a - b;
  const unidadesA = a % 10;
  const dezAbaixo = a - unidadesA; // dezena logo abaixo de a
  const resto = b - unidadesA; // quanto falta subtrair depois da dezena

  return {
    operand1: a,
    operand2: b,
    operator: "-",
    correctAnswer: answer,
    fullHint: `Desca ate ${dezAbaixo}: ${a} - ${unidadesA} = ${dezAbaixo}. Depois tire o resto: ${dezAbaixo} - ${resto} = ${answer}.`,
    partialHint: `Quanto falta do ${a} para descer ate ${dezAbaixo}? Comece por ai...`,
    stepByStep: [
      `Descemos ate a dezena: ${a} - ${unidadesA} = ${dezAbaixo}`,
      `Faltam ${resto} do ${b}: ${b} - ${unidadesA} = ${resto}`,
      `Tiramos o resto: ${dezAbaixo} - ${resto} = ${answer}`,
    ],
  };
}

const subtrairCruzandoDezena: LessonContent = {
  slug: "subtrair-cruzando-dezena",
  title: "Subtrair cruzando a dezena",
  technique: "Descer até a dezena e subtrair o resto",
  operator: "-",
  difficulty: "beginner",

  intro: {
    explanation:
      "Quando a subtração cruza uma dezena, use-a como apoio! Desça até a dezena exata e depois tire o que falta. Passo a passo fica simples!",
    example: {
      expression: "52 - 7",
      steps: [
        "Descemos até 50: 52 - 2 = 50",
        "Faltam 5: 7 - 2 = 5",
        "Tiramos o resto: 50 - 5 = 45",
      ],
      answer: 45,
    },
  },

  exercises: {
    guided: generate(52, 7),
    semiGuided: generate(43, 6),
    free: generate(71, 8),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      // a com unidade entre 1-5 (perto da dezena abaixo)
      const dezena = randomInt(2, 9) * 10;
      const unidade = randomInt(1, 5);
      const a = dezena + unidade;
      // b maior que a unidade para garantir que cruza a dezena
      const b = randomInt(unidade + 1, Math.min(unidade + 6, 9));
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 52,
    introOperand2: 7,
    introScreens: (() => {
      const a = 52, b = 7;
      const dezAbaixo = 50;
      const unidadesA = 2; // 52 - 50
      const resto = 5; // 7 - 2
      const answer = 45;
      return [
        { kind: "observe", message: "Subtrair 52 - 7 de cabeca... e se descêssemos ate a dezena primeiro?" } as IntroScreen,
        { kind: "choice", question: "Qual e a dezena exata logo abaixo de 52?", options: [
          { label: "40", value: "40", sublabel: "4 dezenas" },
          { label: "50", value: "50", sublabel: "5 dezenas" },
          { label: "60", value: "60", sublabel: "6 dezenas" },
        ], correct: "50", wrongMsg: "Quase! Pense no numero redondo logo abaixo de 52...", winMsg: "Isso! 50 e a dezena logo abaixo de 52!" } as IntroScreen,
        { kind: "fill", question: `Quanto tiramos do 52 para chegar em 50? (52 - ? = 50)`, answer: unidadesA, winMsg: `Isso! 52 - ${unidadesA} = ${dezAbaixo}!`, equationHint: `52 - ? = 50` } as IntroScreen,
        { kind: "fill", question: `Ja tiramos ${unidadesA} dos ${b}. Quanto falta tirar?`, answer: resto, winMsg: `Boa! Faltam ${resto} para completar os ${b}!`, equationHint: `${b} - ${unidadesA} = ?` } as IntroScreen,
        { kind: "solve", message: "Agora tire o resto:", equationDisplay: `${dezAbaixo} - ${resto} = ?`, answer: answer, winMsg: "Perfeito! Usou a dezena como apoio!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Descemos ate a dezena: 52 - ${unidadesA} = ${dezAbaixo}`, color: "cyan" as const },
          { text: `Faltam ${resto} dos ${b}: ${b} - ${unidadesA} = ${resto}`, color: "amber" as const },
          { text: `Tiramos o resto: ${dezAbaixo} - ${resto} = ${answer} — pronto!`, color: "emerald" as const },
        ], closingMsg: "Usar a dezena como apoio facilita qualquer subtracao que cruza a dezena!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const dezAbaixo = Math.floor(operand1 / 10) * 10;
      const unidadesA = operand1 - dezAbaixo;
      const resto = operand2 - unidadesA;
      return [
        { prompt: `Desca ate ${dezAbaixo}: ${operand1} - ${unidadesA} = ?`, answer: dezAbaixo },
        { prompt: `Quanto falta? ${operand2} - ${unidadesA} = ?`, answer: resto },
        { prompt: `Tire o resto: ${dezAbaixo} - ${resto} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default subtrairCruzandoDezena;
