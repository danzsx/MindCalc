# Plano de Melhoria das Aulas Interativas — MindCalc

> Análise técnica completa + plano de correção em fases
> Data: 2026-02-17
> Escopo: `components/lessons/`, `lib/lessons/`, `app/(app)/lessons/`

---

## 1. Diagnóstico dos Bugs

### Bug #1 — Segunda pergunta respondida automaticamente

**Componente afetado:** `GenericInteractiveExercise.tsx` → `ScaffoldedExercise`
**Lição confirmada:** "Somar dezenas primeiro" (slug: `somar-dezenas-primeiro`) — usa `type: "step-discovery"` com `buildExerciseSteps` que gera 3 passos encadeados.

#### Causa raiz (Double-Fire Race Condition)

No `handleStepSubmit`, há um `setTimeout` de 800ms para avançar `currentStepIdx`:

```tsx
// GenericInteractiveExercise.tsx · linha 148
if (currentStepIdx + 1 < visibleSteps.length) {
  setTimeout(() => setCurrentStepIdx((i) => i + 1), 800);
}
```

**Não existe nenhum guard** contra chamadas múltiplas durante esses 800ms.
Em mobile, o teclado virtual dispara `Enter`/`Done` repetidamente ao confirmar um campo numérico — comportamento documentado em iOS Safari e Android Chrome.

**Sequência do bug (3 passos, modo guiado):**

| t=0ms | Usuário responde Passo 0 corretamente → `handleStepSubmit()` dispara uma vez |
|-------|-----------------------------------------------------------------------------|
| t=0ms | `stepDone[0] = true`; Timer A agendado: `currentStepIdx → 1` em 800ms |
| t=~50ms | `Enter` dispara novamente (teclado mobile). `currentStepIdx` ainda é 0. `inputs[0]` ainda tem a resposta certa. |
| t=~50ms | `handleStepSubmit()` dispara **de novo**: condição `isApproximatelyEqual` passa novamente |
| t=~50ms | Timer B agendado: `currentStepIdx → i+1` em 800ms |
| t=800ms | Timer A: `0 → 1` |
| t=850ms | Timer B: `1 → 2` ← **`currentStepIdx` pula para 2** |

**Resultado visual:** Os passos 0, 1 e 2 ficam visíveis simultaneamente (`i ≤ currentStepIdx=2`). O passo 0 aparece como "feito" ✓. Os passos 1 e 2 aparecem como inputs ativos ao mesmo tempo. O `stepInputRef` aponta para o passo 2 (último renderizado), que recebe o auto-focus. O usuário percebe como "a segunda pergunta apareceu sozinha e já está selecionada."

---

### Bug #2 — Botão "Continuar" ausente após resposta correta

**Componentes afetados:** `ScaffoldedExercise`, `FreeExercise` (em `GenericInteractiveExercise.tsx`), `LessonExercise.tsx`

#### Causa raiz

Após resposta correta, todos os componentes de exercício usam **apenas auto-transição via `setTimeout`**:

```tsx
// ScaffoldedExercise, linha 180
setTimeout(() => onAnswer(true), 1500);

// FreeExercise, linha 402
setTimeout(() => onAnswer(true), 1500);

// LessonExercise, linha 104
setTimeout(() => onAnswer(true), 1500);
```

Não há botão visível. O usuário vê a mensagem de sucesso e fica esperando, sem feedback de que algo vai acontecer. Em mobile, o cenário piora:

1. O usuário toca fora do input ou na mensagem de sucesso
2. O app parece "congelado" por 1,5 segundos
3. A transição acontece mas o usuário já tentou tocar em algum lugar e pode ter disparado algo errado

**Agravante em `GenericInteractiveIntro`:** O `FillScreen` e o `SolveScreen` também fazem auto-avanço (`setTimeout(() => onNext(), 1200)` e `setTimeout(() => onNext(), 1500)`), sem botão de confirmação — o mesmo padrão.

---

### Bug #3 — Problemas de responsividade mobile

| Componente | Problema |
|------------|----------|
| `ScaffoldedExercise` | Input + botão OK limitados a `max-w-[220px]` — muito pequeno para dedos |
| `GenericInteractiveExercise` | Expression em `text-3xl sm:text-4xl` — poderia ser maior em mobile |
| `LessonProgressIndicator` | Labels ficam ilegíveis em telas pequenas (`text-[10px]`) |
| `LessonShell` | Sem padding bottom adequado para aulas longas com mobile nav |
| `GenericInteractiveIntro` | `ChoiceScreen` usa `grid-cols-2 sm:grid-cols-3` — no mobile, 2 colunas de botões podem ficar apertadas |
| `FillScreen` / `SolveScreen` | `max-w-xs` para input em mobile — gap visual entre input e botão |

