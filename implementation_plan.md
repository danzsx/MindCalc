# Plano de Implementação: Migração de Design NovoFrontEnd → MindCalc

## 1. Resumo Executivo

Migrar o design visual e componentes UI do mockup Vite (NovoFrontEnd) para o projeto Next.js 16 (MindCalc), mantendo toda a arquitetura existente (App Router, Supabase, autenticação, API routes, engine de exercícios).

**Princípio central:** Apenas a camada visual muda. Toda lógica de negócio, busca de dados e integração com Supabase permanece intacta.

---

## 2. Análise Comparativa

### 2.1 Diferenças de Tema

| Aspecto | MindCalc Atual | NovoFrontEnd (Alvo) |
|---------|---------------|---------------------|
| Primary | `#3b82f6` (azul) | `#2DD4BF` (teal/cyan) |
| Secondary | `#1e3a5f` (azul escuro) | `#FDE047` (amarelo) |
| Background | `#0f172a` (dark only) | `#F8FAFC` (light) / `#1E293B` (dark) |
| Card | `#1e293b` | `#FFFFFF` (light) / `#334155` (dark) |
| Success | N/A | `#10B981` (verde) |
| Destructive | `#ef4444` (vermelho) | `#FB923C` (laranja) |
| Border radius | `0.625rem` (10px) | `1.25rem` (20px) |
| Fontes | Geist Sans/Mono | Fredoka (display) + Inter (body) |
| Modo | Dark only | Light + Dark (com toggle) |
| Shadows | Nenhum | Custom shadows com hover |

### 2.2 Diferenças de Componentes shadcn/ui

| Componente | MindCalc | NovoFrontEnd | Ação |
|------------|----------|-------------|------|
| Button | Sim | Sim | Atualizar estilo |
| Card | Sim | Sim | Atualizar estilo |
| Input | Sim | Sim | Atualizar estilo |
| Label | Sim | Sim | Manter |
| Dialog | Nao | Sim | **Copiar** |
| Tabs | Nao | Sim | **Copiar** |
| Progress | Nao | Sim | **Copiar** |
| Badge | Nao | Sim | **Copiar** |
| Tooltip | Nao | Sim | **Copiar** |
| Separator | Nao | Sim | **Copiar** |
| Sonner (toast) | Nao | Sim | **Copiar** |
| Drawer | Nao | Sim | Opcional |
| Sheet | Nao | Sim | **Copiar** (mobile nav) |
| Skeleton | Nao | Sim | **Copiar** (loading states) |
| Switch | Nao | Sim | **Copiar** (theme toggle) |
| Accordion | Nao | Sim | Opcional |

**Nota:** Copiar apenas os componentes efetivamente utilizados, nao todos os 43.

### 2.3 Diferenças de Layout

| Aspecto | MindCalc | NovoFrontEnd |
|---------|----------|-------------|
| Max width | `max-w-4xl` / `max-w-6xl` | `max-w-7xl` |
| Navbar | Desktop only, sem mobile | Desktop + Mobile drawer |
| Padding | `px-4` | `px-6 lg:px-12` |
| Spacing | `space-y-8` | `gap-4 lg:gap-6`, `mb-8` |
| Cards | Flat com border | Rounded-[20px] com shadow + hover |
| Botao CTA | Simples | Shadow + hover translate + min-h-[56px] |

### 2.4 Componentes Novos (NovoFrontEnd)

| Componente | Descricao | Equivalente MindCalc |
|------------|-----------|---------------------|
| `StatsCard` | Card de estatistica com icone circular | `StatsSummary` (redesenhar) |
| `InteractiveSection` | Card de progresso de aulas | `LessonsOverviewCard` (redesenhar) |
| `EvolutionChart` | Grafico com estilo novo | `EvolutionChart` (atualizar estilo) |
| `WeakPointsSection` | Pontos fracos com dica | `WeakPointsList` (redesenhar) |
| `MobileNav` | Menu mobile slide-in | **Novo componente** |
| `LessonsPage` | Lista de aulas com modal | Adaptar visual para sistema existente |
| `TrainingPage` | Treino com design novo | Aplicar visual ao treino existente |
| `BillingPage` | Planos com "Why Pro?" | Atualizar visual |

