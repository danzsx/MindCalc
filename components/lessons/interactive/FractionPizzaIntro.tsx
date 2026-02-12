"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Sparkles,
  Lightbulb,
  Rocket,
  Scissors,
  Pizza,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isApproximatelyEqual, parseNumericInput } from "@/lib/lessons/utils";
import {
  ScreenProgress,
  MicroWin,
  FriendlyMessage,
  RecapStep,
  Confetti,
} from "./shared";
import { PizzaFraction, PizzaRow } from "./PizzaFraction";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Screen =
  | "welcome"
  | "whole"
  | "cut-half"
  | "practice-half"
  | "cut-third"
  | "quiz-third"
  | "cut-quarter"
  | "practice-solve"
  | "summary";

const SCREENS: Screen[] = [
  "welcome",
  "whole",
  "cut-half",
  "practice-half",
  "cut-third",
  "quiz-third",
  "cut-quarter",
  "practice-solve",
  "summary",
];

interface FractionPizzaIntroProps {
  title: string;
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function FractionPizzaIntro({
  title,
  onContinue,
}: FractionPizzaIntroProps) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const screen = SCREENS[screenIndex];

  const goNext = useCallback(() => {
    if (screenIndex + 1 < SCREENS.length) {
      setScreenIndex((i) => i + 1);
    }
  }, [screenIndex]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-section-title">{title}</h2>
        <ScreenProgress current={screenIndex} total={SCREENS.length} />
      </div>

      {showConfetti && <Confetti intensity={1.5} />}

      {/* ── Screen: Welcome ── */}
      {screen === "welcome" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Pizza}>
            Fração parece difícil? Relaxa! Vamos entender usando algo que
            todo mundo ama: <strong>pizza</strong>!
          </FriendlyMessage>

          <div className="flex justify-center py-4">
            <div className="pizza-bounce">
              <PizzaFraction slices={1} size={160} />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Uma pizza inteira. Delícia, né?
          </p>

          <Button onClick={goNext} className="w-full" size="lg">
            Bora aprender!
            <Rocket className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Screen: Whole Pizza ── */}
      {screen === "whole" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Lightbulb}>
            <strong>Fração</strong> é só dividir algo em{" "}
            <strong>partes iguais</strong>. Quando temos a pizza inteira,
            temos <strong>1/1</strong> — ou seja, tudo!
          </FriendlyMessage>

          <div className="flex justify-center py-2">
            <PizzaFraction slices={1} size={150} showLabel label="1 inteira = 1/1" />
          </div>

          <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 p-4 text-center">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Agora vamos cortar essa pizza e ver o que acontece...
            </p>
          </div>

