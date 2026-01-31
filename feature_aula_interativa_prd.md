# PRD — Feature: Aula Interativa

**Produto:** MindCalc
**Versão:** 1.0
**Data:** 2026-01-30
**Stack:** Next.js 14 (App Router) · Supabase · Tailwind CSS

---

## 1. Visão Geral

A **Aula Interativa** é uma experiência de micro-aprendizado (2–5 min) que ensina **uma técnica de cálculo mental por aula**. O objetivo é reduzir ansiedade matemática, criar padrões mentais simples e preparar o usuário para o treino com mais confiança.

**Princípios invioláveis:**
- Sem cronômetro, sem pontuação competitiva, sem penalizações.
- Erros são oportunidades pedagógicas, nunca punições.
- Resultados da aula **não** afetam streak, nível nem estatísticas globais do Dashboard.
- Linguagem acolhedora, clara e sem termos técnicos.

---

## 2. User Flow Completo

### 2.1 Entrada (Dashboard → Lista de Aulas)

```
Dashboard
  └─ Card "Aulas Interativas" (novo componente no Dashboard)
       ├─ Texto: "Aprenda técnicas para calcular mais rápido"
       ├─ Progresso: "3 de 12 aulas concluídas"
       └─ Botão: "Ver Aulas" → /lessons
```

1. O usuário vê no Dashboard um **Card de Aulas Interativas** posicionado entre o `StatsSummary` e o card de `Evolução`.
2. Ao clicar em "Ver Aulas", é redirecionado para `/lessons`.

### 2.2 Lista de Aulas (`/lessons`)

```
/lessons
  ├─ Header: "Aulas Interativas"
  ├─ Subtítulo: "Cada aula ensina uma técnica prática de cálculo mental"
  └─ Grid de LessonCards:
       ├─ [✓] Aula 1 — Somar dezenas primeiro       (concluída)
       ├─ [▶] Aula 2 — Quebrar números grandes       (disponível)
       ├─ [🔒] Aula 3 — Multiplicar por 9 com 10x-1x (bloqueada)
       └─ ...
```

1. Cada card exibe: título, descrição curta, operação-alvo (ícone), e status (concluída / disponível / bloqueada).
2. **Progressão linear:** aulas são desbloqueadas sequencialmente. A próxima aula só é liberada quando a anterior é concluída.
3. Ao clicar em uma aula disponível, o usuário é levado para `/lessons/[slug]`.

### 2.3 Experiência da Aula (`/lessons/[slug]`)

A aula é uma **máquina de estados** com 5 fases sequenciais:

```
┌─────────────────────────────────────────────────────────┐
│                    FASE 1: INTRO                        │
│  Título: "Somar dezenas primeiro"                       │
│  Explicação visual (1-2 telas, max 60 palavras)         │
│  Exemplo numérico animado/destacado                     │
│  Botão: "Entendi, vamos praticar"                       │
└───────────────────────┬─────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│              FASE 2: EXERCÍCIO GUIADO                   │
│  Exercício com DICA VISÍVEL permanente                  │
│  Ex: "37 + 48 = ?"                                      │
│  Dica: "Pense: 37 + 50 = 87, depois 87 - 2 = 85"      │
│  Input numérico + botão "Responder"                     │
│                                                         │
│  ✅ Acerto → mensagem positiva → próxima fase           │
│  ❌ Erro  → explicação passo a passo → tentar de novo   │
└───────────────────────┬─────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│            FASE 3: EXERCÍCIO SEMI-GUIADO                │
│  Exercício com DICA PARCIAL (resumida)                  │
│  Ex: "56 + 29 = ?"                                      │
│  Dica: "Arredonde o 29 para 30..."                      │
│  Input numérico + botão "Responder"                     │
│                                                         │
│  ✅ Acerto → mensagem positiva → próxima fase           │
│  ❌ Erro  → explicação passo a passo → tentar de novo   │
└───────────────────────┬─────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│              FASE 4: EXERCÍCIO LIVRE                    │
│  Exercício SEM DICA                                     │
│  Ex: "43 + 38 = ?"                                      │
│  Input numérico + botão "Responder"                     │
│                                                         │
│  ✅ Acerto → mensagem positiva → fase final             │
│  ❌ Erro  → explicação passo a passo → tentar de novo   │
└───────────────────────┬─────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│             FASE 5: CONCLUSÃO                           │
│  Mensagem: "Parabéns! Você aprendeu a técnica           │
│  'Somar dezenas primeiro'!"                             │
│                                                         │
│  Opções:                                                │
│  [Praticar mais] → gera 5 exercícios extras (sem dica)  │
│  [Voltar ao Dashboard] → /dashboard                     │
└─────────────────────────────────────────────────────────┘
```