---

## 3. Arquivos que NAO serao modificados

```
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
lib/supabase/schema.sql
lib/supabase/migrations/*
lib/supabase/seeds/*
lib/engine.ts
lib/lessons/types.ts
lib/lessons/engine.ts
lib/lessons/index.ts
lib/lessons/data/*
app/api/sessions/route.ts
app/api/lessons/complete/route.ts
middleware.ts
types/index.ts
hooks/useAuth.ts
hooks/useTrainingSession.ts
components/providers/AuthProvider.tsx
```

---

## 4. Etapas de Implementacao

### ETAPA 1: Dependencias e Configuracao Base

#### 1.1 Instalar dependencias novas
```bash
npm install next-themes motion sonner vaul @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-progress @radix-ui/react-separator @radix-ui/react-switch @radix-ui/react-tooltip
```

**Justificativa de cada dependencia:**
- `next-themes` — Alternancia entre tema claro/escuro
- `motion` — Animacoes suaves (fade-in, zoom-in em cards)
- `sonner` — Notificacoes toast (feedback de acoes)
- `vaul` — Drawer para mobile navigation
- `@radix-ui/react-dialog` — Modal para aulas interativas
- `@radix-ui/react-tabs` — Abas no modal de aula
- `@radix-ui/react-progress` — Barras de progresso
- `@radix-ui/react-separator` — Separadores visuais
- `@radix-ui/react-switch` — Toggle do tema
- `@radix-ui/react-tooltip` — Tooltips informativos

#### 1.2 Configurar fontes no Next.js

**Arquivo:** `app/layout.tsx`

Adicionar fontes Fredoka e Inter via `next/font/google`:
```tsx
import { Fredoka, Inter } from "next/font/google";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-family-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-family-body" });
```

Aplicar classes no `<html>` tag:
```tsx
<html className={`${fredoka.variable} ${inter.variable}`}>
```

#### 1.3 Atualizar globals.css com novo tema

**Arquivo:** `app/globals.css`

Substituir completamente o bloco `:root` e `.dark` pelo tema do NovoFrontEnd:

```css
:root {
  --radius: 1.25rem;
  --font-size: 16px;
  --font-family-display: var(--font-family-display, 'Fredoka', sans-serif);
  --font-family-body: var(--font-family-body, 'Inter', sans-serif);

  /* Light Mode - MindCalc Calm Tech */
  --background: #F8FAFC;
  --foreground: #1E293B;
  --card: #FFFFFF;
  --card-foreground: #1E293B;
  --popover: #FFFFFF;
  --popover-foreground: #1E293B;
  --primary: #2DD4BF;
  --primary-foreground: #FFFFFF;
  --secondary: #FDE047;
  --secondary-foreground: #1E293B;
  --muted: #F1F5F9;
  --muted-foreground: #94A3B8;
  --accent: #F1F5F9;
  --accent-foreground: #1E293B;
  --destructive: #FB923C;
  --destructive-foreground: #FFFFFF;
  --success: #10B981;
  --success-foreground: #FFFFFF;
  --border: rgba(148, 163, 184, 0.2);
  --input: transparent;
  --input-background: #F1F5F9;
  --ring: #2DD4BF;
  --chart-1: #2DD4BF;
  --chart-2: #10B981;
  --chart-3: #FDE047;
  --chart-4: #FB923C;
  --chart-5: #94A3B8;
}

.dark {
  --background: #1E293B;
  --foreground: #F8FAFC;
  --card: #334155;
  --card-foreground: #F8FAFC;
  --primary: #2DD4BF;
  --primary-foreground: #1E293B;
  --secondary: #FDE047;
  --secondary-foreground: #1E293B;
  --muted: #475569;
  --muted-foreground: #94A3B8;
  --accent: #475569;
  --accent-foreground: #F8FAFC;
  --destructive: #FB923C;
  --destructive-foreground: #FFFFFF;
  --success: #10B981;
  --success-foreground: #FFFFFF;
  --border: rgba(148, 163, 184, 0.2);
  --input: #475569;
  --ring: #2DD4BF;
  --chart-1: #2DD4BF;
  --chart-2: #10B981;
  --chart-3: #FDE047;
  --chart-4: #FB923C;
  --chart-5: #94A3B8;
}
```

