I am writing a prompt to use in Replit Design Mode: an ai agent specialized in designing beautiful landing pages. In addition to React/ Shadcn/ Tailwind code generation , this agent can also generate images, short videos and get stock photos from the internet.

I need to give enough context to it so that it generates a design that matches my expectations.

See below the description that I have so far for this web app mobile first app. As you will see, this is lacking some style guidelines.



# MindCalc — Descrição Visual Completa

## Design System
- **Background**: `#0f172a` (dark slate)
- **Primary**: Teal-Cyan gradient · **Glassmorphism**: `bg-white/5 backdrop-blur-xl border-white/10`
- **Fonts**: Space Grotesk (display) / Inter (body)
- **Cards**: `rounded-3xl`, glow layer + blur + border
- **Animações**: fade-up, shimmer em progress bars, confetti, hover lift

---

## 1. Landing Page (`/`)

### Hero
- **Badge**: Pulsing dot + "Matemática mental sem complicação"
- **H1**: "Cálculo mental **sem travar** do jeito que faz sentido" (gradient teal-purple)
- **CTA**: "Começar do jeito fácil" (gradient button, ArrowRight)
- **Decorativo**: Símbolos flutuantes (+, ÷, 7, ×)

### Benefícios (grid 3 colunas)
| Column 1: Card | Column 2: Card | Column 3: Card |
|---|---|---|
| Icon: TrendingUp (Lucide) | Icon: Sparkles (Lucide) | Icon: Brain (Lucide) |
| Title h3: **Se adapta a você** | Title h3: **Você vê sua evolução** | Title h3: **IA que te ajuda a pensar** |
| Desc: Exercícios no seu nível | Desc: Acompanhe seu progresso | Desc: Dicas contextuais |

### Depoimentos (grid 2×2)
4 cards com avatar (gradiente + inicial), nome, cargo, citação

### Macetes (2 colunas)
- **Esquerda**: Título + 4 bullets com Check (verde)
- **Direita**: Demo card "Multiplicar por 5?" com steps visuais

### Para quem é (grid 2×2)
| 🙋‍♀️ Quem trava com contas | 💼 Profissionais do dia a dia |
| 😰 Quem tem ansiedade com números | 🎯 Quem quer ser mais rápido |

### CTA Final
- **H2**: "Pronto para parar de travar com números?"
- **Botão**: Gradient com sombra · "Grátis para sempre · Sem cartão"

---

## 2. Login (`/login`)

- Card centralizado com glow
- Icon: **Brain** (Lucide) em círculo gradiente
- **H1**: "MindCalc" · Badge: Sparkles + "Aprenda brincando"
- Input email (Mail icon) + Input senha (Lock icon)
- Botão "Entrar" (LogIn, gradiente) · Divider "ou" · "Criar conta" (UserPlus, glass)

---

## 3. Dashboard (`/dashboard`)

### Hero
- **H1**: "Olá, {nome}!" (gradient text, 5xl-7xl)
- **Sub**: "Pronto para turbinar seu cérebro hoje?"

### Stats Grid (4 cards)
| Card | Card | Card | Card |
|---|---|---|---|
| Icon: Flame (Lucide) | Icon: Target (Lucide) | Icon: TrendingUp (Lucide) | Icon: Zap (Lucide) |
| Gradient: orange-red | Gradient: teal-cyan | Gradient: emerald-teal | Gradient: yellow-orange |
| Metric: **7** | Metric: **85%** | Metric: **3** | Metric: **42** |
| Label: Sequência | Label: Precisão | Label: Nível | Label: Treinos |

### Bento Grid (2/3 + 1/3)

**Aulas Interativas (2/3)**
- Icon: BookOpen (Lucide, teal-cyan)
- Progress: % grande + barra com shimmer + "X de Y concluídas"
- CTA: "Continuar aprendendo" (gradient, ArrowRight)

**Tabuada Turbo (1/3)**
- Icon: Grid3X3 (Lucide, blue-purple)
- Trophy icon + melhor score
- Mini barras por operação
- CTA: "Iniciar treino"

### Analytics (2/3 + 1/3)

**Evolução (2/3)**
- Icon: TrendingUp (Lucide)
- Gráfico de área dual (Recharts): precisão (teal) + tempo (emerald)
- Tooltip glassmorphism

**Áreas para Melhorar (1/3)**
- Icon: Award (Lucide, pink-purple)
- Lightbulb tip card + barras de taxa de erro

### Autoconfiança (1/2)
- Icon: Heart (Lucide, pink-rose)
- Score grande + /10 com trend icon
- Line chart de confiança ao longo do tempo

---

## 4. Aulas (`/lessons`)

### Hero
- **Badge**: Pulsing dot + "{X} aulas disponíveis"
- **H1**: "Sua Jornada de Aprendizado" (gradient, 5xl-7xl)

### Progresso Geral Card
- % grande (teal, 5xl) + barra shimmer + "X de Y concluídas"

### Categorias (seções com header + grid 3 colunas)

| Categoria | Gradiente | Emoji |
|---|---|---|
| Básicas | emerald → teal | ➕ |
| Dia-a-dia | orange → amber | 🛒 |
| Vestibulares | blue → purple | 🎓 |

