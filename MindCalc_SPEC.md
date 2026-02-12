# MindCalc — Especificação Técnica (SPEC)

> Derivado do [MindCalc PRD](./MindCalc_PRD.md). Este documento traduz cada requisito de produto em definições técnicas implementáveis.

---

## 1. Visão Geral da Arquitetura

### 1.1 Stack Tecnológico

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.1 |
| Estilização | Tailwind CSS v4 (inline `@theme` em `globals.css`) | 4.x |
| Backend / Auth / DB | Supabase (PostgreSQL + Auth + RLS) | — |
| Gráficos | Recharts | — |
| Linguagem | TypeScript | strict |
| Fontes | Fredoka (display), Inter (body) | — |

### 1.2 Estrutura de Diretórios

```
app/
  page.tsx                    — Landing page pública
  (auth)/login/               — Tela de login (Supabase Auth)
  (app)/                      — Páginas autenticadas
    onboarding/               — Diagnóstico inicial
    dashboard/                — Painel do usuário
    lessons/                  — Catálogo de aulas
    lessons/[slug]/           — Aula individual
    train/                    — Sessão de treino adaptativo
    tabuada/                  — Prática de tabuada
    tabuada/session/          — Sessão ativa de tabuada
    tabuada/result/[id]/      — Resultado da sessão
    billing/                  — Planos e assinatura
  api/
    sessions/                 — Criação de sessão de treino
    tables/sessions/          — Criação de sessão de tabuada

components/
  dashboard/                  — StatsSummary, EvolutionChart, WeakPointsList, LessonsOverviewCard, TablesCard
  lessons/                    — LessonShell, LessonCard, LessonIntro, LessonExercise, LessonPractice, etc.
  lessons/interactive/        — InteractiveLessonIntro, InteractiveExercise, GenericInteractive*, PizzaFraction, NumberBar
  tables/                     — TablesConfigForm, TablesQuestionCard, TablesBlockSummary, TablesSessionSummary, etc.
  training/                   — ExerciseCard, Keypad, Timer, ProgressBar
  shared/                     — Navbar, MobileNav, UserMenu, Footer
  ui/                         — Primitivos (button, card, input, dialog, sheet, badge, etc.)
  providers/                  — AuthProvider, ThemeProvider

lib/
  engine.ts                   — Geração de exercícios + cálculo de nível
  lessons/
    types.ts                  — Interfaces de aula
    categories.ts             — Definição das 3 categorias
    data/                     — 22 arquivos de conteúdo de aula
    engine.ts                 — Motor de fases da aula
  tables/
    engine.ts                 — Motor de tabuada (blocos, combinações, explicações)
  supabase/
    client.ts                 — Cliente Supabase (browser)
    server.ts                 — Cliente Supabase (server component)
    middleware.ts             — Refresh de sessão auth

hooks/
  useAuth.ts                  — Estado de autenticação
  useTrainingSession.ts       — Estado da sessão de treino
  useTablesSession.ts         — Estado da sessão de tabuada

types/
  index.ts                    — Interfaces TypeScript globais
```

---

## 2. Modelo de Dados (Supabase / PostgreSQL)

### 2.1 Diagrama de Entidades

```
auth.users (Supabase Auth)
  └──< profiles (1:1, trigger on insert)
          ├──< sessions (1:N)
          │      └──< exercise_logs (1:N)
          ├──< lesson_progress (1:N)
          ├──< learned_techniques (1:N)
          ├──< tables_sessions (1:N)
          │      └──< tables_question_logs (1:N)
          └──< tables_progress (1:N)

lessons (catálogo estático, seed)
  ├──< lesson_progress (1:N)
  └──< learned_techniques (1:N)
```

### 2.2 Tabelas

#### `profiles`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK, FK → auth.users) | — | ID do usuário |
| `level` | integer (1-10) | 1 | Nível atual |
| `streak` | integer | 0 | Dias consecutivos praticando |
| `created_at` | timestamptz | now() | — |
| `updated_at` | timestamptz | now() | — |

- **Trigger**: Criado automaticamente ao inserir em `auth.users`.

#### `sessions`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `user_id` | uuid (FK → profiles) | — | — |
| `accuracy` | numeric(5,2) | — | % de acerto da sessão |
| `avg_time` | numeric(6,2) | — | Tempo médio por exercício (s) |
| `level_at_time` | integer | — | Nível no momento da sessão |
| `exercises_count` | integer | 10 | Quantidade de exercícios |
| `created_at` | timestamptz | now() | — |

