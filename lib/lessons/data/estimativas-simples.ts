import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToNearest10(n: number): number {
  return Math.round(n / 10) * 10;
}

function generate(a: number, b: number): LessonExerciseData {
  const roundA = roundToNearest10(a);
  const roundB = roundToNearest10(b);
  const estimate = roundA + roundB;

  return {
    operand1: a,
    operand2: b,
    operator: "+",
    correctAnswer: estimate,
    fullHint: `Arredonde: ${a} ≈ ${roundA} e ${b} ≈ ${roundB}. Agora some: ${roundA} + ${roundB} = ${estimate}.`,
    partialHint: `Arredonde para a dezena: ${a} ≈ ${roundA}, ${b} ≈ ${roundB}...`,
    stepByStep: [
      `Arredondamos ${a} para ${roundA}`,
      `Arredondamos ${b} para ${roundB}`,
      `Somamos: ${roundA} + ${roundB} = ${estimate}`,
    ],
  };
}

const estimativasSimples: LessonContent = {
  slug: "estimativas-simples",
  title: "Estimativas: arredondar para calcular rapido",
  technique: "Estimativa por arredondamento",
  operator: "+",
  difficulty: "beginner",

  intro: {
    explanation:
      "Nem sempre precisamos do resultado exato. Arredondando os numeros para a dezena mais proxima, conseguimos estimar a resposta de cabeca muito mais rapido!",
    example: {
      expression: "48 + 33 ≈ ?",
      steps: [
        "Arredonde 48 para 50",
        "Arredonde 33 para 30",
        "Some: 50 + 30 = 80",
      ],
      answer: 80,
    },
  },

  exercises: {
    guided: generate(48, 33),
    semiGuided: generate(27, 54),
    free: generate(36, 67),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(13, 89);
      const b = randomInt(13, 89);
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 48,
    introOperand2: 33,
    introScreens: (() => {
      const a = 48, b = 33;
      const roundA = 50, roundB = 30;
      const estimate = 80;
      return [
        { kind: "observe", message: "Quanto e 48 + 33? Parece complicado... mas e so a gente estimar!" } as IntroScreen,
        { kind: "action", message: "Vamos arredondar cada numero para a dezena mais proxima.", buttonText: "Arredondar!", resultMessage: `${a} ≈ ${roundA}  e  ${b} ≈ ${roundB}`, resultHighlight: "Numeros redondos sao muito mais faceis de somar!" } as IntroScreen,
        { kind: "fill", question: `Arredonde ${a} para a dezena mais proxima:`, answer: roundA, winMsg: `Isso! ${a} arredondado fica ${roundA}!`, equationHint: `${a} ≈ ?` } as IntroScreen,
        { kind: "fill", question: `Agora arredonde ${b}:`, answer: roundB, winMsg: `Boa! ${b} arredondado fica ${roundB}!`, equationHint: `${b} ≈ ?` } as IntroScreen,
        { kind: "solve", message: "Agora some os numeros arredondados:", equationDisplay: `${roundA} + ${roundB} = ?`, answer: estimate, winMsg: "Estimativa feita! Rapido e facil!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: `Arredondamos ${a} para ${roundA}`, color: "cyan" as const },
          { text: `Arredondamos ${b} para ${roundB}`, color: "amber" as const },
          { text: `Somamos: ${roundA} + ${roundB} = ${estimate} (exato: ${a + b})`, color: "emerald" as const },
        ], closingMsg: "Estimar arredondando e perfeito pra calculos rapidos do dia a dia!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const roundA = roundToNearest10(operand1);
      const roundB = roundToNearest10(operand2);
      return [
        { prompt: `Arredonde ${operand1} para a dezena:`, answer: roundA },
        { prompt: `Arredonde ${operand2} para a dezena:`, answer: roundB },
        { prompt: `Some: ${roundA} + ${roundB} = ?`, answer: correctAnswer },
      ];
    },
  },
};

export default estimativasSimples;