### LessonCard
- Ícone operação em círculo gradiente (Plus/Minus/X/Divide)
- Status badge: CheckCircle2 (concluída, teal) ou Lock (bloqueada, gray)
- Difficulty badge colorido + "Aula X/Y" (Clock icon)
- Título (display font) + descrição (2 linhas)
- Botão: "Começar" (Play, gradient) / "Revisar" (glass) / "Bloqueada" (disabled)

---

## 5. Aula Individual (Lesson Shell)

### Header
- ArrowLeft + título · BookOpen + "Aula interativa" · Clock + "~5 min"

### Stepper (5 fases)
| 1. Conceito (BookOpen) | 2. Guiado (Lightbulb) | 3. Pista (HelpCircle) | 4. Sozinho (Zap) | 5. Pronto! (Trophy) |

Círculos conectados por linhas, ativo com glow+pulse, completo com check

### Fase Intro
- Card Info + expressão grande (gradient 4xl-5xl)
- Steps revelados sequencialmente com badges numerados
- Resultado em emerald com glow
- CTA: "Entendi! Vamos praticar"

### Fase Exercício
- Expressão centralizada (4xl-6xl)
- Dica: Full (Lightbulb, teal) / Parcial (Sparkles, amber) / Sem
- Input numérico + botão Send
- Feedback: Correto (CheckCircle2, emerald, confetti) / Errado (amber, "Ver passos" ou "Tentar de novo")

### Fase Conclusão
- Confetti (30 peças coloridas) + 🎉 com glow
- **H2**: "Missão Cumprida!" (gradient)
- 3 stat cards: XP (Sparkles, emerald) · Precisão (Target, cyan) · Tempo (Clock, amber)
- Botões: "Próxima Aula" (primary) · "Praticar mais" (Dumbbell) · "Voltar às aulas"

---

## 6. Treino (`/train`)

### Pré-início
- Icon: Zap em círculo gradiente
- **H2**: "Treino Mental"
- 2 cards modo:

| Card 1 | Card 2 |
|---|---|
| Icon: Smile (Lucide) | Icon: Clock (Lucide) |
| Gradient: teal | Gradient: orange |
| Title: **Tranquilo** | Title: **Cronometrado** |
| Desc: Sem timer | Desc: Contra o relógio |

- CTA: "Bora treinar" (gradient, ArrowRight)

### Sessão ativa
- Header: Zap + "Treino" · Timer/Countdown · X button
- Progress bar: teal-cyan shimmer
- Badge "X / Y" · Operando1 + Operador (gradient box) + Operando2 + = ?
- Números grandes (5xl-6xl, display font)
- Input centralizado + "Essa é minha resposta"
- Shake animation em erro

### Limite diário (Bloqueio)
- Icon: Lock (amber-orange)
- "Limite diário atingido" · Botões: "Assinar Pro" / "Voltar ao painel"

---

## 7. Tabuada (`/tabuada`)

### Hero
- Badge: Sparkles + "Pratique no seu ritmo"
- **H1**: "Tabuada" (gradient, 5xl-6xl)

### Config Card (Grid3X3, blue-purple)
- **Operação** (4 botões): +, −, ×, ÷ (cada com ícone em gradiente)
- **Range** (3 botões): "1 a 5", "1 a 10", "1 a 12"
- **Modo** (2 cards): Guiado (BookOpen, teal) / Treino livre (Zap, orange)
- CTA: "Bora começar"

---

## 8. Planos (`/billing`)

### Hero
- **H1**: "Seu plano" (gradient) · "Treine no ritmo que faz sentido pra você."

### Plans Grid (2 colunas)

| Free | Pro |
|---|---|
| "R$ 0/mês" | Glow teal + Badge "Popular" (Sparkles) |
| ✓ 1 treino/dia · ✓ Nível max 5 | "R$ 19,90/mês" |
| ✗ Recursos bloqueados | ✓ Todos os recursos |
| "Plano Atual" (disabled) | "Assinar Pro" (gradient) |

### Benefícios Pro (grid 2×2)
| Card | Card | Card | Card |
|---|---|---|---|
| Icon: Zap | Icon: TrendingUp | Icon: BarChart3 | Icon: Sparkles |
| Treinos ilimitados | Níveis avançados | Analytics completo | Novidades primeiro |

---

## 9. Navegação

### Desktop Navbar
- **Logo**: Sparkles + "MindCalc"
- **Links** (5): Painel (LayoutDashboard) · Aulas (BookOpen) · Tabuada (Grid3X3) · Treinar (Dumbbell) · Planos (CreditCard)
- **Ativo**: white text + white glass bg · **Inativo**: white/60

### Mobile Nav (bottom bar)
- Fixed bottom, `rounded-3xl`, glow teal-cyan
- 4 itens: Painel, Aulas, Tabuada, Treinar
- Ativo: gradient bg + white text

please, help me enhance this existing prompt with some design guidelines, following the reference screenshot attached:

Deeply analyse the design of the attached screenshot. Improve my prompt above by adding to it a design.json  that describes the style and design of every UI component needed in a design system at a high level like a creative director. Capture high level guidelines for structure, spacing, fonts, colours, design style and design principles so I can use this file as the design guidelines for my app. The goal with this file is to instruct AI to be able to replicate this look easily in this project.