### 2.4 Detalhamento do Comportamento por Fase

#### Fase 1 — Intro
- Exibe título da técnica e explicação concreta com exemplo numérico.
- A explicação é armazenada como dados estáticos (JSON) dentro do código, não em banco.
- Botão "Entendi, vamos praticar" avança para a Fase 2.

#### Fases 2, 3 e 4 — Exercícios (Guiado → Semi-Guiado → Livre)
- Cada fase exibe **1 exercício** por vez.
- O exercício é gerado deterministicamente a partir do conteúdo da aula (não usa `generateExercise` do engine existente — usa um gerador específico por aula que produz exercícios coerentes com a técnica ensinada).
- **Em caso de acerto:** feedback positivo ("Isso mesmo!", "Muito bem!") com destaque verde → avança para a próxima fase após 1.5s.
- **Em caso de erro:**
  1. Feedback neutro ("Não foi dessa vez, vamos ver juntos").
  2. Exibição automática de uma **explicação passo a passo** específica para aquele exercício, mostrando como aplicar a técnica.
  3. Botão "Tentar novamente" → o mesmo exercício é reexibido com o input limpo.
  4. Não há limite de tentativas.
- A dica visível varia por fase:
  - **Fase 2 (Guiado):** dica completa visível o tempo todo.
  - **Fase 3 (Semi-Guiado):** dica parcial (primeira parte do raciocínio).
  - **Fase 4 (Livre):** sem dica visível.

#### Fase 5 — Conclusão
- Mensagem de reforço positivo.
- Dois botões de ação:
  - **"Praticar mais":** gera 5 exercícios extras sem dica, usando a mesma técnica da aula. Funciona como um mini-treino temático. Ao final, exibe resumo simples ("Você acertou X de 5") e retorna à tela de conclusão.
  - **"Voltar ao Dashboard":** redireciona para `/dashboard`.

### 2.5 Fluxo de Erro / Edge Cases

| Cenário | Comportamento |
|---|---|
| Usuário fecha a aba no meio da aula | O progresso da aula **não** é salvo parcialmente. Na próxima vez, a aula recomeça do início. |
| Usuário clica em "voltar" do browser | Redireciona para `/lessons` (lista de aulas). |
| Usuário tenta acessar aula bloqueada via URL | Redireciona para `/lessons` com a lista atualizada. |
| Usuário já completou a aula | Pode refazer a aula quantas vezes quiser. O status permanece "concluída". |

---

## 3. Mudanças no Banco de Dados (Supabase)

### 3.1 Nova Tabela: `lessons`

Armazena o catálogo de aulas disponíveis (seed data, gerenciada pela equipe).

```sql
CREATE TABLE public.lessons (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,                        -- ex: "somar-dezenas-primeiro"
  title       text NOT NULL,                               -- ex: "Somar dezenas primeiro"
  description text NOT NULL,                               -- descrição curta para o card
  technique   text NOT NULL,                               -- nome da técnica
  operator    text NOT NULL CHECK (operator IN ('+', '-', '*', '/')),
  sort_order  integer NOT NULL DEFAULT 0,                  -- ordem de exibição/desbloqueio
  difficulty  text NOT NULL DEFAULT 'beginner'
              CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Índice para ordenação
CREATE INDEX idx_lessons_sort_order ON public.lessons (sort_order);
```

