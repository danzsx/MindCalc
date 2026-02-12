export type Operator = "+" | "-" | "*" | "/";

export type UserPlan = "free" | "pro";

export interface Profile {
  id: string;
  level: number;
  streak: number;
  plan: UserPlan;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  accuracy: number;
  avg_time: number;
  level_at_time: number;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  session_id: string;
  user_id: string;
  operand1: number;
  operand2: number;
  operator: Operator;
  correct_answer: number;
  user_answer: number | null;
  time_spent: number;
  is_correct: boolean;
}

export interface Exercise {
  operand1: number;
  operand2: number;
  operator: Operator;
  correctAnswer: number;
}

export interface TrainingState {
  exercises: Exercise[];
  currentIndex: number;
  answers: number[];
  startTime: Date | null;
  isLoading: boolean;
  isFinished: boolean;
}

// ---------------------------------------------------------------------------
// Lessons (Aula Interativa)
// ---------------------------------------------------------------------------

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  technique: string;
  operator: Operator;
  sort_order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category?: string;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
  times_completed: number;
}

export interface LearnedTechnique {
  id: string;
  user_id: string;
  lesson_id: string;
  operator: Operator;
  learned_at: string;
}

// ---------------------------------------------------------------------------
// Tabuada
// ---------------------------------------------------------------------------

export type TablesOperation = "+" | "-" | "*" | "/";
export type TablesMode = "guided" | "free";
export type TablesRange = { min: number; max: number };

export interface TablesConfig {
  operation: TablesOperation;
  range: TablesRange;
  mode: TablesMode;
}

export interface TablesQuestion {
  id: string;
  operand1: number;
  operand2: number;
  operator: TablesOperation;
  correctAnswer: number;
  explanation: string;
}

export interface TablesAnswer {
  questionId: string;
  userAnswer: number | null;
  isCorrect: boolean;
  attempts: number;
}

export interface TablesBlock {
  questions: TablesQuestion[];
  answers: TablesAnswer[];
  accuracy: number;
}

export interface TablesSessionState {
  config: TablesConfig;
  blocks: TablesBlock[];
  currentBlockIndex: number;
  currentQuestionIndex: number;
  retryQueue: TablesQuestion[];
  retryCount: Map<string, number>;
  phase: "answering" | "feedback" | "block-summary" | "finished";
  isFinished: boolean;
}

export interface TablesSessionResult {
  sessionId: string;
  config: TablesConfig;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  blocksCompleted: number;
  difficultCombinations: TablesQuestion[];
}

export interface TablesProgress {
  id: string;
  operation: TablesOperation;
  rangeMin: number;
  rangeMax: number;
  masteredPercentage: number;
  lastPracticedAt: string | null;
}

export interface TablesQuestionLog {
  id: string;
  session_id: string;
  user_id: string;
  operand1: number;
  operand2: number;
  operator: TablesOperation;
  correct_answer: number;
  user_answer: number | null;
  is_correct: boolean;
  attempts: number;
  created_at: string;
}
