# MindCalc — Plano de Redesign (Mobile-First)

> **Objetivo**: Aplicar o novo design visual inspirado na pasta `Novo design para web app/` ao projeto atual, sem alterar lógica, data-fetching, hooks ou integrações Supabase/Stripe. Apenas CSS, classes, layout e componentes visuais.

---

## 1. VISÃO GERAL DO NOVO DESIGN

### 1.1 Identidade Visual (Extraída da Referência)

| Aspecto | Atual | Novo Design |
|---------|-------|-------------|
| **Background** | Light (#F8FAFC) | Dark gradient: `from-slate-900 via-teal-950 to-cyan-950` |
| **Texto principal** | Dark (#1E293B) | White (`text-white`) |
| **Texto secundário** | Muted gray | `text-white/60`, `text-white/50` |
| **Font display** | Fredoka | **Space Grotesk** (bold, modern, geométrica) |
| **Font body** | Inter | Inter (mantém) |
| **Cards** | bg-white, shadow | Glassmorphism: `bg-white/5 backdrop-blur-xl border border-white/10` |
| **Cards hover** | shadow-lg | `hover:bg-white/10` + glow blur effect |
| **Border radius** | 20px (--radius) | `rounded-3xl` (24px) padrão |
| **Botões primários** | bg-primary solid | `bg-gradient-to-r from-teal-500 to-cyan-500` |
| **Ícones** | Em circles com bg-primary/10 | Em boxes gradient `bg-gradient-to-br from-X to-Y p-3 rounded-2xl` |
| **Gradientes por operação** | Não definidos | Adição: emerald→teal, Subtração: orange→red, Multiplicação: blue→purple, Divisão: yellow→orange |
| **Animações** | CSS fade-in, stagger | Framer Motion (`motion/react`) com `initial/animate/transition` |
| **Glow effects** | Não tem | `absolute inset-0 bg-gradient-to-br ... opacity-10 blur-2xl` |
| **Progress bars** | Simple solid | Gradient + shimmer animation |
| **Mobile nav** | Hamburger menu (sheet) | Bottom floating bar: `fixed bottom-6 left-6 right-6 rounded-3xl` |

### 1.2 Paleta de Cores Primária

```
Teal principal:    from-teal-500 to-cyan-500  (CTAs, accent, nav ativo)
Teal hover:        from-teal-400 to-cyan-400
Stats - Sequência: from-orange-500 to-red-500
Stats - Precisão:  from-teal-500 to-cyan-500
Stats - XP:        from-emerald-500 to-teal-500
Stats - Treinos:   from-yellow-500 to-orange-500
Fraquezas:         from-pink-500 to-purple-500
Tabuada:           from-blue-500 to-purple-500
```

### 1.3 Tipografia

```css
/* Display (títulos de página) */
font-family: 'Space Grotesk', sans-serif;
font-weight: 700;
/* H1: text-5xl md:text-7xl */
/* H2: text-2xl md:text-3xl */
/* H3: text-xl md:text-2xl */

/* Body */
font-family: 'Inter', sans-serif;
/* p: text-xl (hero subtitle) */
/* p: text-sm (descriptions) */
/* span: text-xs (labels, captions) */
```

---

## 2. FASES DE IMPLEMENTAÇÃO

### FASE 0 — Fundação (globals.css + fonts + dependências)
> **Escopo**: Atualizar design tokens, carregar nova font, instalar framer-motion

**Arquivos**:
- `app/globals.css` — Reescrever variáveis CSS e @theme
- `app/layout.tsx` — Adicionar font Space Grotesk via next/font/google

**Tarefas**:
1. Adicionar `Space Grotesk` via `next/font/google` no layout root
2. Atualizar `globals.css`:
   - Mudar `--background` para cor dark (`slate-900` base)
   - Mudar `--foreground` para white
   - Mudar `--card` para transparent/glassmorphism
   - Atualizar `--primary` para teal-500
   - Adicionar variáveis de gradiente por operação
   - Adicionar keyframe `shimmer` para progress bars
   - Adicionar classe `.animate-shimmer`
3. Instalar `motion` (framer-motion v11+): `npm install motion`
4. Manter todos os spacing tokens existentes (--space-xs até --space-3xl)

**Regra**: NÃO alterar nenhum componente ainda. Só fundação.

---

### FASE 1 — App Shell (Layout + Navbar + Mobile Nav)
> **Escopo**: Mudar o esqueleto do app — header, navegação, fundo global

**Arquivos**:
- `app/(app)/layout.tsx`
- `components/shared/Navbar.tsx`
- `components/shared/MobileNav.tsx` (ou criar novo)

**Tarefas**:

#### 1.1 Layout (`app/(app)/layout.tsx`)
- Background: `min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white`
- Manter `max-w-7xl mx-auto` container
- Padding: `p-6 md:p-8 pb-32 md:pb-8` (pb-32 no mobile para floating nav)

#### 1.2 Navbar Desktop (`components/shared/Navbar.tsx`)
- Fundo: `bg-slate-900/80 backdrop-blur-xl border-b border-white/10`
- Logo: ícone Sparkles em box gradient teal + "MindCalc" em Space Grotesk
- Nav links: pills com `px-5 py-2.5 rounded-xl`
  - Ativo: `bg-white/15 text-white shadow-lg`
  - Inativo: `text-white/60 hover:text-white hover:bg-white/5`
- Actions (direita): bell icon + avatar com gradient circle + "Assinar Pro" button gradient
- Preservar: lógica de roteamento, usePathname, links existentes

#### 1.3 Mobile Nav (Bottom Bar)
- **Substituir** hamburger menu por bottom floating bar
- Posição: `fixed bottom-6 left-6 right-6 z-50`
- Container: `bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-2`
- Glow: div absolute com gradient opacity-20 blur-xl
- Items: `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl`
  - Ativo: `bg-gradient-to-r from-teal-500 to-cyan-500 text-white`
  - Inativo: `text-white/60`
- 4-5 items: Painel, Aulas, Tabuada, Treinar (Planos opcional no mobile)
- Preservar: onClick navegação, currentPage highlight

**LÓGICA PRESERVADA**: Toda lógica de auth, redirect, children rendering no layout.

---

### FASE 2 — Dashboard
> **Escopo**: Redesign completo da página principal

**Arquivos**:
- `app/(app)/dashboard/page.tsx`
- `app/(app)/dashboard/loading.tsx`
- `components/dashboard/StatsSummary.tsx`
- `components/dashboard/EvolutionChart.tsx`
- `components/dashboard/WeakPointsList.tsx`
- `components/dashboard/LessonsOverviewCard.tsx`
- `components/dashboard/TablesCard.tsx`
- `components/dashboard/ConfidenceCard.tsx`

**Tarefas**:

#### 2.1 Hero Section (no page.tsx)
- Título grande: `text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent`
- Font: Space Grotesk
- Subtítulo: `text-xl text-white/60`

#### 2.2 Stats Grid (`StatsSummary.tsx`)
- Layout: `grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6`
- Cada card:
  - Glow effect: absolute div com gradient + blur-xl + opacity-10
  - Card: `bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15`
  - Ícone: `inline-flex p-3 rounded-2xl bg-gradient-to-br from-X to-Y`
  - Valor: `text-4xl font-bold` Space Grotesk
  - Label: `text-sm text-white/70`
- Cores por stat: cada um com gradiente próprio (orange, teal, emerald, yellow)
- **Wrap com motion.div** para animação staggered

#### 2.3 Bento Grid Principal
- Layout: `grid lg:grid-cols-3 gap-6`
- **Card "Aulas" (col-span-2)**:
  - Glassmorphism card com glow
  - Ícone BookOpen em box gradient
  - Título "Aulas Interativas" em Space Grotesk
  - Barra de progresso com gradient + shimmer
  - Botão CTA: gradient teal com hover shadow
- **Card "Tabuada Turbo" (1 col)**:
  - Ícone Grid3x3 em box gradient blue→purple
  - Título + melhor tempo
  - Botão gradient blue→purple

#### 2.4 Seção "Áreas para Melhorar" (`WeakPointsList.tsx`)
- Card glassmorphism com glow pink→purple
- Ícone Award em box gradient
- Dica personalizada em sub-card `bg-white/5 rounded-2xl p-5`
- Progress bars: gradient colors por operação + motion.div animated width
- Grid: `grid md:grid-cols-2 gap-4`

#### 2.5 Chart e Cards Secundários
- EvolutionChart: adaptar cores do Recharts para teal/cyan/white
- ConfidenceCard: glassmorphism style
- TablesCard: glassmorphism + progress indicator

#### 2.6 Loading State (`loading.tsx`)
- Skeleton com `bg-white/5 animate-pulse rounded-3xl` em vez de bg-gray

**LÓGICA PRESERVADA**: Todas as queries Supabase server-side, data transformation, Promise.all(), props passadas aos componentes.

---

### FASE 3 — Página de Aulas (Lessons)
> **Escopo**: Catálogo de aulas com novo design

**Arquivos**:
- `app/(app)/lessons/page.tsx`
- `components/lessons/LessonCard.tsx`

**Tarefas**:

#### 3.1 Hero Section
- Badge animada: `px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20` com dot pulsante
- Título grande com gradient text (Space Grotesk)
- Subtítulo em `text-white/60`

#### 3.2 Progresso Geral
- Card glassmorphism full-width
- Título "Progresso Geral" + percentual grande `text-5xl font-bold text-teal-400`
- Barra: `h-4 bg-white/5 rounded-full` com inner gradient + shimmer

#### 3.3 Category Sections
- Cada categoria (Adição, Subtração, Multiplicação, Divisão):
  - Header: ícone em box gradient + título `text-3xl md:text-4xl` Space Grotesk + descrição
  - Badge de progresso: percentual em teal-400 + "X/Y concluídas"
  - Mobile: barra de progresso compacta
  - Grid de lesson cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

#### 3.4 Lesson Card (`LessonCard.tsx`)
- Glassmorphism card com hover lift (`whileHover scale 1.02, y -4`)
- Header visual: `h-32 relative` com ícone grande centralizado em box gradient
- Status badges:
  - Completed: `bg-teal-500 p-2 rounded-full` com CheckCircle2 (top-right)
  - Locked: `bg-white/10 p-2 rounded-full` com Lock
- Dificuldade: `text-xs px-3 py-1 rounded-full` (easy=emerald, medium=yellow, hard=red)
- Duração: `text-xs text-white/50`
- Botão:
  - Available: gradient da operação
  - Completed: `bg-white/10 hover:bg-white/15`
  - Locked: `bg-white/5 text-white/40 cursor-not-allowed` + opacity-60 no card

**LÓGICA PRESERVADA**: useAuth, Supabase queries (lessons + lesson_progress), categorização, useMemo, useRouter.

---

### FASE 4 — Lesson Player (Lesson View)
> **Escopo**: Redesign da tela de aula individual

**Arquivos**:
- `components/lessons/LessonShell.tsx`
- `components/lessons/LessonProgressIndicator.tsx`
- `components/lessons/LessonIntro.tsx`
- `components/lessons/LessonStepByStep.tsx`
- `components/lessons/LessonExercise.tsx`
- `components/lessons/LessonPractice.tsx`
- `components/lessons/LessonCompletion.tsx`
- `components/lessons/LessonHint.tsx`

**Tarefas**:

#### 4.1 Header
- Botão voltar: `bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl` com ArrowLeft
- Título da aula: Space Grotesk + subtítulo "Aula básica • X minutos"
- Mobile: título centralizado abaixo do header

#### 4.2 Progress Stepper
- Steps circulares: `w-14 h-14 rounded-full`
  - Completed: `bg-gradient-to-br from-teal-500 to-cyan-500 border-2 border-teal-400`
  - Current: mesmo + `shadow-lg shadow-teal-500/50` + glow pulse
  - Upcoming: `bg-white/5 border-2 border-white/20`
- Labels: `text-sm mt-3 font-medium`
- Connecting lines: `h-0.5 bg-white/10` com animated fill gradient

#### 4.3 Lesson Content Area
- Título: `text-4xl md:text-5xl font-bold text-center` Space Grotesk
- Tip card: glassmorphism com ícone Info em box gradient
- Visual examples: manter lógica interativa, atualizar container visual
- Botão next: gradient teal + seta com translate-x animation

#### 4.4 Completion Screen
- Emoji grande (`text-8xl`) com spring animation
- Título "Missão Cumprida!" Space Grotesk
- Stats: XP e Precisão em `bg-white/5 px-6 py-4 rounded-2xl`

**LÓGICA PRESERVADA**: Todas as fases da aula, access control, admin bypass, interactive components (PizzaFraction, NumberBar, etc.), lesson state machine.

---

### FASE 5 — Treinar (Training)
> **Escopo**: Tela de configuração e sessão de treino

**Arquivos**:
- `app/(app)/train/page.tsx`
- `components/training/ExerciseCard.tsx`
- `components/training/Timer.tsx`
- `components/training/CountdownTimer.tsx`
- `components/training/ProgressBar.tsx`
- `components/training/ConfidenceSurveyDialog.tsx`

**Tarefas**:

#### 5.1 Pré-start (Mode Selector)
- Card centralizado `max-w-2xl mx-auto` glassmorphism
- Título "Treino Mental" `text-4xl md:text-5xl font-bold` Space Grotesk
- Subtítulo com nível do user
- Cards de modo: `grid md:grid-cols-2 gap-4`
  - Cada um: `p-8 rounded-2xl border-2`
  - Selected: `border-teal-400 bg-teal-500/10` + glow absoluto
  - Ícone: grande em box gradient (Smile=teal, Clock=orange)
  - Título: `text-2xl font-bold` Space Grotesk
- Botão "Bora treinar": gradient teal, full-width, `py-5 rounded-2xl font-bold text-lg`

#### 5.2 Durante o Treino
- ExerciseCard: manter layout grande dos números, atualizar cores para white-on-dark
- Timer: estilizar para dark theme
- ProgressBar: gradient com shimmer
- Input: adaptar para dark theme (`bg-white/5 border-white/10`)

#### 5.3 Estado Bloqueado (Daily Limit)
- Card informativo glassmorphism com CTA para billing

**LÓGICA PRESERVADA**: useTrainingSession hook, submitAnswer, shake animation, countdown timer, session check API, keyboard input, daily limit logic.

---

### FASE 6 — Tabuada
> **Escopo**: Configuração + sessão de tabuada

**Arquivos**:
- `app/(app)/tabuada/page.tsx`
- `components/tables/TablesConfigForm.tsx`
- `components/tables/TablesQuestionCard.tsx`
- `components/tables/TablesSessionSummary.tsx`
- `components/tables/TablesProgressBar.tsx`
- `components/tables/TablesFeedback.tsx`

**Tarefas**:

#### 6.1 Config Page
- Hero: título "Tabuada" `text-5xl md:text-6xl` gradient text, Space Grotesk
- Card centralizado `max-w-2xl` glassmorphism
- Operation selector: `grid grid-cols-2 md:grid-cols-4 gap-3`
  - Cada: `p-6 rounded-2xl border-2` com ícone em box gradient
  - Selected: `border-teal-400 bg-white/10`
- Range selector: `grid grid-cols-3 gap-3` com pills
- Mode selector: cards verticais com ícone + título + descrição
- Botão "Bora começar": gradient full-width

#### 6.2 Session e Results
- Question card: adaptar para dark theme
- Feedback: manter lógica, atualizar cores
- Summary: glassmorphism cards com stats

**LÓGICA PRESERVADA**: useState config, navigation, session logic, question generation.

---

### FASE 7 — Billing/Planos
> **Escopo**: Página de planos e assinatura

**Arquivos**:
- `app/(app)/billing/page.tsx`

**Tarefas**:

#### 7.1 Hero
- Título "Seu plano" gradient text, Space Grotesk
- Subtítulo `text-white/60`

#### 7.2 Plan Cards (`grid md:grid-cols-2 gap-6 max-w-5xl mx-auto`)
- **Free Plan**:
  - Glassmorphism simples `bg-white/5 border border-white/10 rounded-3xl p-8`
  - Badge "Atual" em `bg-white/10 border border-white/20 rounded-full`
  - Preço: `text-5xl font-bold`
  - Features: Check icon em `bg-teal-500/20 rounded-full` ou X icon em `bg-white/5`
  - Botão disabled: `border-2 border-white/20 bg-white/5 text-white/50`

- **Pro Plan**:
  - Glow: absolute gradient teal opacity-20 blur-2xl
  - Card: `bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-2 border-teal-500/30`
  - Badge "Popular" gradient teal com Sparkles icon
  - Features: todas com Check verde
  - Botão: gradient teal com hover shadow

#### 7.3 Benefits Section
- Card glassmorphism com título "O que muda com o Pro?"
- Grid `md:grid-cols-2 gap-6` com ícones em box gradient + texto

**LÓGICA PRESERVADA**: Stripe checkout, portal, toast notifications, plan comparison logic.

---

### FASE 8 — Componentes UI Base (shadcn)
> **Escopo**: Atualizar primitivos UI para dark theme

**Arquivos**:
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/dialog.tsx`
- `components/ui/progress.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/badge.tsx`
- `components/ui/tabs.tsx`

**Tarefas**:
- Button: variantes com gradients (primary=teal gradient, secondary=white/10, ghost=white/5)
- Card: glassmorphism base (`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl`)
- Input: `bg-white/5 border-white/10 text-white placeholder:text-white/40`
- Dialog: dark backdrop, glassmorphism content
- Progress: gradient fill + shimmer
- Skeleton: `bg-white/5 animate-pulse`
- Badge: variants com cores por operação
- Tabs: pills style com active gradient

---

### FASE 9 — Páginas Secundárias
> **Escopo**: Onboarding, Results, Session pages

**Arquivos**:
- `app/(app)/onboarding/page.tsx`
- `app/(app)/results/[sessionId]/page.tsx`
- `app/(app)/tabuada/session/page.tsx`
- `app/(app)/tabuada/result/[sessionId]/page.tsx`

**Tarefas**:
- Aplicar dark theme + glassmorphism pattern consistente
- Manter toda lógica de data fetching e state

---

### FASE 10 — Auth Page
> **Escopo**: Tela de login

**Arquivos**:
- `app/(auth)/login/page.tsx`

**Tarefas**:
- Background: dark gradient matching
- Card: glassmorphism centered
- Inputs: dark theme
- Botão: gradient teal
- Logo: Space Grotesk

---

## 3. REGRAS DE IMPLEMENTAÇÃO

### O QUE MUDAR
- Classes CSS / Tailwind (cores, backgrounds, borders, shadows, radius)
- Font families (adicionar Space Grotesk para displays)
- Layout grids (adaptar para novo bento layout)
- Animações (adicionar Framer Motion wrappers)
- Mobile navigation (substituir hamburger por bottom bar)
- Glow/blur effects (adicionar divs decorativos)

### O QUE NÃO MUDAR
- Nenhuma query Supabase (server ou client)
- Nenhum hook (useAuth, useTrainingSession, etc.)
- Nenhuma API route
- Nenhuma lógica de state (useState, useMemo, useEffect)
- Nenhum router.push ou navegação
- Nenhuma validação ou business logic
- Nenhum type/interface
- Nenhum interactive component interno (PizzaFraction, NumberBar, etc.) — só wrappers visuais

### PADRÃO DE CARD GLASSMORPHISM
```tsx
<div className="relative group">
  {/* Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-X to-Y rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />
  {/* Card */}
  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
    {/* Content */}
  </div>
</div>
```

### PADRÃO DE MOTION WRAPPER
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.X }}
>
  {/* Content */}
</motion.div>
```

### MOBILE-FIRST BREAKPOINTS
```
Base (mobile):  p-6, text-5xl titles, grid-cols-1, grid-cols-2 (stats)
md (tablet):    p-8, text-7xl titles, grid-cols-2 (cards), grid-cols-4 (stats)
lg (desktop):   grid-cols-3 (bento), navigation desktop
```

---

## 4. DEPENDÊNCIAS A INSTALAR

```bash
npm install motion
# motion = framer-motion v11+ (novo nome do pacote)
# Importar como: import { motion } from 'motion/react'
```

Font Space Grotesk via next/font:
```tsx
import { Space_Grotesk } from 'next/font/google'
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
```

---

## 5. ESTIMATIVA DE ARQUIVOS POR FASE

| Fase | Arquivos | Prioridade |
|------|----------|-----------|
| 0 - Fundação | 2-3 | CRÍTICA |
| 1 - App Shell | 3-4 | CRÍTICA |
| 2 - Dashboard | 7-8 | ALTA |
| 3 - Lessons | 2-3 | ALTA |
| 4 - Lesson Player | 7-8 | MÉDIA |
| 5 - Treinar | 5-6 | ALTA |
| 6 - Tabuada | 5-6 | MÉDIA |
| 7 - Billing | 1-2 | MÉDIA |
| 8 - UI Base | 8 | MÉDIA |
| 9 - Secundárias | 4 | BAIXA |
| 10 - Auth | 1 | BAIXA |
| **TOTAL** | **~50 arquivos** | |

---

## 6. ORDEM DE EXECUÇÃO RECOMENDADA

```
Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 5 → Fase 6 → Fase 7 → Fase 4 → Fase 8 → Fase 9 → Fase 10
```

Justificativa: Fundação e shell primeiro (afetam tudo), depois páginas mais usadas (dashboard, lessons, train), depois secundárias.

---

## 7. CHECKLIST DE VALIDAÇÃO POR FASE

Após cada fase, verificar:
- [ ] Build sem erros (`npm run build` — ignorar erros PastaFront/)
- [ ] Mobile responsivo (320px, 375px, 428px)
- [ ] Tablet (768px)
- [ ] Desktop (1280px, 1440px)
- [ ] Navegação funcional (todos os links)
- [ ] Data rendering correto (dados do Supabase aparecem)
- [ ] Animações fluidas (sem jank)
- [ ] Contraste de texto legível (white on dark)
- [ ] Interações preservadas (clicks, inputs, submits)