Adicionar variaveis `--color-success` e `--color-input-background` no bloco `@theme inline`.

Adicionar tipografia base (h1-h4, p, label, button, input) e animacoes customizadas (fade-in, zoom-in-95, shake, slide-in-left) conforme `NovoFrontEnd/src/styles/`.

#### 1.4 Configurar ThemeProvider com next-themes

**Arquivo:** `components/providers/ThemeProvider.tsx`

Atualizar para usar `next-themes`:
```tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

**Arquivo:** `app/layout.tsx` — Envolver app com ThemeProvider.

---

### ETAPA 2: Copiar Componentes shadcn/ui Necessarios

Copiar os seguintes componentes de `NovoFrontEnd/src/app/components/ui/` para `components/ui/`:

| Arquivo | Usado em |
|---------|----------|
| `dialog.tsx` | Modal de aula |
| `tabs.tsx` | Abas do modal de aula |
| `progress.tsx` | Barras de progresso |
| `badge.tsx` | Status de aulas |
| `separator.tsx` | Separadores |
| `tooltip.tsx` | Dicas informativas |
| `sonner.tsx` | Notificacoes toast |
| `sheet.tsx` | Mobile navigation |
| `skeleton.tsx` | Loading states |
| `switch.tsx` | Toggle de tema |

**Adaptacoes necessarias em cada componente:**
1. Trocar `@/app/components/ui/utils` → `@/lib/utils` (path do cn())
2. Verificar compatibilidade com React 19 (todos os Radix UI suportam)
3. Manter variantes e estilos do NovoFrontEnd

**Atualizar componentes existentes:**
- `components/ui/button.tsx` — Adicionar variante `success`, ajustar border-radius padrao
- `components/ui/card.tsx` — Aplicar `rounded-[20px]` e shadow padrao do NovoFrontEnd
- `components/ui/input.tsx` — Ajustar estilo de foco para usar cor primary teal

---

### ETAPA 3: Atualizar Layout e Navbar

#### 3.1 Navbar redesenhada

**Arquivo:** `components/shared/Navbar.tsx`

Mudancas visuais:
- Sticky header com `bg-card shadow-sm border-b border-border`
- Max width: `max-w-7xl` (era `max-w-6xl`)
- Padding: `px-6 lg:px-12 py-4` (era `px-4`)
- Logo: Usar fonte Fredoka (display) com `text-primary`
- Nav links: Icones maiores (18px), `gap-8` entre logo e nav
- Botao "Assinar Pro" com emoji no desktop (hidden < lg)
- Estilo ativo: `text-foreground bg-muted` com `rounded-lg`
- Hover: `text-primary hover:bg-muted`

**Manter:** Links como `<Link>` do Next.js (nao `<button>` como no mockup).
**Manter:** `usePathname()` para highlight do item ativo.
**Manter:** `<UserMenu />` integrado com autenticacao.

#### 3.2 Novo componente MobileNav

**Arquivo novo:** `components/shared/MobileNav.tsx`

Criar componente mobile navigation baseado em `NovoFrontEnd/src/app/components/MobileNav.tsx`:
- Botao hamburger visivel apenas em `md:hidden`
- Overlay escuro com fade-in
- Drawer lateral com slide-in-left
- Items de navegacao com icones
- Botao "Assinar Pro" separado por border
- Usar `<Link>` do Next.js em vez de `<button>`
- Usar `usePathname()` para item ativo
- Fechar ao navegar (onClick handler)

#### 3.3 Atualizar App Layout

**Arquivo:** `app/(app)/layout.tsx`

- Ajustar max-width do container principal para `max-w-7xl`
- Padding: `px-6 lg:px-12 py-8 lg:py-12`

---

### ETAPA 4: Migrar Dashboard (Prioridade 1)

**Arquivo:** `app/(app)/dashboard/page.tsx`

**MANTER INTACTO:**
- Toda a logica de data fetching (Supabase queries)
- Server Component
- Redirect logic
- Calculo de weakPoints, avgAccuracy, sessions

**ALTERAR VISUAL:**

#### 4.1 Header do Dashboard
```tsx
// DE:
<div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold">Dashboard</h1>
  <Button asChild><Link href="/train">Iniciar Treino</Link></Button>