          <Button onClick={goNext} className="w-full" size="lg">
            <Scissors className="size-4 mr-2" />
            Cortar a pizza!
          </Button>
        </div>
      )}

      {/* ── Screen: Cut in Half ── */}
      {screen === "cut-half" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Scissors}>
            Cortamos a pizza em <strong>2 partes iguais</strong>. Cada
            pedaço é <strong>a metade</strong> — ou seja,{" "}
            <strong>1/2</strong> (um meio).
          </FriendlyMessage>

          <div className="flex items-center justify-center gap-8 py-4">
            {/* Full pizza faded */}
            <div className="flex flex-col items-center gap-1 opacity-40">
              <PizzaFraction slices={1} size={90} />
              <span className="text-xs text-muted-foreground">antes</span>
            </div>

            <ArrowRight className="size-5 text-muted-foreground" />

            {/* Cut pizza */}
            <div className="flex flex-col items-center gap-1">
              <PizzaFraction
                slices={2}
                highlighted={1}
                size={130}
                animateCuts
                animateHighlight
                showLabel
                label="1/2 (metade)"
              />
            </div>
          </div>

          <div className="rounded-xl bg-cyan-500/10 border border-cyan-400/20 p-4 space-y-2">
            <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 text-center">
              Metade = dividir por 2
            </p>
            <p className="text-xs text-muted-foreground text-center">
              O número de baixo da fração (denominador) diz em quantas partes
              dividimos.
            </p>
          </div>

          <Button onClick={goNext} className="w-full" size="lg">
            Entendi! Próximo
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Screen: Practice Half ── */}
      {screen === "practice-half" && (
        <PracticeHalfScreen onNext={goNext} />
      )}

      {/* ── Screen: Cut in Thirds ── */}
      {screen === "cut-third" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Scissors}>
            Agora cortamos em <strong>3 partes iguais</strong>. Cada pedaço
            é <strong>um terço</strong> — ou seja, <strong>1/3</strong>.
          </FriendlyMessage>

          <div className="flex items-center justify-center gap-8 py-4">
            <div className="flex flex-col items-center gap-1 opacity-40">
              <PizzaFraction slices={1} size={90} />
              <span className="text-xs text-muted-foreground">antes</span>
            </div>

            <ArrowRight className="size-5 text-muted-foreground" />

            <div className="flex flex-col items-center gap-1">
              <PizzaFraction
                slices={3}
                highlighted={1}
                size={130}
                animateCuts
                animateHighlight
                showLabel
                label="1/3 (um terço)"
              />
            </div>
          </div>

          <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 p-4 space-y-2">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 text-center">
              Terço = dividir por 3
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Se tem 3 amigos e 1 pizza, cada um come 1/3!
            </p>
          </div>

          <Button onClick={goNext} className="w-full" size="lg">
            Faz sentido!
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Screen: Quiz Third ── */}
      {screen === "quiz-third" && <QuizThirdScreen onNext={goNext} />}

      {/* ── Screen: Cut in Quarters ── */}
      {screen === "cut-quarter" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Scissors}>
            Por fim, <strong>4 partes iguais</strong>. Cada pedaço é{" "}
            <strong>um quarto</strong> — ou <strong>1/4</strong>.
          </FriendlyMessage>

          {/* Show all three side by side */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 py-4">
            <div className="flex flex-col items-center gap-2">
              <PizzaFraction slices={2} highlighted={1} size={80} showLabel label="1/2" />
              <span className="text-xs text-muted-foreground">metade</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PizzaFraction slices={3} highlighted={1} size={80} showLabel label="1/3" />
              <span className="text-xs text-muted-foreground">terço</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PizzaFraction
                slices={4}
                highlighted={1}
                size={100}
                animateCuts
                animateHighlight
                showLabel
                label="1/4"
              />
              <span className="text-xs font-medium text-foreground">quarto</span>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 p-4 space-y-2">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 text-center">
              Quarto = dividir por 4
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Quanto mais partes, menor cada pedaço!
              <br />
              1/2 &gt; 1/3 &gt; 1/4
            </p>
          </div>

          <Button onClick={goNext} className="w-full" size="lg">
            Agora vamos calcular!
            <Sparkles className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Screen: Practice Solve ── */}
      {screen === "practice-solve" && (
        <PracticeSolveScreen onNext={goNext} onConfetti={triggerConfetti} />
      )}

      {/* ── Screen: Summary ── */}
      {screen === "summary" && (
        <div className="space-y-6 interactive-fade-up">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-6 space-y-5">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Você entendeu frações!
              </h3>
            </div>

            {/* Visual summary with pizzas */}
            <div className="flex items-end justify-center gap-6 py-2">
              <div className="flex flex-col items-center gap-1">
                <PizzaFraction slices={2} highlighted={1} size={60} />
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  1/2
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <PizzaFraction slices={3} highlighted={1} size={60} />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  1/3
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <PizzaFraction slices={4} highlighted={1} size={60} />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  1/4
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <RecapStep
                number={1}
                color="cyan"
                text="Fração = dividir em partes iguais"
              />
              <RecapStep
                number={2}
                color="amber"
                text="O denominador (número de baixo) diz em quantas partes dividimos"
              />
              <RecapStep
                number={3}
                color="emerald"
                text="Metade = ÷2, Terço = ÷3, Quarto = ÷4"
              />
            </div>

            <p className="text-caption text-muted-foreground text-center">
              Para calcular a fração de um número, é só dividir!
              <br />
              1/3 de 60 = 60 ÷ 3 = 20
            </p>
          </div>

          <Button onClick={onContinue} className="w-full" size="lg">
            Entendi! Vamos praticar
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Practice Half Screen — interactive exercise with visual pizzas
// ---------------------------------------------------------------------------

function PracticeHalfScreen({ onNext }: { onNext: () => void }) {
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseNumericInput(input);
    if (num === null) return;
    if (isApproximatelyEqual(6, num)) {
      setDone(true);
      setTimeout(() => onNext(), 1400);
    } else {
      setWrongCount((c) => c + 1);
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [input, onNext]);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Users}>
        Imagine que você tem <strong>12 fatias de pizza</strong> e quer
        dividir pela <strong>metade</strong> (entre 2 amigos). Quantas
        fatias cada um ganha?
      </FriendlyMessage>

      {/* Visual: 12 mini pizzas */}
      <div className="py-2">
        <PizzaRow
          count={12}
          pizzaSize={40}
          stagger
          groupSize={done ? 6 : undefined}
        />
      </div>

      {!done && (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              12 ÷ 2 = <span className="text-primary">?</span>
            </p>
          </div>
          <div className="flex gap-3 max-w-xs mx-auto">
            <Input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="?"
              className="text-center text-lg"
            />
            <Button onClick={handleSubmit} disabled={input.trim() === ""}>
              Isso!
            </Button>
          </div>
          {wrongCount > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              {wrongCount >= 2
                ? "Dica: divida as 12 fatias em 2 grupos iguais."
                : "Quase! Tente novamente."}
            </p>
          )}
        </div>
      )}

      {done && (
        <div className="space-y-3">
          <MicroWin message="Isso! 12 ÷ 2 = 6. Cada amigo ganha 6 fatias!" />
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-muted-foreground">Amigo 1: 6 fatias</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Amigo 2: 6 fatias</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quiz Third Screen — multiple choice
// ---------------------------------------------------------------------------

function QuizThirdScreen({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);

  const handleChoice = useCallback(
    (value: string) => {
      setSelected(value);
      if (value === "3") {
        setCorrect(true);
        setTimeout(() => onNext(), 1200);
      }
    },
    [onNext]
  );

  const options = [
    { value: "2", label: "÷ 2", sublabel: "metade", pizza: 2 },
    { value: "3", label: "÷ 3", sublabel: "terço", pizza: 3 },
    { value: "4", label: "÷ 4", sublabel: "quarto", pizza: 4 },
  ];

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Lightbulb}>
        Um <strong>terço</strong> significa dividir por quanto?
      </FriendlyMessage>

      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleChoice(opt.value)}
            disabled={correct}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300",
              correct && selected === opt.value
                ? "border-emerald-400 bg-emerald-500/10 ring-4 ring-emerald-400/20"
                : selected === opt.value && !correct
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            <PizzaFraction slices={opt.pizza} highlighted={1} size={60} />
            <span
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {opt.label}
            </span>
            <span className="text-xs text-muted-foreground">{opt.sublabel}</span>
          </button>
        ))}
      </div>

      {selected && !correct && (
        <p className="text-center text-sm text-muted-foreground interactive-fade-up">
          Terço vem de <strong>três</strong> partes iguais... Tente o ÷ 3!
        </p>
      )}

      {correct && (
        <MicroWin message="Isso! Terço = dividir por 3!" />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Practice Solve Screen — solve 1/3 of 60
// ---------------------------------------------------------------------------

function PracticeSolveScreen({
  onNext,
  onConfetti,
}: {
  onNext: () => void;
  onConfetti: () => void;
}) {
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseNumericInput(input);
    if (num === null) return;
    if (isApproximatelyEqual(20, num)) {
      setDone(true);
      onConfetti();
      setTimeout(() => onNext(), 1800);
    } else {
      setWrongCount((c) => c + 1);
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [input, onNext, onConfetti]);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Sparkles}>
        Agora o desafio! Quanto é <strong>1/3 de 60</strong>?
      </FriendlyMessage>

      <div className="flex justify-center py-2">
        <PizzaFraction
          slices={3}
          highlighted={1}
          size={120}
          animateHighlight
        />
      </div>

      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-bold tracking-wide text-foreground">
          60 ÷ 3 = <span className="text-primary">?</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          1/3 de 60 = dividir 60 por 3
        </p>
      </div>

      {!done && (
        <div className="flex gap-3 max-w-sm mx-auto">
          <Input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Sua resposta"
            className="text-center text-xl"
          />
          <Button onClick={handleSubmit} disabled={input.trim() === ""} size="lg">
            Essa!
          </Button>
        </div>
      )}

      {wrongCount > 0 && !done && (
        <p className="text-center text-xs text-muted-foreground">
          {wrongCount >= 2
            ? "Dica: 60 dividido por 3... Pense: 3 × ? = 60"
            : "Quase. Faça a divisão com calma."}
        </p>
      )}

      {done && (
        <div className="space-y-3">
          <div className="text-center interactive-number-reveal">
            <p className="text-5xl sm:text-6xl font-bold text-success">= 20</p>
          </div>
          <MicroWin message="1/3 de 60 = 20. Você é fera!" />
        </div>
      )}
    </div>
  );
}
