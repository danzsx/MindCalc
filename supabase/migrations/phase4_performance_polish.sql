-- Phase 4: Alta Performance & Polish
-- Run this migration on your Supabase SQL Editor

-- 4.1 Modo Cronometrado
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'normal' CHECK (mode IN ('normal', 'timed'));
ALTER TABLE public.exercise_logs ADD COLUMN IF NOT EXISTS timed_out boolean NOT NULL DEFAULT false;

-- 4.2 Mistura Estrategica de Tecnicas
ALTER TABLE public.exercise_logs ADD COLUMN IF NOT EXISTS technique_slug text;

-- 4.3 Survey de Autoconfianca
CREATE TABLE IF NOT EXISTS public.confidence_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score BETWEEN 1 AND 10),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_confidence_surveys_user ON public.confidence_surveys (user_id, created_at DESC);

ALTER TABLE public.confidence_surveys ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'confidence_surveys' AND policyname = 'Users can view own'
  ) THEN
    CREATE POLICY "Users can view own" ON public.confidence_surveys FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'confidence_surveys' AND policyname = 'Users can insert own'
  ) THEN
    CREATE POLICY "Users can insert own" ON public.confidence_surveys FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