**Campos explicados:**
- `slug`: identificador URL-friendly, usado na rota `/lessons/[slug]`.
- `operator`: operação matemática principal da aula (para vincular com o sistema de treino).
- `sort_order`: define a ordem sequencial de desbloqueio.
- `difficulty`: mapeia para os tiers do engine (`beginner` = níveis 1-3, `intermediate` = 4-7, `advanced` = 8-10).

**Nota:** O conteúdo pedagógico de cada aula (textos da intro, dicas, exercícios, explicações passo a passo) será armazenado como **dados estáticos no código** (`lib/lessons/`) e não no banco. Isso permite versionamento via Git, tipagem TypeScript, e elimina chamadas ao banco para buscar conteúdo durante a aula.

### 3.2 Nova Tabela: `lesson_progress`

Registra quais aulas cada usuário completou.

```sql
CREATE TABLE public.lesson_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id    uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  times_completed integer NOT NULL DEFAULT 1,              -- quantas vezes refez a aula

  CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

-- Índice para queries do usuário
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress (user_id);
```

**Campos explicados:**
- `completed_at`: data/hora da última conclusão.
- `times_completed`: incrementa cada vez que o usuário refaz a aula. Útil para analytics futuras.
- `UNIQUE (user_id, lesson_id)`: garante um registro por aula/usuário (upsert na conclusão).

### 3.3 Nova Tabela: `learned_techniques`

Registra as técnicas que o usuário já aprendeu, usada para integração com o sistema de treino.

```sql
CREATE TABLE public.learned_techniques (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id   uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  operator    text NOT NULL CHECK (operator IN ('+', '-', '*', '/')),
  learned_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_user_technique UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_learned_techniques_user ON public.learned_techniques (user_id);
```

**Propósito:** Quando o sistema de treino gera exercícios, ele pode consultar quais técnicas o usuário aprendeu e priorizar exercícios que reforcem essas técnicas (sem dicas), promovendo transferência gradual do aprendizado guiado para o treino livre.

### 3.4 Tabelas Existentes — Sem Alterações

| Tabela | Alteração | Justificativa |
|---|---|---|
| `profiles` | **Nenhuma** | A Aula Interativa não afeta `level`, `streak` nem `updated_at`. O progresso é controlado por `lesson_progress`. |
| `sessions` | **Nenhuma** | Aulas não geram sessões de treino. |
| `exercise_logs` | **Nenhuma** | Exercícios da aula são pedagógicos e não devem poluir as estatísticas de treino. |

### 3.5 Row-Level Security (RLS)

