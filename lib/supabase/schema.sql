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
