import type { LessonContent, LessonExerciseData } from "../types";

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
};

export default subtrairCompletando;