#### `exercise_logs`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `session_id` | uuid (FK → sessions) | — | — |
| `user_id` | uuid (FK → profiles) | — | — |
| `operand1` | numeric | — | Primeiro operando |
| `operand2` | numeric | — | Segundo operando |
| `operator` | text (check: +, -, *, /) | — | Operação |
| `correct_answer` | numeric | — | Resposta correta |
| `user_answer` | numeric (nullable) | — | Resposta do usuário |
| `time_spent` | numeric(6,2) | — | Tempo gasto (s) |
| `is_correct` | boolean | — | Acertou? |
| `source` | text (check: training, tables) | 'training' | Origem do exercício |
| `created_at` | timestamptz | now() | — |

#### `lessons`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `slug` | text (unique) | — | Identificador URL |
| `title` | text | — | Título da aula |
| `description` | text | — | Descrição breve |
| `technique` | text | — | Técnica ensinada |
| `operator` | text (check: +, -, *, /) | — | Operação principal |
| `sort_order` | integer | 0 | Ordem de exibição |
| `difficulty` | text (check: beginner, intermediate, advanced) | — | Nível da aula |
| `created_at` | timestamptz | now() | — |

#### `lesson_progress`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `user_id` | uuid (FK → profiles) | — | — |
| `lesson_id` | uuid (FK → lessons) | — | — |
| `completed_at` | timestamptz | — | Quando completou |
| `times_completed` | integer | 1 | Quantas vezes completou |

- **Unique constraint**: (`user_id`, `lesson_id`)

#### `learned_techniques`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `user_id` | uuid (FK → profiles) | — | — |
| `lesson_id` | uuid (FK → lessons) | — | — |
| `operator` | text (check: +, -, *, /) | — | — |
| `learned_at` | timestamptz | — | — |

- **Unique constraint**: (`user_id`, `lesson_id`)

#### `tables_sessions`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `user_id` | uuid (FK → profiles) | — | — |
| `operation` | text (check: +, -, *, /) | — | Operação praticada |
| `range_min` | integer | — | Limite inferior |
| `range_max` | integer | — | Limite superior |
| `mode` | text (check: guided, free) | — | Modo de prática |
| `total_questions` | integer | — | Total de perguntas |
| `correct_answers` | integer | — | Respostas corretas |
| `accuracy` | numeric(5,2) | — | % de acerto |
| `created_at` | timestamptz | now() | — |

#### `tables_progress`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `user_id` | uuid (FK → profiles) | — | — |
| `operation` | text (check: +, -, *, /) | — | — |
| `range_min` | integer | — | — |
| `range_max` | integer | — | — |
| `mastered_percentage` | numeric(5,2) | 0 | % de combinações dominadas |
| `last_practiced_at` | timestamptz (nullable) | — | — |
| `updated_at` | timestamptz | now() | — |

- **Unique constraint**: (`user_id`, `operation`, `range_min`, `range_max`)

#### `tables_question_logs`

| Coluna | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | uuid (PK) | gen_random_uuid() | — |
| `session_id` | uuid (FK → tables_sessions) | — | — |
| `user_id` | uuid (FK → profiles) | — | — |
| `operand1` | integer | — | — |
| `operand2` | integer | — | — |
| `operator` | text (check: +, -, *, /) | — | — |
| `correct_answer` | integer | — | — |
| `user_answer` | integer (nullable) | — | — |
| `is_correct` | boolean | false | — |
| `attempts` | integer | 1 | Tentativas na mesma pergunta |
| `created_at` | timestamptz | now() | — |

### 2.3 Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado:

| Tabela | SELECT | INSERT | UPDATE |
|---|---|---|---|
| `profiles` | own | — | own |
| `sessions` | own | own | — |
| `exercise_logs` | own | own | — |
| `lessons` | authenticated | — | — |
| `lesson_progress` | own | own | own |
| `learned_techniques` | own | own | — |
| `tables_sessions` | own | own | — |
| `tables_progress` | own | own | own |
| `tables_question_logs` | own | own | — |

> `own` = `auth.uid() = user_id`

---

## 3. Autenticação e Onboarding

### 3.1 Fluxo de Autenticação

1. Usuário acessa landing page (`/`)
2. Clica "Começar" → navega para `/login`
3. Supabase Auth (email/password ou OAuth)
4. Middleware (`lib/supabase/middleware.ts`) mantém sessão via cookie refresh
5. `AuthProvider` (client) expõe contexto de autenticação
6. Perfil criado automaticamente via trigger no banco

### 3.2 Diagnóstico Inicial (Onboarding)

