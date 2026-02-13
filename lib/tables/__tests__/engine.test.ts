import { describe, it, expect } from "vitest";
import {
  generateCombinations,
  generateBlock,
  generateExplanation,
  calculateMasteredPercentage,
  getDifficultyTier,
} from "@/lib/tables/engine";
import type { TablesOperation, TablesRange, TablesQuestionLog } from "@/types";

// ---------------------------------------------------------------------------
// generateCombinations
// ---------------------------------------------------------------------------

describe("generateCombinations", () => {
  const range: TablesRange = { min: 1, max: 5 };

  it("addition range 1-5 produces correct count (15 unique pairs where a<=b)", () => {
    const combos = generateCombinations("+", range);
    // pairs: (1,1),(1,2),(1,3),(1,4),(1,5),(2,2),(2,3),(2,4),(2,5),(3,3),(3,4),(3,5),(4,4),(4,5),(5,5) = 15
    expect(combos).toHaveLength(15);
    for (const q of combos) {
      expect(q.operator).toBe("+");
      expect(q.correctAnswer).toBe(q.operand1 + q.operand2);
    }
  });

  it("subtraction produces valid pairs where a >= b", () => {
    const combos = generateCombinations("-", range);
    for (const q of combos) {
      expect(q.operand1).toBeGreaterThanOrEqual(q.operand2);
      expect(q.correctAnswer).toBe(q.operand1 - q.operand2);
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
    }
  });

  it("multiplication deduplicates (a <= b)", () => {
    const combos = generateCombinations("*", range);
    const ids = combos.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of combos) {
      expect(q.operand1).toBeLessThanOrEqual(q.operand2);
      expect(q.correctAnswer).toBe(q.operand1 * q.operand2);
    }
  });

  it("division produces only integer quotients", () => {
    const combos = generateCombinations("/", range);
    for (const q of combos) {
      expect(Number.isInteger(q.correctAnswer)).toBe(true);
      expect(q.operand2).toBeGreaterThan(0);
      expect(q.operand1 / q.operand2).toBe(q.correctAnswer);
    }
  });

  it("empty range returns empty", () => {
    const empty: TablesRange = { min: 5, max: 4 };
    expect(generateCombinations("+", empty)).toHaveLength(0);
    expect(generateCombinations("*", empty)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// generateBlock
// ---------------------------------------------------------------------------

describe("generateBlock", () => {
  const range: TablesRange = { min: 1, max: 10 };
  const allCombos = generateCombinations("+", range);

  it("returns max 6 questions", () => {
    const block = generateBlock(allCombos, new Set(), [], "low", range);
    expect(block.length).toBeLessThanOrEqual(6);
  });

  it("includes retry questions (max 2)", () => {
    const retryQueue = [allCombos[0], allCombos[1], allCombos[2]];
    const block = generateBlock(
      allCombos,
      new Set(),
      retryQueue,
      "low",
      range
    );
    // retryQueue should have been spliced to include at most 2
    expect(retryQueue).toHaveLength(1); // 3 - 2 = 1 remaining
    expect(block.length).toBeLessThanOrEqual(6);
  });

  it("marks used IDs", () => {
    const usedIds = new Set<string>();
    generateBlock(allCombos, usedIds, [], "low", range);
    expect(usedIds.size).toBeGreaterThan(0);
  });

  it("fills from unused when tier insufficient", () => {
    // Use a very narrow range so tier filtering yields few questions
    const narrowRange: TablesRange = { min: 1, max: 3 };
    const narrowCombos = generateCombinations("+", narrowRange);
    const block = generateBlock(narrowCombos, new Set(), [], "high", narrowRange);
    // Should still return some questions even if tier is "high" and range is narrow
    expect(block.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// generateExplanation
// ---------------------------------------------------------------------------

describe("generateExplanation", () => {
  it("addition uses 'complete to ten' strategy for suitable numbers", () => {
    const explanation = generateExplanation(7, 8, "+");
    // 7 + 8: toTen = 3, remainder = 5, roundedUp = 10
    expect(explanation).toContain("10");
    expect(explanation).toContain("15");
  });

  it("subtraction uses 'down to ten' strategy for suitable numbers", () => {
    const explanation = generateExplanation(13, 5, "-");
    // 13 % 10 = 3, downToTen=3, 3 < 5, remainder=2, roundedDown=10
    expect(explanation).toContain("10");
    expect(explanation).toContain("8");
  });

  it("multiplication decomposes the smaller operand", () => {
    const explanation = generateExplanation(6, 7, "*");
    // smaller=6, half=3, otherHalf=3
    expect(explanation).toContain("42");
    expect(explanation).toContain("(3 + 3)");
  });

  it("division inverts to multiplication", () => {
    const explanation = generateExplanation(24, 6, "/");
    expect(explanation).toContain("6 x 4 = 24");
    expect(explanation).toContain("resposta: 4");
  });

  it("trivial cases (operand <= 2) return simple expression", () => {
    const explanation = generateExplanation(2, 5, "+");
    expect(explanation).toBe("2 + 5 = 7");
  });
});

// ---------------------------------------------------------------------------
// calculateMasteredPercentage
// ---------------------------------------------------------------------------

describe("calculateMasteredPercentage", () => {
  const range: TablesRange = { min: 1, max: 3 };

  it("returns 0 for no logs", () => {
    expect(calculateMasteredPercentage([], "+", range)).toBe(0);
  });

  it("counts only combinations with 2+ correct in last 2 attempts", () => {
    const combos = generateCombinations("+", range);
    const firstCombo = combos[0];

    const logs: TablesQuestionLog[] = [
      {
        id: "1",
        session_id: "s1",
        user_id: "u1",
        operand1: firstCombo.operand1,
        operand2: firstCombo.operand2,
        operator: "+",
        correct_answer: firstCombo.correctAnswer,
        user_answer: firstCombo.correctAnswer,
        is_correct: true,
        attempts: 1,
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "2",
        session_id: "s2",
        user_id: "u1",
        operand1: firstCombo.operand1,
        operand2: firstCombo.operand2,
        operator: "+",
        correct_answer: firstCombo.correctAnswer,
        user_answer: firstCombo.correctAnswer,
        is_correct: true,
        attempts: 1,
        created_at: "2025-01-02T00:00:00Z",
      },
    ];

    const percentage = calculateMasteredPercentage(logs, "+", range);
    // 1 mastered out of total combinations
    expect(percentage).toBeCloseTo((1 / combos.length) * 100);
  });

  it("returns correct percentage for fully mastered set", () => {
    const combos = generateCombinations("+", range);
    const logs: TablesQuestionLog[] = [];

    for (const combo of combos) {
      // Two correct attempts per combo
      for (let i = 0; i < 2; i++) {
        logs.push({
          id: `${combo.id}-${i}`,
          session_id: `s${i}`,
          user_id: "u1",
          operand1: combo.operand1,
          operand2: combo.operand2,
          operator: "+",
          correct_answer: combo.correctAnswer,
          user_answer: combo.correctAnswer,
          is_correct: true,
          attempts: 1,
          created_at: `2025-01-0${i + 1}T00:00:00Z`,
        });
      }
    }

    expect(calculateMasteredPercentage(logs, "+", range)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// getDifficultyTier
// ---------------------------------------------------------------------------

describe("getDifficultyTier", () => {
  it("returns 'low' for block indices 0 and 1", () => {
    expect(getDifficultyTier(0)).toBe("low");
    expect(getDifficultyTier(1)).toBe("low");
  });

  it("returns 'mid' for block indices 2 and 3", () => {
    expect(getDifficultyTier(2)).toBe("mid");
    expect(getDifficultyTier(3)).toBe("mid");
  });

  it("returns 'high' for block index 4+", () => {
    expect(getDifficultyTier(4)).toBe("high");
    expect(getDifficultyTier(10)).toBe("high");
  });
});
