# PRD — Feature: Tabuada

**Produto:** MindCalc  
**Versão:** 1.0  
**Data:** 2026-02-15  
**Stack:** Next.js 14 (App Router) · Supabase (Auth, Database, RLS) · Tailwind CSS

---

## 1. Objetivo da Feature

A **Tabuada** resolve a necessidade de **treino estruturado e seguro** das operações básicas para adultos com grande dificuldade em matemática. Ela cria um ambiente separado do treino geral, **com baixa carga cognitiva, repetição progressiva e feedback imediato**, permitindo que o usuário **consolide combinações fundamentais** (ex: 2 + 3, 7 − 4, 6 × 8) sem pressão, sem competição e sem impacto negativo na motivação.

**Problema que resolve no MindCalc:**
- Usuários que falham no treino adaptativo por falta de domínio das combinações básicas não têm hoje um espaço dedicado para reconstruir a base.
- O treino geral é bom para evolução de nível, mas não é suficiente para **micro-reforço sistemático** das tabuadas.

---

## 2. User Flow

### 2.1 Entrada (Dashboard → Tabuada)
1. Usuário acessa o **Dashboard**.
2. Visualiza um **card “Tabuada”** com resumo de progresso (ex: “Multiplicação 60% concluída”).
3. Clica em **“Treinar Tabuada”** → redireciona para `/tabuada`.

### 2.2 Configuração da Sessão (`/tabuada`)
1. Tela de configuração com:
   - **Operação**: adição, subtração, multiplicação, divisão.
   - **Intervalo**: ex. 1–5, 1–10, 1–12 (dropdown).
   - **Modo de treino**:
     - **Guiado (sem tempo):** perguntas com explicação contextual e ritmo controlado.
     - **Treino livre:** perguntas sequenciais sem explicação imediata, mas com feedback.
2. Botão **“Iniciar sessão”**.

### 2.3 Sessão de Treino (`/tabuada/session`)
1. Apresenta **poucas combinações por vez** (ex: blocos de 6 questões).
2. A cada questão:
   - Usuário responde.
   - Sistema dá **feedback imediato**.
   - Se errado, entra em **modo de reforço** (explicação simples e repetição posterior).
3. Ao final do bloco, mostra **resumo leve** (ex: “Você acertou 4 de 6”).
4. Avança para o próximo bloco com **progressão controlada**.

### 2.4 Conclusão (`/tabuada/result`)
1. Resumo da sessão (acertos, blocos concluídos, combinações difíceis).
2. Sugestões:
   - **“Repetir Tabuada”** (mesma configuração).
   - **“Escolher outra operação”**.
   - **Aula sugerida** quando houver dificuldade recorrente.
3. Botão **“Voltar ao Dashboard”**.

---

## 3. Regras de Negócio

### 3.1 Critérios de Repetição
- Cada bloco contém **6 combinações únicas** geradas a partir do intervalo escolhido.
- Qualquer questão errada é adicionada automaticamente à **fila de repetição**.
- Uma questão errada é repetida **no máximo 2 vezes adicionais** dentro da mesma sessão.
- Se o usuário errar novamente após 2 repetições, a combinação é marcada como **“dificuldade persistente”**.

### 3.2 Como Lidar com Erros
- **Erro não punitivo:** sem perda de nível ou streak.
- Feedback imediato com tom neutro e acolhedor:
  - Ex: “Não foi dessa vez. Vamos ver juntos.”
- Exibição de **explicação simples** quando errar, baseada em decomposição mental:
  - Ex: “6 × 8 = 6 × (4 + 4) = 24 + 24 = 48”.
- O usuário sempre pode tentar novamente sem limite de tempo.

### 3.3 Progressão de Dificuldade
- Progressão ocorre **dentro do intervalo escolhido**, sem escalar para intervalos maiores automaticamente.
- Sequência padrão de blocos:
  1. Combinações mais baixas (ex: 1–3)
  2. Combinações médias (ex: 4–7)
  3. Combinações altas (ex: 8–10 ou 12)