**Rota**: `/onboarding`

**Objetivo**: Determinar nível inicial do usuário (PRD §5 — Senso Numérico).

**Estrutura do teste**: 8 exercícios fixos em pares progressivos:

| Par | Operação | Exercício 1 (fácil) | Exercício 2 (difícil) |
|---|---|---|---|
| 1 | Adição | 1 dígito + adolescente | 2 dígitos + 2 dígitos |
| 2 | Subtração | 2 dígitos - 1 dígito | 2 dígitos - 2 dígitos (maior) |
| 3 | Multiplicação | Tabuada simples | 2 dígitos × 1 dígito |
| 4 | Divisão | Divisão básica | Divisão maior (resultado inteiro) |

**Algoritmo de cálculo de nível**:
```
baseLevel = 1
Para cada par (adição, subtração, multiplicação, divisão):
  Se pelo menos 1 resposta correta → baseLevel++
Nível final = baseLevel (range 1-5)
```

**Fluxo de telas**:
1. **Intro**: Explica o teste de 8 questões
2. **Teste**: Loop de exercícios com captura de resposta + tempo
3. **Salvando**: POST para `/api/sessions`
4. **Redirect**: Navega para `/dashboard`

---

## 4. Sistema de Aulas (Lessons)

### 4.1 Categorias

| Categoria | Ícone | sort_order | Descrição PRD |
|---|---|---|---|
| **Básicas** | 🧮 | 1-99 | Fase 1-2: Senso numérico + Estratégias |
| **Dia a Dia** | 🛒 | 100-199 | Fase 3: Aplicação no mundo real |
| **Vestibulares** | 🎯 | 200-299 | Fase 4: Alta performance |

### 4.2 Catálogo de Aulas (22 aulas)

#### Básicas (8 aulas)
| Slug | Operação | Dificuldade | Técnica |
|---|---|---|---|
| `somar-dezenas-primeiro` | + | beginner | Somar dezenas primeiro |
| `somar-arredondando` | + | beginner | Arredondamento (PRD §6 Fase 2) |
| `subtrair-completando` | - | beginner | Completar (PRD §6 Fase 1) |
| `subtrair-por-partes` | - | beginner | Decomposição (PRD §6 Fase 2) |
| `multiplicar-por-5` | * | beginner | Padrão multiplicativo |
| `multiplicar-por-9` | * | beginner | Padrão multiplicativo |
| `dividir-por-2-e-4` | / | beginner | Dobros e metades (PRD §6 Fase 2) |
| `dividir-pensando-na-multiplicacao` | / | beginner | Inversão mental |

#### Dia a Dia (6 aulas)
| Slug | Operação | Dificuldade | Técnica |
|---|---|---|---|
| `porcentagem-10` | * | intermediate | Porcentagem 10% (PRD §6 Fase 3 — Descontos) |
| `porcentagem-quanto-e` | * | intermediate | Porcentagem genérica |
| `fracao-metade-terco-quarto` | / | intermediate | Frações básicas |
| `fracao-somar-subtrair` | + | intermediate | Soma/subtração de frações |
| `regra-de-3-proporcao` | * | intermediate | Regra de 3 direta |
| `regra-de-3-inversa` | / | intermediate | Regra de 3 inversa |

#### Vestibulares (6 aulas)
| Slug | Operação | Dificuldade | Técnica |
|---|---|---|---|
| `multiplicar-por-11` | * | advanced | Padrão multiplicativo (PRD §6 Fase 4) |
| `quadrado-terminados-em-5` | * | advanced | Quadrados perfeitos |
| `multiplicar-proximos-100` | * | advanced | Compensação (PRD §6 Fase 2) |
| `divisibilidade-rapida` | / | advanced | Critérios de divisibilidade |
| `estimativa-raiz-quadrada` | * | advanced | Estimativas (PRD §6 Fase 1) |
| `potencias-de-2-e-3` | * | advanced | Memorização estratégica |

### 4.3 Interface `LessonContent`

```typescript
interface LessonContent {
  slug: string;
  title: string;
  technique: string;
  operator: '+' | '-' | '*' | '/';
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  intro: {
    explanation: string;
    example: {
      expression: string;
      steps: string[];
      answer: number;
    };
  };

  exercises: {
    guided: LessonExerciseData;      // Dicas completas + passo a passo
    semiGuided: LessonExerciseData;  // Dicas parciais
    free: LessonExerciseData;        // Sem dicas
  };

  practiceGenerator: (count: number) => LessonExerciseData[];
  interactive?: InteractiveLessonConfig;  // Fluxo interativo opcional
}
```

