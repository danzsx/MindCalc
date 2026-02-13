import { describe, it, expect } from "vitest";
import {
  getStandardTime,
  calculateLevel,
  generateExercise,
  generateExercises,
  generateMixedExercises,
  identifyWeakOperations,
} from "@/lib/engine";
import type { Operator } from "@/types";

// ---------------------------------------------------------------------------
// getStandardTime
// ---------------------------------------------------------------------------

describe("getStandardTime", () => {
  it("returns 15 for level 1", () => {
    expect(getStandardTime(1)).toBe(15);
  });

  it("returns 4 for level 10", () => {
    expect(getStandardTime(10)).toBeCloseTo(4);
  });

  it("decreases as level increases", () => {
    for (let l = 1; l < 10; l++) {
      expect(getStandardTime(l)).toBeGreaterThan(getStandardTime(l + 1));
    }
  });
});

// ---------------------------------------------------------------------------
// calculateLevel
// ---------------------------------------------------------------------------

describe("calculateLevel", () => {
  it("levels up when accuracy >= 80% and avgTime < standard", () => {
    const standardTime = getStandardTime(3);
    expect(calculateLevel(85, standardTime - 1, 3)).toBe(4);
  });

  it("levels down when accuracy < 50%", () => {
    expect(calculateLevel(40, 10, 5)).toBe(4);
  });

  it("stays the same when accuracy is between 50% and 80%", () => {
    expect(calculateLevel(60, 10, 5)).toBe(5);
  });

  it("does not exceed level 10", () => {
    const standardTime = getStandardTime(10);
    expect(calculateLevel(100, standardTime - 1, 10)).toBe(10);
  });

  it("does not go below level 1", () => {
    expect(calculateLevel(20, 20, 1)).toBe(1);
  });

  it("stays the same when accuracy >= 80% but avgTime >= standard", () => {
    const standardTime = getStandardTime(5);
    expect(calculateLevel(90, standardTime + 1, 5)).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// generateExercise
// ---------------------------------------------------------------------------

describe("generateExercise", () => {
  it("returns an exercise with all required fields", () => {
    const ex = generateExercise(1);
    expect(ex).toHaveProperty("operand1");
    expect(ex).toHaveProperty("operand2");
    expect(ex).toHaveProperty("operator");
    expect(ex).toHaveProperty("correctAnswer");
  });

  it("only uses +/- for levels 1-3", () => {
    for (let i = 0; i < 50; i++) {
      const ex = generateExercise(2);
      expect(["+", "-"]).toContain(ex.operator);
    }
  });

  it("can use all four operators for levels 4+", () => {
    const operators = new Set<Operator>();
    for (let i = 0; i < 200; i++) {
      operators.add(generateExercise(5).operator);
    }
    expect(operators.size).toBe(4);
  });

  it("computes correctAnswer matching the operands and operator", () => {
    for (let i = 0; i < 50; i++) {
      const ex = generateExercise(5);
      let expected: number;
      switch (ex.operator) {
        case "+":
          expected = ex.operand1 + ex.operand2;
          break;
        case "-":
          expected = ex.operand1 - ex.operand2;
          break;
        case "*":
          expected = ex.operand1 * ex.operand2;
          break;
        case "/":
          expected = ex.operand1 / ex.operand2;
          break;
      }
      expect(ex.correctAnswer).toBeCloseTo(expected, 1);
    }
  });
});

// ---------------------------------------------------------------------------
// generateExercises
// ---------------------------------------------------------------------------

describe("generateExercises", () => {
  it("generates the requested number of exercises", () => {
    expect(generateExercises(10, 3)).toHaveLength(10);
    expect(generateExercises(5, 7)).toHaveLength(5);
    expect(generateExercises(1, 1)).toHaveLength(1);
  });

  it("respects the level for operator selection", () => {
    const exs = generateExercises(50, 2);
    for (const ex of exs) {
      expect(["+", "-"]).toContain(ex.operator);
    }
  });

  it("biases towards weak operations when provided", () => {
    const weak: Operator[] = ["-"];
    const exs = generateExercises(100, 2, weak);
    const minusCount = exs.filter((e) => e.operator === "-").length;
    // With 70% bias, we expect significantly more than 50%
    expect(minusCount).toBeGreaterThan(50);
  });
});

// ---------------------------------------------------------------------------
// identifyWeakOperations
// ---------------------------------------------------------------------------

describe("identifyWeakOperations", () => {
  it("returns empty array for empty input", () => {
    expect(identifyWeakOperations([])).toEqual([]);
  });

  it("returns operators sorted by error frequency", () => {
    const logs = [
      { operator: "/" },
      { operator: "/" },
      { operator: "/" },
      { operator: "*" },
      { operator: "*" },
      { operator: "+" },
    ];
    const result = identifyWeakOperations(logs);
    expect(result).toEqual(["/", "*", "+"]);
  });

  it("handles a single operator", () => {
    const logs = [{ operator: "-" }, { operator: "-" }];
    expect(identifyWeakOperations(logs)).toEqual(["-"]);
  });
});

// ---------------------------------------------------------------------------
// generateMixedExercises
// ---------------------------------------------------------------------------

describe("generateMixedExercises", () => {
  const manyTechniques = [
    "somar-dezenas-primeiro",
    "somar-arredondando",
    "subtrair-completando",
    "multiplicar-por-5",
    "multiplicar-por-9",
  ];

  it("falls back to generateExercises when < 3 techniques", () => {
    const result = generateMixedExercises(5, 3, ["somar-dezenas-primeiro"]);
    expect(result).toHaveLength(5);
    // Should still produce valid exercises
    for (const ex of result) {
      expect(ex).toHaveProperty("operand1");
      expect(ex).toHaveProperty("correctAnswer");
    }
  });

  it("returns count exercises", () => {
    const result = generateMixedExercises(8, 5, manyTechniques);
    expect(result).toHaveLength(8);
  });

  it("includes at least 3 distinct technique slugs when enough techniques provided", () => {
    const result = generateMixedExercises(10, 5, manyTechniques);
    const slugs = new Set(
      result.filter((e) => e.techniqueSlug).map((e) => e.techniqueSlug)
    );
    expect(slugs.size).toBeGreaterThanOrEqual(3);
  });

  it("each exercise has valid fields", () => {
    const result = generateMixedExercises(6, 4, manyTechniques);
    for (const ex of result) {
      expect(typeof ex.operand1).toBe("number");
      expect(typeof ex.operand2).toBe("number");
      expect(["+", "-", "*", "/"]).toContain(ex.operator);
      expect(typeof ex.correctAnswer).toBe("number");
    }
  });
});
