import type { Exercise, Operator } from "@/types";

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
 */
export function generateExercise(
  level: number,
  weakOperations?: Operator[]
): Exercise {
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
 * weak operations.
 */
export function generateExercises(
  count: number,
  level: number,
  weakOperations?: Operator[]
): Exercise[] {
  const exercises: Exercise[] = [];
  for (let i = 0; i < count; i++) {
    exercises.push(generateExercise(level, weakOperations));
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