### 4.4 Fases de uma Aula

Cada aula progride por 5 fases sequenciais (PRD §5 — pilares cognitivos):

| Fase | Nome | Componente | PRD §5 Pilar |
|---|---|---|---|
| 1 | Introdução | `LessonIntro` / `InteractiveLessonIntro` | Senso Numérico |
| 2 | Exercício guiado | `LessonExercise` (guided) | Estratégia Mental |
| 3 | Exercício semi-guiado | `LessonExercise` (semiGuided) | Chunking |
| 4 | Exercício livre | `LessonExercise` (free) | Fluidez |
| 5 | Prática (5 exercícios) | `LessonPractice` | Autoconfiança |

### 4.5 Tipos de Tela Interativa

Aulas com `interactive` definido usam um fluxo de descoberta com os seguintes tipos de tela:

| Tipo | Descrição |
|---|---|
| `observe` | Mostra expressão + mensagem explicativa |
| `choice` | Pergunta de múltipla escolha |
| `fill` | Preencher lacuna numérica |
| `action` | Botão que revela informação |
| `solve` | Resolver equação completa |
| `summary` | Resumo com destaques coloridos |

### 4.6 Progressão e Desbloqueio

- **Primeira aula** de cada categoria: sempre disponível
- **Aulas subsequentes**: desbloqueiam ao completar a anterior (por `sort_order`)
- Completar uma aula registra em `lesson_progress` e `learned_techniques`
- Técnicas aprendidas são reforçadas no treino adaptativo (ver §5)

---

## 5. Motor de Treino Adaptativo

### 5.1 Visão Geral

**Rota**: `/train`

O treino é o mecanismo central de desenvolvimento de fluidez (PRD §5 — pilar Fluidez). Cada sessão gera 10 exercícios adaptativos baseados no nível do usuário e seus pontos fracos.

### 5.2 Geração de Exercícios

**Função**: `generateExercise(level, weakOperations?, learnedTechniques?)`

#### Faixas de dificuldade por nível

| Nível | Operações | Faixa numérica |
|---|---|---|
| 1-3 | Adição, Subtração | Números < 50 |
| 4-7 | Todas (4 operações) | Números maiores; mult/div com resultado > 100 |
| 8-10 | Todas + decimais | Decimais e porcentagens |

#### Lógica adaptativa

```
Se weakOperations não vazio:
  70% chance → exercício com operação fraca
  30% chance → reforço de técnica aprendida (se houver)
Senão:
  exercício aleatório para o nível
```

### 5.3 Detecção de Operações Fracas

**Função**: `identifyWeakOperations(errorLogs)`

1. Busca últimos 50 `exercise_logs` incorretos
2. Conta erros por operador
3. Ordena por frequência (mais erros primeiro)
4. Retorna lista ordenada de operadores

### 5.4 Cálculo de Nível

**Função**: `calculateLevel(accuracy, avgTime, currentLevel)`

| Condição | Resultado |
|---|---|
| accuracy ≥ 80% **E** avgTime < tempo padrão | Sobe 1 nível |
| accuracy < 50% | Desce 1 nível |
| Caso contrário | Mantém nível |

**Tempo padrão por nível**: interpolação linear de 15s (nível 1) a 4s (nível 10).

### 5.5 Fluxo da Sessão de Treino

```
[Tela pré-início] → [Loop de 10 exercícios] → [Salvando...] → [Resultados]
     │                       │                        │              │
     │                       ├─ Exibir exercício      │              │
     │                       ├─ Capturar resposta     │              │
     │                       ├─ Medir tempo           │              │
     │                       ├─ Shake em erro         │              │
     │                       └─ Auto-avançar          │              │
     │                                                │              │
     │                              POST /api/sessions               │
     │                              ├─ Inserir session               │
     │                              ├─ Inserir 10 exercise_logs      │
     │                              ├─ Calcular novo nível           │
     │                              ├─ Atualizar profile             │
     │                              └─ Atualizar streak              │
     │                                                               │
     │                                            /results/{sessionId}
```

### 5.6 Hook `useTrainingSession`

| Método | Descrição |
|---|---|
| `startSession(level, weakOps)` | Gera 10 exercícios |
| `submitAnswer(value, timeSpent)` | Registra resposta + avança |
| `finishSession(userId, level)` | POST para API, retorna sessionId |

---

## 6. Sistema de Tabuada

### 6.1 Visão Geral

**Rota**: `/tabuada`

