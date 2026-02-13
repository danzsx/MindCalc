import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a + b;
  const unidadesA = a % 10;
  const dezSeguinte = a - unidadesA + 10; // próxima dezena acima de a
  const completar = dezSeguinte - a; // quanto falta pra chegar na dezena
  const resto = b - completar; // quanto sobra depois da dezena

  return {
    operand1: a,
    operand2: b,
    operator: "+",
    correctAnswer: answer,
    fullHint: `Complete ate ${dezSeguinte}: ${a} + ${completar} = ${dezSeguinte}. Depois some o resto: ${dezSeguinte} + ${resto} = ${answer}.`,
    partialHint: `Quanto falta do ${a} para chegar em ${dezSeguinte}? Comece por ai...`,
    stepByStep: [
      `Completamos ate a dezena: ${a} + ${completar} = ${dezSeguinte}`,
      `Sobram ${resto} do ${b}: ${b} - ${completar} = ${resto}`,
      `Somamos o resto: ${dezSeguinte} + ${resto} = ${answer}`,
    ],
  };
}

const somarCruzandoDezena: LessonContent = {
  slug: "somar-cruzando-dezena",
  title: "Somar cruzando a dezena",
  technique: "Completar para a dezena seguinte e somar o resto",
  operator: "+",
  difficulty: "beginner",

  intro: {
    explanation:
      "Quando a soma passa de uma dezena, use-a como trampolim! Complete até a dezena seguinte e depois some o que sobrou. Fica muito mais fácil!",
    example: {
      expression: "47 + 5",
      steps: [
        "Completamos até 50: 47 + 3 = 50",
        "Sobram 2: 5 - 3 = 2",
        "Somamos o resto: 50 + 2 = 52",
      ],
      answer: 52,
    },
  },

  exercises: {
    guided: generate(47, 5),
    semiGuided: generate(38, 6),
    free: generate(65, 8),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      // a com unidade entre 4-9 (perto da próxima dezena)
      const dezena = randomInt(1, 8) * 10;
      const unidade = randomInt(4, 9);
      const a = dezena + unidade;
      // b pequeno que garanta cruzar a dezena
      const completar = 10 - unidade;
      const b = randomInt(completar + 1, Math.min(completar + 6, 9));
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 47,
    introOperand2: 5,
    introScreens: (() => {
      const a = 47, b = 5;
      const dezSeguinte = 50;
      const completar = 3; // 50 - 47
      const resto = 2; // 5 - 3
      const answer = 52;
      return [
        { kind: "observe", message: "Somar 47 + 5 de cabeca... e se usassemos a dezena como trampolim?" } as IntroScreen,
        { kind: "choice", question: "Qual e a dezena seguinte acima de 47?", options: [
          { label: "40", value: "40", sublabel: "4 dezenas" },
          { label: "50", value: "50", sublabel: "5 dezenas" },
          { label: "60", value: "60", sublabel: "6 dezenas" },
        ], correct: "50", wrongMsg: "Quase! Pense no proximo numero redondo acima de 47...", winMsg: "Isso! 50 e a dezena logo acima de 47!" } as IntroScreen,
        { kind: "fill", question: `Quanto falta do 47 para chegar em 50? (47 + ? = 50)`, answer: completar, winMsg: `Isso! 47 + ${completar} = ${dezSeguinte}!`, equationHint: `47 + ? = 50` } as IntroScreen,
        { kind: "fill", question: `Ja usamos ${completar} dos ${b}. Quanto sobra?`, answer: resto, winMsg: `Boa! Sobram ${resto} para somar!`, equationHint: `${b} - ${completar} = ?` } as IntroScreen,
        { kind: "solve", message: "Agora some o resto:", equationDisplay: `${dezSeguinte} + ${resto} = ?`, answer: answer, winMsg: "Perfeito! Usou a dezena como trampolim!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Completamos ate a dezena: 47 + ${completar} = ${dezSeguinte}`, color: "cyan" as const },
          { text: `Sobram ${resto} dos ${b}: ${b} - ${completar} = ${resto}`, color: "amber" as const },
          { text: `Somamos o resto: ${dezSeguinte} + ${resto} = ${answer} — pronto!`, color: "emerald" as const },
        ], closingMsg: "Usar a dezena como trampolim facilita qualquer soma que cruza a dezena!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const dezSeguinte = Math.ceil(operand1 / 10) * 10;
      const completar = dezSeguinte - operand1;
      const resto = operand2 - completar;
      return [
        { prompt: `Complete ate ${dezSeguinte}: ${operand1} + ${completar} = ?`, answer: dezSeguinte },
        { prompt: `Quanto sobra? ${operand2} - ${completar} = ?`, answer: resto },
        { prompt: `Some o resto: ${dezSeguinte} + ${resto} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default somarCruzandoDezena;
