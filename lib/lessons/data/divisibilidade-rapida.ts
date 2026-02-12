import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DIVISORS = [2, 3, 4, 5, 6, 9] as const;

function isDivisible(n: number, d: number): boolean {
  return n % d === 0;
}

function generate(n: number, d: number): LessonExerciseData {
  const result = isDivisible(n, d) ? 1 : 0;

  const rules: Record<number, string> = {
    2: "par (termina em 0, 2, 4, 6 ou 8)",
    3: `soma dos digitos (${String(n).split("").join(" + ")} = ${String(n).split("").reduce((s, c) => s + Number(c), 0)}) divisivel por 3`,
    4: `ultimos 2 digitos (${n % 100}) divisiveis por 4`,
    5: "termina em 0 ou 5",
    6: "divisivel por 2 E por 3",
    9: `soma dos digitos (${String(n).split("").join(" + ")} = ${String(n).split("").reduce((s, c) => s + Number(c), 0)}) divisivel por 9`,
  };

  const divisivel = isDivisible(n, d);

  return {
    operand1: n,
    operand2: d,
    operator: "/",
    correctAnswer: result,
    fullHint: `Regra do ${d}: ${rules[d]}. ${n} ${divisivel ? "e" : "nao e"} divisivel por ${d}. Responda ${result}.`,
    partialHint: `Aplique a regra do ${d}: ${rules[d]?.split(")")[0]})...`,
    stepByStep: [
      `Regra do ${d}: ${rules[d]}`,
      `${n} ${divisivel ? "e" : "nao e"} divisivel por ${d}`,
      `Resposta: ${result} (${divisivel ? "sim" : "nao"})`,
    ],
  };
}

const divisibilidadeRapida: LessonContent = {
  slug: "divisibilidade-rapida",
  title: "Divisibilidade rapida",
  technique: "Regras de divisibilidade para 2, 3, 4, 5, 6 e 9",
  operator: "/",
  difficulty: "intermediate",

  intro: {
    explanation:
      "Regras rapidas: divisivel por 2 se par, por 3 se soma dos digitos / 3, por 4 se ultimos 2 digitos / 4, por 5 se termina em 0 ou 5, por 6 se / 2 e / 3, por 9 se soma dos digitos / 9. Responda 1 para sim, 0 para nao.",
    example: {
      expression: "342 ÷ 9",
      steps: [
        "Soma dos digitos: 3 + 4 + 2 = 9",
        "9 e divisivel por 9? Sim!",
        "Resposta: 1 (sim)",
      ],
      answer: 1,
    },
  },

  exercises: {
    guided: generate(342, 9),
    semiGuided: generate(156, 3),
    free: generate(725, 4),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const d = DIVISORS[randomInt(0, DIVISORS.length - 1)];
      // Alternate between divisible and not-divisible cases
      const base = randomInt(10, 200);
      const n = i % 2 === 0 ? base * d : base * d + randomInt(1, d - 1);
      exercises.push(generate(n, d));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    introOperand1: 342,
    introOperand2: 9,
    introScreens: (() => {
      return [
        { kind: "observe", message: "342 e divisivel por 9? Sem fazer a conta, da pra saber na hora!", expressionLabel: "342 ÷ 9?" } as IntroScreen,
        { kind: "action", message: "Regra do 9: some todos os digitos do numero.", buttonText: "Vamos la!", resultMessage: "3 + 4 + 2 = 9", resultHighlight: "Se a soma for divisivel por 9, o numero tambem e!" } as IntroScreen,
        { kind: "fill", question: "Soma dos digitos de 342: 3 + 4 + 2 = ?", answer: 9, winMsg: "9 e divisivel por 9? Sim!", equationHint: "3 + 4 + 2 = ?" } as IntroScreen,
        { kind: "choice", question: "342 e divisivel por 9?", options: [
          { label: "Sim", value: "1" },
          { label: "Nao", value: "0" },
        ], correct: "1", wrongMsg: "A soma deu 9, que e divisivel por 9!", winMsg: "Correto! 342 / 9 = 38" } as IntroScreen,
        { kind: "summary", recapSteps: [
          { text: "Por 2: ultimo digito par | Por 5: termina em 0 ou 5", color: "cyan" as const },
          { text: "Por 3/9: soma dos digitos divisivel por 3 ou 9", color: "amber" as const },
          { text: "Por 4: ultimos 2 digitos divisiveis por 4 | Por 6: par E / 3", color: "emerald" as const },
        ], closingMsg: "Com essas regras voce elimina alternativas em provas muito mais rapido!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const somaDigitos = String(operand1).split("").reduce((s, c) => s + Number(c), 0);
      const steps: StrategyStep[] = [];
      if ([3, 6, 9].includes(operand2)) {
        steps.push({ prompt: `Soma dos digitos de ${operand1} = ?`, answer: somaDigitos });
      }
      steps.push({
        prompt: `${operand1} e divisivel por ${operand2}? (1=sim, 0=nao)`,
        answer: correctAnswer,
      });
      return steps;
    },
  },
};

export default divisibilidadeRapida;