---

## 2. Análise de Qualidade Pedagógica

### O que funciona bem (preservar)
- Estrutura de 5 fases (guiado → semi-guiado → livre) é pedagogicamente sólida
- O `skipFirst` no semi-guiado mostra dica do 1º passo — bom scaffold progressivo
- Confetti proporcional ao nível de dificuldade: boa motivação intrínseca
- Mensagens contextuais por nível de hint (`SUCCESS_MESSAGES`)
- `GenericInteractiveIntro` com tipos variados (observe, fill, action, solve, summary) já oferece variedade

### O que pode melhorar
- **Ausência de visuais/diagramas**: a aula "somar dezenas primeiro" poderia mostrar uma representação visual dos blocos de dezenas/unidades
- **Falta de animações de decomposição**: ao separar `37 = 30 + 7`, poderia haver uma animação visual
- **Interatividade limitada**: tudo é input numérico. Nenhuma aula usa drag-and-drop ou seleção direta
- **Sem feedback de progresso granular**: o usuário não sabe quantas "telas" faltam dentro de uma fase
- **Sem gamificação micro**: um "streak" visual ou barra de progresso dentro do exercício ajudaria
- **Transições bruscas entre fases**: o interstitial de 800ms (`"Dessa vez com menos ajuda..."`) some rápido demais

---

## 3. Plano de Correção em Fases

---

### Fase 1 — Correção dos Bugs Críticos

**Prioridade:** Alta · **Impacto:** Bloqueia uso em mobile

#### 1.1 — Guard contra Double-Fire em `ScaffoldedExercise`

**Arquivo:** `components/lessons/interactive/GenericInteractiveExercise.tsx`

Adicionar um `useRef` `isAdvancingRef` que bloqueia chamadas múltiplas a `handleStepSubmit` durante a janela de 800ms:

```tsx
// Adicionar junto aos outros refs (~linha 110)
const isAdvancingRef = useRef(false);

// Em handleStepSubmit, adicionar guard no início:
const handleStepSubmit = useCallback(() => {
  if (isAdvancingRef.current) return; // ← Guard
  const val = parseNumericInput(inputs[currentStepIdx] ?? "");
  if (val === null) return;
  if (isApproximatelyEqual(currentStep.answer, val)) {
    isAdvancingRef.current = true; // ← Lock
    setStepFeedback(null);
    setStepDone(prev => { ... });
    if (currentStepIdx + 1 < visibleSteps.length) {
      setTimeout(() => {
        setCurrentStepIdx(i => i + 1);
        isAdvancingRef.current = false; // ← Unlock após avanço
      }, 800);
    } else {
      isAdvancingRef.current = false; // ← Unlock imediato no último passo
    }
  } else { ... }
}, [...]);
```

O mesmo guard deve ser aplicado a `handleFinalSubmit` para evitar dupla confirmação da resposta final.

#### 1.2 — Botão "Continuar" explícito após resposta correta

Em todos os componentes que mostram sucesso e depois chamam `onAnswer(true)` via setTimeout, substituir o auto-avanço por um **botão "Continuar →"** que o usuário deve apertar.

**Justificativa pedagógica:** o momento pós-acerto é uma oportunidade de celebração consciente. Forçar o usuário a apertar "Continuar" reforça a agência e elimina a confusão de "o app travou".

**Arquivos afetados:**
- `GenericInteractiveExercise.tsx` — `ScaffoldedExercise` (após `answerCorrect = true`)
- `GenericInteractiveExercise.tsx` — `FreeExercise` (após `feedback === "correct"`)
- `LessonExercise.tsx` (após `feedback === "correct"`)
- `GenericInteractiveIntro.tsx` — `FillScreen` (após `done = true`, antes de `onNext()`)
- `GenericInteractiveIntro.tsx` — `SolveScreen` (após `done = true`)

**Padrão proposto para o estado de sucesso:**
```tsx
{answerCorrect && (
  <div className="space-y-4">
    {/* Resultado + mensagem (mantém igual) */}
    ...
    {/* Botão explícito em vez de setTimeout */}
    <Button onClick={() => onAnswer(true)} className="w-full" size="lg">
      Continuar →
    </Button>
  </div>
)}
```

O `setTimeout` de 1500ms pode ser mantido como fallback (para casos de acessibilidade), mas o botão deve aparecer imediatamente.

