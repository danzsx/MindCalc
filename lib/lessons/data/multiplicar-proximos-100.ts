import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a * b;
  const compA = 100 - a;
  const compB = 100 - b;
  const base = 100 - compA - compB;
  const prodComp = compA * compB;

  return {
    operand1: a,
    operand2: b,
    operator: "*",
    correctAnswer: answer,
    fullHint: `Complementos: ${compA} e ${compB}. Base: ${a} - ${compB} = ${base}. Produto dos complementos: ${compA} × ${compB} = ${prodComp}. Resultado: ${base}${prodComp < 10 ? "0" : ""}${prodComp} = ${answer}.`,
    partialHint: `Complementos de 100: ${compA} e ${compB}. Subtraia cruzado e multiplique os complementos...`,
    stepByStep: [
      `Complementos: 100 - ${a} = ${compA}, 100 - ${b} = ${compB}`,
      `Subtraia cruzado: ${a} - ${compB} = ${base} (centenas)`,
      `Produto dos complementos: ${compA} × ${compB} = ${prodComp}`,
      `Resultado: ${answer}`,
    ],
  };
}

const multiplicarProximos100: LessonContent = {
  slug: "multiplicar-proximos-100",
  title: "Multiplicar numeros proximos de 100",
  technique: "Complementos de 100",
  operator: "*",
  difficulty: "advanced",

  intro: {
    explanation:
      "Para multiplicar numeros proximos de 100 (como 97 × 96), use complementos: ache a distancia de cada um ate 100, subtraia cruzado e multiplique os complementos. Ex: 97×96 → 97-4=93, 3×4=12 → 9312.",
    example: {
      expression: "97 × 96",
      steps: [
        "Complementos: 100-97=3, 100-96=4",
        "Subtraia cruzado: 97-4 = 93",
        "Produto dos complementos: 3×4 = 12",
        "Resultado: 9312",
      ],
      answer: 9312,
    },
  },

  exercises: {
    guided: generate(98, 97),
    semiGuided: generate(96, 95),
    free: generate(93, 97),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(91, 99);
      const b = randomInt(91, 99);
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 97,
    introOperand2: 96,
    introScreens: (() => {
      return [
        { kind: "observe", message: "97 × 96 sem calculadora? Com complementos de 100, e rapido!" } as IntroScreen,
        { kind: "fill", question: "Quanto falta de 97 ate 100?", answer: 3, winMsg: "Isso! Complemento de 97 = 3", equationHint: "100 - 97 = ?" } as IntroScreen,
        { kind: "fill", question: "Quanto falta de 96 ate 100?", answer: 4, winMsg: "Complemento de 96 = 4", equationHint: "100 - 96 = ?" } as IntroScreen,
        { kind: "solve", message: "Subtraia cruzado: 97 - 4 = ?", equationDisplay: "97 - 4 = ?", answer: 93, winMsg: "93 serao as centenas!" } as IntroScreen,
        { kind: "solve", message: "Produto dos complementos: 3 × 4 = ?", equationDisplay: "3 × 4 = ?", answer: 12, winMsg: "Junte: 9312! Resultado final!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Ache complementos: 100-97=3, 100-96=4", color: "cyan" as const },
          { text: "Subtraia cruzado: 97-4 = 93", color: "amber" as const },
          { text: "Multiplique complementos: 3×4=12 → 9312!", color: "emerald" as const },
        ], closingMsg: "Funciona para qualquer par de numeros proximos de 100!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2 } = exercise;
      const compA = 100 - operand1;
      const compB = 100 - operand2;
      const base = operand1 - compB;
      const prodComp = compA * compB;
      const answer = operand1 * operand2;
      return [
        { prompt: `Complemento de ${operand1}: 100 - ${operand1} = ?`, answer: compA },
        { prompt: `Complemento de ${operand2}: 100 - ${operand2} = ?`, answer: compB },
        { prompt: `Cruzado: ${operand1} - ${compB} = ?`, answer: base },
        { prompt: `Complementos: ${compA} × ${compB} = ?`, answer: prodComp },
        { prompt: `Resultado: ${operand1} × ${operand2} = ?`, answer },
      ];
    },
  },
};

export default multiplicarProximos100;
