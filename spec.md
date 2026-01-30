# Especificacao Tecnica — MindCalc (MVP)

Baseado no PRD_mindcalc.md. Este documento lista **todos os arquivos a criar e modificar**, com descricao precisa do que cada um deve conter.

---

## 1. Inicializacao do Projeto

Antes de qualquer arquivo, executar:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
npx shadcn@latest init
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @mistralai/mistralai recharts zustand
```

Isso gera a estrutura base do Next.js 14 (App Router) com Tailwind ja configurado.

---

## 2. Arquivos a CRIAR

### 2.1 Configuracao e Infraestrutura

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 1 | `.env.local` | Criar com as variaveis: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MISTRAL_API_KEY` (apenas valores placeholder). |
| 2 | `lib/supabase/client.ts` | Exportar funcao `createClient()` que instancia o Supabase browser client usando `createBrowserClient` do `@supabase/auth-helpers-nextjs` com as env vars publicas. |
| 3 | `lib/supabase/server.ts` | Exportar funcao `createServerClient()` para uso em Server Components e Route Handlers, usando `createServerComponentClient` com cookies. |
| 4 | `lib/supabase/middleware.ts` | Exportar funcao `updateSession()` que renova o token Supabase via middleware, usando `createMiddlewareClient`. |
| 5 | `lib/supabase/schema.sql` | Script SQL para criar as 3 tabelas no Supabase (ver secao 5 abaixo). Nao e executado pelo app — serve de referencia para rodar no Supabase Dashboard. |

### 2.2 Providers e Layout Global

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 6 | `app/layout.tsx` | Root layout. Importar fonte Inter do `next/font/google`. Envolver `{children}` com `<AuthProvider>` e `<ThemeProvider>`. Incluir metadata (title: "MindCalc", description). Body com classes Tailwind de fundo escuro (`bg-slate-950 text-slate-100`). |
| 7 | `components/providers/AuthProvider.tsx` | `"use client"`. Context provider que usa `useEffect` para escutar `onAuthStateChange` do Supabase. Expoe `user`, `session`, `loading` e `signOut()` via context. |
| 8 | `components/providers/ThemeProvider.tsx` | Wrapper simples que aplica classe `dark` no `<html>`. Pode usar `next-themes` ou ser manual. |

### 2.3 Paginas (Rotas)

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 9 | `app/page.tsx` | **Landing Page**. Conteudo estatico: headline ("Treine calculo mental como um profissional"), subtitulo, CTA "Comecar agora" que redireciona para `/login`. Mostrar 3 blocos de beneficios (Adaptativo, Tracking, IA). Layout limpo, sem navbar. |
| 10 | `app/(auth)/login/page.tsx` | **Tela de Login/Cadastro**. Formulario com email + senha. Dois botoes: "Entrar" (signInWithPassword) e "Criar conta" (signUp). Usar Supabase Auth. Apos login, redirecionar: se perfil nao tem nivel -> `/onboarding`, senao -> `/dashboard`. |
| 11 | `app/(auth)/login/layout.tsx` | Layout simples centralizado (flex center) sem navbar, fundo gradiente escuro. |
| 12 | `app/(app)/layout.tsx` | Layout das rotas protegidas. Inclui `<Navbar />` no topo. Verifica autenticacao — se nao logado, redireciona para `/login`. |
| 13 | `app/(app)/onboarding/page.tsx` | **Teste Diagnostico**. Apresenta 8 exercicios sequenciais (2 soma, 2 subtracao, 2 multiplicacao, 2 divisao) com dificuldade crescente. Mede tempo de resposta e acertos. Ao finalizar, calcula nivel inicial (1-10) e salva no `profiles`. Redireciona para `/dashboard`. |
| 14 | `app/(app)/dashboard/page.tsx` | **Dashboard Principal**. Server Component que busca dados do `profiles` e `sessions`. Renderiza: `<StatsSummary>` (nivel, streak, precisao media), `<EvolutionChart>` (grafico de linha com ultimas 10 sessoes), `<WeakPointsList>` (operacoes com mais erros). Botao "Iniciar Treino" -> `/train`. |
| 15 | `app/(app)/train/page.tsx` | **Interface de Treino**. `"use client"`. Usa hook `useTrainingSession`. Fluxo: (1) chama API para gerar exercicios, (2) exibe um por vez com `<ExerciseCard>` e `<Timer>`, (3) usuario digita resposta e confirma, (4) apos 10 exercicios salva sessao e redireciona para `/results/[sessionId]`. |
| 16 | `app/(app)/results/[sessionId]/page.tsx` | **Feedback Pos-Treino**. Server Component. Busca a sessao pelo `sessionId` do params. Mostra: acertos/total, tempo medio, comparacao com sessao anterior (melhor/pior), lista de erros cometidos. Botao "Treinar novamente" e "Voltar ao Dashboard". |
| 17 | `app/(app)/billing/page.tsx` | **Paywall**. Pagina estatica com tabela comparativa Free vs Pro. Free: 1 treino/dia, 5 niveis. Pro: ilimitado, 10 niveis, relatorio IA. Botao "Assinar Pro" (placeholder, sem integracao de pagamento no MVP). |

