import type {
  TablesOperation,
  TablesRange,
  TablesQuestion,
  TablesQuestionLog,
} from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeId(op1: number, op2: number, operator: TablesOperation): string {
  return `${op1}${operator}${op2}`;
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function computeAnswer(a: number, b: number, op: TablesOperation): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
  }
}

// ---------------------------------------------------------------------------
// 4.1 — generateCombinations
// ---------------------------------------------------------------------------

export function generateCombinations(
  operation: TablesOperation,
  range: TablesRange
): TablesQuestion[] {
  const questions: TablesQuestion[] = [];
  const seen = new Set<string>();

  switch (operation) {
    case "+": {
      for (let a = range.min; a <= range.max; a++) {
        for (let b = a; b <= range.max; b++) {
          const id = makeId(a, b, operation);
          if (!seen.has(id)) {
            seen.add(id);
            questions.push({
              id,
              operand1: a,
              operand2: b,
              operator: operation,
              correctAnswer: a + b,
              explanation: generateExplanation(a, b, operation),
            });
          }
        }
      }
      break;
    }

    case "-": {
      for (let a = range.min; a <= range.max; a++) {
        for (let b = range.min; b <= a; b++) {
          if (a - b >= 0) {
            const id = makeId(a, b, operation);
            if (!seen.has(id)) {
              seen.add(id);
              questions.push({
                id,
                operand1: a,
                operand2: b,
                operator: operation,
                correctAnswer: a - b,
                explanation: generateExplanation(a, b, operation),
              });
            }
          }
        }
      }
      break;
    }

    case "*": {
      for (let a = range.min; a <= range.max; a++) {
        for (let b = a; b <= range.max; b++) {
          const id = makeId(a, b, operation);
          if (!seen.has(id)) {
            seen.add(id);
            questions.push({
              id,
              operand1: a,
              operand2: b,
              operator: operation,
              correctAnswer: a * b,
              explanation: generateExplanation(a, b, operation),
            });
          }
        }
      }
      break;
    }

    case "/": {
      for (let b = Math.max(range.min, 1); b <= range.max; b++) {
        for (let quotient = range.min; quotient <= range.max; quotient++) {
          const a = b * quotient;
          if (a >= range.min * range.min && a <= range.max * range.max) {
            const key = `${a}/${b}`;
            if (!seen.has(key)) {
              seen.add(key);
              questions.push({
                id: makeId(a, b, operation),
                operand1: a,
                operand2: b,
                operator: operation,
                correctAnswer: quotient,
                explanation: generateExplanation(a, b, operation),
              });
            }
          }
        }
      }
      break;
    }
  }

  return questions;
}

// ---------------------------------------------------------------------------
// 4.2 — generateBlock
// ---------------------------------------------------------------------------

export function generateBlock(
  allCombinations: TablesQuestion[],
  usedIds: Set<string>,
  retryQueue: TablesQuestion[],
  difficultyTier: "low" | "mid" | "high",
  range: TablesRange
): TablesQuestion[] {
  const BLOCK_SIZE = 6;
  const MAX_RETRY_PER_BLOCK = 2;
  const block: TablesQuestion[] = [];

  // 1. Include retry questions (max 2)
  const retries = retryQueue.splice(0, MAX_RETRY_PER_BLOCK);
  block.push(...retries);

  // 2. Filter by difficulty tier
  const tierRange = getTierRange(difficultyTier, range);
  const tierQuestions = allCombinations.filter((q) => {
    if (usedIds.has(q.id)) return false;
    return isInTierRange(q, tierRange);
  });

  // 3. Fill remaining slots
  const shuffled = fisherYatesShuffle(tierQuestions);
  for (const q of shuffled) {
    if (block.length >= BLOCK_SIZE) break;
    block.push(q);
    usedIds.add(q.id);
  }

  // If not enough tier questions, fill from any unused
  if (block.length < BLOCK_SIZE) {
    const remaining = allCombinations.filter(
      (q) => !usedIds.has(q.id) && !block.some((b) => b.id === q.id)
    );
    const shuffledRemaining = fisherYatesShuffle(remaining);
    for (const q of shuffledRemaining) {
      if (block.length >= BLOCK_SIZE) break;
      block.push(q);
      usedIds.add(q.id);
    }
  }

  // 4. Shuffle the block
  return fisherYatesShuffle(block);
}

function getTierRange(
  tier: "low" | "mid" | "high",
  range: TablesRange
): { min: number; max: number } {
  const span = range.max - range.min;
  const third = Math.floor(span / 3);

  switch (tier) {
    case "low":
      return { min: range.min, max: range.min + third };
    case "mid":
      return { min: range.min + third + 1, max: range.min + 2 * third };
    case "high":
      return {
        min: range.min + 2 * Math.ceil(span / 3),
        max: range.max,
      };
  }
}

