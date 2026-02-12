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
}

// ---------------------------------------------------------------------------
// Interactive lesson configuration
// ---------------------------------------------------------------------------

export type InteractiveLessonType = "round-to-ten" | "step-discovery" | "fraction-pizza";

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

export type IntroScreen =
  | IntroScreenObserve
  | IntroScreenChoice
  | IntroScreenFill
  | IntroScreenAction
  | IntroScreenSolve
  | IntroScreenSummary;

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

export interface InteractiveLessonConfig {
  type: InteractiveLessonType;
  /** Operands used in the interactive intro discovery journey */
  introOperand1: number;
  introOperand2: number;
  /** Screens for the step-discovery intro (only for type "step-discovery") */
  introScreens?: IntroScreen[];
  /** Builds strategy steps for scaffolded exercises (only for type "step-discovery") */
  buildExerciseSteps?: (exercise: LessonExerciseData) => StrategyStep[];
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
}
