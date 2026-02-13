import type { Exercise, Operator } from "@/types";
import { allLessons } from "./lessons";

/**
 * Returns the maximum acceptable response time (in seconds) for a given level.
 * Level 1 = 15s, Level 10 = 4s, linearly interpolated.
 */
export function getStandardTime(level: number): number {
  const maxTime = 15;
  const minTime = 4;
  return maxTime - ((level - 1) * (maxTime - minTime)) / 9;
}

/**
 * Calculates the new level based on session performance.
 * - accuracy >= 80% AND avgTime < standard time => level up
 * - accuracy < 50% => level down
 * - otherwise => same level
 */
export function calculateLevel(
  accuracy: number,
  avgTime: number,
  currentLevel: number
): number {
  const standardTime = getStandardTime(currentLevel);

  if (accuracy >= 80 && avgTime < standardTime) {
    return Math.min(currentLevel + 1, 10);
  }

  if (accuracy < 50) {
    return Math.max(currentLevel - 1, 1);
  }

  return currentLevel;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function computeAnswer(a: number, b: number, op: Operator): number {
  switch (op) {
    case "+":
      return round(a + b, 2);
    case "-":
      return round(a - b, 2);
    case "*":
      return round(a * b, 2);
    case "/":
      return round(a / b, 2);
  }
}

// ---------------------------------------------------------------------------
// Exercise generation
// ---------------------------------------------------------------------------

function generateForBeginner(operator: Operator): Exercise {
  // Levels 1-3: addition / subtraction with numbers < 50
  let operand1 = randomInt(2, 49);
  let operand2 = randomInt(2, 49);

  if (operator === "-" && operand2 > operand1) {
    [operand1, operand2] = [operand2, operand1];
  }

  return {
    operand1,
    operand2,
    operator,
    correctAnswer: computeAnswer(operand1, operand2, operator),
  };
}

function generateForIntermediate(operator: Operator): Exercise {
  // Levels 4-7: all four operations, larger numbers, mult/div > 100
  let operand1: number;
  let operand2: number;

  switch (operator) {
    case "+":
      operand1 = randomInt(20, 200);
      operand2 = randomInt(20, 200);
      break;
    case "-":
      operand1 = randomInt(50, 300);
      operand2 = randomInt(10, operand1 - 1);
      break;
    case "*":
      operand1 = randomInt(4, 15);
      operand2 = randomInt(6, 15);
      break;
    case "/": {
      operand2 = randomInt(2, 12);
      const quotient = randomInt(3, 15);
      operand1 = operand2 * quotient;
      break;
    }
  }

  return {
    operand1,
    operand2,
    operator,
    correctAnswer: computeAnswer(operand1, operand2, operator),
  };
}

function generateForAdvanced(operator: Operator): Exercise {
  // Levels 8-10: decimals and percentages
  let operand1: number;
  let operand2: number;

  switch (operator) {
    case "+":
    case "-": {
      operand1 = round(randomInt(10, 200) + randomInt(1, 9) / 10, 1);
      operand2 = round(randomInt(10, 200) + randomInt(1, 9) / 10, 1);
      if (operator === "-" && operand2 > operand1) {
        [operand1, operand2] = [operand2, operand1];
      }
      break;
    }
    case "*": {
      operand1 = round(randomInt(2, 30) + randomInt(1, 9) / 10, 1);
      operand2 = randomInt(2, 12);
      break;
    }
    case "/": {
      operand2 = randomInt(2, 12);
      const quotient = round(randomInt(2, 20) + randomInt(1, 9) / 10, 1);
      operand1 = round(operand2 * quotient, 2);
      break;
    }
  }

  return {
    operand1,
    operand2,
    operator,
    correctAnswer: computeAnswer(operand1, operand2, operator),
  };
}

/**
 * Generates a random exercise appropriate for the given level.
 *
 * Level ranges:
 *   1-3  — addition / subtraction, numbers < 50
 *   4-7  — all four operations, larger numbers (mult/div results > 100)
 *   8-10 — decimals and percentages
 *
 * If `weakOperations` is provided, there is a 70% chance the exercise will
 * use one of those operations (when compatible with the level range).
 *
 * If `learnedTechniques` is provided (slugs from completed lessons), there
 * is a 30% chance the exercise will be generated using one of those
 * technique's practice generators, reinforcing what the user learned.
 */
export function generateExercise(
  level: number,
  weakOperations?: Operator[],
  learnedTechniques?: string[]
): Exercise {
  // 30% chance to reinforce a learned technique
  if (learnedTechniques && learnedTechniques.length > 0 && Math.random() < 0.3) {
    const slug = pickRandom(learnedTechniques);
    const lesson = allLessons.find((l) => l.slug === slug);
    if (lesson) {
      const [ex] = lesson.practiceGenerator(1);
      return {
        operand1: ex.operand1,
        operand2: ex.operand2,
        operator: ex.operator,
        correctAnswer: ex.correctAnswer,
        techniqueSlug: slug,
      };
    }
  }
  // Determine valid operators for the level range
  let availableOperators: Operator[];

  if (level <= 3) {
    availableOperators = ["+", "-"];
  } else {
    availableOperators = ["+", "-", "*", "/"];
  }

  // Bias towards weak operations (70% chance) when provided
  let operators = availableOperators;

  if (weakOperations && weakOperations.length > 0) {
    const validWeak = weakOperations.filter((op) =>
      availableOperators.includes(op)
    );
    if (validWeak.length > 0 && Math.random() < 0.7) {
      operators = validWeak;
    }
  }

  const operator = pickRandom(operators);

  if (level <= 3) {
    return generateForBeginner(operator);
  }

  if (level <= 7) {
    return generateForIntermediate(operator);
  }

  return generateForAdvanced(operator);
}

/**
 * Generates `count` exercises for the given level, optionally biased towards
 * weak operations and/or learned techniques.
 */
export function generateExercises(
  count: number,
  level: number,
  weakOperations?: Operator[],
  learnedTechniques?: string[]
): Exercise[] {
  const exercises: Exercise[] = [];
  for (let i = 0; i < count; i++) {
    exercises.push(generateExercise(level, weakOperations, learnedTechniques));
  }
  return exercises;
}

/**
 * Generates a mixed set of exercises guaranteeing technique diversity.
 * Requires 3+ learned techniques; falls back to generateExercises otherwise.
 *
 * Strategy:
 * - Pick 3-5 random technique slugs
 * - Generate 1 exercise per selected technique (guaranteed diversity)
 * - Fill remaining 50/50 between technique-based and level-based
 * - Shuffle final array
 */
export function generateMixedExercises(
  count: number,
  level: number,
  learnedTechniques: string[],
  weakOperations?: Operator[]
): Exercise[] {
  if (learnedTechniques.length < 3) {
    return generateExercises(count, level, weakOperations, learnedTechniques);
  }

  const exercises: Exercise[] = [];

  // Pick 3-5 random unique technique slugs
  const shuffled = [...learnedTechniques].sort(() => Math.random() - 0.5);
  const pickCount = Math.min(shuffled.length, randomInt(3, 5));
  const selectedSlugs = shuffled.slice(0, pickCount);

  // Generate 1 exercise per selected technique (guaranteed diversity)
  for (const slug of selectedSlugs) {
    const lesson = allLessons.find((l) => l.slug === slug);
    if (lesson) {
      const [ex] = lesson.practiceGenerator(1);
      exercises.push({
        operand1: ex.operand1,
        operand2: ex.operand2,
        operator: ex.operator,
        correctAnswer: ex.correctAnswer,
        techniqueSlug: slug,
      });
    }
  }

  // Fill remaining slots 50/50 between technique-based and level-based
  const remaining = count - exercises.length;
  for (let i = 0; i < remaining; i++) {
    if (Math.random() < 0.5) {
      // Technique-based
      const slug = pickRandom(learnedTechniques);
      const lesson = allLessons.find((l) => l.slug === slug);
      if (lesson) {
        const [ex] = lesson.practiceGenerator(1);
        exercises.push({
          operand1: ex.operand1,
          operand2: ex.operand2,
          operator: ex.operator,
          correctAnswer: ex.correctAnswer,
          techniqueSlug: slug,
        });
        continue;
      }
    }
    // Level-based
    exercises.push(generateExercise(level, weakOperations));
  }

  // Shuffle final array
  for (let i = exercises.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
  }

  return exercises;
}

/**
 * Identifies weak operations from a list of error logs.
 * Returns operators sorted by error frequency (most errors first).
 */
export function identifyWeakOperations(
  errorLogs: { operator: string }[]
): Operator[] {
  if (!errorLogs || errorLogs.length === 0) return [];

  const errorCounts: Record<string, number> = {};
  for (const log of errorLogs) {
    const op = log.operator;
    errorCounts[op] = (errorCounts[op] || 0) + 1;
  }

  return Object.entries(errorCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([op]) => op as Operator);
}