</div>

// PARA:
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
  <h1 className="text-foreground">Dashboard</h1>
  <Link href="/train"
    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground
    px-6 py-3 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg
    transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium">
    Iniciar Treino
  </Link>
</div>
```

#### 4.2 StatsSummary redesenhado

**Arquivo:** `components/dashboard/StatsSummary.tsx`

Aplicar design do `StatsCard` do NovoFrontEnd:
- Cards individuais com `bg-card rounded-[20px] p-6`
- Shadow: `shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]`
- Hover: `hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)]`
- Icone dentro de circulo colorido (`bg-primary/10 p-3 rounded-full`)
- Valor em `text-foreground text-2xl font-bold` centralizado
- Label em `text-muted-foreground text-sm` centralizado
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6`

**Props mantidas:** `level, streak, avgAccuracy, totalSessions` (dados reais do Supabase).

Icone de Sequencia: usar `text-secondary` (amarelo) no icone Flame.

#### 4.3 LessonsOverviewCard redesenhado

**Arquivo:** `components/dashboard/LessonsOverviewCard.tsx`

Aplicar design do `InteractiveSection` do NovoFrontEnd:
- Card com `bg-card rounded-[20px] p-6 lg:p-8`
- Icone BookOpen com fundo `bg-primary/10 p-2 rounded-lg`
- Barra de progresso com gradiente: `bg-gradient-to-r from-primary to-success`
- Altura da barra: `h-3`
- Background da barra: `bg-primary/20 rounded-full`
- Texto de progresso: `{completed} de {total} aulas`
- Link "Ver Aulas" com estilo: `text-primary hover:text-[#14B8A6]`

**Props mantidas:** `completedCount, totalCount` (dados reais do Supabase).

#### 4.4 EvolutionChart atualizado

**Arquivo:** `components/dashboard/EvolutionChart.tsx`

Aplicar estilos visuais do NovoFrontEnd:
- Card wrapper: `bg-card rounded-[20px] p-6 lg:p-8 shadow-[...]`
- Titulo `h2` com fonte do tema
- Altura do chart: `h-[300px] lg:h-[350px]`
- Cores das linhas: `#2DD4BF` (precisao), `#10B981` (tempo)
- `strokeWidth={3}`, dots com `r={5}`, activeDot `r={7}`
- Grid: `stroke="rgba(148, 163, 184, 0.2)"`
- Tooltip com estilo do card: `borderRadius: '12px'`
- Legend com `paddingTop: '20px'`

**Props mantidas:** `sessions` (dados reais do Supabase).
**Remover Card wrapper externo** do dashboard page (o chart tera seu proprio wrapper).

#### 4.5 WeakPointsList redesenhado

**Arquivo:** `components/dashboard/WeakPointsList.tsx`

Aplicar design do `WeakPointsSection`:
- Card wrapper: `bg-card rounded-[20px] p-6 lg:p-8 shadow-[...]`
- Barra de progresso colorida (laranja se > 40%, verde se <= 40%)
- Altura da barra: `h-3` com `rounded-full`
- Texto do erro: cor dinamica (`#FB923C` ou `#10B981`)
- Secao de dica: `bg-primary/5 rounded-xl border border-primary/20 p-4`
- Emoji de lampada + texto de dica
- Espaco entre items: `space-y-5`

