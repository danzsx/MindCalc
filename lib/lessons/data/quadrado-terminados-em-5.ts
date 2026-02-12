import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number): LessonExerciseData {
  const answer = a * a;
  const dezena = Math.floor(a / 10);
  const produto = dezena * (dezena + 1);

  return {
    operand1: a,
    operand2: a,
    operator: "*",
    correctAnswer: answer,
    fullHint: `Dezena: ${dezena}. Faca ${dezena} × ${dezena + 1} = ${produto}. Junte com 25: ${answer}.`,
    partialHint: `Faca ${dezena} × ${dezena + 1} = ... e junte com 25.`,
    stepByStep: [
      `Dezena e ${dezena}`,
      `${dezena} × ${dezena + 1} = ${produto}`,
      `Junte com 25: ${answer}`,
    ],
  };
}

const quadradoTerminadosEm5: LessonContent = {
  slug: "quadrado-terminados-em-5",
  title: "Quadrado de numeros terminados em 5",
  technique: "Quadrado terminados em 5 — n×(n+1)|25",
  operator: "*",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Para elevar ao quadrado um numero terminado em 5: multiplique a dezena por ela mesma + 1 e coloque 25 no final. Ex: 35² → 3×4 = 12, junta 25 → 1225.",
    example: {
      expression: "35²",
      steps: [
        "Dezena: 3",
        "3 × 4 = 12",
        "Junte com 25: 1225",
      ],
      answer: 1225,
    },
  },

  exercises: {
    guided: generate(25),
    semiGuided: generate(45),
    free: generate(65),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const nums = [15, 25, 35, 45, 55, 65, 75, 85, 95];
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      exercises.push(generate(nums[randomInt(0, nums.length - 1)]));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 35,
    introOperand2: 35,
    introScreens: (() => {
      return [
        { kind: "observe", message: "35 ao quadrado... sem calculadora? Tem um truque perfeito!", expressionLabel: "35²" } as IntroScreen,
        { kind: "action", message: "A dezena e 3. Multiplique por ela mesma + 1.", buttonText: "Entendi!", resultMessage: "3 × 4 = 12", resultHighlight: "Agora e so juntar com 25!" } as IntroScreen,
        { kind: "fill", question: "Faca: 3 × 4 = ?", answer: 12, winMsg: "Isso! Agora coloque 25 no final!", equationHint: "3 × 4 = ?" } as IntroScreen,
        { kind: "solve", message: "Junte 12 com 25:", equationDisplay: "35² = ?", answer: 1225, winMsg: "Perfeito! 35² = 1225!" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Dezena: 3 — multiplique por 3+1 = 4", color: "cyan" as const },
          { text: "3 × 4 = 12", color: "amber" as const },
          { text: "Junte com 25: 1225 — magico!", color: "emerald" as const },
        ], closingMsg: "Funciona para 15, 25, 35, 45... qualquer numero terminado em 5!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1 } = exercise;
      const dezena = Math.floor(operand1 / 10);
      const produto = dezena * (dezena + 1);
      const answer = operand1 * operand1;
      return [
        { prompt: `Dezena × (dezena+1): ${dezena} × ${dezena + 1} = ?`, answer: produto },
        { prompt: `Junte com 25: ${operand1}² = ?`, answer },
      ];
    },
  },
};

export default quadradoTerminadosEm5;
