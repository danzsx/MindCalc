import { describe, it, expect } from "vitest";
import {
  getExerciseForPhase,
  generatePracticeExercises,
  checkAnswer,
} from "@/lib/lessons/engine";
import {
  getStepColor,
  getOperatorSymbol,
  parseNumericInput,
  isApproximatelyEqual,
} from "@/lib/lessons/utils";
import type { LessonContent, LessonExerciseData } from "@/lib/lessons/types";

// ---------------------------------------------------------------------------
// Test fixture — a minimal lesson
// ---------------------------------------------------------------------------

function makeExercise(overrides: Partial<LessonExerciseData> = {}): LessonExerciseData {
  return {
    operand1: 10,
    operand2: 5,
    operator: "+",
    correctAnswer: 15,
    fullHint: "10 + 5 = 15",
    partialHint: "10 + 5 = ...",
    stepByStep: ["Step 1"],
    ...overrides,
  };
}

const mockLesson: LessonContent = {
  slug: "test-lesson",
  title: "Test Lesson",
  technique: "Test",
  operator: "+",
  difficulty: "beginner",
  intro: {
    explanation: "Test explanation",
    example: { expression: "10 + 5", steps: ["10 + 5 = 15"], answer: 15 },
  },
  exercises: {
    guided: makeExercise({ operand1: 10, operand2: 5, correctAnswer: 15 }),
    semiGuided: makeExercise({ operand1: 20, operand2: 3, correctAnswer: 23 }),
    free: makeExercise({ operand1: 30, operand2: 7, correctAnswer: 37 }),
  },
  practiceGenerator: (count: number) =>
    Array.from({ length: count }, (_, i) =>
      makeExercise({ operand1: i + 1, operand2: 2, correctAnswer: i + 3 })
    ),
};

// ---------------------------------------------------------------------------
// getExerciseForPhase
// ---------------------------------------------------------------------------

describe("getExerciseForPhase", () => {
  it("returns guided exercise for 'guided' phase", () => {
    const ex = getExerciseForPhase(mockLesson, "guided");
    expect(ex.correctAnswer).toBe(15);
  });

  it("returns semi-guided exercise for 'semi-guided' phase", () => {
    const ex = getExerciseForPhase(mockLesson, "semi-guided");
    expect(ex.correctAnswer).toBe(23);
  });

  it("returns free exercise for 'free' phase", () => {
    const ex = getExerciseForPhase(mockLesson, "free");
    expect(ex.correctAnswer).toBe(37);
  });
});

// ---------------------------------------------------------------------------
// generatePracticeExercises
// ---------------------------------------------------------------------------

describe("generatePracticeExercises", () => {
  it("generates requested count", () => {
    const exercises = generatePracticeExercises(mockLesson, 3);
    expect(exercises).toHaveLength(3);
  });

  it("default count is 5", () => {
    const exercises = generatePracticeExercises(mockLesson);
    expect(exercises).toHaveLength(5);
  });

  it("exercises have required fields", () => {
    const exercises = generatePracticeExercises(mockLesson, 2);
    for (const ex of exercises) {
      expect(ex).toHaveProperty("operand1");
      expect(ex).toHaveProperty("operand2");
      expect(ex).toHaveProperty("operator");
      expect(ex).toHaveProperty("correctAnswer");
      expect(ex).toHaveProperty("fullHint");
      expect(ex).toHaveProperty("partialHint");
      expect(ex).toHaveProperty("stepByStep");
    }
  });
});

// ---------------------------------------------------------------------------
// checkAnswer
// ---------------------------------------------------------------------------

describe("checkAnswer", () => {
  const exercise = makeExercise({ correctAnswer: 42 });

  it("correct answer returns true", () => {
    expect(checkAnswer(exercise, 42)).toBe(true);
  });

  it("wrong answer returns false", () => {
    expect(checkAnswer(exercise, 43)).toBe(false);
  });

  it("float tolerance works", () => {
    const floatExercise = makeExercise({ correctAnswer: 3.333333 });
    expect(checkAnswer(floatExercise, 3.333333)).toBe(true);
    expect(checkAnswer(floatExercise, 3.3333331)).toBe(true);
    expect(checkAnswer(floatExercise, 3.5)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getStepColor
// ---------------------------------------------------------------------------

describe("getStepColor", () => {
  it("single step returns emerald", () => {
    const color = getStepColor(0, 1);
    expect(color.text).toContain("emerald");
  });

  it("first step of multiple returns cyan", () => {
    const color = getStepColor(0, 3);
    expect(color.text).toContain("cyan");
  });

  it("last step returns emerald", () => {
    const color = getStepColor(2, 3);
    expect(color.text).toContain("emerald");
  });

  it("middle step returns amber", () => {
    const color = getStepColor(1, 3);
    expect(color.text).toContain("amber");
  });
});

// ---------------------------------------------------------------------------
// getOperatorSymbol
// ---------------------------------------------------------------------------

describe("getOperatorSymbol", () => {
  it("maps + to +", () => {
    expect(getOperatorSymbol("+")).toBe("+");
  });

  it("maps - to minus sign (−)", () => {
    expect(getOperatorSymbol("-")).toBe("\u2212");
  });

  it("maps * to multiplication sign (×)", () => {
    expect(getOperatorSymbol("*")).toBe("\u00d7");
  });

  it("maps / to division sign (÷)", () => {
    expect(getOperatorSymbol("/")).toBe("\u00f7");
  });

  it("unknown operator passes through", () => {
    expect(getOperatorSymbol("%")).toBe("%");
  });
});

// ---------------------------------------------------------------------------
// parseNumericInput
// ---------------------------------------------------------------------------

describe("parseNumericInput", () => {
  it("parses '42' to 42", () => {
    expect(parseNumericInput("42")).toBe(42);
  });

  it("parses '3,5' to 3.5 (comma as decimal separator)", () => {
    expect(parseNumericInput("3,5")).toBe(3.5);
  });

  it("returns null for empty string", () => {
    expect(parseNumericInput("")).toBeNull();
  });

  it("returns null for 'abc'", () => {
    expect(parseNumericInput("abc")).toBeNull();
  });

  it("trims whitespace: ' 7 ' to 7", () => {
    expect(parseNumericInput(" 7 ")).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// isApproximatelyEqual
// ---------------------------------------------------------------------------

describe("isApproximatelyEqual", () => {
  it("equal values return true", () => {
    expect(isApproximatelyEqual(5, 5)).toBe(true);
  });

  it("within epsilon returns true", () => {
    expect(isApproximatelyEqual(1.0000001, 1.0000002)).toBe(true);
  });

  it("beyond epsilon returns false", () => {
    expect(isApproximatelyEqual(1.0, 1.1)).toBe(false);
  });
});
