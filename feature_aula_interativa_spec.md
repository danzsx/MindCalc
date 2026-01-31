# Spec — Feature: Aula Interativa

**Baseado em:** `feature_aula_interativa_prd.md`
**Data:** 2026-01-30

---

## 1. Arquivos a CRIAR

### 1.1 Migração / SQL

| # | Arquivo | Descrição |
|---|---|---|
| 1 | `lib/supabase/migrations/001_lessons_tables.sql` | Criação das tabelas `lessons`, `lesson_progress`, `learned_techniques` com RLS policies e índices |
| 2 | `lib/supabase/seeds/lessons-seed.sql` | INSERT das 8 aulas iniciais na tabela `lessons` (seed data) |

### 1.2 Páginas (App Router)

| # | Arquivo | Tipo | Descrição |
|---|---|---|---|
| 3 | `app/(app)/lessons/page.tsx` | Server Component | Lista de aulas com grid de LessonCards e status de progresso (concluída/disponível/bloqueada) |
| 4 | `app/(app)/lessons/[slug]/page.tsx` | Client Component | Experiência da aula — máquina de estados com 5 fases (intro → guiado → semi-guiado → livre → conclusão) |

### 1.3 API Routes

| # | Arquivo | Método | Descrição |
|---|---|---|---|
| 5 | `app/api/lessons/complete/route.ts` | POST | Registra conclusão de aula: upsert em `lesson_progress`, insert em `learned_techniques`. Body: `{ userId, lessonSlug }` |

### 1.4 Componentes — Lessons (`components/lessons/`)

| # | Arquivo | Tipo | Props | Descrição |
|---|---|---|---|---|
| 6 | `components/lessons/LessonCard.tsx` | Client | `{ lesson, status, onClick }` | Card na lista de aulas. Exibe título, descrição, ícone de operação, badge de status |
| 7 | `components/lessons/LessonShell.tsx` | Client | `{ lesson, onComplete }` | Container principal. Gerencia a máquina de estados (5 fases) e orquestra transições |
| 8 | `components/lessons/LessonIntro.tsx` | Client | `{ title, explanation, example, onContinue }` | Fase 1. Explicação da técnica com exemplo numérico visual |
| 9 | `components/lessons/LessonExercise.tsx` | Client | `{ exercise, hintLevel, onAnswer }` | Fases 2-4. Input numérico, dica condicional, feedback acerto/erro |
| 10 | `components/lessons/LessonHint.tsx` | Client | `{ hint, level }` | Renderiza dica: completa (guiado), parcial (semi-guiado), oculta (livre) |
| 11 | `components/lessons/LessonStepByStep.tsx` | Client | `{ steps, onRetry }` | Explicação passo a passo exibida após erro, com botão "Tentar novamente" |
| 12 | `components/lessons/LessonCompletion.tsx` | Client | `{ technique, onPracticeMore, onDashboard }` | Fase 5. Mensagem de conclusão + botões de ação |
| 13 | `components/lessons/LessonPractice.tsx` | Client | `{ exercises, technique }` | Mini-treino pós-aula: 5 exercícios sem dica + resumo final |
| 14 | `components/lessons/LessonProgressIndicator.tsx` | Client | `{ currentPhase, totalPhases }` | Indicador visual de progresso (5 dots/steps) |

### 1.5 Componente — Dashboard (`components/dashboard/`)

| # | Arquivo | Tipo | Props | Descrição |
|---|---|---|---|---|
| 15 | `components/dashboard/LessonsOverviewCard.tsx` | Server | `{ completedCount, totalCount }` | Card no Dashboard com progresso geral das aulas e link para `/lessons` |

### 1.6 Dados Estáticos e Engine (`lib/lessons/`)

| # | Arquivo | Descrição |
|---|---|---|
| 16 | `lib/lessons/types.ts` | Tipos TypeScript: `LessonContent`, `LessonExerciseData`, enums de fase e hint level |
| 17 | `lib/lessons/index.ts` | Re-exporta todas as aulas e função de lookup por slug |
| 18 | `lib/lessons/engine.ts` | Gerador de exercícios específico para aulas (diferente do `lib/engine.ts` do treino) |

### 1.7 Conteúdo Pedagógico das 8 Aulas (`lib/lessons/data/`)