### 2.4 Componentes de UI

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 18 | `components/shared/Navbar.tsx` | Barra superior. Logo "MindCalc" a esquerda. Links: Dashboard, Treinar, Billing. `<UserMenu>` a direita. |
| 19 | `components/shared/UserMenu.tsx` | Dropdown com email do usuario e botao "Sair" (chama `signOut` do AuthProvider). Usar componente `DropdownMenu` do shadcn/ui. |
| 20 | `components/shared/Footer.tsx` | Footer minimalista. Texto "MindCalc © 2025" centralizado. Usado apenas na Landing Page. |
| 21 | `components/training/ExerciseCard.tsx` | Recebe props: `operand1`, `operand2`, `operator`, `questionNumber`, `total`. Renderiza o exercicio no formato "12 x 7 = ?" em tipografia grande. Mostra progresso "3/10". |
| 22 | `components/training/Timer.tsx` | Recebe prop `startTime` (Date). Exibe cronometro em tempo real (segundos e decimos). Usa `useEffect` com `setInterval` de 100ms. Exibe em formato "00:12.3". |
| 23 | `components/training/ProgressBar.tsx` | Recebe props: `current` e `total`. Barra horizontal que preenche proporcionalmente. Usar div com width dinamico e transicao CSS. |
| 24 | `components/training/Keypad.tsx` | Teclado numerico opcional para mobile. Grid 3x4 com digitos 0-9, backspace e confirmar. Emite `onInput(digit)` e `onSubmit()`. |
| 25 | `components/dashboard/EvolutionChart.tsx` | `"use client"`. Recebe array de sessoes `{date, accuracy, avgTime}`. Renderiza `<LineChart>` do Recharts com duas linhas: precisao (%) e tempo medio (s). Eixo X = data, dois eixos Y. |
| 26 | `components/dashboard/StatsSummary.tsx` | Recebe props: `level`, `streak`, `avgAccuracy`, `totalSessions`. Renderiza 4 cards em grid com icone + valor + label. Usar `Card` do shadcn/ui. |
| 27 | `components/dashboard/WeakPointsList.tsx` | Recebe array de `{operation, errorRate}`. Lista ordenada pela maior taxa de erro. Cada item mostra operacao (ex: "Multiplicacao > 50") e barra visual do erro %. |

### 2.5 Logica, Hooks e Engine

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 28 | `lib/engine.ts` | **Motor de progressao**. Exportar: (1) `calculateLevel(accuracy, avgTime, currentLevel)` — retorna novo nivel baseado em regras (>=80% acerto e tempo abaixo do standard sobe nivel; <50% desce). (2) `getStandardTime(level)` — retorna tempo maximo aceitavel por nivel (ex: nivel 1 = 15s, nivel 10 = 4s). (3) `generateExercise(level, weakOperations?)` — gera um exercicio aleatorio adequado ao nivel seguindo as regras de faixa (1-3: soma/sub <50; 4-7: mult/div >100; 8-10: decimais/porcentagens). |
| 29 | `hooks/useTrainingSession.ts` | `"use client"`. Hook customizado. Estado interno: `exercises[]`, `currentIndex`, `answers[]`, `startTime`, `isLoading`, `isFinished`. Funcoes: `startSession()` (chama API, popula exercises), `submitAnswer(value)` (registra resposta e tempo, avanca index), `finishSession()` (salva no DB via fetch POST e retorna sessionId). |
| 30 | `hooks/useAuth.ts` | Hook que consome o AuthContext. Retorna `{user, session, loading, signOut}`. Atalho para `useContext(AuthContext)`. |

### 2.6 API Routes

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 31 | `app/api/generate-exercises/route.ts` | **POST**. Recebe `{userId, level}` no body. (1) Busca ultimos 50 registros de `exercise_logs` do usuario no Supabase. (2) Identifica operacoes com mais erros. (3) Monta prompt para Mistral: "Gere 10 exercicios de calculo mental nivel X, priorizando {operacoes fracas}. Retorne JSON array com campos: operand1, operand2, operator, correctAnswer." (4) Instancia o client Mistral com `new Mistral({ apiKey: process.env.MISTRAL_API_KEY })` e chama `client.chat.complete()` com model `mistral-medium-latest`, passando `response_format: { type: "json_object" }` para garantir retorno em JSON. (5) Parseia resposta (`chatResponse.choices[0].message.content`) e retorna JSON. |
| 32 | `app/api/sessions/route.ts` | **POST**. Recebe `{userId, exercises, answers, times, level}`. Calcula accuracy e avgTime. Insere registro em `sessions`. Insere cada exercicio em `exercise_logs`. Chama `calculateLevel()` e atualiza `profiles`. Atualiza streak (se treinou ontem, incrementa; senao, reseta para 1). Retorna `{sessionId, newLevel}`. |

