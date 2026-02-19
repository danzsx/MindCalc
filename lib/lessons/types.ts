import type { Operator } from "@/types";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type LessonPhase =
  | "intro"
  | "guided"
  | "semi-guided"
  | "free"
  | "completion";

export type HintLevel = "full" | "partial" | "none";

export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

// ---------------------------------------------------------------------------
// Lesson exercise data (used for guided / semi-guided / free phases)
// ---------------------------------------------------------------------------

export interface LessonExerciseData {
  operand1: number;
  operand2: number;
  operator: Operator;
  correctAnswer: number;
  fullHint: string;
  partialHint: string;
  stepByStep: string[];
  /** Optional real-world context shown above the expression (Phase 5.1) */
  context?: string;
}

// ---------------------------------------------------------------------------
// Comprehension check (Phase 5.4)
// Shown between guided and semi-guided phases — no impact on progress
// ---------------------------------------------------------------------------

export interface ComprehensionCheck {
  question: string;
  options: Array<{ label: string }>;
  /** 0-based index of the correct option */
  correctIndex: number;
  /** Feedback shown after answering (for both correct and incorrect) */
  feedback: string;
}

// ---------------------------------------------------------------------------
// Interactive lesson configuration
// ---------------------------------------------------------------------------

export type InteractiveLessonType = "round-to-ten" | "step-discovery" | "fraction-pizza" | "price-comparison" | "parcelamento";

// ---------------------------------------------------------------------------
// Generic step-discovery intro screen types
// ---------------------------------------------------------------------------

export interface IntroScreenObserve {
  kind: "observe";
  message: string;
  /** Override the default "op1 OP op2" expression display */
  expressionLabel?: string;
}

export interface IntroScreenChoice {
  kind: "choice";
  question: string;
  options: Array<{ label: string; value: string; sublabel?: string }>;
  correct: string;
  wrongMsg: string;
  winMsg: string;
}

export interface IntroScreenFill {
  kind: "fill";
  question: string;
  answer: number;
  winMsg: string;
  wrongMsg?: string;
  /** Visual equation hint like "30 + 40 = ?" */
  equationHint?: string;
}

export interface IntroScreenAction {
  kind: "action";
  message: string;
  buttonText: string;
  resultMessage: string;
  resultHighlight?: string;
}

export interface IntroScreenSolve {
  kind: "solve";
  message: string;
  equationDisplay: string;
  answer: number;
  winMsg: string;
  wrongMsg?: string;
}

export interface IntroScreenSummary {
  kind: "summary";
  recapSteps: Array<{ text: string; color: "cyan" | "amber" | "emerald" }>;
  closingMsg: string;
}

// ---------------------------------------------------------------------------
// Phase 4 — Advanced interaction screen types
// ---------------------------------------------------------------------------

/** Tap-to-select + tap-to-place decomposition of a number into tens and units */
export interface IntroScreenDragDecompose {
  kind: "drag-decompose";
  /** The number to decompose, e.g. 37 → 30 (tens) + 7 (units) */
  number: number;
  winMsg: string;
}

/** Visual equation with an inline blank input — e.g. "30 + 40 = [__]" */
export interface IntroScreenEquationFill {
  kind: "equation-fill";
  question: string;
  /** Left side of the equation, e.g. "30 + 40 =" */
  equationLeft: string;
  /** Optional right side after blank */
  equationRight?: string;
  answer: number;
  winMsg: string;
  wrongMsg?: string;
}

/** Slider that the user drags to reach the nearest decade */
export interface IntroScreenNumberSlider {
  kind: "number-slider";
  question: string;
  /** Starting value for the slider (e.g. 53) */
  number: number;
  /** Target decade the user must slide to (e.g. 50) */
  target: number;
  winMsg: string;
}

export type IntroScreen =
  | IntroScreenObserve
  | IntroScreenChoice
  | IntroScreenFill
  | IntroScreenAction
  | IntroScreenSolve
  | IntroScreenSummary
  | IntroScreenDragDecompose
  | IntroScreenEquationFill
  | IntroScreenNumberSlider;

// ---------------------------------------------------------------------------
// Strategy step for exercise scaffolding
// ---------------------------------------------------------------------------

export interface StrategyStep {
  prompt: string;
  answer: number;
  hint?: string;
}

// ---------------------------------------------------------------------------
// Interactive lesson configuration
// ---------------------------------------------------------------------------

export type LessonVisualType = "decomposition" | "number-line" | "blocks";

export interface InteractiveLessonConfig {
  type: InteractiveLessonType;
  /** Operands used in the interactive intro discovery journey */
  introOperand1: number;
  introOperand2: number;
  /** Screens for the step-discovery intro (only for type "step-discovery") */
  introScreens?: IntroScreen[];
  /** Builds strategy steps for scaffolded exercises (only for type "step-discovery") */
  buildExerciseSteps?: (exercise: LessonExerciseData) => StrategyStep[];
  /** Optional visual component shown alongside the exercise scaffolding (Phase 3) */
  visual?: LessonVisualType;
}

// ---------------------------------------------------------------------------
// Full lesson content (static data stored in lib/lessons/data/)
// ---------------------------------------------------------------------------

export interface LessonContent {
  slug: string;
  title: string;
  technique: string;
  operator: Operator;
  difficulty: LessonDifficulty;

  intro: {
    explanation: string;
    example: {
      expression: string;
      steps: string[];
      answer: number;
    };
  };

  exercises: {
    guided: LessonExerciseData;
    semiGuided: LessonExerciseData;
    free: LessonExerciseData;
  };

  practiceGenerator: (count: number) => LessonExerciseData[];

  /** When present, the lesson uses the interactive discovery flow */
  interactive?: InteractiveLessonConfig;

  /** Optional comprehension check shown after guided phase, before semi-guided (Phase 5.4) */
  comprehensionCheck?: ComprehensionCheck;
}
