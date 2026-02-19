import type { LessonContent, LessonExerciseData, IntroScreen, StrategyStep } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 5.1: Real-world context templates for this lesson
const CONTEXT_TEMPLATES: Array<(a: number, b: number) => string> = [
  (a, b) => `Você tem ${a} figurinhas e ganhou mais ${b} de um amigo. Quantas tem agora?`,
  (a, b) => `Uma loja vendeu ${a} sorvetes de manhã e ${b} à tarde. Total do dia?`,
  (a, b) => `Você correu ${a} m no primeiro treino e ${b} m no segundo. Quantos metros no total?`,
  (a, b) => `Numa escola há ${a} alunos no turno da manhã e ${b} à tarde. Quantos ao todo?`,
  (a, b) => `Você economizou R$\u00a0${a} na primeira semana e R$\u00a0${b} na segunda. Quanto no total?`,
];

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
    guided: { ...generate(25, 43), context: "Você coletou 25 tampinhas e ganhou mais 43 de um amigo. Quantas tampinhas tem agora?" },
    semiGuided: { ...generate(56, 38), context: "Uma livraria vendeu 56 livros na segunda-feira e 38 na terça-feira. Quantos no total?" },
    free: { ...generate(47, 36), context: "Num videogame você fez 47 pontos no 1º nível e 36 no 2º. Quantos pontos ao todo?" },
  },

  practiceGenerator(count: number): LessonExerciseData[] {
    const exercises: LessonExerciseData[] = [];
    for (let i = 0; i < count; i++) {
      const a = randomInt(12, 49);
      const b = randomInt(12, 49);
      const ctx = CONTEXT_TEMPLATES[i % CONTEXT_TEMPLATES.length](a, b);
      exercises.push({ ...generate(a, b), context: ctx });
    }
    return exercises;
  },

  // 5.4: Comprehension check shown after guided phase, before semi-guided
  comprehensionCheck: {
    question: "Por que começamos somando as dezenas primeiro?",
    options: [
      { label: "Fica mais fácil calcular mentalmente com números redondos" },
      { label: "É apenas uma convenção matemática sem motivo prático" },
      { label: "Não importa a ordem — o resultado é sempre o mesmo" },
    ],
    correctIndex: 0,
    feedback: "Exato! Dezenas são múltiplos de 10, muito mais fáceis de combinar mentalmente. Separar assim reduz bastante o esforço cognitivo.",
  },

  interactive: {
    type: "step-discovery",
    visual: "decomposition",
    introOperand1: 37,
    introOperand2: 48,
    introScreens: (() => {
      const a = 37, b = 48;
      const dezA = 30, uniA = 7, dezB = 40, uniB = 8;
      const somaDez = 70, somaUni = 15;
      return [
        // 0 — Observe
        { kind: "observe", message: "Olha esses dois numeros. Parece dificil somar de cabeca? Tem um jeito esperto!" } as IntroScreen,
        // 1 — Drag-decompose: separate 37 (Phase 4.1)
        { kind: "drag-decompose", number: a, winMsg: `Exato! ${a} = ${dezA} + ${uniA}` } as IntroScreen,
        // 2 — Drag-decompose: separate 48 (Phase 4.1)
        { kind: "drag-decompose", number: b, winMsg: `Boa! ${b} = ${dezB} + ${uniB}` } as IntroScreen,
        // 3 — EquationFill: sum the tens (Phase 4.3)
        { kind: "equation-fill", question: `Agora some as dezenas: ${dezA} + ${dezB} = ?`, equationLeft: `${dezA} + ${dezB} =`, answer: somaDez, winMsg: `Isso! ${dezA} + ${dezB} = ${somaDez}` } as IntroScreen,
        // 4 — EquationFill: sum the units (Phase 4.3)
        { kind: "equation-fill", question: `E as unidades: ${uniA} + ${uniB} = ?`, equationLeft: `${uniA} + ${uniB} =`, answer: somaUni, winMsg: `Boa! ${uniA} + ${uniB} = ${somaUni}` } as IntroScreen,
        // 5 — Solve: join everything
        { kind: "solve", message: "Agora junta tudo:", equationDisplay: `${somaDez} + ${somaUni} = ?`, answer: 85, winMsg: "Voce resolveu separando em partes!" } as IntroScreen,
        // 6 — Summary
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