### 2.7 Tipos TypeScript

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 33 | `types/index.ts` | Definir e exportar interfaces: `Profile {id, user_id, level, streak, created_at, updated_at}`, `Session {id, user_id, accuracy, avg_time, level_at_time, created_at}`, `ExerciseLog {id, session_id, user_id, operand1, operand2, operator, correct_answer, user_answer, time_spent, is_correct}`, `Exercise {operand1, operand2, operator, correctAnswer}`, `TrainingState {exercises, currentIndex, answers, startTime, isLoading, isFinished}`. |

---

## 3. Arquivos a MODIFICAR

Estes arquivos sao gerados pelo `create-next-app` e precisam de ajustes:

| # | Arquivo | O que modificar |
|---|---------|-----------------|
| M1 | `middleware.ts` | Criar na raiz (Next.js gera vazio ou nao gera). Importar `updateSession` de `lib/supabase/middleware`. Aplicar refresh de sessao. Configurar `matcher` para proteger rotas: `["/dashboard/:path*", "/train/:path*", "/onboarding/:path*", "/results/:path*", "/billing/:path*"]`. Se nao autenticado, redirecionar para `/login`. |
| M2 | `tailwind.config.ts` | Estender `theme.extend.colors` com paleta customizada: `primary` (azul escuro #1e3a5f), `accent` (azul vibrante #3b82f6), `surface` (cinza ardosia #1e293b), `background` (quase preto #0f172a). Configurar `darkMode: "class"`. |
| M3 | `next.config.js` (ou `.mjs`) | Adicionar configuracao de `env` se necessario. Adicionar dominio de imagens do Supabase em `images.remotePatterns` (para avatares futuros). Nenhuma configuracao critica no MVP — manter simples. |
| M4 | `app/globals.css` | Ajustar variaveis CSS do shadcn/ui para a paleta escura. Remover estilos default do create-next-app. Manter apenas `@tailwind base/components/utilities` e variaveis de cor customizadas no `:root` e `.dark`. |
| M5 | `package.json` | Ja modificado pelo `npm install`. Verificar se todos os pacotes estao listados: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `@mistralai/mistralai`, `recharts`, `zustand`. Adicionar script `"db:types": "npx supabase gen types typescript --project-id=<ref> > types/supabase.ts"` (opcional). |

---

## 4. Arquivos que NAO precisam ser criados no MVP

- Testes automatizados (fora do escopo MVP)
- Internacionalizacao (i18n)
- CI/CD pipeline (deploy manual via Vercel)
- PWA/Service Worker
- Integracao de pagamento real (billing e apenas visual)

---

## 5. Schema do Banco de Dados (Referencia para Supabase)

```sql
-- Tabela de perfis (extende auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  level integer not null default 1 check (level between 1 and 10),
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela de sessoes de treino
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  accuracy numeric(5,2) not null,
  avg_time numeric(6,2) not null,
  level_at_time integer not null,
  exercises_count integer not null default 10,
  created_at timestamptz not null default now()
);

-- Tabela de logs individuais de exercicios
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

-- Indices para queries frequentes
create index idx_sessions_user on public.sessions(user_id, created_at desc);
create index idx_exercise_logs_user on public.exercise_logs(user_id, is_correct);
create index idx_exercise_logs_session on public.exercise_logs(session_id);

-- RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.exercise_logs enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can view own sessions"
  on public.sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions"
  on public.sessions for insert with check (auth.uid() = user_id);

create policy "Users can view own logs"
  on public.exercise_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs"
  on public.exercise_logs for insert with check (auth.uid() = user_id);

-- Trigger para criar profile automaticamente ao cadastrar
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
```

---

## 6. Ordem de Implementacao Recomendada

1. **Fase 1 — Infraestrutura**: Inicializar projeto, instalar deps, configurar Supabase (client/server/middleware), criar schema SQL, configurar Tailwind e globals.css.
2. **Fase 2 — Auth**: AuthProvider, hook useAuth, pagina de login, middleware de protecao de rotas.
3. **Fase 3 — Engine + Tipos**: types/index.ts, lib/engine.ts (gerar exercicios local, calcular nivel).
4. **Fase 4 — Onboarding**: Pagina de teste diagnostico, salvar nivel inicial.
5. **Fase 5 — Treino**: useTrainingSession hook, API generate-exercises, API sessions, pagina de treino, componentes (ExerciseCard, Timer, ProgressBar).
6. **Fase 6 — Dashboard + Resultados**: Pagina de dashboard, componentes de graficos (EvolutionChart, StatsSummary, WeakPointsList), pagina de resultados.
7. **Fase 7 — Polish**: Landing page, billing page, Navbar, Footer, UserMenu, Keypad mobile.

---

## Resumo Quantitativo

| Categoria | Quantidade |
|-----------|-----------|
| Arquivos a **criar** | 33 |
| Arquivos a **modificar** | 5 |
| Tabelas no banco | 3 |
| API Routes | 2 |
| Componentes de UI | 10 |
| Paginas/Rotas | 8 |
| Total de arquivos envolvidos | **38** |
