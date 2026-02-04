# Spec — Feature: Tabuada

**Produto:** MindCalc
**Baseado em:** `prd_TABUADA.md`
**Stack:** Next.js 14 (App Router) · Supabase · Tailwind CSS · shadcn/ui

---

## 1. Visao Geral

Esta spec detalha a implementacao tecnica da feature Tabuada conforme definida no PRD. O objetivo e criar um modulo de treino isolado para operacoes basicas, com blocos curtos, repeticao de erros e feedback imediato, sem impactar nivel ou streak do usuario.

A implementacao segue os padroes ja estabelecidos no codebase:
- Server components para data fetching, client components para interatividade
- Custom hooks para state management de sessao (mesmo padrao de `useTrainingSession`)
- API routes para persistencia (mesmo padrao de `/api/sessions`)
- Supabase client/server split (mesmo padrao de `lib/supabase/`)

---

## 1.1 Design Patterns do Codebase

Referencia obrigatoria para todas as fases. O pseudocodigo das secoes seguintes define estrutura e comportamento; o **estilo visual** deve sempre seguir os padroes abaixo.

### Cards

Toda superficie tipo card usa:

```
bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]
```

Hover (quando aplicavel):

```
hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300
```

Variante maior (dashboard/chart):

```
bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]
```

### Botao Primario

```
bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6]
shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300
min-h-[56px] font-medium
```

Estado disabled:

```
disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-md
```

Largura total (dentro de card): adicionar `w-full`.

### Input Numerico

```
w-full px-6 py-4 bg-muted text-foreground rounded-xl border-2 border-primary/30
focus:border-primary focus:outline-none transition-colors text-lg text-center font-medium
```

Atributos: `type="number"`, `inputMode="numeric"`, `autoFocus`.

### Barra de Progresso

Nao usar shadcn `Progress`. Usar o padrao custom:

```html
<div className="h-3 w-full overflow-hidden rounded-full bg-primary/20">
  <div
    className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-300"
    style={{ width: `${pct}%` }}
  />
</div>
```

Variante para erro/acerto (WeakPointsList): cor condicional `bg-[#FB923C]` (alto erro) ou `bg-[#10B981]` (baixo erro).

### Header de Card no Dashboard

```html
<div className="flex items-center gap-3 mb-4">
  <div className="bg-{color}/10 p-2 rounded-lg">
    <Icon className="h-5 w-5 text-{color}" />
  </div>
  <h2 className="text-lg font-semibold text-foreground">Titulo</h2>
</div>
```

Cores por contexto: `primary` (geral), `destructive` (erros/alertas), `success` (conquistas).

### Icone em Circulo (Stats)

```html
<div className="bg-{color}/10 p-3 rounded-full">
  <Icon className="h-5 w-5 text-{color}" />
</div>
```

### Layout por Tipo de Pagina

| Tipo | Classes | Referencia |
|------|---------|------------|
| Treino (foco central) | `flex items-center justify-center min-h-[70vh]` + card `max-w-md w-full` | `train/page.tsx` |
| Listagem | `container mx-auto max-w-4xl px-4 py-8 space-y-6 fade-in` | `lessons/page.tsx` |
| Resultado | `mx-auto max-w-2xl px-4 py-8 space-y-8` | `results/[sessionId]/page.tsx` |
| Dashboard | `<main className="space-y-8 fade-in">` (sem container, usa layout pai) | `dashboard/page.tsx` |

**Tabuada deve usar:**
- `/tabuada` (config): layout de treino (card centralizado, `max-w-md`)
- `/tabuada/session`: layout de treino (card centralizado, `max-w-md`)
- `/tabuada/result/[sessionId]`: layout de resultado (`max-w-2xl`)

### Animacoes

- Container de pagina: classe `fade-in`
- Card que aparece (pre-start, modais): classe `zoom-in-95`
- Listas/grids: `animationDelay` escalonado por item (`${index * 80}ms` ou `${index * 100}ms`)
- Erro de input: classe `shake` no wrapper

