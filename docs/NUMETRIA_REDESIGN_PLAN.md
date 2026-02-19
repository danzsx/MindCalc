# Numetria — Plano Mestre de Redesign
> De MindCalc para Numetria: uma transformação radical do frontend

**Versão:** 1.0
**Data:** 2026-02-18
**Status:** Aguardando aprovação
**Escopo:** 100% frontend. Backend intacto. Zero de legado visual.

---

## 0. Visão e Filosofia de Design

### Nome e Identidade
**Numetria** — precisão numérica que flui naturalmente. O nome evoca métricas, geometria e domínio dos números. O design deve refletir isso: **preciso, fluido, confiante**.

### Conceito Central: *"Glass Intelligence"*
Glassmorphism evoluído. Não mais o glassmorphism ingênuo de bordas brancas em fundos roxos. A Numetria usa **vidro azul profundo** — como janelas de cockpit, como displays de laboratório, como telas de controle de missão. Cada card é uma janela para o progresso do aluno.

- **Modo escuro** como padrão visual (dark-first, não dark-mode)
- Camadas de vidro tintado em azul sobre fundos navy profundos
- Verde lima `#cef26d` como energia elétrica — o destaque que corta o escuro
- Tipografia Oddval para display: geométrica, angular, precisa
- Inter para corpo: legibilidade máxima, zero ruído

### Paleta Oficial Numetria

| Token | Nome | Hex | Uso |
|-------|------|-----|-----|
| `--color-primary` | Blue Harbor | `#3770bf` | Botões primários, links, ícones ativos |
| `--color-accent` | Sunny Herb | `#cef26d` | CTAs, highlights, progresso, sucesso |
| `--color-bg` | Deep Navy | `#080f1e` | Background principal (dark) |
| `--color-surface` | Ocean Glass | `#0d1d3a` | Superfície de cards |
| `--color-glass` | Ice Blue | `#8dc2ff` | Efeito glassmorphism, bordas, blur tint |
| `--color-base-light` | Moon Tint | `#f3f6ff` | Background em modo claro |
| `--color-text` | Branco | `#f0f4ff` | Texto principal |
| `--color-text-muted` | Névoa | `#6b89b4` | Texto secundário |

### Remapeamento de Cores por Operação

| Operação | Antes (MindCalc) | Depois (Numetria) |
|----------|-----------------|-------------------|
| Adição (+) | Emerald `#10b981` | Blue Harbor `#3770bf` |
| Subtração (−) | Rose `#fb7185` | Ice Blue `#8dc2ff` (frio) |
| Multiplicação (×) | Violet `#a78bfa` | Sunny Herb `#cef26d` |
| Divisão (÷) | Amber `#fcd34d` | Muted Lime `#a8cc47` |

---

## 1. Inventário de Arquivos a Modificar

### Arquivos críticos (redesign total)
```
app/globals.css                              → Sistema de design completo
app/layout.tsx                               → Meta, fontes, providers
app/(app)/layout.tsx                         → Shell autenticado
app/(app)/dashboard/page.tsx                 → Dashboard
app/(app)/dashboard/loading.tsx              → Loading skeleton
app/(app)/lessons/page.tsx                   → Catálogo de aulas
app/(app)/tabuada/page.tsx                   → Tabuada overview
app/(app)/tabuada/session/page.tsx           → Sessão tabuada
app/(app)/tabuada/result/[sessionId]/page.tsx → Resultado tabuada
app/(app)/billing/page.tsx                   → Planos/assinatura
app/(app)/onboarding/page.tsx                → Onboarding
app/(app)/results/[sessionId]/page.tsx       → Resultado de aula
```

### Componentes (redesign total)
```
components/shared/Navbar.tsx
components/shared/MobileNav.tsx
components/dashboard/StatsSummary.tsx
components/dashboard/EvolutionChart.tsx
components/dashboard/WeakPointsList.tsx
components/dashboard/ConfidenceCard.tsx
components/dashboard/LessonsOverviewCard.tsx
components/lessons/LessonCard.tsx
components/lessons/LessonShell.tsx
components/lessons/LessonIntro.tsx
components/lessons/LessonExercise.tsx
components/lessons/LessonCompletion.tsx
components/lessons/LessonProgressIndicator.tsx
components/lessons/LessonStepByStep.tsx
components/tables/TablesBlockSummary.tsx
components/tables/TablesCard.tsx
components/tables/TablesConfigForm.tsx
components/tables/TablesFeedback.tsx
components/tables/TablesQuestionCard.tsx
components/tables/TablesSessionSummary.tsx
components/training/ExerciseCard.tsx
components/training/ProgressBar.tsx
components/training/Timer.tsx
components/training/ConfidenceSurveyDialog.tsx
components/ui/button.tsx
components/ui/card.tsx
components/ui/badge.tsx
components/ui/input.tsx
components/ui/progress.tsx
components/ui/skeleton.tsx
components/ui/tabs.tsx
```