**Props mantidas:** `weakPoints` (dados reais do Supabase).
**Remover Card wrapper externo** do dashboard page.

#### 4.6 Layout do Dashboard

Remover wrappers `<Card>` do dashboard page para cada secao (os componentes terao seus proprios wrappers).

Layout final:
```tsx
<main className="space-y-8">
  {/* Header + CTA */}
  {/* Stats Grid (4 cards) */}
  {/* Aulas Interativas card */}
  {/* Evolucao chart card */}
  {/* Pontos Fracos card */}
</main>
```

---

### ETAPA 5: Migrar Training (Prioridade 2)

**Arquivo:** `app/(app)/train/page.tsx`

**MANTER INTACTO:**
- Client Component (`"use client"`)
- `useTrainingSession()` hook
- `useAuth()` hook
- Toda logica de geracao de exercicios via `generateExercises()`
- Biasing por operacoes fracas e tecnicas aprendidas
- Salvamento de sessao via `/api/sessions`
- Redirect para `/results/[sessionId]`

**ALTERAR VISUAL:**

#### 5.1 Tela de Pre-inicio
- Container centralizado: `flex items-center justify-center min-h-[70vh]`
- Card: `bg-card rounded-[20px] p-8 shadow-[...] max-w-md w-full`
- Texto de nivel: `Nivel atual (${level})`
- Botao "Iniciar Treino": estilo CTA do NovoFrontEnd

#### 5.2 Tela de Exercicio
- Mesmo container centralizado
- Header com titulo "Treino" + timer monospace + botao X para encerrar
- Progresso: `{current} / {total}` centralizado
- Expressao: numeros grandes `text-4xl lg:text-5xl` com operador em `text-primary`
- Input: `bg-muted rounded-xl border-2 border-primary/30 focus:border-primary text-center text-lg`
- Botao "Confirmar": CTA teal com disabled state
- Animacao shake no erro: CSS class `.shake`

#### 5.3 Tela de Salvamento
- Manter spinner atual (dados sendo salvos)

#### 5.4 Resultado
- Nao alterar pagina de resultado (`/results/[sessionId]`) — manter funcionalidade existente, apenas aplicar novos estilos de card e tipografia quando acessada.

---

### ETAPA 6: Migrar Lessons (Prioridade 3)

**Arquivos:**
- `app/(app)/lessons/page.tsx`
- `app/(app)/lessons/[slug]/page.tsx`
- `components/lessons/*`

**MANTER INTACTO:**
- Server Component no `lessons/page.tsx` (fetch de aulas do Supabase)
- Logica de status (completed/available/locked) baseada em lesson_progress
- Sistema de 5 fases do `LessonShell` (intro, guided, semi-guided, free, completion)
- Engine de exercicios de aula (`lib/lessons/engine.ts`)
- API route `/api/lessons/complete`

**ALTERAR VISUAL:**

#### 6.1 Pagina de listagem de aulas (`lessons/page.tsx`)

Aplicar design do `LessonsPage` do NovoFrontEnd:
- Header: `<h1>Aulas Interativas</h1>` + subtitulo
- Lista: `grid gap-4 lg:gap-5`
- Cada aula como card clicavel: `bg-card rounded-[20px] p-6 shadow-[...]`
- Icone da operacao: `w-12 h-12 rounded-xl` com fundo colorido por status
- Status badge com icone (CheckCircle/Circle/Lock) + texto
- Hover: `hover:shadow-[...] hover:-translate-y-1`
- Locked: `opacity-60 cursor-not-allowed`
- Card de progresso no rodape com barra gradiente

**Manter:** `<Link href="/lessons/{slug}">` em vez de modal (sistema atual usa paginas separadas).

#### 6.2 Pagina individual de aula (`lessons/[slug]/page.tsx`)