#### 1.3 — Mensagem interstitial com botão "Pronto" (LessonShell)

O `interstitialMsg` em `LessonShell.tsx` aparece por 800ms e some automaticamente. Em mobile lento, 800ms pode ser insuficiente para renderizar a próxima fase.

**Melhoria:** tornar o interstitial um cartão com botão opcional. A transição automática pode acontecer após 1.5s, mas o botão acelera se o usuário tocar.

```tsx
// Em LessonShell, substituir o timeout por estado controlável
const [interstitialConfirmed, setInterstitialConfirmed] = useState(false);

// O interstitial some quando: timeout OU botão tocado
useEffect(() => {
  if (interstitialMsg) {
    const timer = setTimeout(() => {
      setInterstitialMsg(null);
      setPhase(pendingPhase);
    }, 1500); // aumentar de 800ms para 1500ms
    return () => clearTimeout(timer);
  }
}, [interstitialMsg]);
```

---

### Fase 2 — Responsividade Mobile

**Prioridade:** Alta · **Impacto:** UX em ~70% dos usuários

#### 2.1 — Inputs e touch targets maiores

**`GenericInteractiveExercise.tsx` — ScaffoldedExercise:**
- `max-w-[220px]` → `max-w-sm` (mais espaço para o input)
- Botão "OK" → `h-12` no mobile (alinhar com input)
- `text-lg` → `text-xl` nos inputs

**Todos os inputs de lição:**
- `h-12` mínimo (48px = touch target seguro per Material Design)
- `text-xl` para facilitar leitura de números em mobile

#### 2.2 — Expressão matemática responsiva

A expressão principal (e.g., `25 + 43 = ?`) deve ser maior em mobile, não menor:
```tsx
// ScaffoldedExercise, atualmente text-3xl sm:text-4xl
// Proposta: manter tamanho ou aumentar
<p className="text-4xl sm:text-5xl font-bold tracking-wide">
```

#### 2.3 — Progress indicator mais robusto

`LessonProgressIndicator` em telas muito pequenas (< 360px) está ilegível. Proposta:
- Labels sumir em < 380px, mostrar apenas ícones
- Tamanho dos círculos: `w-9 h-9 sm:w-11 sm:h-11`

#### 2.4 — Scroll automático ao novo step

Quando um novo passo aparece na tela, em mobile pode ficar fora do viewport. Usar `scrollIntoView`:

```tsx
// Em ScaffoldedExercise, após setCurrentStepIdx
const stepRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  setTimeout(() => {
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 850); // após o timeout de avanço
}, [currentStepIdx]);
```

#### 2.5 — Keyboard avoidance

Em mobile, o teclado virtual sobe e pode cobrir o input ativo. Garantir que os containers de exercício têm `pb-[env(keyboard-inset-height,0px)]` ou usar `visualViewport` API para reposicionar.

---

### Fase 3 — Visuais e Animações

**Prioridade:** Média · **Impacto:** Engajamento e retenção

#### 3.1 — Visualização de decomposição numérica

Para lições de tipo `step-discovery` (como "somar dezenas primeiro"), criar um componente `NumberDecomposition` que mostra visualmente a separação de dezenas e unidades:

```
   25          43
  /  \        /  \
 20   5      40   3
  \          /
   20 + 40 = 60  e  5 + 3 = 8
            ↓
         60 + 8 = 68
```

Implementar como SVG animado ou divs com Framer Motion. A decomposição ocorre em etapas sincronizadas com os passos do exercício.

**Componente proposto:** `components/lessons/interactive/NumberDecompositionVisual.tsx`

#### 3.2 — Blocos de dezenas/unidades (Manipulativo Visual)

Inspirado em material Montessori digital: mostrar blocos visuais onde cada dezena é uma barra longa e cada unidade é um quadrado. Ao somar `25 + 43`:
- Mostrar 2 barras + 5 quadrados (para o 25)
- Mostrar 4 barras + 3 quadrados (para o 43)
- Animar o agrupamento

**Componente proposto:** `components/lessons/interactive/BaseBlockVisual.tsx`

#### 3.3 — Linha numérica animada (NumberLine)

Para lições de subtração e adição próximas a dezenas, um componente de linha numérica onde o "salto" é mostrado visualmente:

```
←——[43]——————[50]————→
        +7 ↗
```

**Componente proposto:** `components/lessons/interactive/NumberLine.tsx`

#### 3.4 — Animação de transição entre passos melhorada

Atualmente: `interactive-fade-up` (CSS puro). Melhorar para incluir:
- Slide horizontal ao avançar passo
- "Bounce" no número resposta ao aparecer
- Highlight verde pulsante por 300ms no passo completado antes de mostrar o ✓