Sistema de prática focada em memorização de fatos numéricos (PRD §5 — pilar Memória de Trabalho), com progressão em blocos e retry automático.

### 6.2 Configuração

O usuário seleciona:

| Parâmetro | Opções |
|---|---|
| Operação | +, -, *, / |
| Faixa (range) | min-max (ex: 1-10) |
| Modo | **Guiado** (feedback após cada resposta) / **Livre** (auto-avança em acerto) |

### 6.3 Geração de Combinações

**Função**: `generateCombinations(operation, range)`

| Operação | Regra | Exemplo (range 1-10) |
|---|---|---|
| Adição | (a, b) onde a ≤ b | 55 combinações |
| Subtração | (a, b) onde a ≥ b, resultado ≥ 0 | 55 combinações |
| Multiplicação | (a, b) onde a ≤ b | 55 combinações |
| Divisão | (a, b) onde a = b × quociente (resultado inteiro) | Variável |

### 6.4 Estrutura de Blocos

Cada bloco contém **6 perguntas** com faixas de dificuldade progressivas:

| Blocos | Tier | Faixa numérica |
|---|---|---|
| 0-1 | Low | Terço inferior do range |
| 2-3 | Mid | Terço central do range |
| 4+ | High | Terço superior do range |

**Composição do bloco**: perguntas do tier atual + até 2 perguntas de retry.

### 6.5 Lógica de Retry

1. Resposta errada → pergunta adicionada à fila de retry
2. Máximo **2 retries** por pergunta
3. Após 2 falhas → marcada como "combinação difícil"

### 6.6 Progressão entre Blocos

```
Se accuracy do bloco < 60%  → Repetir bloco com novas perguntas
Se accuracy do bloco ≥ 60%  → Avançar para próximo tier
Sessão termina quando        → Tier high completado OU combinações esgotadas
```

### 6.7 Explicações Automáticas

**Função**: `generateExplanation(operand1, operand2, operator)`

| Operação | Estratégia gerada |
|---|---|
| + | "Complete até a dezena mais próxima" |
| - | "Desça até a dezena mais próxima" |
| × | Decompor operando menor (ex: 7×8 = 7×4 + 7×4 = 28+28) |
| ÷ | Inverter para multiplicação (ex: 48÷6 → 6×? = 48) |

### 6.8 Cálculo de Domínio (Mastery)

**Função**: `calculateMasteredPercentage(logs, operation, range)`

- Uma combinação é **dominada** se as últimas 2 tentativas foram ambas corretas
- `mastered_percentage = (combinações dominadas / total de combinações) × 100`
- Armazenado em `tables_progress` via upsert

### 6.9 Hook `useTablesSession`

| Método | Descrição |
|---|---|
| `startSession(config)` | Gera primeiro bloco |
| `submitAnswer(answer)` | Verifica, auto-avança (livre) ou mostra feedback (guiado) |
| `nextQuestion()` | Avança para próxima pergunta |
| `nextBlock()` | Calcula accuracy, gera próximo bloco ou finaliza |
| `finishSession(userId)` | POST para `/api/tables/sessions` |

---

## 7. Dashboard e Métricas

### 7.1 Visão Geral

**Rota**: `/dashboard`

O dashboard implementa as métricas de sucesso do PRD §9 e o perfil cognitivo do PRD §8.

### 7.2 Componentes e Dados

| Componente | Dados exibidos | Fonte |
|---|---|---|
| `StatsSummary` | Nível (1-10), Streak, Accuracy média, Total sessões | `profiles` + últimas 10 `sessions` |
| `EvolutionChart` | Gráfico de linha: accuracy % ao longo das últimas 10 sessões | `sessions` (Recharts) |
| `WeakPointsList` | Operações com mais erros (peso 1.0 treino, 0.7 tabuada) | `exercise_logs` + `tables_question_logs` |
| `LessonsOverviewCard` | Progresso: aulas completadas / total + barra | `lessons` + `lesson_progress` |
| `TablesCard` | Progresso recente por operação/faixa: mastery %, última prática | `tables_progress` |

### 7.3 Mapeamento para Métricas do PRD §9

| Métrica PRD | Implementação |
|---|---|
| Redução de tempo médio por questão | `avg_time` nas `sessions` (comparação ao longo do tempo) |
| Aumento da taxa de acerto estratégico | `accuracy` nas `sessions` + `EvolutionChart` |
| Engajamento semanal | `streak` em `profiles` |
| Conclusão das fases | `lesson_progress` (contagem) + `LessonsOverviewCard` |
| Autopercepção de confiança | **Não implementado** (survey interno pendente) |