### Arquivos novos a criar
```
public/fonts/Oddval-SemiBold.woff2           → Fonte customizada (converter TTF→WOFF2)
public/fonts/Oddval-SemiBoldItalic.woff2     → Fonte itálica
public/brand/logo.svg                        → Logo Numetria (extraído do brand/)
components/shared/NumetriaLogo.tsx           → Componente do logo
```

---

## 2. Bugs e Problemas Identificados no Frontend Atual

### Bugs Visuais
- [ ] **[CRÍTICO]** Navbar desktop oculta em mobile sem transição suave entre Navbar/MobileNav
- [ ] **[CRÍTICO]** Dashboard hero sem padding consistente com o restante da página no mobile
- [ ] **[CRÍTICO]** Botão "Assinar Pro" na navbar quebra layout em telas 768–1024px
- [ ] **[ALTO]** Cards do dashboard com `rounded-[32px]` mas inputs com apenas `rounded-2xl` — inconsistência de border-radius
- [ ] **[ALTO]** `StatsSummary` com gap irregular entre cards em viewport 375px
- [ ] **[ALTO]** `EvolutionChart` não responsivo abaixo de 480px (Recharts overflow)
- [ ] **[MÉDIO]** MobileNav com `bottom-6` fixa em todas as páginas mas conflita com o teclado virtual em inputs do treino
- [ ] **[MÉDIO]** Animações de lesson (`lesson-pulse`, `confetti-burst`) usam `animation-fill-mode: forwards` mas não resetam corretamente ao remontar
- [ ] **[MÉDIO]** `LessonCard` com estado "locked" tem opacidade e pointer-events mas ainda recebe focus via teclado
- [ ] **[BAIXO]** Tooltip do Recharts em `.dash-tooltip` com z-index conflitando com MobileNav
- [ ] **[BAIXO]** Cor `text-gray-400` usada inconsistentemente — às vezes como placeholder, às vezes como label

### Bugs Funcionais (frontend)
- [ ] **[CRÍTICO]** `onboarding/page.tsx` — layout quebra em iOS Safari (viewport height com URL bar)
- [ ] **[ALTO]** `tabuada/session/page.tsx` — input numérico abre teclado com layout shift visível
- [ ] **[MÉDIO]** `results/[sessionId]/page.tsx` — animação de confetti dispara antes do dado carregar
- [ ] **[MÉDIO]** `billing/page.tsx` — card Pro sem scroll horizontal em mobile
- [ ] **[BAIXO]** `ThemeProvider` aplica classe `dark` no `<html>` mas vários componentes verificam `dark:` ao invés de usar as CSS vars

### Problemas de Acessibilidade
- [ ] Contraste insuficiente de `text-gray-400` em fundo `bg-gray-50`
- [ ] Falta de `aria-label` nos itens de nav do `MobileNav`
- [ ] `LessonCard` locked sem `aria-disabled` adequado
- [ ] Foco visual ausente nos botões de operação do treino

---

## 3. Fases de Execução

---

### FASE 1 — Sistema de Design (Fundação)
**Objetivo:** Criar o DNA visual da Numetria. Nada funcionará corretamente até esta fase estar completa.

**Arquivos:**
- `app/globals.css` — reescrever completamente
- `app/layout.tsx` — atualizar metadados e fontes
- `public/fonts/` — adicionar Oddval

**O que fazer:**

#### 1.1 — Fonte Oddval
Converter os arquivos TTF (`Oddval-SemiBold.ttf`, `Oddval-SemiBoldItalic.ttf`) para WOFF2 e declarar com `@font-face` no `globals.css`. Adicionar ao `layout.tsx` como `localFont` do Next.js ou `@font-face` direto.

#### 1.2 — Tokens de Cor (CSS Custom Properties)
Substituir toda a paleta amber/yellow pela paleta Numetria. O `@theme` do Tailwind v4 inline no `globals.css` deve ser completamente reescrito:

```css
@theme {
  /* === NUMETRIA CORE === */
  --color-primary: #3770bf;        /* Blue Harbor */
  --color-primary-light: #5a8fd4;
  --color-primary-dark: #2558a0;
  --color-accent: #cef26d;         /* Sunny Herb */
  --color-accent-dim: #b8d85a;
  --color-glass: #8dc2ff;          /* Ice Blue */

  /* === BACKGROUNDS === */
  --color-bg-dark: #080f1e;        /* Deep Navy */
  --color-surface-dark: #0d1d3a;   /* Ocean Glass */
  --color-surface-mid: #122040;
  --color-surface-light: #1a2f55;
  --color-bg-light: #f3f6ff;       /* Moon Tint */

  /* === TEXT === */
  --color-text-primary: #f0f4ff;
  --color-text-secondary: #a8c0e0;
  --color-text-muted: #6b89b4;
  --color-text-dark: #0d1d3a;

  /* === GLASSMORPHISM === */
  --glass-bg: rgba(13, 29, 58, 0.6);
  --glass-border: rgba(141, 194, 255, 0.15);
  --glass-blur: blur(20px);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  /* === OPERAÇÕES === */
  --op-add: #3770bf;               /* Azul */
  --op-sub: #8dc2ff;               /* Ice Blue */
  --op-mul: #cef26d;               /* Lime */
  --op-div: #a8cc47;               /* Lime escuro */

  /* === BORDER RADIUS === */
  --radius-sm: 0.75rem;            /* 12px */
  --radius-md: 1rem;               /* 16px */
  --radius-lg: 1.5rem;             /* 24px */
  --radius-xl: 2rem;               /* 32px */
  --radius-full: 9999px;

  /* === TYPOGRAPHY === */
  --font-display: 'Oddval', 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

#### 1.3 — Glassmorphism System
Definir classes utilitárias no `globals.css`:

```css
.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
}