```sql
-- lessons: leitura pública (catálogo)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are viewable by authenticated users"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

-- lesson_progress: usuário vê/edita apenas seus dados
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own lesson progress"
  ON public.lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress"
  ON public.lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress"
  ON public.lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- learned_techniques: usuário vê/edita apenas seus dados
ALTER TABLE public.learned_techniques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own learned techniques"
  ON public.learned_techniques FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learned techniques"
  ON public.learned_techniques FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## 4. Interface e Componentes

### 4.1 Novas Páginas (App Router)

| Rota | Tipo | Descrição |
|---|---|---|
| `app/(app)/lessons/page.tsx` | Server Component | Lista de aulas com status de progresso |
| `app/(app)/lessons/[slug]/page.tsx` | Client Component | Experiência da aula (máquina de estados) |

**Middleware:** Adicionar `/lessons/:path*` ao matcher em `middleware.ts` para proteção de rota.

### 4.2 Novos Componentes

#### Componentes de Página (`components/lessons/`)

| Componente | Tipo | Props | Descrição |
|---|---|---|---|
| `LessonCard.tsx` | Client | `{ lesson, status, onClick }` | Card na lista de aulas. Exibe título, descrição, ícone de operação, badge de status (concluída/disponível/bloqueada). |
| `LessonShell.tsx` | Client | `{ lesson, onComplete }` | Container principal da aula. Gerencia a máquina de estados (intro → guiado → semi-guiado → livre → conclusão). |
| `LessonIntro.tsx` | Client | `{ title, explanation, example, onContinue }` | Fase 1. Renderiza a explicação da técnica com exemplo visual. |
| `LessonExercise.tsx` | Client | `{ exercise, hintLevel, onAnswer }` | Fases 2-4. Exibe exercício, input numérico, dica (se aplicável), feedback de acerto/erro. |
| `LessonHint.tsx` | Client | `{ hint, level }` | Renderiza a dica de acordo com o nível (completa, parcial, ou oculta). |
| `LessonStepByStep.tsx` | Client | `{ steps, onRetry }` | Exibe explicação passo a passo após erro. |
| `LessonCompletion.tsx` | Client | `{ technique, onPracticeMore, onDashboard }` | Fase 5. Mensagem de conclusão + botões de ação. |
| `LessonPractice.tsx` | Client | `{ exercises, technique }` | Mini-treino pós-aula (5 exercícios sem dica). |
| `LessonProgressIndicator.tsx` | Client | `{ currentPhase, totalPhases }` | Indicador visual de progresso dentro da aula (5 dots/steps). |

#### Componente no Dashboard (`components/dashboard/`)

| Componente | Tipo | Props | Descrição |
|---|---|---|---|
| `LessonsOverviewCard.tsx` | Server | `{ completedCount, totalCount }` | Card no Dashboard com progresso geral das aulas e link para `/lessons`. |

### 4.3 Componentes Reutilizados do Sistema Atual

| Componente | Origem | Uso na Aula Interativa |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Botões "Entendi", "Responder", "Tentar novamente", "Praticar mais", "Voltar ao Dashboard" |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | `components/ui/card.tsx` | Cards na lista de aulas (`LessonCard`) e card no Dashboard (`LessonsOverviewCard`) |
| `Input` | `components/ui/input.tsx` | Input numérico para respostas dos exercícios |
| `ProgressBar` | `components/training/ProgressBar.tsx` | Barra de progresso no mini-treino pós-aula (5 exercícios) |
| `Navbar` | `components/shared/Navbar.tsx` | Adicionada entrada "Aulas" na navegação |

### 4.4 Alterações em Componentes Existentes

#### `Navbar.tsx` — Novo link de navegação

```typescript
// Adicionar ao array navLinks:
{ href: "/lessons", label: "Aulas", icon: BookOpen },
// Importar BookOpen de lucide-react
```

Posição: entre "Dashboard" e "Treinar" na navbar.

#### `Dashboard page.tsx` — Novo card

Inserir o componente `<LessonsOverviewCard>` entre `<StatsSummary>` e o card de Evolução.

### 4.5 Nova Estrutura de Dados Estáticos

```
lib/
  lessons/
    index.ts              -- re-exporta todas as aulas
    types.ts              -- tipos TypeScript para conteúdo de aula
    data/
      somar-dezenas.ts    -- conteúdo da aula "Somar dezenas primeiro"
      quebrar-numeros.ts  -- conteúdo da aula "Quebrar números grandes"
      multiplicar-por-9.ts
      ...
    engine.ts             -- gerador de exercícios específico para aulas
```

#### Tipo `LessonContent` (`lib/lessons/types.ts`)

```typescript
export interface LessonContent {
  slug: string;
  title: string;
  technique: string;
  operator: Operator;
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  intro: {
    explanation: string;       // max 60 palavras
    example: {
      expression: string;     // ex: "37 + 48"
      steps: string[];        // ex: ["37 + 50 = 87", "87 - 2 = 85"]
      answer: number;         // 85
    };
  };

  exercises: {
    guided: LessonExerciseData;
    semiGuided: LessonExerciseData;
    free: LessonExerciseData;
  };

