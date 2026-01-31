export type Operator = "+" | "-" | "*" | "/";

export interface Profile {
  id: string;
  level: number;
  streak: number;
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