---

## 8. Monetização

### 8.1 Modelo Freemium

**Rota**: `/billing`

| Feature | Free (R$ 0/mês) | Pro (R$ 19,90/mês) |
|---|---|---|
| Sessões de treino | 1 por dia | Ilimitadas |
| Nível máximo | 5 | 10 |
| Analytics detalhados | ✗ | ✓ |
| Exercícios personalizados | ✗ | ✓ |

### 8.2 Status de Implementação

- UI de planos: **implementada**
- Integração com gateway de pagamento (Stripe, etc.): **pendente**
- Enforcement de limites (sessões/dia, nível máximo): **pendente**

---

## 9. Landing Page

### 9.1 Estrutura

**Rota**: `/` (pública, sem autenticação)

| Seção | Conteúdo | PRD §7 Etapa |
|---|---|---|
| Hero | Headline + CTA "Começar do jeito fácil" → `/login` | Etapa 1: Insegurança |
| Benefícios | 3 cards: Adapta-se, Evolução visual, IA | Etapa 2: Microvitórias |
| Depoimentos | 4 testimonials fictícios | Etapa 1: Redução de ansiedade |
| Macetes | Exemplo: multiplicar por 5 | Etapa 3: Compreensão estratégica |
| Para quem é | 4 perfis de público-alvo (PRD §4) | — |
| CTA Final | "Grátis para sempre · Sem cartão de crédito" | — |

### 9.2 Design