function isInTierRange(
  q: TablesQuestion,
  tierRange: { min: number; max: number }
): boolean {
  if (q.operator === "/") {
    // For division, check the quotient (correctAnswer) against tier range
    return q.correctAnswer >= tierRange.min && q.correctAnswer <= tierRange.max;
  }
  return (
    q.operand1 >= tierRange.min &&
    q.operand1 <= tierRange.max &&
    q.operand2 >= tierRange.min &&
    q.operand2 <= tierRange.max
  );
}

// ---------------------------------------------------------------------------
// 4.3 — generateExplanation
// ---------------------------------------------------------------------------

export function generateExplanation(
  operand1: number,
  operand2: number,
  operator: TablesOperation
): string {
  // Trivial cases (operand <= 2)
  if (operand1 <= 2 || operand2 <= 2) {
    return `${operand1} ${operator} ${operand2} = ${computeAnswer(operand1, operand2, operator)}`;
  }

  switch (operator) {
    case "+": {
      const result = operand1 + operand2;
      // Strategy: complete to nearest ten
      const toTen = 10 - (operand1 % 10);
      if (toTen > 0 && toTen < operand2 && operand1 % 10 !== 0) {
        const remainder = operand2 - toTen;
        const roundedUp = operand1 + toTen;
        return `${operand1} + ${operand2} = ${operand1} + ${toTen} + ${remainder} = ${roundedUp} + ${remainder} = ${result}`;
      }
      return `${operand1} + ${operand2} = ${result}`;
    }

    case "-": {
      const result = operand1 - operand2;
      // Strategy: go down to nearest ten
      const downToTen = operand1 % 10;
      if (downToTen > 0 && downToTen < operand2 && operand2 > downToTen) {
        const remainder = operand2 - downToTen;
        const roundedDown = operand1 - downToTen;
        return `${operand1} - ${operand2} = ${operand1} - ${downToTen} - ${remainder} = ${roundedDown} - ${remainder} = ${result}`;
      }
      return `${operand1} - ${operand2} = ${result}`;
    }

    case "*": {
      const result = operand1 * operand2;
      // Strategy: decompose the smaller operand
      const smaller = Math.min(operand1, operand2);
      const larger = Math.max(operand1, operand2);

      if (smaller <= 2) {
        return `${operand1} x ${operand2} = ${result}`;
      }

      // Split into two parts (halves or near-halves)
      const half = Math.floor(smaller / 2);
      const otherHalf = smaller - half;
      const part1 = larger * half;
      const part2 = larger * otherHalf;
      return `${operand1} x ${operand2} = ${larger} x (${half} + ${otherHalf}) = ${part1} + ${part2} = ${result}`;
    }

    case "/": {
      const result = operand1 / operand2;
      // Strategy: invert to multiplication
      return `${operand1} / ${operand2} = ? → ${operand2} x ? = ${operand1} → ${operand2} x ${result} = ${operand1} → resposta: ${result}`;
    }
  }
}

// ---------------------------------------------------------------------------
// 4.4 — calculateMasteredPercentage
// ---------------------------------------------------------------------------

export function calculateMasteredPercentage(
  logs: TablesQuestionLog[],
  operation: TablesOperation,
  range: TablesRange
): number {
  const allCombinations = generateCombinations(operation, range);
  const totalCombinations = allCombinations.length;

  if (totalCombinations === 0) return 0;

  // Group logs by combination key (operand1, operand2, operator)
  const logsByKey = new Map<string, TablesQuestionLog[]>();
  for (const log of logs) {
    const key = makeId(log.operand1, log.operand2, log.operator);
    const existing = logsByKey.get(key) ?? [];
    existing.push(log);
    logsByKey.set(key, existing);
  }

  let mastered = 0;

  for (const combo of allCombinations) {
    const comboLogs = logsByKey.get(combo.id);
    if (!comboLogs || comboLogs.length < 2) continue;

    // Sort by created_at descending to get the latest 2
    const sorted = [...comboLogs].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const last2 = sorted.slice(0, 2);
    if (last2.every((l) => l.is_correct)) {
      mastered++;
    }
  }

  return (mastered / totalCombinations) * 100;
}

// ---------------------------------------------------------------------------
// 4.5 — getDifficultyTier
// ---------------------------------------------------------------------------

export function getDifficultyTier(
  blockIndex: number
): "low" | "mid" | "high" {
  if (blockIndex <= 1) return "low";
  if (blockIndex <= 3) return "mid";
  return "high";
}