#### 3.5 — Micro-animação na "junção" final

Na etapa final (`Juntando: 60 + 8 = ?`), mostrar os resultados dos passos anteriores "voando" para o centro e se juntando — reforça visualmente o processo de síntese.

---

### Fase 4 — Interatividade Avançada (Drag, Select, etc.)

**Prioridade:** Média · **Impacto:** Diferencial pedagógico e engajamento

#### 4.1 — Arraste para decompor números

Para a fase de introdução da lição "somar dezenas primeiro", em vez de apenas mostrar `37 = 30 + 7`, permitir que o usuário **arraste** os dígitos para as respectivas colunas (dezenas/unidades).

**Implementação:**
- Usar `@dnd-kit/core` (já pode estar nas dependências) ou native HTML5 Drag & Drop
- Duas "caixas" de destino: Dezenas e Unidades
- Dígitos animados que se encaixam visualmente

**Arquivo:** novo componente `components/lessons/interactive/DragDecompose.tsx`

#### 4.2 — Seleção de múltipla escolha visual

Para perguntas do tipo "qual número está mais próximo da dezena?", substituir o `ChoiceScreen` atual (2 botões) por cartões maiores e mais visuais com feedback de cores:

- Cartão com bordas animadas no hover/focus
- Botão de tamanho mínimo 64px de altura
- Ícone representativo do número (ex: barras de dezenas)
- Estado de "carregando" visual enquanto verifica a resposta

#### 4.3 — Completar a equação (Fill-in-the-blank visual)

Em vez de um input numérico avulso, mostrar a equação completa com um "espaço em branco" destacado:

```
30 + 40 = [___]
```

O `[___]` é um campo visual que fica pulsando aguardando entrada. Ao preencher corretamente, o número "aparece" com animação (scale + fade).

**Componente proposto:** `components/lessons/interactive/EquationFill.tsx`

#### 4.4 — Arrastar para ordenar passos (Fase de revisão)

Para a tela de Summary/Conclusão das lições, em vez de apenas listar os passos, permitir que o usuário os **arraste para a ordem correta** (os passos aparecem embaralhados). Só confirma quando a ordem está certa.

**Benefício pedagógico:** reforça a sequência do raciocínio ao invés de apenas relê-la.

#### 4.5 — Slider numérico para arredondamentos

Para lições de arredondamento (`somar-arredondando`, `subtrair-completando`), um slider visual onde o usuário "empurra" um número em direção à dezena mais próxima. O slider mostra a linha numérica e a distância até a dezena.

---

### Fase 5 — Qualidade Pedagógica e Didatismo

**Prioridade:** Média-baixa · **Impacto:** Longo prazo — retenção e profundidade

#### 5.1 — Contexto do mundo real nos exercícios

Cada exercício prático poderia ter um "tema" do mundo real opcional:
- `25 + 43` → "Você tem 25 figurinhas e ganhou mais 43. Quantas tem agora?"
- Exibido como uma linha de contexto acima da expressão, desativável

**Implementação:** Adicionar campo `context?: string` em `LessonExerciseData` em `types.ts`. Os dados das lições preenchem opcionalmente esse campo.

#### 5.2 — Dica de estratégia "ao vivo" durante digitação

Enquanto o usuário pensa, mostrar uma dica discreta que aumenta gradualmente:
- Após 10s sem resposta: ícone de lâmpada pisca
- Após 20s: tooltip com a primeira pista ("Lembra das dezenas...")
- Ao clicar no ícone: mostra a dica completa

**Implementação:** `useIdleHint` hook no `LessonExercise.tsx`.

#### 5.3 — Replay do raciocínio ao errar

Quando o usuário erra, em vez de apenas "Ver passos" (texto estático), oferecer uma **animação passo a passo** que refaz o cálculo visualmente em 3-4 segundos, como um vídeo. O usuário vê o processo e depois tenta de novo.

#### 5.4 — Perguntas de verificação de compreensão

Após a fase guiada (antes da semi-guiada), fazer uma **mini-pergunta conceitual** de múltipla escolha:
- Ex: "Por que começamos pelas dezenas?" → opções: A) Fica mais fácil | B) É mais bonito | C) Não importa
- 1 pergunta, 2-3 opções, sem impacto no progresso
- Reforça compreensão e não apenas mecânica

#### 5.5 — Estatísticas granulares de acertos por fase

Mostrar no `LessonCompletion` quantas tentativas o usuário precisou em cada fase (guiada, semi-guiada, livre). Ex: "Guiada: acertou de primeira. Livre: 2 tentativas."