- Aplicar estilos de card e tipografia do NovoFrontEnd ao `LessonShell`

#### 6.3 Componentes de aula

Atualizar estilos dos seguintes componentes mantendo toda a logica:
- `LessonCard.tsx` — Novo estilo de card com rounded-[20px]
- `LessonIntro.tsx` — Estilo de exemplo com steps numerados
- `LessonExercise.tsx` — Input e botao no estilo NovoFrontEnd
- `LessonStepByStep.tsx` — Steps com numeracao visual
- `LessonCompletion.tsx` — Icone de celebracao + botao CTA
- `LessonPractice.tsx` — Consistencia visual

---

### ETAPA 7: Migrar Billing (Prioridade 4)

**Arquivo:** `app/(app)/billing/page.tsx`

**ALTERAR VISUAL:**

- Header centralizado: `<h1>` + subtitulo
- Grid: `grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto`
- Cards: `bg-card rounded-[20px] p-8 shadow-[...]`
- Plano Pro destacado: `ring-2 ring-primary shadow-[...teal shadow...] md:scale-105`
- Preco: `text-4xl lg:text-5xl font-bold`
- Features com Check/X maiores (`size={20}`)
- Check em `text-success`, X em `text-muted-foreground`
- Botoes CTA: `min-h-[56px] rounded-xl`
- **Novo:** Secao "Por que escolher o Pro?" com `bg-primary/5 rounded-xl border border-primary/20 p-6`
  - Lista com bullet points em `text-primary`

---

### ETAPA 8: Paginas Secundarias

#### 8.1 Landing Page (`app/page.tsx`)
- Aplicar nova paleta de cores (primary teal)
- Atualizar fonte do titulo para Fredoka
- Ajustar feature cards com novo estilo

#### 8.2 Login Page (`app/(auth)/login/page.tsx`)
- Atualizar cores de botao para primary teal
- Ajustar input styles

#### 8.3 Onboarding (`app/(app)/onboarding/page.tsx`)
- Aplicar estilo de exercicio do NovoFrontEnd (expressao grande, input centralizado)

#### 8.4 Results Page (`app/(app)/results/[sessionId]/page.tsx`)
- Aplicar novo estilo de cards e tipografia

---

### ETAPA 9: Polimento Final

#### 9.1 Toggle de Tema
- Adicionar botao de toggle claro/escuro no `UserMenu` ou na Navbar
- Usar `useTheme()` do `next-themes`
- Icone: Sol/Lua com `Switch` component

#### 9.2 Loading States
- Adicionar `Skeleton` components para estados de carregamento
- Dashboard: skeleton cards + skeleton chart
- Lessons: skeleton list items

#### 9.3 Toast Notifications
- Configurar `<Toaster />` do sonner no root layout
- Usar para feedback de acoes (aula concluida, sessao salva, erros)

#### 9.4 Animacoes
- Fade-in nos cards ao carregar pagina
- Hover elevacao nos cards interativos
- Shake no input de resposta errada

---

## 5. Mapeamento Detalhado de Arquivos

### Arquivos a CRIAR:
```
components/shared/MobileNav.tsx          ← Novo (baseado em NovoFrontEnd)
components/ui/dialog.tsx                 ← Copiar do NovoFrontEnd
components/ui/tabs.tsx                   ← Copiar do NovoFrontEnd
components/ui/progress.tsx               ← Copiar do NovoFrontEnd
components/ui/badge.tsx                  ← Copiar do NovoFrontEnd
components/ui/separator.tsx              ← Copiar do NovoFrontEnd
components/ui/tooltip.tsx                ← Copiar do NovoFrontEnd
components/ui/sonner.tsx                 ← Copiar do NovoFrontEnd
components/ui/sheet.tsx                  ← Copiar do NovoFrontEnd
components/ui/skeleton.tsx               ← Copiar do NovoFrontEnd
components/ui/switch.tsx                 ← Copiar do NovoFrontEnd
```