### Cores Semanticas

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `#2DD4BF` | Acoes principais, links, destaques |
| `--primary` hover | `#14B8A6` | Hover de botoes e links primarios |
| `--secondary` | `#FDE047` | Badges, streak |
| `--success` | `#10B981` | Acertos, progresso positivo |
| `--destructive` | `#FB923C` | Erros (tom laranja, **nunca vermelho**) |
| `--foreground` | `#1E293B` | Texto principal |
| `--muted-foreground` | `#94A3B8` | Texto secundario, descricoes |
| `--muted` | `#F1F5F9` | Fundos de input, badges, estados inativos |

### Tipografia

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| h1 | Fredoka (`--font-family-display`) | 2rem | 600 |
| h2 | Inter (`--font-family-body`) | 1.25rem | 500 |
| h3 | Inter | 1.125rem | 500 |
| p, input, button | Inter | 1rem | 400/500 |

### Navbar

Array `navLinks` em `components/shared/Navbar.tsx`. Cada item: `{ href, label, icon }`.

- Ativo: `bg-muted text-foreground font-medium`
- Inativo: `text-muted-foreground hover:text-primary hover:bg-muted`

Mobile: componente `MobileNav` (Sheet) consome o mesmo array `navLinks`.

### Loading States

Skeleton (shadcn `Skeleton`) para listas. Spinner custom para salvamento:

```html
<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
```

### Feedback Visual

- Acerto: icone `CheckCircle2` com `text-success` + fundo `bg-success/10`
- Erro: icone `XCircle` com `text-destructive` + fundo `bg-destructive/10` (tom laranja)
- Mensagens de erro em formulario: `text-sm text-destructive`
- Toasts: via `sonner` (`toast.success()`, `toast.error()`)

---

## 2. Banco de Dados

### 2.1 Nova Tabela: `tables_sessions`

```sql
CREATE TABLE public.tables_sessions (
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

CREATE INDEX idx_tables_sessions_user ON public.tables_sessions (user_id);

ALTER TABLE public.tables_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own tables_sessions"
  ON public.tables_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own tables_sessions"
  ON public.tables_sessions FOR SELECT
  USING (auth.uid() = user_id);
```

### 2.2 Nova Tabela: `tables_progress`