| # | Arquivo | Aula | Operação | Dificuldade |
|---|---|---|---|---|
| 19 | `lib/lessons/data/somar-dezenas.ts` | Somar dezenas primeiro | + | beginner |
| 20 | `lib/lessons/data/somar-arredondando.ts` | Somar arredondando para 10 | + | beginner |
| 21 | `lib/lessons/data/subtrair-completando.ts` | Subtrair completando a dezena | - | beginner |
| 22 | `lib/lessons/data/subtrair-por-partes.ts` | Subtrair por partes | - | beginner |
| 23 | `lib/lessons/data/multiplicar-por-5.ts` | Multiplicar por 5 (metade de 10x) | * | intermediate |
| 24 | `lib/lessons/data/multiplicar-por-9.ts` | Multiplicar por 9 (10x - 1x) | * | intermediate |
| 25 | `lib/lessons/data/dividir-por-2-e-4.ts` | Dividir por 2 e por 4 (metade da metade) | / | intermediate |
| 26 | `lib/lessons/data/dividir-pensando-na-multiplicacao.ts` | Dividir pensando na multiplicação | / | intermediate |

---

## 2. Arquivos a MODIFICAR

### 2.1 Middleware

| # | Arquivo | Alteração |
|---|---|---|
| 27 | `middleware.ts` | Adicionar `/lessons/:path*` ao array `matcher` para proteção de rota autenticada |

### 2.2 Navegação

| # | Arquivo | Alteração |
|---|---|---|
| 28 | `components/shared/Navbar.tsx` | Adicionar `{ href: "/lessons", label: "Aulas", icon: BookOpen }` ao array `navLinks`, entre "Dashboard" e "Treinar". Importar `BookOpen` de `lucide-react` |

### 2.3 Dashboard

| # | Arquivo | Alteração |
|---|---|---|
| 29 | `app/(app)/dashboard/page.tsx` | Importar e renderizar `<LessonsOverviewCard>` entre `<StatsSummary>` e o card de Evolução. Adicionar query para contar aulas concluídas e total de aulas |

### 2.4 Engine de Treino

| # | Arquivo | Alteração |
|---|---|---|
| 30 | `lib/engine.ts` | Adicionar parâmetro opcional `learnedTechniques?: string[]` em `generateExercise()` e `generateExercises()`. Implementar biasing de 30% para exercícios que reforcem técnicas aprendidas |

### 2.5 Tipos Globais

| # | Arquivo | Alteração |
|---|---|---|
| 31 | `types/index.ts` | Adicionar interfaces: `Lesson` (tabela lessons), `LessonProgress` (tabela lesson_progress), `LearnedTechnique` (tabela learned_techniques) |

### 2.6 Schema SQL

| # | Arquivo | Alteração |
|---|---|---|
| 32 | `lib/supabase/schema.sql` | Append das definições das 3 novas tabelas + RLS policies (referência/documentação) |

---

## 3. Resumo Quantitativo

| Categoria | Criar | Modificar | Total |
|---|---|---|---|
| SQL / Migração | 2 | 1 | 3 |
| Páginas (App Router) | 2 | 1 | 3 |
| API Routes | 1 | 0 | 1 |
| Componentes (lessons/) | 9 | 0 | 9 |
| Componentes (dashboard/) | 1 | 0 | 1 |
| Componentes (shared/) | 0 | 1 | 1 |
| Lib (lessons/) | 3 | 0 | 3 |
| Dados pedagógicos | 8 | 0 | 8 |
| Engine de treino | 0 | 1 | 1 |
| Tipos | 0 | 1 | 1 |
| Middleware | 0 | 1 | 1 |
| **Total** | **26** | **6** | **32** |

---

## 4. Ordem de Implementação Sugerida

A ordem abaixo respeita as dependências entre os arquivos:

### Fase 1 — Fundação (sem dependências)
1. `lib/lessons/types.ts` (#16)
2. `types/index.ts` (#31 — modificar)
3. `lib/supabase/migrations/001_lessons_tables.sql` (#1)
4. `lib/supabase/seeds/lessons-seed.sql` (#2)
5. `lib/supabase/schema.sql` (#32 — modificar)

### Fase 2 — Dados e Engine
6. `lib/lessons/data/somar-dezenas.ts` (#19)
7. `lib/lessons/data/somar-arredondando.ts` (#20)
8. `lib/lessons/data/subtrair-completando.ts` (#21)
9. `lib/lessons/data/subtrair-por-partes.ts` (#22)
10. `lib/lessons/data/multiplicar-por-5.ts` (#23)
11. `lib/lessons/data/multiplicar-por-9.ts` (#24)
12. `lib/lessons/data/dividir-por-2-e-4.ts` (#25)
13. `lib/lessons/data/dividir-pensando-na-multiplicacao.ts` (#26)
14. `lib/lessons/engine.ts` (#18)
15. `lib/lessons/index.ts` (#17)

### Fase 3 — API e Backend
16. `app/api/lessons/complete/route.ts` (#5)
17. `middleware.ts` (#27 — modificar)

### Fase 4 — Componentes de UI
18. `components/lessons/LessonProgressIndicator.tsx` (#14)
19. `components/lessons/LessonHint.tsx` (#10)
20. `components/lessons/LessonStepByStep.tsx` (#11)
21. `components/lessons/LessonExercise.tsx` (#9)
22. `components/lessons/LessonIntro.tsx` (#8)
23. `components/lessons/LessonCompletion.tsx` (#12)
24. `components/lessons/LessonPractice.tsx` (#13)
25. `components/lessons/LessonShell.tsx` (#7)
26. `components/lessons/LessonCard.tsx` (#6)
27. `components/dashboard/LessonsOverviewCard.tsx` (#15)

### Fase 5 — Páginas e Integração
28. `app/(app)/lessons/page.tsx` (#3)
29. `app/(app)/lessons/[slug]/page.tsx` (#4)
30. `components/shared/Navbar.tsx` (#28 — modificar)
31. `app/(app)/dashboard/page.tsx` (#29 — modificar)

### Fase 6 — Integração com Treino
32. `lib/engine.ts` (#30 — modificar)

---

## 5. Estrutura de Diretórios Resultante (arquivos novos)

```
Calc/
├── app/
│   ├── (app)/
│   │   ├── lessons/
│   │   │   ├── page.tsx                              ← CRIAR
│   │   │   └── [slug]/
│   │   │       └── page.tsx                          ← CRIAR
│   │   └── dashboard/
│   │       └── page.tsx                              ← MODIFICAR
│   └── api/
│       └── lessons/
│           └── complete/
│               └── route.ts                          ← CRIAR
├── components/
│   ├── dashboard/
│   │   └── LessonsOverviewCard.tsx                   ← CRIAR
│   ├── lessons/                                      ← CRIAR diretório
│   │   ├── LessonCard.tsx                            ← CRIAR
│   │   ├── LessonShell.tsx                           ← CRIAR
│   │   ├── LessonIntro.tsx                           ← CRIAR
│   │   ├── LessonExercise.tsx                        ← CRIAR
│   │   ├── LessonHint.tsx                            ← CRIAR
│   │   ├── LessonStepByStep.tsx                      ← CRIAR
│   │   ├── LessonCompletion.tsx                      ← CRIAR
│   │   ├── LessonPractice.tsx                        ← CRIAR
│   │   └── LessonProgressIndicator.tsx               ← CRIAR
│   └── shared/
│       └── Navbar.tsx                                ← MODIFICAR
├── lib/
│   ├── engine.ts                                     ← MODIFICAR
│   ├── lessons/                                      ← CRIAR diretório
│   │   ├── types.ts                                  ← CRIAR
│   │   ├── index.ts                                  ← CRIAR
│   │   ├── engine.ts                                 ← CRIAR
│   │   └── data/                                     ← CRIAR diretório
│   │       ├── somar-dezenas.ts                      ← CRIAR
│   │       ├── somar-arredondando.ts                 ← CRIAR
│   │       ├── subtrair-completando.ts               ← CRIAR
│   │       ├── subtrair-por-partes.ts                ← CRIAR
│   │       ├── multiplicar-por-5.ts                  ← CRIAR
│   │       ├── multiplicar-por-9.ts                  ← CRIAR
│   │       ├── dividir-por-2-e-4.ts                  ← CRIAR
│   │       └── dividir-pensando-na-multiplicacao.ts  ← CRIAR
│   └── supabase/
│       ├── schema.sql                                ← MODIFICAR
│       ├── migrations/                               ← CRIAR diretório
│       │   └── 001_lessons_tables.sql                ← CRIAR
│       └── seeds/                                    ← CRIAR diretório
│           └── lessons-seed.sql                      ← CRIAR
├── types/
│   └── index.ts                                      ← MODIFICAR
└── middleware.ts                                     ← MODIFICAR
```
