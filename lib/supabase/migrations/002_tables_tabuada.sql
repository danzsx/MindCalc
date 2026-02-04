-- =============================================
-- MindCalc — Tabuada: Migration SQL
-- Executar no Supabase Dashboard > SQL Editor
-- Copie TODO o conteudo e execute de uma vez.
--
-- Este script e IDEMPOTENTE: pode ser executado
-- varias vezes sem erro.
-- =============================================

-- ===================
-- 1. TABELAS
-- ===================

-- Sessoes de treino da Tabuada
CREATE TABLE IF NOT EXISTS public.tables_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  operation text NOT NULL CHECK (operation IN ('+', '-', '*', '/')),
  range_min integer NOT NULL,
  range_max integer NOT NULL,
  mode text NOT NULL CHECK (mode IN ('guided', 'free')),
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  accuracy numeric(5,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Progresso do usuario por operacao/range
CREATE TABLE IF NOT EXISTS public.tables_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  operation text NOT NULL CHECK (operation IN ('+', '-', '*', '/')),
  range_min integer NOT NULL,
  range_max integer NOT NULL,
  mastered_percentage numeric(5,2) NOT NULL DEFAULT 0,
  last_practiced_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_op_range UNIQUE (user_id, operation, range_min, range_max)
);

-- Log individual de cada questao dentro de uma sessao de tabuada
CREATE TABLE IF NOT EXISTS public.tables_question_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.tables_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  operand1 integer NOT NULL,
  operand2 integer NOT NULL,
  operator text NOT NULL CHECK (operator IN ('+', '-', '*', '/')),
  correct_answer integer NOT NULL,
  user_answer integer,
  is_correct boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===================
-- 2. INDICES
-- ===================

CREATE INDEX IF NOT EXISTS idx_tables_sessions_user
  ON public.tables_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_tables_question_logs_user
  ON public.tables_question_logs (user_id);

CREATE INDEX IF NOT EXISTS idx_tables_question_logs_session
  ON public.tables_question_logs (session_id);

-- ===================
-- 3. ROW LEVEL SECURITY
-- ===================

ALTER TABLE public.tables_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables_question_logs ENABLE ROW LEVEL SECURITY;

-- tables_sessions: usuario insere e le apenas suas proprias sessoes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tables_sessions'
      AND policyname = 'Users can insert own tables_sessions'
  ) THEN
    CREATE POLICY "Users can insert own tables_sessions"
      ON public.tables_sessions FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tables_sessions'
      AND policyname = 'Users can read own tables_sessions'
  ) THEN
    CREATE POLICY "Users can read own tables_sessions"
      ON public.tables_sessions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- tables_progress: usuario gerencia apenas seu proprio progresso
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tables_progress'
      AND policyname = 'Users can manage own tables_progress'
  ) THEN
    CREATE POLICY "Users can manage own tables_progress"
      ON public.tables_progress FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- tables_question_logs: usuario insere e le apenas seus proprios logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tables_question_logs'
      AND policyname = 'Users can insert own tables_question_logs'
  ) THEN
    CREATE POLICY "Users can insert own tables_question_logs"
      ON public.tables_question_logs FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tables_question_logs'
      AND policyname = 'Users can read own tables_question_logs'
  ) THEN
    CREATE POLICY "Users can read own tables_question_logs"
      ON public.tables_question_logs FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- ===================
-- 4. ALTERACAO: coluna source em exercise_logs
-- ===================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'exercise_logs'
      AND column_name = 'source'
  ) THEN
    ALTER TABLE public.exercise_logs
      ADD COLUMN source text NOT NULL DEFAULT 'training';

    ALTER TABLE public.exercise_logs
      ADD CONSTRAINT exercise_logs_source_check
      CHECK (source IN ('training', 'tables'));
  END IF;
END $$;

-- ===================
-- 5. RECARREGAR SCHEMA CACHE DO PostgREST
-- ===================
-- Isso faz o Supabase reconhecer as novas tabelas imediatamente.

NOTIFY pgrst, 'reload schema';
