-- =============================================
-- Migration 001 — Lessons tables
-- Aula Interativa: lessons, lesson_progress, learned_techniques
-- =============================================

-- ===================
-- 1. TABELAS
-- ===================

-- Catalogo de aulas disponiveis (seed data)
create table public.lessons (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text not null,
  technique   text not null,
  operator    text not null check (operator in ('+', '-', '*', '/')),
  sort_order  integer not null default 0,
  difficulty  text not null default 'beginner'
              check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at  timestamptz not null default now()
);

-- Progresso do usuario em cada aula
create table public.lesson_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  lesson_id       uuid not null references public.lessons(id) on delete cascade,
  completed_at    timestamptz not null default now(),
  times_completed integer not null default 1,

  constraint uq_user_lesson unique (user_id, lesson_id)
);

-- Tecnicas aprendidas pelo usuario (integracao com treino)
create table public.learned_techniques (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  operator    text not null check (operator in ('+', '-', '*', '/')),
  learned_at  timestamptz not null default now(),

  constraint uq_user_technique unique (user_id, lesson_id)
);

-- ===================
-- 2. INDICES
-- ===================

create index idx_lessons_sort_order on public.lessons (sort_order);
create index idx_lesson_progress_user on public.lesson_progress (user_id);
create index idx_learned_techniques_user on public.learned_techniques (user_id);

-- ===================
-- 3. ROW LEVEL SECURITY
-- ===================

-- lessons: leitura publica para usuarios autenticados (catalogo)
alter table public.lessons enable row level security;

create policy "Lessons are viewable by authenticated users"
  on public.lessons for select
  to authenticated
  using (true);

-- lesson_progress: usuario ve/insere/atualiza apenas seus dados
alter table public.lesson_progress enable row level security;

create policy "Users can view own lesson progress"
  on public.lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own lesson progress"
  on public.lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own lesson progress"
  on public.lesson_progress for update
  to authenticated
  using (auth.uid() = user_id);

-- learned_techniques: usuario ve/insere apenas seus dados
alter table public.learned_techniques enable row level security;

create policy "Users can view own learned techniques"
  on public.learned_techniques for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own learned techniques"
  on public.learned_techniques for insert
  to authenticated
  with check (auth.uid() = user_id);