  practiceGenerator: (count: number) => LessonExerciseData[];
}

export interface LessonExerciseData {
  operand1: number;
  operand2: number;
  operator: Operator;
  correctAnswer: number;
  fullHint: string;           // dica completa (usada na fase guiada)
  partialHint: string;        // dica parcial (usada na fase semi-guiada)
  stepByStep: string[];       // explicação passo a passo (usada após erro)
}
```

### 4.6 Nova API Route

| Rota | Método | Descrição |
|---|---|---|
| `app/api/lessons/complete/route.ts` | POST | Registra conclusão de aula |

**Request body:**
```typescript
{
  userId: string;
  lessonSlug: string;
}
```

**Comportamento:**
1. Busca a aula por `slug` na tabela `lessons`.
2. Faz **upsert** em `lesson_progress`: se já existe, incrementa `times_completed` e atualiza `completed_at`.
3. Insere em `learned_techniques` (se ainda não existir) com o `operator` da aula.
4. Retorna `{ success: true }`.

**Não altera:** `profiles`, `sessions`, `exercise_logs`.

---

## 5. Integração com o Sistema Existente

### 5.1 Integração com o Dashboard

| Elemento | Comportamento |
|---|---|
| `LessonsOverviewCard` | Exibe total de aulas concluídas vs. disponíveis. Query: `SELECT COUNT(*) FROM lesson_progress WHERE user_id = ?` e `SELECT COUNT(*) FROM lessons`. |
| `StatsSummary` | **Sem alteração.** Nível, streak, precisão e sessões continuam refletindo apenas o treino. |
| `EvolutionChart` | **Sem alteração.** Gráfico reflete apenas sessões de treino. |
| `WeakPointsList` | **Sem alteração.** Pontos fracos vêm de `exercise_logs` do treino. |

### 5.2 Integração com o Sistema de Treino

A integração é **indireta e gradual**:

1. Quando o usuário completa uma aula, a técnica é registrada em `learned_techniques`.
2. O `generateExercise()` em `lib/engine.ts` será estendido com um parâmetro opcional `learnedTechniques`:
   - Se o usuário aprendeu técnicas para uma operação, o sistema pode gerar exercícios que usem os mesmos padrões numéricos da aula (ex: somas que se beneficiam de arredondar para dezena).
   - Isso é feito sem dicas — o objetivo é reforçar a técnica no contexto de treino real.
3. A lógica de biasing já existe (`weakOperations` com 70% de peso). A mesma abordagem será usada para `learnedTechniques`, mas com peso menor (30%), para que os exercícios apareçam de forma natural e não dominante.

**Regra crítica:** Exercícios da Aula Interativa **nunca** são gravados em `exercise_logs` nem `sessions`. A separação é total.

### 5.3 Integração com Nível e Streak

| Sistema | Impacto da Aula Interativa |
|---|---|
| Nível (1-10) | **Zero.** `calculateLevel()` não é chamado durante/após aulas. |
| Streak | **Zero.** Concluir uma aula não conta como "treino do dia" para streak. |
| Pontuação | **Não existe** na aula. Sem score, sem ranking, sem XP. |

### 5.4 Integração com Navegação

- Navbar: novo link "Aulas" entre "Dashboard" e "Treinar" (ícone `BookOpen`).
- Dashboard: card `LessonsOverviewCard` como ponto de entrada secundário.
- Conclusão de aula: botão "Voltar ao Dashboard" leva a `/dashboard`.

---

## 6. Catálogo Inicial de Aulas (Seed Data)

O MVP incluirá **8 aulas** cobrindo as operações básicas:

| # | Slug | Título | Operação | Dificuldade |
|---|---|---|---|---|
| 1 | `somar-dezenas-primeiro` | Somar dezenas primeiro | + | beginner |
| 2 | `somar-arredondando` | Somar arredondando para 10 | + | beginner |
| 3 | `subtrair-completando` | Subtrair completando a dezena | - | beginner |
| 4 | `subtrair-por-partes` | Subtrair por partes | - | beginner |
| 5 | `multiplicar-por-5` | Multiplicar por 5 (metade de 10x) | * | intermediate |
| 6 | `multiplicar-por-9` | Multiplicar por 9 (10x - 1x) | * | intermediate |
| 7 | `dividir-por-2-e-4` | Dividir por 2 e por 4 (metade da metade) | / | intermediate |
| 8 | `dividir-pensando-na-multiplicacao` | Dividir pensando na multiplicação | / | intermediate |

Cada aula será um módulo TypeScript em `lib/lessons/data/` contendo o conteúdo pedagógico completo (intro, exercícios, dicas, explicações passo a passo).

---

## 7. Regras de Negócio Consolidadas

### RN-01: Isolamento Total
Exercícios, respostas e desempenho da Aula Interativa são **completamente isolados** do sistema de treino. Não há escrita em `sessions` nem `exercise_logs`.

### RN-02: Progressão Sequencial
Aulas são desbloqueadas em ordem. A aula N+1 só é acessível quando a aula N for concluída. A primeira aula está sempre disponível.

### RN-03: Conclusão por Completude
Uma aula é marcada como "concluída" quando o usuário chega à Fase 5 (Conclusão). Não importa quantos erros cometeu nas fases anteriores.

### RN-04: Repetição Ilimitada
O usuário pode refazer qualquer aula concluída. O campo `times_completed` é incrementado, mas o status permanece "concluída".

### RN-05: Sem Persistência Parcial
Se o usuário sair da aula antes da Fase 5, nenhum progresso é salvo. Na próxima vez, a aula recomeça da Fase 1.

### RN-06: Tentativas Ilimitadas por Exercício
Não há limite de tentativas em nenhum exercício da aula. O usuário pode errar quantas vezes precisar.

### RN-07: Feedback Passo a Passo Obrigatório
Todo erro deve acionar automaticamente a exibição de uma explicação passo a passo antes de permitir nova tentativa.

### RN-08: Sem Elementos Competitivos
Durante a aula: sem timer, sem pontuação, sem ranking, sem comparação, sem efeitos sonoros de erro.

### RN-09: Integração Gradual com Treino
Técnicas aprendidas influenciam o gerador de exercícios do treino com peso de 30% (via `learned_techniques`). Os exercícios gerados no treino não incluem dicas.

### RN-10: Acesso Restrito por URL
Se o usuário tentar acessar `/lessons/[slug]` de uma aula bloqueada, ele é redirecionado para `/lessons`.

---

## 8. Critérios de Aceite

### 8.1 Navegação e Acesso

- [ ] **CA-01:** O Dashboard exibe o card `LessonsOverviewCard` com contagem de aulas concluídas.
- [ ] **CA-02:** A Navbar contém o link "Aulas" com ícone `BookOpen` entre "Dashboard" e "Treinar".
- [ ] **CA-03:** A rota `/lessons` exibe a lista de todas as aulas com status correto (concluída / disponível / bloqueada).
- [ ] **CA-04:** Clicar em uma aula disponível redireciona para `/lessons/[slug]`.
- [ ] **CA-05:** Clicar em uma aula bloqueada não realiza nenhuma ação (ou exibe tooltip "Complete a aula anterior").
- [ ] **CA-06:** Acessar via URL uma aula bloqueada redireciona para `/lessons`.

### 8.2 Experiência da Aula

- [ ] **CA-07:** A Fase 1 (Intro) exibe o título, explicação e exemplo numérico da técnica.
- [ ] **CA-08:** O botão "Entendi, vamos praticar" avança para a Fase 2.
- [ ] **CA-09:** Na Fase 2 (Guiado), a dica completa está visível permanentemente.
- [ ] **CA-10:** Na Fase 3 (Semi-Guiado), apenas a dica parcial está visível.
- [ ] **CA-11:** Na Fase 4 (Livre), nenhuma dica é exibida.
- [ ] **CA-12:** Em caso de acerto, o sistema exibe feedback positivo e avança para a próxima fase após 1.5s.
- [ ] **CA-13:** Em caso de erro, o sistema exibe a explicação passo a passo e o botão "Tentar novamente".
- [ ] **CA-14:** Após clicar em "Tentar novamente", o mesmo exercício é reexibido com input limpo.
- [ ] **CA-15:** Não há cronômetro visível em nenhum momento da aula.
- [ ] **CA-16:** Não há pontuação ou score visível durante a aula.

### 8.3 Conclusão e Pós-Aula

- [ ] **CA-17:** A Fase 5 exibe mensagem de conclusão positiva com o nome da técnica aprendida.
- [ ] **CA-18:** O botão "Praticar mais" gera 5 exercícios sem dica da mesma técnica.
- [ ] **CA-19:** Ao final do mini-treino extra, exibe resumo ("Você acertou X de 5") sem penalização.
- [ ] **CA-20:** O botão "Voltar ao Dashboard" redireciona para `/dashboard`.
- [ ] **CA-21:** A conclusão persiste no banco: `lesson_progress` é criado/atualizado e `learned_techniques` é inserido.

### 8.4 Progressão e Persistência

- [ ] **CA-22:** Após concluir a aula N, a aula N+1 aparece como "disponível" na lista.
- [ ] **CA-23:** Sair da aula antes da Fase 5 não salva progresso algum.
- [ ] **CA-24:** Refazer uma aula concluída incrementa `times_completed` sem alterar o status.
- [ ] **CA-25:** A conclusão de uma aula **não** altera `level`, `streak` nem gera registros em `sessions` ou `exercise_logs`.

### 8.5 Integração com Treino

- [ ] **CA-26:** Após concluir uma aula, exercícios do treino incluem padrões da técnica aprendida com frequência ~30%.
- [ ] **CA-27:** Exercícios do treino gerados por integração **não** incluem dicas.

### 8.6 Responsividade e UX

- [ ] **CA-28:** Todas as telas funcionam em viewport mobile (min 320px) e desktop.
- [ ] **CA-29:** O input numérico recebe foco automaticamente em cada exercício.
- [ ] **CA-30:** A tecla Enter submete a resposta (mesmo comportamento do sistema de treino atual).
- [ ] **CA-31:** A linguagem é acolhedora em todos os textos: sem termos técnicos, sem jargão matemático, sem tom punitivo.

---

## 9. Fora de Escopo (v1)

Os seguintes itens **não** fazem parte desta versão da feature:

- Recomendação automática de aula com base no desempenho do treino.
- Aulas para nível avançado (decimais, porcentagens).
- Gamificação (badges, conquistas, XP por aula concluída).
- Conteúdo em vídeo ou áudio.
- Personalização do conteúdo da aula por IA.
- Testes A/B de conteúdo pedagógico.
- Internacionalização (i18n) — toda a interface é em pt-BR.
- Analytics detalhado (tempo por fase, taxa de erro por exercício na aula).

---

## 10. Resumo Técnico de Implementação

| Item | Detalhe |
|---|---|
| **Novas tabelas** | `lessons`, `lesson_progress`, `learned_techniques` |
| **Tabelas alteradas** | Nenhuma |
| **Novas rotas (pages)** | `/lessons`, `/lessons/[slug]` |
| **Nova rota (API)** | `/api/lessons/complete` |
| **Novos componentes** | 10 componentes em `components/lessons/` + 1 em `components/dashboard/` |
| **Componentes alterados** | `Navbar.tsx` (novo link), `dashboard/page.tsx` (novo card) |
| **Novos módulos** | `lib/lessons/` (tipos, dados, engine de exercícios) |
| **Módulos alterados** | `lib/engine.ts` (parâmetro `learnedTechniques` opcional), `middleware.ts` (nova rota protegida) |
| **Seed data** | 8 aulas iniciais com conteúdo pedagógico completo |