- Background com formas animadas
- Gradiente: teal primário + purple (#7C3AED)
- Fredoka para display, Inter para body
- Mobile-first (PRD §1)

---

## 10. API Routes

### 10.1 `POST /api/sessions`

**Usado por**: Onboarding + Treino

**Request body**:
```typescript
{
  userId: string;
  level: number;
  exercises: {
    operand1: number;
    operand2: number;
    operator: string;
    correctAnswer: number;
    userAnswer: number | null;
    timeSpent: number;
    isCorrect: boolean;
  }[];
}
```

**Processamento**:
1. Calcula accuracy e avgTime
2. Insere registro em `sessions`
3. Insere N registros em `exercise_logs`
4. Calcula novo nível via `calculateLevel()`
5. Atualiza `profiles.level`
6. Atualiza `profiles.streak` (incrementa se praticou hoje)

**Response**: `{ sessionId: string; newLevel: number }`

### 10.2 `POST /api/tables/sessions`

**Usado por**: Tabuada

**Request body**:
```typescript
{
  userId: string;
  operation: string;
  rangeMin: number;
  rangeMax: number;
  mode: 'guided' | 'free';
  questions: {
    operand1: number;
    operand2: number;
    operator: string;
    correctAnswer: number;
    userAnswer: number | null;
    isCorrect: boolean;
    attempts: number;
  }[];
}
```

**Processamento**:
1. Calcula accuracy e totais
2. Insere registro em `tables_sessions`
3. Insere N registros em `tables_question_logs`
4. Calcula mastery % via `calculateMasteredPercentage()`
5. Upsert em `tables_progress`

**Response**: `{ sessionId: string }`

---

## 11. Mapeamento PRD → Implementação

### 11.1 Pilares Cognitivos (PRD §5)

| Pilar | Onde é exercitado |
|---|---|
| Senso Numérico | Onboarding, Aulas Básicas (fase intro), Tabuada |
| Chunking | Aulas (decomposição, arredondamento), Treino adaptativo |
| Memória de Trabalho | Tabuada (memorização de fatos), Treino cronometrado |
| Estratégia Mental | Aulas (escolha consciente de técnica), Exercícios interativos |
| Fluidez | Treino adaptativo (sessões de 10), Tabuada modo livre |
| Autoconfiança | Progressão de nível, Streak, Feedback positivo, Dashboard |

### 11.2 Fases de Desenvolvimento (PRD §6)

| Fase PRD | Implementação |
|---|---|
| Fase 1 — Senso Numérico | Onboarding + Aulas Básicas (completar, visualizar, comparar) |
| Fase 2 — Estratégias | Aulas Básicas (compensação, arredondamento, decomposição, dobros, padrões) |
| Fase 3 — Mundo Real | Aulas Dia a Dia (porcentagem, frações, regra de 3) |
| Fase 4 — Alta Performance | Aulas Vestibulares (multiplicar por 11, quadrados, divisibilidade) |

### 11.3 Jornada do Usuário (PRD §7)

| Etapa PRD | Mecanismo |
|---|---|
| Insegurança → Microvitórias | Onboarding fácil, exercícios guiados com dicas, feedback positivo |
| Microvitórias → Compreensão | Aulas com fases progressivas (guiado → semi → livre) |
| Compreensão → Aplicação | Aulas Dia a Dia (mercado, parcelamento, descontos) |
| Aplicação → Fluidez | Treino adaptativo + Tabuada modo livre + cronômetro |

### 11.4 Funcionalidades (PRD §8)

| Funcionalidade PRD | Componente/Sistema |
|---|---|
| Aulas interativas com apoio visual | `InteractiveLessonIntro`, `NumberBar`, `PizzaFraction` |
| Animações de transformação numérica | Telas interativas tipo `observe`, `action` |
| Escolha consciente de estratégia | Telas interativas tipo `choice` |
| Modo prática e modo fluidez | Treino (`/train`) + Tabuada modo guiado/livre |
| Feedback emocional positivo | `LessonCompletion`, shake em erro, auto-avançar em acerto |
| Perfil cognitivo | Dashboard: nível, streak, evolução, pontos fracos |
| Métricas: clareza, fluidez, estratégia | accuracy, avg_time, weak operations |

---

## 12. Itens Pendentes (Gap Analysis PRD vs. Implementação)

| # | Item do PRD | Status | Descrição |
|---|---|---|---|
| 1 | Survey de autopercepção de confiança (§9) | **Pendente** | Nenhum formulário de autoavaliação implementado |
| 2 | Integração de pagamento (§ Billing) | **Pendente** | UI pronta, sem gateway (Stripe) |
| 3 | Enforcement de limites do plano Free | **Pendente** | Sem verificação de 1 sessão/dia ou nível max 5 |
| 4 | Pressão de tempo na Fase 1 (§6) | **OK** | Fase 1 não tem cronômetro (conforme PRD) |
| 5 | Questões de vestibular/concurso cronometradas (§6 Fase 4) | **Parcial** | Aulas de vestibular existem, mas sem modo cronometrado dedicado |
| 6 | Mistura estratégica (§6 Fase 4) | **Parcial** | Treino adaptativo mistura operações, mas sem mistura explícita de técnicas |
| 7 | Sistema de comparação de preços (§6 Fase 3) | **Pendente** | Não há aula específica de comparação de preços |
| 8 | Juros simples (§6 Fase 3) | **Pendente** | Não há aula de juros simples |
| 9 | Parcelamento (§6 Fase 3) | **Pendente** | Não há aula de cálculo de parcelas |
| 10 | Estimativas simples (§6 Fase 1) | **Parcial** | `estimativa-raiz-quadrada` existe, mas classificada como avançada |

---

## 13. Roadmap de Implementação

As fases abaixo organizam o trabalho restante por prioridade e dependência lógica. Cada fase constrói sobre a anterior, priorizando primeiro a solidez do que já existe, depois monetização, conteúdo novo, e por fim qualidade.

### Fase 1 — Conexões & Correções (Foundation)

**Objetivo:** Garantir que todas as peças já implementadas funcionem juntas corretamente.

| # | Tarefa | Contexto |
|---|---|---|
| 1.1 | Conectar `learnedTechniques` ao fluxo de treino | `train/page.tsx` deve buscar aulas completadas do usuário via Supabase (`user_lesson_progress`) e passar a lista de técnicas aprendidas ao hook `useTrainingSession`. O motor de treino (Seção 5) já suporta `learnedTechniques`, mas a page não fornece os dados. |
| 1.2 | Verificar/corrigir slugs de aulas | O SPEC lista `somar-dezenas-primeiro` mas o código usa `somar-dezenas`. Auditar todos os slugs entre `lessonsList` (Seção 4.2) e os arquivos em `lib/lessons/content/` para garantir consistência. |
| 1.3 | Reclassificar estimativas | `estimativa-raiz-quadrada` está como avançada (Gap #10, Seção 12). Criar aula de estimativas simples para Fase 1 (beginner) ou reclassificar a existente conforme PRD §6. |

**Dependências:** Nenhuma — pode iniciar imediatamente.
**Valida:** Gaps #10 da Seção 12; fluxo aulas → treino da Seção 11.2.

---

### Fase 2 — Freemium & Monetização

**Objetivo:** Implementar o modelo de negócio descrito na Seção 8.

| # | Tarefa | Contexto |
|---|---|---|
| 2.1 | Enforcement de limite diário | Plano Free permite apenas 1 sessão de treino por dia (Seção 8). Adicionar verificação no início de `/train` consultando `training_sessions` do dia. |
| 2.2 | Enforcement de nível máximo | Plano Free limita progresso até nível 5 (Seção 8). Adicionar cap no cálculo de nível do dashboard e no desbloqueio de aulas. |
| 2.3 | Integração Stripe | Implementar checkout session, webhooks (`customer.subscription.created/updated/deleted`), e tabela `subscriptions` no Supabase. A UI de billing já existe (Seção 8). |
| 2.4 | Middleware de verificação de plano | Criar middleware ou helper que verifica status da assinatura antes de liberar funcionalidades Pro. Integrar com o middleware de auth existente (Seção 3). |

**Dependências:** Fase 1 (correções de base).
**Valida:** Gaps #2 e #3 da Seção 12.

---

### Fase 3 — Conteúdo Adicional (Mundo Real)

**Objetivo:** Completar as aulas de Dia a Dia previstas no PRD §6 Fase 3.

| # | Tarefa | Contexto |
|---|---|---|
| 3.1 | Aula: Comparação de preços | Ensinar preço por unidade/kg, comparação entre embalagens. Seguir estrutura de fases da Seção 4.3. Categoria: `dia-a-dia`. |
| 3.2 | Aula: Juros simples | Conceito de juros, cálculo J = C × i × t, aplicação em empréstimos. Categoria: `dia-a-dia`. |
| 3.3 | Aula: Parcelamento | Cálculo de parcelas, valor total parcelado vs. à vista. Categoria: `dia-a-dia`. |

**Dependências:** Nenhuma técnica (pode rodar em paralelo com Fase 2), mas idealmente após Fase 1 para slugs consistentes.
**Valida:** Gaps #7, #8, #9 da Seção 12. Total de aulas: 22 → 25.

---

### Fase 4 — Alta Performance & Polish

**Objetivo:** Funcionalidades avançadas para a Fase 4 do PRD (fluidez e vestibulares).

| # | Tarefa | Contexto |
|---|---|---|
| 4.1 | Modo cronometrado para vestibulares | Modo de treino dedicado com timer por questão e por sessão. Complementa as aulas de vestibular existentes (Seção 4.2, categoria `vestibulares`). |
| 4.2 | Mistura estratégica de técnicas | No treino adaptativo (Seção 5), permitir sessões que combinem explicitamente múltiplas técnicas aprendidas, forçando o aluno a escolher a estratégia correta. |
| 4.3 | Survey de autopercepção de confiança | Formulário periódico (PRD §9) onde o aluno avalia sua própria confiança com números. Armazenar no Supabase para tracking de evolução no dashboard (Seção 7). |

**Dependências:** Fase 1 (learnedTechniques conectadas) para 4.2; Fase 2 (monetização) se features forem Pro-only.
**Valida:** Gaps #1, #5, #6 da Seção 12.

---

### Fase 5 — Qualidade & Testes

**Objetivo:** Cobertura de testes e garantia de qualidade para produção.

| # | Tarefa | Contexto |
|---|---|---|
| 5.1 | Testes unitários: API routes | Testar todas as routes da Seção 10 (onboarding, training, tabuada, lessons, dashboard). |
| 5.2 | Testes unitários: engines | Expandir testes existentes do motor de treino e adicionar testes para o motor de tabuada (Seção 6.5) e lesson engine. |
| 5.3 | Testes E2E: fluxos críticos | Onboarding → primeira aula → treino → dashboard. Verificar que o fluxo completo funciona com dados reais. |
| 5.4 | Acessibilidade e performance | Audit com Lighthouse, verificar contraste, navegação por teclado, labels ARIA. Otimizar bundle size e Core Web Vitals. |

**Dependências:** Todas as fases anteriores (testar funcionalidades completas).
**Valida:** Cobertura geral; prepara para launch.

---

### Resumo do Roadmap

| Fase | Escopo | Gaps Resolvidos (Seção 12) |
|---|---|---|
| 1 — Conexões & Correções | learnedTechniques, slugs, estimativas | #10 |
| 2 — Freemium & Monetização | Limites Free, Stripe, middleware | #2, #3 |
| 3 — Conteúdo Adicional | 3 aulas Dia a Dia | #7, #8, #9 |
| 4 — Alta Performance | Cronômetro, mistura, survey | #1, #5, #6 |
| 5 — Qualidade & Testes | Unit, E2E, a11y, perf | — |

> **Nota:** O Gap #4 (pressão de tempo na Fase 1) está marcado como **OK** na Seção 12 — o PRD deliberadamente não inclui cronômetro na Fase 1, portanto não requer ação.