### Arquivos a MODIFICAR (apenas visual):
```
app/globals.css                          ← Novo tema completo
app/layout.tsx                           ← Fontes + ThemeProvider
app/(app)/layout.tsx                     ← Max-width + padding
app/(app)/dashboard/page.tsx             ← Layout visual (manter data fetching)
app/(app)/train/page.tsx                 ← Estilo visual (manter logica)
app/(app)/lessons/page.tsx               ← Estilo visual (manter data fetching)
app/(app)/lessons/[slug]/page.tsx        ← Estilo visual
app/(app)/billing/page.tsx               ← Novo design + secao "Why Pro?"
app/(app)/onboarding/page.tsx            ← Estilo visual
app/(app)/results/[sessionId]/page.tsx   ← Estilo visual
app/(auth)/login/page.tsx                ← Cores e estilo
app/page.tsx                             ← Cores e estilo
components/shared/Navbar.tsx             ← Redesenho completo
components/shared/UserMenu.tsx           ← Estilo visual
components/dashboard/StatsSummary.tsx    ← Redesenho (manter props)
components/dashboard/EvolutionChart.tsx  ← Estilo do chart (manter props)
components/dashboard/WeakPointsList.tsx  ← Redesenho (manter props)
components/dashboard/LessonsOverviewCard.tsx ← Redesenho (manter props)
components/lessons/LessonCard.tsx        ← Estilo visual
components/lessons/LessonShell.tsx       ← Estilo visual
components/lessons/LessonIntro.tsx       ← Estilo visual
components/lessons/LessonExercise.tsx    ← Estilo visual
components/lessons/LessonCompletion.tsx  ← Estilo visual
components/lessons/LessonStepByStep.tsx  ← Estilo visual
components/lessons/LessonPractice.tsx    ← Estilo visual
components/ui/button.tsx                 ← Ajustar variantes
components/ui/card.tsx                   ← Ajustar border-radius e shadow
components/ui/input.tsx                  ← Ajustar estilo de foco
components/providers/ThemeProvider.tsx    ← next-themes
```

### Arquivos que NAO serao tocados:
```
middleware.ts
types/index.ts
lib/engine.ts
lib/utils.ts
lib/supabase/*
lib/lessons/*
app/api/*
hooks/*
components/providers/AuthProvider.tsx
components/training/ExerciseCard.tsx      ← Manter logica, ajustar visual via CSS global
components/training/Timer.tsx
components/training/ProgressBar.tsx
components/training/Keypad.tsx
```

---

## 6. Ordem de Execucao

```
FASE 1 - Base (Etapas 1-2)
  1.1 Instalar dependencias
  1.2 Configurar fontes
  1.3 Atualizar globals.css (tema completo)
  1.4 Configurar ThemeProvider
  2.1 Copiar componentes shadcn/ui necessarios
  2.2 Atualizar componentes existentes (button, card, input)

FASE 2 - Layout (Etapa 3)
  3.1 Redesenhar Navbar
  3.2 Criar MobileNav
  3.3 Atualizar App Layout

FASE 3 - Dashboard (Etapa 4)
  4.1 Atualizar header + CTA
  4.2 Redesenhar StatsSummary
  4.3 Redesenhar LessonsOverviewCard
  4.4 Atualizar EvolutionChart
  4.5 Redesenhar WeakPointsList
  4.6 Ajustar layout do dashboard page

FASE 4 - Training (Etapa 5)
  5.1 Redesenhar tela de pre-inicio
  5.2 Redesenhar tela de exercicio
  5.3 Manter tela de salvamento

FASE 5 - Lessons (Etapa 6)
  6.1 Redesenhar pagina de listagem
  6.2 Atualizar pagina individual
  6.3 Atualizar componentes de aula

FASE 6 - Billing + Secundarias (Etapas 7-8)
  7.1 Redesenhar pagina de billing
  8.1 Atualizar landing page
  8.2 Atualizar login page
  8.3 Atualizar onboarding
  8.4 Atualizar results page

FASE 7 - Polimento (Etapa 9)
  9.1 Toggle de tema
  9.2 Loading states
  9.3 Toast notifications
  9.4 Animacoes
```