.glass-card-hover {
  transition: all 0.3s ease;
  &:hover {
    background: rgba(18, 32, 64, 0.7);
    border-color: rgba(141, 194, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(141, 194, 255, 0.2);
  }
}

.glass-accent {
  background: rgba(206, 242, 109, 0.08);
  border: 1px solid rgba(206, 242, 109, 0.2);
}

.glass-primary {
  background: rgba(55, 112, 191, 0.15);
  border: 1px solid rgba(55, 112, 191, 0.3);
}
```

#### 1.4 — Metadados e Fontes no layout.tsx
```tsx
export const metadata: Metadata = {
  title: "Numetria",
  description: "Domine os números. Treine sua mente.",
};
```

**Resultado esperado:** Sistema de design completamente novo. Zero referências ao amber/yellow. Todo card tem glassmorphism com azul profundo.

---

### FASE 2 — Navegação e Shell
**Objetivo:** A primeira coisa que o usuário vê deve gritar "Numetria" — marca forte, navegação elegante.

**Arquivos:**
- `components/shared/Navbar.tsx`
- `components/shared/MobileNav.tsx`
- `components/shared/NumetriaLogo.tsx` (novo)
- `app/(app)/layout.tsx`

**O que fazer:**

#### 2.1 — Logo Component
Criar `NumetriaLogo.tsx` que renderiza o SVG do logotipo. Duas variantes:
- `variant="mark"` — apenas o ícone geométrico azul
- `variant="full"` — ícone + wordmark "Numetria"
- Prop `color` para adaptar entre dark/light mode

O wordmark deve usar a fonte Oddval. A cor padrão é branco em dark mode, navy em light mode.

#### 2.2 — Navbar Desktop
**Design:**
- Background: `rgba(8, 15, 30, 0.85)` com `backdrop-blur-2xl`
- Borda inferior: `1px solid rgba(141, 194, 255, 0.08)`
- Altura: `72px`
- Logo: `NumetriaLogo variant="full"` à esquerda
- Nav links: centro, pill pills com estado ativo em `--color-primary` com glow sutil
- Botão CTA "Upgrade": verde lima `#cef26d` com texto escuro — botão mais importante da interface
- UserMenu: avatar com anel em `--color-primary`

**Links de navegação (mesmos destinos, novos ícones e labels):**
- `/dashboard` — "Painel" com ícone personalizado
- `/lessons` — "Aulas"
- `/tabuada` — "Tabuada"
- `/train` — "Treinar"

**Estado ativo:** Background `rgba(55, 112, 191, 0.15)`, borda `1px solid rgba(55, 112, 191, 0.4)`, texto branco, ícone azul claro

#### 2.3 — MobileNav
**Design:** Floating pill na base, mas redesenhado:
- Background: `rgba(8, 15, 30, 0.95)` com blur forte
- Borda: `1px solid rgba(141, 194, 255, 0.12)`
- Sombra: `0 -4px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(141, 194, 255, 0.08)`
- Item ativo: ícone com background `rgba(55, 112, 191, 0.2)` e texto verde lima `#cef26d`
- Sem label texto — apenas ícones + badge indicador

**Bug fix:** Garantir que o nav não interfere com o teclado virtual usando `env(safe-area-inset-bottom)`

#### 2.4 — App Shell Layout
Garantir que o layout autenticado aplica o background correto:
- Body: `background: #080f1e` (Deep Navy)
- Gradiente de fundo sutil: radial gradient com azul no canto superior direito
- Ruído de textura leve via SVG filter para profundidade

---

### FASE 3 — Dashboard
**Objetivo:** O dashboard é a vitrine do produto. Deve impressionar na primeira visita.

**Arquivos:**
- `app/(app)/dashboard/page.tsx`
- `app/(app)/dashboard/loading.tsx`
- `components/dashboard/StatsSummary.tsx`
- `components/dashboard/EvolutionChart.tsx`
- `components/dashboard/WeakPointsList.tsx`
- `components/dashboard/ConfidenceCard.tsx`
- `components/dashboard/LessonsOverviewCard.tsx`

**Design do Dashboard:**

#### 3.1 — Hero Section
```
┌─────────────────────────────────────────────────────────┐
│  Boa tarde, Ana.                    [Nível 7] [🔥 12]   │
│  Numetria · Sessão de hoje                              │
│                                                         │
│  "Continue de onde parou →"    [Botão: Continuar Aula] │
└─────────────────────────────────────────────────────────┘
```
- Gradiente de fundo no hero: azul radial + partículas numéricas sutis (CSS)
- Nome do usuário em Oddval, tamanho 48–64px
- Badges de nível e streak em glass pill
- CTA em verde lima com seta animada

#### 3.2 — Stats Bar (StatsSummary)
4 métricas em linha, glass cards horizontais:
- Ícone em `--color-primary` com fundo `rgba(55, 112, 191, 0.12)`
- Valor principal em Oddval, grande
- Label em text-muted
- Sem bordas pesadas — apenas glass border sutil
- Animação de counter-up no load

#### 3.3 — Bento Grid
```
┌──────────────────────────┬─────────────────┐
│  EvolutionChart          │  Aulas          │
│  (2/3 width)             │  Overview       │
│                          │  (1/3 width)    │
├──────────────────────────┴─────────────────┤
│  WeakPoints (1/2) │ ConfidenceCard (1/2)   │
└────────────────────────────────────────────┘
```
- Todos os cards: `.glass-card .glass-card-hover`
- Border radius: `--radius-xl` (32px)
- Sem sombras brancas — sombras escuras profundas

#### 3.4 — EvolutionChart
- Recharts: tema completamente custom com as cores Numetria
- Área fill: gradiente de Blue Harbor com opacity
- Linha: Ice Blue `#8dc2ff`
- Grid: linhas sutis `rgba(141, 194, 255, 0.05)`
- Tooltip: glass card escuro custom

#### 3.5 — WeakPointsList
- Barras de progresso em tema Numetria
- Cores de operação remapeadas
- Ícone da operação à esquerda com glow colorido

#### 3.6 — Loading Skeleton
Redesenhar para usar `--color-surface-dark` como base e shimmer com tint azul.

---

### FASE 4 — Aulas (Lessons)
**Objetivo:** O catálogo de aulas deve ser a parte mais visualmente rica do app.

**Arquivos:**
- `app/(app)/lessons/page.tsx`
- `components/lessons/LessonCard.tsx`
- `components/lessons/LessonShell.tsx`
- `components/lessons/LessonIntro.tsx`
- `components/lessons/LessonExercise.tsx`
- `components/lessons/LessonCompletion.tsx`
- `components/lessons/LessonProgressIndicator.tsx`
- `components/lessons/LessonStepByStep.tsx`
- `app/(app)/results/[sessionId]/page.tsx`

**Design:**

#### 4.1 — Página de Aulas
- Header: título "Aulas" em Oddval com badge de progresso geral
- Progress bar geral: lime verde pulsante
- Por categoria: header com nome da operação + ícone com cor remapeada
- Grid de cards: 3 colunas desktop, 2 tablet, 1 mobile

#### 4.2 — LessonCard
Redesign total. Layout novo:
```
┌───────────────────────────────┐
│ [Ícone operação]   [Badge]    │  ← Header glass escuro
│                               │
│ Título da Aula                │
│ Descrição curta               │
│                               │
│ [████░░░░░] 40%               │  ← Progresso (se iniciada)
│                     [→ Aula]  │
└───────────────────────────────┘
```
- Background: `glass-card` com glassmorphism
- Header da operação: cor remapeada com ícone
- Badge de estado: "Nova", "Em progresso", "Concluída", "Bloqueada"
- Estado concluído: borda em `--color-accent` (lime verde) com glow sutil
- Estado bloqueado: opacidade 0.4, `pointer-events: none`, `aria-disabled: true`
- Hover: elevação + glow na borda em azul

#### 4.3 — LessonShell
- Layout de lição: fundo escuro com painel de conteúdo centralizado
- Progress indicator no topo: steps com cores Numetria
- Sidebar lateral (desktop): outline do conteúdo da aula

#### 4.4 — LessonExercise
- Input de resposta: grande, centralizado, glass card
- Input focus: borda lime verde `#cef26d` com glow
- Botões de ação: primário em Blue Harbor, CTA em lime
- Feedback de acerto: flash verde lima
- Feedback de erro: flash ice blue (não vermelho agressivo)

#### 4.5 — LessonCompletion
- Tela de conclusão: full-screen com animação de partículas/estrelas
- Pontuação em Oddval grande
- Botões: "Próxima Aula" (lime) e "Voltar ao Painel" (ghost)

---

### FASE 5 — Tabuada
**Objetivo:** Experiência de treino focada, sem distrações visuais.

**Arquivos:**
- `app/(app)/tabuada/page.tsx`
- `app/(app)/tabuada/session/page.tsx`
- `app/(app)/tabuada/result/[sessionId]/page.tsx`
- `components/tables/` (todos os 6 arquivos)

**Design:**

#### 5.1 — Overview da Tabuada
- Grid de números 1–10 como cards grandes
- Cada número com seu próprio glass card
- Estado de domínio por cor: incompleto (azul escuro), aprendendo (ice blue), dominado (lime)
- Animação de hover: scale + glow

#### 5.2 — Config Form
- Seleção de tabela(s): chips selecionáveis em design Numetria
- Botão de início: lime verde grande, full-width, com ícone de play

#### 5.3 — Sessão de Treino
- Layout limpo: apenas a questão no centro
- Número grande da tabela em Oddval (64px+)
- Input de resposta: minimalista, com borda lime no focus
- Timer: circular progress ring em azul

**Bug fix:** Input com `inputMode="numeric"` e `pattern="[0-9]*"` para evitar layout shift em iOS.

#### 5.4 — Resultado da Tabuada
- Placar grande em Oddval
- Gráfico de acertos por número da tabela
- Botões de ação claros

---

### FASE 6 — Treino (Training)
**Objetivo:** Sessão de treino intensa e focada. Feedback imediato e satisfatório.

**Arquivos:**
- `app/(app)/train/page.tsx`
- `components/training/ExerciseCard.tsx`
- `components/training/ProgressBar.tsx`
- `components/training/Timer.tsx`
- `components/training/ConfidenceSurveyDialog.tsx`

**Design:**

#### 6.1 — Página de Treino
- Seleção de operações: chips grandes com ícone e cor remapeada
- Config de dificuldade: slider com graduações
- CTA: "Iniciar Treino" em lime verde

#### 6.2 — ExerciseCard
- Full-screen ou card centralizado grande
- Equação em Oddval tamanho 80px+
- Operador com cor da operação
- Input de resposta: input glass com borda reativa
- Transição entre questões: slide horizontal suave

#### 6.3 — ProgressBar
- Barra slim no topo da tela
- Fill com gradiente Blue Harbor → lime
- Animação suave de progresso

#### 6.4 — Timer
- Circular ring progress
- Cores: azul normal, ice blue urgente, lime quando terminando (invertido — fica vermelho apenas em design Numetria como ice blue quase branco)
- Sem pulsação agressiva

#### 6.5 — ConfidenceSurveyDialog
- Dialog glass card
- Rating como stars ou slider
- Design limpo, sem clutter

---

### FASE 7 — Billing e Onboarding
**Objetivo:** Converter e integrar novos usuários com confiança.

**Arquivos:**
- `app/(app)/billing/page.tsx`
- `app/(app)/onboarding/page.tsx`

**Design:**

#### 7.1 — Billing
- Dois cards de plano: Free e Pro
- Plano Pro: glass card com glow em lime verde `#cef26d`, borda mais brilhante
- Badge "Mais popular" ou "Recomendado" em lime
- Lista de features: check em lime, X em muted
- CTA principal: botão lime com texto escuro "Assinar Pro"
- Garantia: texto pequeno em muted

```
┌──────────────────┬────────────────────────────┐
│    Gratuito      │  ✦ Pro                 ★   │  ← glow
│                  │                            │
│  R$ 0/mês        │  R$ X/mês                  │
│                  │                            │
│  ✓ Feature 1     │  ✓ Tudo do gratuito         │
│  ✓ Feature 2     │  ✓ Feature premium 1        │
│  ✗ Feature pro   │  ✓ Feature premium 2        │
│                  │  ✓ Feature premium 3        │
│  [Plano atual]   │  [Assinar Pro →]            │
└──────────────────┴────────────────────────────┘
```

**Bug fix:** Scroll horizontal em mobile — usar `flex-col` em mobile, `flex-row` em md+.

#### 7.2 — Onboarding
- Wizard multi-step com progress steps no topo
- Fase de teste: exercícios diagnósticos com design de treino limpo
- Animações de transição entre fases: slide com fade
- Loading/saving: spinner com logo Numetria animado

**Bug fix iOS Safari:** Usar `dvh` (dynamic viewport height) ao invés de `vh` para evitar bug com URL bar.

---

### FASE 8 — Componentes UI Base
**Objetivo:** Atualizar todos os componentes Shadcn/base para o tema Numetria.

**Arquivos:**
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/input.tsx`
- `components/ui/progress.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/tabs.tsx`

**Variantes Numetria:**

**Button:**
- `primary`: Blue Harbor background, texto branco
- `accent`: Lime verde background, texto `--color-bg-dark`
- `ghost`: Apenas borda glass, texto branco
- `destructive`: Ice Blue (suave, não agressivo)

**Card:**
- Default: `glass-card`
- Elevated: `glass-card` + sombra mais intensa
- Accent: `glass-accent` (tint lime)

**Badge:**
- Remapear todas as variantes para paleta Numetria

**Input:**
- Background: `rgba(13, 29, 58, 0.8)`
- Borda: `rgba(141, 194, 255, 0.15)`
- Focus: borda lime com `box-shadow: 0 0 0 3px rgba(206, 242, 109, 0.2)`
- Texto: branco

**Progress:**
- Track: `rgba(141, 194, 255, 0.1)`
- Fill: gradiente Blue Harbor → lime (para progresso alto)

**Skeleton:**
- Base: `rgba(13, 29, 58, 0.8)`
- Shimmer: gradiente em azul

**Tabs:**
- Ativo: pill com Blue Harbor background
- Inativo: texto muted, sem background

---

### FASE 9 — QA, Bug Fixes e Polimento
**Objetivo:** Zero regressões. Interface consistente em todos os viewports.

#### 9.1 — Checklist de Responsividade
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 768px (iPad Mini)
- [ ] 1024px (iPad Pro / small laptop)
- [ ] 1280px (desktop padrão)
- [ ] 1920px (large desktop)

#### 9.2 — Checklist de Acessibilidade
- [ ] Todos os botões interativos com `aria-label`
- [ ] Focus ring visível em todos os elementos interativos (lime verde)
- [ ] Contraste mínimo WCAG AA para todo texto
- [ ] Cards locked com `aria-disabled="true"` e `tabIndex={-1}`
- [ ] MobileNav com `aria-label="Navegação principal"`
- [ ] Roles corretos para nav, main, sections

#### 9.3 — Performance
- [ ] Skeleton loaders em todos os dados assíncronos
- [ ] `will-change` apenas onde necessário para animações
- [ ] Lazy load de gráficos (Recharts) com Suspense
- [ ] Font Oddval com `font-display: swap`

#### 9.4 — Bugs para Corrigir na Fase 9
Todos os bugs listados na Seção 2 que não foram endereçados nas fases anteriores.

---

## 4. Convenções de Código para o Redesign

### CSS Classes
- Usar CSS custom properties ao invés de hardcoded hex
- Glassmorphism sempre via classe `.glass-card` — não inline
- Animações: preferir `@keyframes` no `globals.css` ao invés de `style={{ animation }}`
- Dark mode via CSS vars (sem `dark:` prefix do Tailwind — o app é dark-first)

### Componentes React
- Props de variante: `variant="primary" | "accent" | "ghost"`
- Sem `className` hardcoded com cores — usar variantes semânticas
- Framer Motion mantido para transições de página e stagger de cards
- `motion/react` para animações de enter/exit

### Nomenclatura
- Brand: sempre "Numetria" (nunca "MindCalc" após a migração)
- Cores: usar nomes da paleta (`--color-accent`, `--color-primary`) nunca nomes Tailwind diretos
- Comentários: documentar os tokens de glassmorphism

---

## 5. Ordem de Prioridade de Execução

```
Fase 1 → Fase 2 → Fase 3 → Fase 8 → Fase 4 → Fase 5 → Fase 6 → Fase 7 → Fase 9
  (DS)   (Nav)   (Dash)   (UI)   (Lessons) (Tab) (Train) (Bill)   (QA)
```

A Fase 8 (componentes UI base) deve ser feita após o dashboard pois o dashboard revela quais padrões de componente são mais necessários.

---

## 6. Critérios de Conclusão

O redesign estará completo quando:

1. **Zero referências visuais ao MindCalc** — nenhum amber/yellow, nenhum "MindCalc" no UI
2. **100% das páginas no tema Numetria** — paleta, fontes, glassmorphism
3. **Todos os bugs listados na Seção 2 corrigidos**
4. **Logo Numetria em todas as superfícies** — navbar, mobile nav, loading, onboarding
5. **Responsivo em todos os viewports** (375px–1920px)
6. **Font Oddval carregando corretamente** como display font
7. **Build passa sem erros** (exceto os pre-existing do PastaFront/)
8. **Recharts completamente tematizado** com a paleta Numetria

---

## Apêndice A — Mapeamento de Assets

| Asset | Origem | Destino |
|-------|--------|---------|
| `Logotipo Numetria.svg` | `brand/Logotipo/` | `public/brand/logo-color.svg` |
| `Logotipo Numetria v2.svg` | `brand/Logotipo/` | `public/brand/logo-dark.svg` |
| `Oddval-SemiBold.ttf` | `brand/Tipografia - fonte/` | `public/fonts/Oddval-SemiBold.woff2` |
| `Oddval-SemiBoldItalic.ttf` | `brand/Tipografia - fonte/` | `public/fonts/Oddval-SemiBoldItalic.woff2` |

> **Nota:** Converter TTF → WOFF2 com `ttf2woff2` ou FontSquirrel Webfont Generator para otimização de carga.

---

## Apêndice B — Tokens de Glassmorphism por Superfície

| Superfície | Background | Border | Blur | Shadow |
|------------|------------|--------|------|--------|
| Card padrão | `rgba(13,29,58,0.6)` | `rgba(141,194,255,0.12)` | `20px` | `0 8px 32px rgba(0,0,0,0.4)` |
| Card elevado | `rgba(18,32,64,0.75)` | `rgba(141,194,255,0.2)` | `24px` | `0 16px 48px rgba(0,0,0,0.5)` |
| Navbar | `rgba(8,15,30,0.85)` | `rgba(141,194,255,0.08)` | `32px` | `0 1px 0 rgba(141,194,255,0.06)` |
| Modal/Dialog | `rgba(8,15,30,0.95)` | `rgba(141,194,255,0.15)` | `40px` | `0 25px 80px rgba(0,0,0,0.7)` |
| Tooltip | `rgba(13,29,58,0.95)` | `rgba(141,194,255,0.1)` | `16px` | `0 4px 16px rgba(0,0,0,0.4)` |
| MobileNav | `rgba(8,15,30,0.95)` | `rgba(141,194,255,0.12)` | `40px` | `0 -4px 30px rgba(0,0,0,0.5)` |

---

*Plano criado em 2026-02-18. Começamos do zero. Numetria.*
