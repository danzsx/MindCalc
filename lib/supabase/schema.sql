-- =============================================
-- MindCalc MVP — Schema SQL (Supabase)
-- Executar no Supabase Dashboard > SQL Editor
-- Copie TODO o conteudo e execute de uma vez.
-- =============================================

-- ===================
-- 1. TABELAS
-- ===================

-- Perfil do usuario (extende auth.users)
-- PK = auth.users.id → cada usuario tem exatamente 1 perfil
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  level integer not null default 1 check (level between 1 and 10),
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sessoes de treino (diagnostico ou treino regular)
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  accuracy numeric(5,2) not null,
  avg_time numeric(6,2) not null,
  level_at_time integer not null,
  exercises_count integer not null default 10,
  created_at timestamptz not null default now()
);

-- Log individual de cada exercicio dentro de uma sessao
create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  operand1 numeric not null,
  operand2 numeric not null,
  operator text not null check (operator in ('+', '-', '*', '/')),
  correct_answer numeric not null,
  user_answer numeric,
  time_spent numeric(6,2) not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

-- ===================
-- 2. INDICES
-- ===================

create index idx_sessions_user on public.sessions(user_id, created_at desc);
create index idx_exercise_logs_user on public.exercise_logs(user_id, is_correct);
create index idx_exercise_logs_session on public.exercise_logs(session_id);

-- ===================
-- 3. ROW LEVEL SECURITY
-- ===================

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.exercise_logs enable row level security;

-- profiles: usuario le e atualiza apenas seu proprio perfil
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- sessions: usuario le e insere apenas suas proprias sessoes
create policy "Users can view own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

-- exercise_logs: usuario le e insere apenas seus proprios logs
create policy "Users can view own logs"
  on public.exercise_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on public.exercise_logs for insert
  with check (auth.uid() = user_id);

-- ===================
-- 4. TRIGGER: criar profile automaticamente ao cadastrar
-- ===================

-- Funcao executada com permissoes elevadas (security definer)
-- para poder inserir na tabela profiles mesmo com RLS ativo.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===================
-- 5. MIGRACAO: criar perfis para usuarios que ja existem no Auth
-- ===================

-- Se voce ja criou contas de teste antes de executar este script,
-- este INSERT garante que esses usuarios tambem tenham perfis.
insert into public.profiles (id)
select id from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- =============================================
-- 6. TABELAS — Aula Interativa
-- =============================================

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
-- 7. INDICES — Aula Interativa
-- ===================

create index idx_lessons_sort_order on public.lessons (sort_order);
create index idx_lesson_progress_user on public.lesson_progress (user_id);
create index idx_learned_techniques_user on public.learned_techniques (user_id);

-- ===================
-- 8. ROW LEVEL SECURITY — Aula Interativa
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

-- =============================================
-- 9. TABELAS — Tabuada
-- =============================================

-- Sessoes de treino da Tabuada
create table if not exists public.tables_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  operation text not null check (operation in ('+', '-', '*', '/')),
  range_min integer not null,
  range_max integer not null,
  mode text not null check (mode in ('guided', 'free')),
  total_questions integer not null,
  correct_answers integer not null,
  accuracy numeric(5,2) not null,
  created_at timestamptz not null default now()
);

-- Progresso do usuario por operacao/range
create table if not exists public.tables_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  operation text not null check (operation in ('+', '-', '*', '/')),
  range_min integer not null,
  range_max integer not null,
  mastered_percentage numeric(5,2) not null default 0,
  last_practiced_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint uq_user_op_range unique (user_id, operation, range_min, range_max)
);

-- Log individual de cada questao dentro de uma sessao de tabuada
create table if not exists public.tables_question_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.tables_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  operand1 integer not null,
  operand2 integer not null,
  operator text not null check (operator in ('+', '-', '*', '/')),
  correct_answer integer not null,
  user_answer integer,
  is_correct boolean not null default false,
  attempts integer not null default 1,
  created_at timestamptz not null default now()
);

-- ===================
-- 10. INDICES — Tabuada
-- ===================

create index if not exists idx_tables_sessions_user
  on public.tables_sessions (user_id);

create index if not exists idx_tables_question_logs_user
  on public.tables_question_logs (user_id);

create index if not exists idx_tables_question_logs_session
  on public.tables_question_logs (session_id);

-- ===================
-- 11. ROW LEVEL SECURITY — Tabuada
-- ===================

alter table public.tables_sessions enable row level security;
alter table public.tables_progress enable row level security;
alter table public.tables_question_logs enable row level security;

create policy "Users can insert own tables_sessions"
  on public.tables_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can read own tables_sessions"
  on public.tables_sessions for select
  using (auth.uid() = user_id);

create policy "Users can manage own tables_progress"
  on public.tables_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can insert own tables_question_logs"
  on public.tables_question_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can read own tables_question_logs"
  on public.tables_question_logs for select
  using (auth.uid() = user_id);
