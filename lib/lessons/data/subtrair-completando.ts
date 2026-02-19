import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(a: number, b: number): LessonExerciseData {
  const answer = a - b;
  // Strategy: subtract enough to reach the nearest ten below a, then subtract the rest.
  const dezAbaixo = Math.floor(a / 10) * 10;
  const primeiraPartida = a - dezAbaixo; // units of a
  const resto = b - primeiraPartida;

  // If b > units of a, strategy works well (we cross a ten boundary).
  // Otherwise we use a simpler decomposition.
  if (primeiraPartida > 0 && b > primeiraPartida) {
    return {
      operand1: a,
      operand2: b,
      operator: "-",
      correctAnswer: answer,
      fullHint: `Primeiro tire ${primeiraPartida} para chegar em ${dezAbaixo}: ${a} - ${primeiraPartida} = ${dezAbaixo}. Depois tire mais ${resto}: ${dezAbaixo} - ${resto} = ${answer}.`,
      partialHint: `Tente chegar numa dezena: ${a} - ${primeiraPartida} = ${dezAbaixo}...`,
      stepByStep: [
        `Tiramos ${primeiraPartida} para chegar na dezena: ${a} - ${primeiraPartida} = ${dezAbaixo}`,
        `Faltam ${resto} para completar: ${dezAbaixo} - ${resto} = ${answer}`,
        `Resultado: ${a} - ${b} = ${answer}`,
      ],
    };
  }

  // Fallback: direct subtraction by parts (tens then units)
  const dezB = Math.floor(b / 10) * 10;
  const uniB = b % 10;
  const parcial = a - dezB;

  return {
    operand1: a,
    operand2: b,
    operator: "-",
    correctAnswer: answer,
    fullHint: `Subtraia as dezenas: ${a} - ${dezB} = ${parcial}. Depois subtraia as unidades: ${parcial} - ${uniB} = ${answer}.`,
    partialHint: `Comece tirando as dezenas: ${a} - ${dezB} = ${parcial}...`,
    stepByStep: [
      `Tiramos as dezenas: ${a} - ${dezB} = ${parcial}`,
      `Tiramos as unidades: ${parcial} - ${uniB} = ${answer}`,
      `Resultado: ${a} - ${b} = ${answer}`,
    ],
  };
}

const subtrairCompletando: LessonContent = {
  slug: "subtrair-completando",
  title: "Subtrair completando a dezena",
  technique: "Subtrair completando a dezena",
  operator: "-",
  difficulty: "beginner",

  intro: {
    explanation:
      "Para subtrair com mais facilidade, primeiro tire o suficiente para chegar numa dezena exata. Depois subtraia o que falta. Usar dezenas como apoio torna tudo mais simples!",
    example: {
      expression: "53 - 17",
      steps: [
        "Tiramos 3 para chegar em 50: 53 - 3 = 50",
        "Faltam 14: 50 - 14 = 36",
        "Resultado: 53 - 17 = 36",
      ],
      answer: 36,
    },
  },

  exercises: {
    guided: generate(42, 15),
    semiGuided: generate(63, 28),
    free: generate(74, 37),
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(31, 79);
      const b = randomInt(12, Math.min(a - 5, 39));
      exercises.push(generate(a, b));
    }
    return exercises;
  },

  interactive: {
    type: "step-discovery",
    visual: "number-line",
    introOperand1: 53,
    introOperand2: 17,
    introScreens: (() => {
      const a = 53, b = 17;
      const dezAbaixo = 50, unidadesA = 3;
      const resto = b - unidadesA; // 14
      const answer = dezAbaixo - resto; // 36
      return [
        // 0 — Observe
        { kind: "observe", message: "Subtrair de cabeca pode ser chato. Mas tem um atalho usando as dezenas!" } as IntroScreen,
        // 1 — NumberSlider: slide 53 to 50 (Phase 4.5)
        { kind: "number-slider", question: "Deslize o 53 ate a dezena mais proxima abaixo:", number: a, target: dezAbaixo, winMsg: `Isso! ${dezAbaixo} e a dezena logo abaixo de ${a}!` } as IntroScreen,
        // 2 — Fill: how much from 53 to 50?
        { kind: "fill", question: `Quanto tiramos do 53 pra chegar em ${dezAbaixo}? (53 - ? = 50)`, answer: unidadesA, winMsg: `Isso! Tiramos ${unidadesA} pra chegar em ${dezAbaixo}!`, equationHint: `53 - ? = 50` } as IntroScreen,
        // 3 — Fill: how much left to complete b?
        { kind: "fill", question: `Ja tiramos ${unidadesA}. Quanto falta pra completar ${b}?`, answer: resto, winMsg: `Boa! Faltam ${resto} pra completar os ${b}!`, equationHint: `${b} - ${unidadesA} = ?` } as IntroScreen,
        // 4 — Solve: final calculation
        { kind: "solve", message: "Agora faca a conta facil:", equationDisplay: `${dezAbaixo} - ${resto} = ?`, answer: answer, winMsg: "Voce resolveu usando a dezena como apoio!" } as IntroScreen,
        // 5 — Summary
        { kind: "summary", recapSteps: [
          { text: `Tiramos ${unidadesA} para chegar na dezena: 53 - ${unidadesA} = ${dezAbaixo}`, color: "cyan" as const },
          { text: `Faltam ${resto} para completar ${b}: ${b} - ${unidadesA} = ${resto}`, color: "amber" as const },
          { text: `Subtraimos o resto: ${dezAbaixo} - ${resto} = ${answer} — pronto!`, color: "emerald" as const },
        ], closingMsg: "Usar a dezena como apoio deixa a subtracao muito mais facil!" } as IntroScreen,
      ];
    })(),
    buildExerciseSteps(exercise: LessonExerciseData): StrategyStep[] {
      const { operand1, operand2, correctAnswer } = exercise;
      const dezAbaixo = Math.floor(operand1 / 10) * 10;
      const unidadesA = operand1 - dezAbaixo;
      if (unidadesA > 0 && operand2 > unidadesA) {
        const resto = operand2 - unidadesA;
        return [
          { prompt: `Tire ${unidadesA} pra chegar em ${dezAbaixo}: ${operand1} - ${unidadesA} = ?`, answer: dezAbaixo },
          { prompt: `Falta: ${operand2} - ${unidadesA} = ?`, answer: resto },
          { prompt: `Termine: ${dezAbaixo} - ${resto} = ?`, answer: correctAnswer },
        ];
      }
      // Fallback
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

export default subtrairCompletando;