Isso dá feedback mais rico do que apenas "100% de acurácia".

---

## 4. Resumo de Priorização

| # | Item | Fase | Criticidade | Esforço estimado |
|---|------|------|-------------|-----------------|
| 1 | Guard double-fire `handleStepSubmit` | 1 | 🔴 Crítico | Pequeno (< 1h) |
| 2 | Botão "Continuar" explícito pós-acerto | 1 | 🔴 Crítico | Pequeno (1-2h) |
| 3 | Interstitial com botão opcional | 1 | 🟠 Alto | Pequeno (1h) |
| 4 | Touch targets e inputs maiores | 2 | 🟠 Alto | Médio (2-3h) |
| 5 | Scroll automático ao novo step | 2 | 🟡 Médio | Pequeno (1h) |
| 6 | Expressão matemática maior em mobile | 2 | 🟡 Médio | Pequeno (30min) |
| 7 | Animação de transição entre passos | 3 | 🟡 Médio | Médio (2-3h) |
| 8 | Componente `NumberDecompositionVisual` | 3 | 🟡 Médio | Grande (4-6h) |
| 9 | Componente `EquationFill` | 4 | 🟡 Médio | Grande (4-6h) |
| 10 | Drag para decompor números | 4 | 🟢 Baixo | Grande (6-8h) |
| 11 | Slider numérico | 4 | 🟢 Baixo | Grande (4-6h) |
| 12 | Contexto mundo real nos exercícios | 5 | 🟢 Baixo | Médio (2-3h) |
| 13 | Dica automática por inatividade | 5 | 🟢 Baixo | Médio (2-3h) |
| 14 | Replay animado ao errar | 5 | 🟢 Baixo | Grande (4-6h) |

---

## 5. Arquivos a Modificar por Fase

### Fase 1
```
components/lessons/interactive/GenericInteractiveExercise.tsx  ← bug #1 + botão continuar
components/lessons/interactive/GenericInteractiveIntro.tsx     ← botão continuar nos sub-screens
components/lessons/LessonExercise.tsx                          ← botão continuar
components/lessons/LessonShell.tsx                             ← interstitial com botão
```

### Fase 2
```
components/lessons/interactive/GenericInteractiveExercise.tsx  ← inputs maiores, scroll
components/lessons/LessonProgressIndicator.tsx                  ← labels responsivos
components/lessons/interactive/GenericInteractiveIntro.tsx     ← ChoiceScreen tamanho botões
app/globals.css                                                 ← keyboard avoidance tokens
```

### Fase 3
```
components/lessons/interactive/NumberDecompositionVisual.tsx   ← novo componente
components/lessons/interactive/BaseBlockVisual.tsx             ← novo componente
components/lessons/interactive/NumberLine.tsx                  ← novo componente
app/globals.css                                                 ← novas animações
lib/lessons/data/somar-dezenas-primeiro.ts                     ← integrar visuais
lib/lessons/data/somar-arredondando.ts                         ← integrar visuais
```

### Fase 4
```
components/lessons/interactive/DragDecompose.tsx               ← novo componente
components/lessons/interactive/EquationFill.tsx                ← novo componente
components/lessons/interactive/NumberSlider.tsx                ← novo componente
lib/lessons/types.ts                                           ← novos tipos
```

### Fase 5
```
lib/lessons/types.ts                                           ← campo context? em LessonExerciseData
lib/lessons/data/*.ts                                          ← adicionar contextos opcionais
components/lessons/LessonExercise.tsx                          ← useIdleHint hook
components/lessons/LessonCompletion.tsx                        ← estatísticas por fase
```

---

## 6. Observações Técnicas

- **Não afeta lições que usam `LessonExercise` puro** (sem interactive): essas lições (que não têm `buildExerciseSteps`) não sofrem o bug #1. Mas o bug #2 (sem botão continuar) afeta todas.
- **O bug ocorre em TODAS as lições com `type: "step-discovery"`** que tenham `buildExerciseSteps` com 2+ passos. Verificar: `somar-dezenas-primeiro`, `subtrair-por-partes`, e qualquer outra com essa config.
- **Não é necessário alterar `lib/lessons/engine.ts`** para os bugs das fases 1 e 2 — são mudanças puramente de componente.
- **A estrutura de 5 fases e o `PHASE_ORDER` em `LessonShell.tsx` está correta** — não deve ser alterada.
- **`key={phase}` nos exercícios está correto** — garante remount limpo a cada fase. Preservar.