```sql
CREATE TABLE public.tables_progress (
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

ALTER TABLE public.tables_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tables_progress"
  ON public.tables_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 2.3 Nova Tabela: `tables_question_logs`

```sql
CREATE TABLE public.tables_question_logs (
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

CREATE INDEX idx_tables_question_logs_user ON public.tables_question_logs (user_id);
CREATE INDEX idx_tables_question_logs_session ON public.tables_question_logs (session_id);

ALTER TABLE public.tables_question_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own tables_question_logs"
  ON public.tables_question_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own tables_question_logs"
  ON public.tables_question_logs FOR SELECT
  USING (auth.uid() = user_id);
```

### 2.4 Alteracao em Tabela Existente: `exercise_logs`

Adicionar coluna `source` para diferenciar origem dos exercicios:

```sql
ALTER TABLE public.exercise_logs
  ADD COLUMN source text NOT NULL DEFAULT 'training'
  CHECK (source IN ('training', 'tables'));
```

---

## 3. Tipos e Interfaces

Adicionar em `types/index.ts`:

```typescript
// --- Tabuada Types ---

type TablesOperation = "+" | "-" | "*" | "/";
type TablesMode = "guided" | "free";
type TablesRange = { min: number; max: number };

interface TablesConfig {
  operation: TablesOperation;
  range: TablesRange;
  mode: TablesMode;
}

interface TablesQuestion {
  id: string;                    // uuid gerado no cliente para tracking
  operand1: number;
  operand2: number;
  operator: TablesOperation;
  correctAnswer: number;
  explanation: string;           // explicacao de decomposicao mental
}

interface TablesAnswer {
  questionId: string;
  userAnswer: number | null;
  isCorrect: boolean;
  attempts: number;              // 1 = acertou de primeira, 2+ = tentou mais vezes
}

interface TablesBlock {
  questions: TablesQuestion[];
  answers: TablesAnswer[];
  accuracy: number;              // % de acerto do bloco
}

interface TablesSessionState {
  config: TablesConfig;
  blocks: TablesBlock[];
  currentBlockIndex: number;
  currentQuestionIndex: number;
  retryQueue: TablesQuestion[];  // questoes erradas aguardando repeticao
  retryCount: Map<string, number>; // questionId -> numero de repeticoes ja feitas
  phase: "answering" | "feedback" | "block-summary" | "finished";
  isFinished: boolean;
}

interface TablesSessionResult {
  sessionId: string;
  config: TablesConfig;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  blocksCompleted: number;
  difficultCombinations: TablesQuestion[]; // combinacoes com dificuldade persistente
}

interface TablesProgress {
  id: string;
  operation: TablesOperation;
  rangeMin: number;
  rangeMax: number;
  masteredPercentage: number;
  lastPracticedAt: string | null;
}
```

---

## 4. Engine de Geracao — `lib/tables/engine.ts`

Novo arquivo. Motor deterministico para gerar combinacoes da tabuada.

### 4.1 `generateCombinations`

```typescript
function generateCombinations(
  operation: TablesOperation,
  range: TablesRange
): TablesQuestion[]
```

Gera **todas** as combinacoes possiveis para a operacao e intervalo.
- Adicao: `a + b` onde `a, b` estao em `[range.min, range.max]`
- Subtracao: `a - b` onde `a` esta em `[range.min, range.max]`, `b <= a`, resultado >= 0
- Multiplicacao: `a * b` onde `a, b` estao em `[range.min, range.max]`
- Divisao: `a / b` onde `b != 0`, resultado e inteiro, `a` esta em `[range.min * range.min, range.max * range.max]`

Remove duplicatas por comutatividade (ex: `3+5` e `5+3` contam como uma so, manter a de menor operand1).

### 4.2 `generateBlock`

```typescript
function generateBlock(
  allCombinations: TablesQuestion[],
  usedIds: Set<string>,
  retryQueue: TablesQuestion[],
  difficultyTier: "low" | "mid" | "high",
  range: TablesRange
): TablesQuestion[]
```

Retorna um bloco de **6 questoes**:
1. Primeiro, inclui questoes da `retryQueue` (max 2 por bloco).
2. Completa com questoes novas do `difficultyTier` correspondente:
   - `"low"`: operandos em `[range.min, range.min + floor((range.max - range.min) / 3)]`
   - `"mid"`: operandos na faixa intermediaria
   - `"high"`: operandos em `[range.min + 2*ceil((range.max - range.min) / 3), range.max]`
3. Embaralha o bloco com `Fisher-Yates shuffle`.

### 4.3 `generateExplanation`

```typescript
function generateExplanation(
  operand1: number,
  operand2: number,
  operator: TablesOperation
): string
```

Gera explicacao por decomposicao mental:
- Adicao: `"7 + 8 = 7 + 3 + 5 = 10 + 5 = 15"` (completar dezena)
- Subtracao: `"15 - 7 = 15 - 5 - 2 = 10 - 2 = 8"` (descer ate dezena)
- Multiplicacao: `"6 x 8 = 6 x (4 + 4) = 24 + 24 = 48"` (decomposicao)
- Divisao: `"48 / 6 = ? -> 6 x ? = 48 -> 6 x 8 = 48 -> resposta: 8"` (inversao)

Para combinacoes triviais (operando <= 2), retorna explicacao direta: `"2 x 3 = 6"`.

### 4.4 `calculateMasteredPercentage`

```typescript
function calculateMasteredPercentage(
  logs: TablesQuestionLog[],
  operation: TablesOperation,
  range: TablesRange
): number
```

Calcula % de combinacoes dominadas:
- Uma combinacao e "dominada" se foi respondida corretamente nas **ultimas 2 ocorrencias**.
- Retorna `(dominadas / total_combinacoes_possiveis) * 100`.

### 4.5 `getDifficultyTier`

```typescript
function getDifficultyTier(blockIndex: number): "low" | "mid" | "high"
```

Retorna o tier de dificuldade baseado no indice do bloco:
- Blocos 0-1: `"low"`
- Blocos 2-3: `"mid"`
- Blocos 4+: `"high"`

---

## 5. Hook de Sessao — `hooks/useTablesSession.ts`

Novo arquivo. Segue o padrao de `hooks/useTrainingSession.ts`.

### 5.1 Interface Publica

```typescript
function useTablesSession() {
  return {
    // Estado
    state: TablesSessionState | null;
    currentQuestion: TablesQuestion | null;
    blockProgress: { current: number; total: number };
    overallProgress: { blocksCompleted: number; totalCorrect: number; totalAnswered: number };

    // Acoes
    startSession: (config: TablesConfig) => void;
    submitAnswer: (answer: number) => void;
    nextQuestion: () => void;         // apos ver feedback, avanca
    nextBlock: () => void;            // apos ver resumo do bloco, avanca
    finishSession: (userId: string) => Promise<TablesSessionResult>;
  };
}
```

### 5.2 Logica Interna

**`startSession(config)`**:
1. Gera todas as combinacoes via `generateCombinations(config.operation, config.range)`.
2. Gera primeiro bloco via `generateBlock(...)` com tier `"low"`.
3. Inicializa estado: `currentBlockIndex: 0`, `currentQuestionIndex: 0`, `phase: "answering"`.

**`submitAnswer(answer)`**:
1. Compara `answer` com `currentQuestion.correctAnswer`.
2. Se correto: registra `TablesAnswer` com `isCorrect: true`.
3. Se errado:
   - Registra `TablesAnswer` com `isCorrect: false`.
   - Muda `phase` para `"feedback"` (exibir explicacao).
   - Adiciona questao a `retryQueue` se `retryCount < 2`.
   - Se `retryCount >= 2`, marca como "dificuldade persistente".
4. Se correto E `config.mode === "free"`, avanca automaticamente (`nextQuestion`).
5. Se correto E `config.mode === "guided"`, muda `phase` para `"feedback"` (mesmo correto, mostra explicacao brevemente).

**`nextQuestion()`**:
1. Incrementa `currentQuestionIndex`.
2. Se `currentQuestionIndex >= 6` (fim do bloco):
   - Calcula accuracy do bloco.
   - Muda `phase` para `"block-summary"`.
3. Senao, muda `phase` para `"answering"`.

**`nextBlock()`**:
1. Verifica accuracy do bloco atual:
   - Se `accuracy < 60%`: **repete o bloco** (gera novo bloco com mesmas questoes + retry).
   - Se `accuracy >= 60%`: avanca para proximo tier.
2. Se nao ha mais combinacoes novas OU ja completou 3+ tiers: muda `phase` para `"finished"`.
3. Senao: gera proximo bloco e reseta `currentQuestionIndex: 0`, `phase: "answering"`.

**`finishSession(userId)`**:
1. Calcula metricas finais (total, acertos, accuracy, combinacoes dificeis).
2. Faz POST para `/api/tables/sessions`.
3. Retorna `TablesSessionResult`.

---

## 6. API Routes

### 6.1 `POST /api/tables/sessions` — `app/api/tables/sessions/route.ts`

Novo arquivo. Segue o padrao de `app/api/sessions/route.ts`.

**Request Body:**

```typescript
{
  userId: string;
  config: TablesConfig;
  blocks: TablesBlock[];
  difficultCombinations: TablesQuestion[];
}
```

**Logica:**

1. Validar campos obrigatorios.
2. Calcular `totalQuestions` e `correctAnswers` a partir dos `blocks`.
3. Calcular `accuracy = (correctAnswers / totalQuestions) * 100`.
4. Inserir em `tables_sessions`:
   ```sql
   INSERT INTO tables_sessions (user_id, operation, range_min, range_max, mode, total_questions, correct_answers, accuracy)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   RETURNING id
   ```
5. Inserir cada resposta em `tables_question_logs`:
   ```sql
   INSERT INTO tables_question_logs (session_id, user_id, operand1, operand2, operator, correct_answer, user_answer, is_correct, attempts)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
   ```
6. Upsert em `tables_progress`:
   ```sql
   INSERT INTO tables_progress (user_id, operation, range_min, range_max, mastered_percentage, last_practiced_at, updated_at)
   VALUES ($1, $2, $3, $4, $5, now(), now())
   ON CONFLICT (user_id, operation, range_min, range_max)
   DO UPDATE SET mastered_percentage = $5, last_practiced_at = now(), updated_at = now()
   ```
   O `mastered_percentage` e recalculado via `calculateMasteredPercentage` usando todos os logs do usuario para aquela operacao/range.
7. Retornar `{ sessionId }`.

**Response:**

```typescript
// Sucesso (200)
{ sessionId: string }

// Erro (400)
{ error: string }
```

### 6.2 `GET /api/tables/progress` — `app/api/tables/progress/route.ts`

**Logica:**

1. Obter usuario autenticado via `supabase.auth.getUser()`.
2. Buscar todos os registros de `tables_progress` do usuario.
3. Retornar array de `TablesProgress`.

**Response:**

```typescript
// Sucesso (200)
{ progress: TablesProgress[] }
```

---

## 7. Paginas (App Router)

### 7.1 `/tabuada` — `app/(app)/tabuada/page.tsx`

**Tipo:** Client Component (`"use client"`)

**Responsabilidade:** Tela de configuracao da sessao.

**Estrutura:**

```
<div className="container max-w-lg mx-auto p-6">
  <h1>Tabuada</h1>
  <p>Pratique as operacoes basicas no seu ritmo.</p>

  <TablesConfigForm onStart={handleStart} />
</div>
```

**Comportamento:**
- `handleStart(config: TablesConfig)`: redireciona para `/tabuada/session` passando config via query params:
  - `/tabuada/session?op={+|-|*|/}&min={1}&max={10}&mode={guided|free}`

### 7.2 `/tabuada/session` — `app/(app)/tabuada/session/page.tsx`

**Tipo:** Client Component (`"use client"`)

**Responsabilidade:** Execucao da sessao de treino em blocos.

**Estrutura:**

```
<div className="container max-w-lg mx-auto p-6">
  {phase === "answering" && (
    <>
      <TablesProgressBar current={blockProgress.current} total={blockProgress.total} />
      <TablesQuestionCard
        question={currentQuestion}
        onSubmit={submitAnswer}
        mode={config.mode}
      />
    </>
  )}

  {phase === "feedback" && (
    <TablesFeedback
      question={currentQuestion}
      answer={lastAnswer}
      onContinue={nextQuestion}
    />
  )}

  {phase === "block-summary" && (
    <TablesBlockSummary
      block={currentBlock}
      onContinue={nextBlock}
      canAdvance={currentBlock.accuracy >= 60}
    />
  )}

  {phase === "finished" && (
    // Redirecionar para /tabuada/result
  )}
</div>
```

**Comportamento:**
- Le config dos query params via `useSearchParams()`.
- Inicializa sessao via `useTablesSession().startSession(config)`.
- Quando `phase === "finished"`, chama `finishSession(userId)` e redireciona para `/tabuada/result/[sessionId]`.

### 7.3 `/tabuada/result/[sessionId]` — `app/(app)/tabuada/result/[sessionId]/page.tsx`

**Tipo:** Server Component (async)

**Responsabilidade:** Resumo da sessao concluida.

**Data Fetching:**

```typescript
const supabase = await createClient();
const { data: session } = await supabase
  .from("tables_sessions")
  .select("*")
  .eq("id", sessionId)
  .single();

const { data: logs } = await supabase
  .from("tables_question_logs")
  .select("*")
  .eq("session_id", sessionId)
  .order("created_at");
```

**Estrutura:**

```
<div className="container max-w-lg mx-auto p-6">
  <TablesSessionSummary
    session={session}
    logs={logs}
    difficultCombinations={filteredDifficult}
  />

  <div className="flex flex-col gap-3 mt-6">
    <Link href={`/tabuada/session?op=${session.operation}&min=${session.range_min}&max=${session.range_max}&mode=${session.mode}`}>
      <Button>Repetir Tabuada</Button>
    </Link>
    <Link href="/tabuada">
      <Button variant="outline">Escolher outra operacao</Button>
    </Link>
    {suggestedLesson && (
      <Link href={`/lessons/${suggestedLesson.slug}`}>
        <Button variant="secondary">Aula sugerida: {suggestedLesson.title}</Button>
      </Link>
    )}
    <Link href="/dashboard">
      <Button variant="ghost">Voltar ao Dashboard</Button>
    </Link>
  </div>
</div>
```

**Sugestao de Aula:**
- Buscar em `tables_question_logs` combinacoes com `is_correct = false` e `attempts >= 2`.
- Se a operacao e `*`, sugerir aula com `operator = '*'` (ex: `multiplicar-por-5`, `multiplicar-por-9`).
- Se a operacao e `/`, sugerir aula com `operator = '/'`.
- Buscar em `lessons` por `operator` correspondente, ordenar por `sort_order`, retornar primeira nao completada pelo usuario.

---

## 8. Componentes

Todos em `components/tables/`.

### 8.1 `TablesConfigForm.tsx`

**Props:**

```typescript
interface TablesConfigFormProps {
  onStart: (config: TablesConfig) => void;
}
```

**Elementos:**
- **Operacao**: 4 botoes tipo toggle (shadcn `Tabs` ou botoes com estado ativo):
  - `+` Adicao | `-` Subtracao | `x` Multiplicacao | `÷` Divisao
- **Intervalo**: `Select` dropdown com opcoes:
  - `1 a 5` | `1 a 10` | `1 a 12`
- **Modo**: 2 cards clicaveis:
  - **Guiado**: icone BookOpen + "Sem tempo, com explicacoes" (descricao)
  - **Treino livre**: icone Zap + "Sequencial, com feedback"
- **Botao**: `"Iniciar sessao"` (disabled enquanto nao selecionar tudo)

**Estado local:** `operation`, `range`, `mode` — todos comecam `null`, botao so habilita quando os 3 estao preenchidos.

### 8.2 `TablesQuestionCard.tsx`

**Props:**

```typescript
interface TablesQuestionCardProps {
  question: TablesQuestion;
  onSubmit: (answer: number) => void;
  mode: TablesMode;
  isRetry?: boolean;             // indica que e uma repeticao
}
```

**Elementos:**
- Badge "Revisao" se `isRetry === true`.
- Display: `{operand1} {operator} {operand2} = ?` (fonte grande, centralizado).
- `Input` numerico (type="number", autoFocus, inputMode="numeric").
- Botao "Responder" ou submit via Enter.
- Sem timer visivel (ambiente calmo).

**Comportamento:**
- Limpa input apos submit.
- Previne submit vazio.

### 8.3 `TablesFeedback.tsx`

**Props:**

```typescript
interface TablesFeedbackProps {
  question: TablesQuestion;
  answer: TablesAnswer;
  onContinue: () => void;
}
```

**Elementos:**
- Se correto:
  - Icone CheckCircle (verde)
  - Mensagem: "Correto!" (ou variacao aleatoria: "Isso ai!", "Muito bem!", "Acertou!")
  - Se modo guiado: mostra explicacao mesmo assim (reforco positivo)
  - Botao "Continuar" (ou auto-avanco em 1.5s no modo free)
- Se errado:
  - Icone XCircle (laranja, nao vermelho — tom acolhedor)
  - Mensagem: "Nao foi dessa vez. Vamos ver juntos:" (tom neutro)
  - Exibe `question.explanation` em card destacado
  - Resposta correta em destaque: `"A resposta e {correctAnswer}"`
  - Botao "Entendi, continuar"

### 8.4 `TablesProgressBar.tsx`

**Props:**

```typescript
interface TablesProgressBarProps {
  current: number;    // questao atual no bloco (0-5)
  total: number;      // total no bloco (6)
  blockIndex: number; // bloco atual
}
```

**Elementos:**
- Barra de progresso do bloco (shadcn `Progress`).
- Label: `"Bloco {blockIndex + 1} — {current + 1} de {total}"`.

### 8.5 `TablesBlockSummary.tsx`

**Props:**

```typescript
interface TablesBlockSummaryProps {
  block: TablesBlock;
  blockIndex: number;
  canAdvance: boolean;     // accuracy >= 60%
  onContinue: () => void;
}
```

**Elementos:**
- Card com:
  - Titulo: `"Bloco {blockIndex + 1} concluido"`
  - Acertos: `"Voce acertou {correct} de {total}"`
  - Barra visual de acerto (verde/laranja baseado em %)
- Se `!canAdvance`:
  - Mensagem: "Vamos praticar mais este bloco para reforcar."
  - Botao: "Repetir bloco"
- Se `canAdvance`:
  - Botao: "Proximo bloco"

### 8.6 `TablesSessionSummary.tsx`

**Props:**

```typescript
interface TablesSessionSummaryProps {
  session: TablesSession;
  logs: TablesQuestionLog[];
  difficultCombinations: TablesQuestion[];
}
```

**Elementos:**
- Card principal:
  - Titulo: "Sessao concluida"
  - Grid de stats: Questoes | Acertos | Precisao
  - Operacao praticada + intervalo
- Se `difficultCombinations.length > 0`:
  - Secao "Combinacoes para revisar":
  - Lista das combinacoes com dificuldade persistente (ex: `6 x 8`, `7 x 9`)

### 8.7 `TablesCard.tsx` (Dashboard)

**Props:**

```typescript
interface TablesCardProps {
  progress: TablesProgress[];
}
```

**Elementos:**
- Card no Dashboard com:
  - Titulo: "Tabuada"
  - Se `progress.length === 0`: "Comece a praticar!"
  - Se tem progresso: mostra operacao com maior progresso (ex: "Multiplicacao 60%")
  - Mini barras de progresso por operacao praticada
  - Botao: "Treinar Tabuada" → link para `/tabuada`

---

## 9. Integracao com Dashboard

### 9.1 Alteracao em `app/(app)/dashboard/page.tsx`

Adicionar fetch de `tables_progress` do usuario:

```typescript
const { data: tablesProgress } = await supabase
  .from("tables_progress")
  .select("*")
  .eq("user_id", user.id)
  .order("updated_at", { ascending: false });
```

Renderizar `<TablesCard progress={tablesProgress ?? []} />` no grid do dashboard, apos `LessonsOverviewCard`.

### 9.2 Alteracao em `components/dashboard/WeakPointsList.tsx`

Incluir dados da Tabuada no calculo de pontos fracos, com peso 0.7:

```typescript
// Buscar logs da tabuada com erros
const { data: tablesLogs } = await supabase
  .from("tables_question_logs")
  .select("operator, is_correct")
  .eq("user_id", user.id);

// Ao calcular error rate por operador:
// - Erros do treino normal: peso 1.0
// - Erros da tabuada: peso 0.7
```

### 9.3 Alteracao em `components/shared/Navbar.tsx`

Adicionar link "Tabuada" na navegacao:

```typescript
{ href: "/tabuada", label: "Tabuada", icon: Grid3X3 }
```

Posicionar entre "Aulas" e "Treinar" na ordem do menu.

---

## 10. Integracao com Aulas

### 10.1 Sugestao de Aula na Tela de Resultado

Na pagina `/tabuada/result/[sessionId]`, buscar aula sugerida:

```typescript
// 1. Identificar operacao com dificuldade persistente
const difficultOp = session.operation;

// 2. Verificar se ha erro persistente (>= 3 sessoes com essa operacao)
const { count } = await supabase
  .from("tables_sessions")
  .select("id", { count: "exact" })
  .eq("user_id", user.id)
  .eq("operation", difficultOp)
  .lt("accuracy", 70);

// 3. Se count >= 3, buscar aula relacionada nao completada
if (count >= 3) {
  const { data: lesson } = await supabase
    .from("lessons")
    .select("slug, title")
    .eq("operator", difficultOp)
    .order("sort_order")
    .limit(1)
    .single();
  // Verificar se ja foi completada via lesson_progress
}
```

Mapeamento operacao → aulas:
- `*` → `multiplicar-por-5`, `multiplicar-por-9`
- `/` → `dividir-por-2-e-4`, `dividir-pensando-na-multiplicacao`
- `+` → `somar-dezenas`, `somar-arredondando`
- `-` → `subtrair-completando`, `subtrair-por-partes`

---

## 11. Roteamento e Middleware

### 11.1 Adicionar rotas protegidas

Em `middleware.ts`, as rotas `/tabuada/*` ja estao cobertas pelo grupo `(app)` que exige autenticacao. Verificar que o matcher inclui `/tabuada`:

```typescript
export const config = {
  matcher: ["/dashboard/:path*", "/train/:path*", "/lessons/:path*",
            "/tabuada/:path*", "/results/:path*", "/onboarding/:path*",
            "/billing/:path*"],
};
```

---

## 12. Arvore de Arquivos Novos

```
app/(app)/tabuada/
  page.tsx                          # Configuracao da sessao
  session/
    page.tsx                        # Execucao da sessao
  result/
    [sessionId]/
      page.tsx                      # Resumo da sessao

app/api/tables/
  sessions/
    route.ts                        # POST salvar sessao
  progress/
    route.ts                        # GET progresso do usuario

components/tables/
  TablesConfigForm.tsx              # Formulario de configuracao
  TablesQuestionCard.tsx            # Card de questao
  TablesFeedback.tsx                # Feedback pos-resposta
  TablesProgressBar.tsx             # Barra de progresso do bloco
  TablesBlockSummary.tsx            # Resumo do bloco
  TablesSessionSummary.tsx          # Resumo da sessao
  TablesCard.tsx                    # Card do Dashboard

hooks/
  useTablesSession.ts               # Hook de state management da sessao

lib/tables/
  engine.ts                         # Geracao de combinacoes e explicacoes
```

---

## 13. Regras de Negocio — Checklist de Implementacao

| # | Regra | Implementacao |
|---|-------|---------------|
| 1 | Blocos de 6 questoes | `generateBlock` retorna array de 6 |
| 2 | Questao errada entra na fila de repeticao | `submitAnswer` adiciona a `retryQueue` |
| 3 | Max 2 repeticoes por questao | `retryCount` map, checagem antes de adicionar |
| 4 | Erro persistente apos 2 repeticoes | Marcado em `difficultCombinations` |
| 5 | Nao avanca bloco se accuracy < 60% | `nextBlock` checa `currentBlock.accuracy` |
| 6 | Modo guiado: progressao mais lenta | Modo guiado mostra explicacao mesmo em acertos |
| 7 | Nivel e streak nao sao alterados | API nao toca em `profiles.level` nem `profiles.streak` |
| 8 | Feedback imediato + explicacao | `TablesFeedback` com `explanation` do engine |
| 9 | Tom neutro e acolhedor | Mensagens sem negatividade, cor laranja (nao vermelha) para erro |
| 10 | Progressao low → mid → high | `getDifficultyTier(blockIndex)` controla |
| 11 | Progresso salvo por operacao/range | `tables_progress` com upsert |
| 12 | Sugestao de aula em erro persistente | Query em `/tabuada/result` por `lessons` nao completadas |
| 13 | Pontos fracos com peso 0.7 | `WeakPointsList` aplica fator 0.7 para dados da tabuada |

---

## 14. Ordem de Implementacao

### Fase 1 — Fundacao
1. Executar SQL: criar tabelas `tables_sessions`, `tables_progress`, `tables_question_logs`.
2. Executar SQL: adicionar coluna `source` em `exercise_logs`.
3. Criar tipos em `types/index.ts`.
4. Criar `lib/tables/engine.ts` com `generateCombinations`, `generateBlock`, `generateExplanation`, `calculateMasteredPercentage`, `getDifficultyTier`.

### Fase 2 — Sessao de Treino
5. Criar `hooks/useTablesSession.ts`.
6. Criar componentes: `TablesConfigForm`, `TablesQuestionCard`, `TablesFeedback`, `TablesProgressBar`, `TablesBlockSummary`.
7. Criar pagina `/tabuada` (configuracao).
8. Criar pagina `/tabuada/session` (execucao).

### Fase 3 — Persistencia e Resultado
9. Criar API `POST /api/tables/sessions`.
10. Criar API `GET /api/tables/progress`.
11. Criar `TablesSessionSummary`.
12. Criar pagina `/tabuada/result/[sessionId]`.

### Fase 4 — Integracao
13. Criar `TablesCard` e integrar no Dashboard.
14. Atualizar `WeakPointsList` com peso 0.7 para dados da tabuada.
15. Adicionar link "Tabuada" na Navbar.
16. Implementar sugestao de aula na tela de resultado.
17. Atualizar `middleware.ts` se necessario.