---

## 7. Checklist de Validacao

Apos cada fase, verificar:

- [ ] `npm run build` compila sem erros
- [ ] Autenticacao funciona (login/logout)
- [ ] Rotas protegidas redirecionam corretamente
- [ ] Dados sao carregados do Supabase (nao mockados)
- [ ] Dashboard mostra dados reais (nivel, streak, accuracy, sessions)
- [ ] Grafico de evolucao renderiza com dados reais
- [ ] Pontos fracos calculados a partir de exercise_logs reais
- [ ] Treino gera exercicios com biasing correto
- [ ] Sessao de treino salva no banco via `/api/sessions`
- [ ] Aulas interativas funcionam (5 fases)
- [ ] Conclusao de aula salva via `/api/lessons/complete`
- [ ] Aulas bloqueiam/desbloqueiam corretamente
- [ ] Navegacao mobile funciona
- [ ] Tema claro/escuro funciona
- [ ] Responsividade em mobile/tablet/desktop
- [ ] Nenhum dado mockado remanescente

---

## 8. Riscos e Mitigacoes

| Risco | Mitigacao |
|-------|-----------|
| Radix UI incompativel com React 19 | Radix UI ja suporta React 19 desde v1.1+ |
| next-themes conflita com SSR | Usar `suppressHydrationWarning` no `<html>` tag |
| Recharts v3 vs v2 (NovoFrontEnd usa v2) | Manter Recharts v3 do projeto atual, ajustar apenas estilos |
| Fontes FOUT (flash of unstyled text) | Usar `next/font` com `display: 'swap'` |
| CSS custom properties nao aplicam | Verificar ordem de imports no globals.css |
| Componentes shadcn/ui com paths errados | Trocar todos `@/app/components/ui/utils` para `@/lib/utils` |

---

## 9. Dependencias que NAO serao instaladas

O NovoFrontEnd inclui muitas dependencias que sao desnecessarias para a migracao:

- `@emotion/react`, `@emotion/styled` — CSS-in-JS nao necessario (usando Tailwind)
- `@mui/material`, `@mui/icons-material` — Nao usado, conflita com shadcn/ui
- `react-dnd`, `react-dnd-html5-backend` — Drag & drop nao necessario
- `react-slick`, `embla-carousel-react` — Carroseis nao usados
- `react-responsive-masonry` — Masonry nao usado
- `react-resizable-panels` — Paineis redimensionaveis nao usados
- `@popperjs/core`, `react-popper` — Radix UI ja tem posicionamento
- `cmdk` — Command menu nao usado
- `input-otp` — OTP nao usado
- `react-hook-form` — Forms atuais nao precisam
- `date-fns`, `react-day-picker` — Calendario nao usado
- `@radix-ui/react-accordion` — Nao usado nas paginas
- `@radix-ui/react-alert-dialog` — Nao usado
- `@radix-ui/react-aspect-ratio` — Nao usado
- `@radix-ui/react-avatar` — Nao usado
- `@radix-ui/react-checkbox` — Nao usado
- `@radix-ui/react-collapsible` — Nao usado
- `@radix-ui/react-context-menu` — Nao usado
- `@radix-ui/react-dropdown-menu` — Nao usado
- `@radix-ui/react-hover-card` — Nao usado
- `@radix-ui/react-menubar` — Nao usado
- `@radix-ui/react-navigation-menu` — Nao usado
- `@radix-ui/react-popover` — Nao usado
- `@radix-ui/react-radio-group` — Nao usado
- `@radix-ui/react-scroll-area` — Nao usado
- `@radix-ui/react-select` — Nao usado
- `@radix-ui/react-slider` — Nao usado
- `@radix-ui/react-toggle` — Nao usado
- `@radix-ui/react-toggle-group` — Nao usado