- O sistema **não avança para o próximo bloco** se a taxa de acerto for < 60%.
- Se o usuário estiver em modo guiado, a progressão é mais lenta (mais repetições e explicações).

### 3.4 Impacto em Nível, Streak e Estatísticas
- **Nível e streak globais não são alterados** pela Tabuada.
- A Tabuada **contribui apenas para “pontos fracos”** (weak points).
- A sessão gera **métricas próprias** de progresso da tabuada:
  - % de combinações dominadas por operação.
  - Histórico de erros recorrentes.

---

## 4. Mudanças no Banco de Dados (Supabase)

### 4.1 Nova Tabela: `tables_sessions`
Armazena cada sessão de tabuada.

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
```

### 4.2 Nova Tabela: `tables_progress`
Armazena progresso por operação e intervalo.

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
```

### 4.3 Nova Tabela: `tables_question_logs`
Log detalhado para identificação de pontos fracos.

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
```

### 4.4 Ajustes em Tabelas Existentes
- **`exercise_logs`**: incluir flag opcional `source` com valores `training` (default) ou `tables` para diferenciar origens.
- **`weak_points`** (se existir): considerar dados da Tabuada com peso menor (ex: 0,7) para evitar distorções.

---

## 5. Interface e Componentes

### 5.1 Novas Páginas (App Router)
- `/tabuada` — tela de configuração da sessão.
- `/tabuada/session` — execução da sessão (perguntas em blocos).
- `/tabuada/result` — resumo e sugestões.

### 5.2 Componentes Reutilizáveis
- `TablesConfigForm` — seleção de operação, intervalo e modo.
- `TablesQuestionCard` — exibe questão, input e feedback.
- `TablesProgressBar` — progresso por bloco e por sessão.
- `TablesSessionSummary` — resumo ao final do bloco e da sessão.

### 5.3 Estados Importantes da UI
- **Inicial:** seleção de operação/intervalo/modo.
- **Carregando:** geração das primeiras combinações.
- **Em progresso:** questão ativa + progresso.
- **Erro:** feedback acolhedor + explicação simples.
- **Repetição:** indicação de reexposição de questão errada.
- **Conclusão:** resumo + CTA para repetir, mudar operação ou voltar.

---

## 6. Integração com Aulas e Treino

- **Pontos fracos:**
  - Combinações com erro recorrente entram no sistema de identificação de pontos fracos.
  - Ex: “Multiplicação — 6 × 8” aparece como combinação com dificuldade.

- **Aulas interativas:**
  - Quando uma combinação tem **erro persistente (≥ 3 sessões)**, sugerir uma aula relacionada.
  - Ex: dificuldade em multiplicação → sugerir aula “Multiplicar por 9 com 10x-1x”.

- **Treino geral:**
  - Treino adaptativo passa a priorizar operações em que o usuário falha na Tabuada, mas **sem forçar repetição excessiva**.
  - Dados da Tabuada têm peso menor no algoritmo para manter o equilíbrio.

---

## 7. Critérios de Aceite

1. Usuário consegue iniciar uma sessão de Tabuada com **operação, intervalo e modo** configuráveis.
2. Sessão apresenta **blocos curtos** e repete automaticamente combinações erradas.
3. Erros geram **feedback imediato + explicação simples**.
4. Progresso da Tabuada é salvo e exibido no Dashboard (ex: % concluída por operação).
5. Sessões de Tabuada **não alteram nível nem streak**.
6. Pontos fracos consideram dados da Tabuada, porém com peso menor.
7. Ao final da sessão, usuário recebe **resumo claro** e opções de continuar, alterar operação ou voltar.
8. Quando houver erro persistente, o sistema sugere uma **aula interativa** relacionada.

---

**Observação final:** a Tabuada deve ser **deliberadamente calma**, com ritmo controlado, linguagem acolhedora e sem qualquer mecânica competitiva.