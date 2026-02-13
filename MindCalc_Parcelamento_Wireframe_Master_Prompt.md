# MindCalc --- Master Prompt

## Wireframe Ideal --- Aula: Parcelamento (Matemática Aplicada)

Objective: Design a mobile-first lesson screen focused on adult learners
with math anxiety. The goal is to reduce cognitive load, activate
intuition before calculation, and guide toward mental multiplication
insight.

Tone: Calm, confidence-building, non-judgmental, modern, high-contrast
dark UI.

------------------------------------------------------------------------

## 1. Layout Structure (Mobile-First)

### Top Navigation Bar

-   Back arrow (left)
-   Lesson title (center): "Parcelamento: quanto você realmente paga?"
-   Minimal visual noise
-   Progress indicator below (5 stages): Conceito → Guiado → Pista →
    Sozinho → Pronto

Add micro-label under progress: "Etapa 1: Ativando sua intuição
financeira"

------------------------------------------------------------------------

## 2. Intuition Activation Section

Centered container card with subtle elevation.

Prompt text: "Antes de calcular, use sua intuição."

Two comparison cards (stack vertically):

Card 1: Label: À vista Value: R\$ 1200 Subtext: Pagamento único

Card 2: Label: Parcelado Value: 10x de R\$ 150 Subtext: Total: ?

Below cards: Question: "Qual você acha que é mais caro?"

Buttons (large touch targets): \[ Parcelado \] \[ Igual \] \[ À vista \]

No immediate correctness feedback. Transition to guided reasoning.

------------------------------------------------------------------------

## 3. Guided Cognitive Decomposition

Section header: "Vamos descobrir juntos."

Step 1: Micro insight: "Multiplicar por 10 é só acrescentar um zero."

Interactive field: 150 x 10 = \_\_\_\_

If hesitation \> 5s: Show subtle hint animation adding zero.

After answer:

Step 2: Optional cumulative visualization:

150 300 450 600 750 900 1050 1200 1350 1500

Label: "Total do parcelado: R\$1500"

------------------------------------------------------------------------

## 4. Emotional Reinforcement Block

Comparison display:

À vista: R\$1200\
Parcelado: R\$1500

Highlight difference:

"Você pagaria R\$300 a mais apenas para parcelar?"

Tone: reflective, not accusatory.

------------------------------------------------------------------------

## 5. Mode Toggle (Adaptive UX)

Toggle option:

Modo: ( ) Raciocínio rápido ( ) Passo a passo

If anxiety_index high: Default to "Passo a passo"

If confidence_score high: Default to "Raciocínio rápido"

------------------------------------------------------------------------

## 6. Emotional Design Principles

-   Large numbers
-   High contrast
-   Clear spacing
-   Avoid red error colors
-   Encouraging microcopy

------------------------------------------------------------------------

## 7. Behavioral Signals Captured

Track: - Time before selection - Time to compute 150 x 10 - Hint usage -
Mode selection

Send signals to Emotional State Engine.

------------------------------------------------------------------------

## 8. End State CTA

Button: "Entendi --- próxima etapa"

Micro reinforcement: "Você acabou de aplicar matemática a uma decisão
real."

------------------------------------------------------------------------

Design Outcome:

The user should leave thinking: "Eu consigo."
