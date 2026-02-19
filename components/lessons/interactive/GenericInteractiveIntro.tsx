"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Sparkles,
  Lightbulb,
  Rocket,
  Wand2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getOperatorSymbol,
  isApproximatelyEqual,
  parseNumericInput,
} from "@/lib/lessons/utils";
import {
  ScreenProgress,
  MicroWin,
  FriendlyMessage,
  RecapStep,
  Confetti,
} from "./shared";
import { DragDecompose } from "./DragDecompose";
import { EquationFill } from "./EquationFill";
import { NumberSlider } from "./NumberSlider";
import type { IntroScreen } from "@/lib/lessons/types";
import type { Operator } from "@/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface GenericInteractiveIntroProps {
  title: string;
  operand1: number | string;
  operand2: number | string;
  operator: Operator;
  screens: IntroScreen[];
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function GenericInteractiveIntro({
  title,
  operand1,
  operand2,
  operator,
  screens,
  onContinue,
}: GenericInteractiveIntroProps) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const screen = screens[screenIndex];

  const goNext = useCallback(() => {
    if (screenIndex + 1 < screens.length) {
      setScreenIndex((i) => i + 1);
    }
  }, [screenIndex, screens.length]);

  const symbol = getOperatorSymbol(operator);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-section-title">{title}</h2>
        <ScreenProgress current={screenIndex} total={screens.length} />
      </div>

      {/* Confetti overlay */}
      {showConfetti && <Confetti intensity={1.5} />}

      {/* Screen: Observe */}
      {screen.kind === "observe" && (
        <ObserveScreen
          screen={screen}
          operand1={operand1}
          operand2={operand2}
          symbol={symbol}
          onNext={goNext}
        />
      )}

      {/* Screen: Choice */}
      {screen.kind === "choice" && (
        <ChoiceScreen screen={screen} onNext={goNext} />
      )}

      {/* Screen: Fill */}
      {screen.kind === "fill" && (
        <FillScreen screen={screen} onNext={goNext} />
      )}

      {/* Screen: Action */}
      {screen.kind === "action" && (
        <ActionScreen screen={screen} onNext={goNext} />
      )}

      {/* Screen: Solve */}
      {screen.kind === "solve" && (
        <SolveScreen
          screen={screen}
          onNext={goNext}
          onConfetti={() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2500);
          }}
        />
      )}

      {/* Screen: Summary */}
      {screen.kind === "summary" && (
        <SummaryScreen screen={screen} onContinue={onContinue} />
      )}

      {/* Screen: DragDecompose (Phase 4.1) */}
      {screen.kind === "drag-decompose" && (
        <DragDecompose
          number={screen.number}
          winMsg={screen.winMsg}
          onNext={
            screenIndex + 1 < screens.length ? goNext : onContinue
          }
        />
      )}

      {/* Screen: EquationFill (Phase 4.3) */}
      {screen.kind === "equation-fill" && (
        <EquationFill
          question={screen.question}
          equationLeft={screen.equationLeft}
          equationRight={screen.equationRight}
          answer={screen.answer}
          winMsg={screen.winMsg}
          wrongMsg={screen.wrongMsg}
          onNext={
            screenIndex + 1 < screens.length ? goNext : onContinue
          }
        />
      )}

      {/* Screen: NumberSlider (Phase 4.5) */}
      {screen.kind === "number-slider" && (
        <NumberSlider
          question={screen.question}
          number={screen.number}
          target={screen.target}
          winMsg={screen.winMsg}
          onNext={
            screenIndex + 1 < screens.length ? goNext : onContinue
          }
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Observe Screen
// ---------------------------------------------------------------------------

function ObserveScreen({
  screen,
  operand1,
  operand2,
  symbol,
  onNext,
}: {
  screen: Extract<IntroScreen, { kind: "observe" }>;
  operand1: number | string;
  operand2: number | string;
  symbol: string;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6 interactive-fade-up">
      <FriendlyMessage icon={Lightbulb}>{screen.message}</FriendlyMessage>

      <div className="text-center py-2">
        <p className="text-4xl sm:text-5xl font-bold tracking-wide">
          {screen.expressionLabel ? (
            <span className="text-foreground">{screen.expressionLabel}</span>
          ) : (
            <>
              <span className="text-primary">{operand1}</span>
              <span className="text-muted-foreground mx-3">{symbol}</span>
              <span className="text-amber-500">{operand2}</span>
            </>
          )}
        </p>
      </div>

      <Button onClick={onNext} className="w-full" size="lg">
        Bora!
        <Rocket className="size-4 ml-2" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Choice Screen
// ---------------------------------------------------------------------------

function ChoiceScreen({
  screen,
  onNext,
}: {
  screen: Extract<IntroScreen, { kind: "choice" }>;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const handleChoice = useCallback(
    (value: string) => {
      if (correct) return;
      setSelected(value);
      if (value === screen.correct) {
        setCorrect(true);
      } else {
        setWrongAttempts((n) => n + 1);
      }
    },
    [correct, screen.correct]
  );

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Lightbulb}>{screen.question}</FriendlyMessage>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {screen.options.map((opt) => {
          const isSelected = selected === opt.value;
          const isCorrectOpt = opt.value === screen.correct;
          const isWrong = isSelected && !isCorrectOpt;
          const isWinner = isSelected && isCorrectOpt && correct;

          return (
            <button
              key={opt.value}
              onClick={() => handleChoice(opt.value)}
              disabled={correct}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 min-h-[80px]",
                "transition-all duration-300 select-none",
                "hover:scale-[1.03] active:scale-95",
                isWinner
                  ? "border-emerald-400 bg-emerald-500/10 ring-4 ring-emerald-400/20 scale-[1.03]"
                  : isWrong
                    ? "border-destructive/50 bg-destructive/5 shake"
                    : correct && isCorrectOpt
                      ? "border-emerald-300/50 bg-emerald-500/5"
                      : "border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm"
              )}
            >
              {/* Status icon */}
              {isWinner && (
                <CheckCircle2 className="absolute top-2 right-2 size-4 text-emerald-500" />
              )}
              {isWrong && (
                <XCircle className="absolute top-2 right-2 size-4 text-destructive/70" />
              )}

              <span
                className={cn(
                  "text-2xl font-bold transition-colors duration-200",
                  isWinner
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isWrong
                      ? "text-destructive/80"
                      : "text-foreground"
                )}
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {opt.label}
              </span>
              {opt.sublabel && (
                <span
                  className={cn(
                    "text-[11px] font-medium transition-colors duration-200",
                    isWinner
                      ? "text-emerald-600/70 dark:text-emerald-400/70"
                      : "text-muted-foreground"
                  )}
                >
                  {opt.sublabel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Wrong feedback */}
      {selected && !correct && wrongAttempts > 0 && (
        <div className="text-center text-sm text-muted-foreground interactive-fade-up">
          {screen.wrongMsg}
        </div>
      )}

      {/* Success */}
      {correct && (
        <div className="space-y-4 interactive-fade-up">
          <MicroWin message={screen.winMsg} />
          <Button onClick={onNext} className="w-full" size="lg">
            Continuar
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fill Screen
// ---------------------------------------------------------------------------

function FillScreen({
  screen,
  onNext,
}: {
  screen: Extract<IntroScreen, { kind: "fill" }>;
  onNext: () => void;
}) {
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseNumericInput(input);
    if (num === null) return;
    if (isApproximatelyEqual(screen.answer, num)) {
      setDone(true);
      setWrongFeedback(null);
      // Avanço acontece via botão "Continuar →"
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setWrongFeedback(
        nextAttempts >= 2
          ? screen.wrongMsg ?? "Quase. Releia a conta e tente novamente."
          : "Ainda não. Tente mais uma vez."
      );
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [attempts, input, screen.answer, screen.wrongMsg]);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Lightbulb}>{screen.question}</FriendlyMessage>

      {screen.equationHint && (
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold tracking-wide text-muted-foreground">
            {screen.equationHint}
          </p>
        </div>
      )}

      {!done && (
        <div className="flex gap-3 max-w-sm mx-auto">
          <Input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="?"
            className="text-center text-xl h-12"
          />
          <Button onClick={handleSubmit} disabled={input.trim() === ""} size="lg" className="shrink-0">
            Isso!
          </Button>
        </div>
      )}

      {wrongFeedback && !done && (
        <p className="text-center text-sm text-muted-foreground">
          {wrongFeedback}
        </p>
      )}

      {done && (
        <div className="space-y-4 interactive-fade-up">
          <MicroWin message={screen.winMsg} />
          <Button onClick={onNext} className="w-full" size="lg">
            Continuar
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action Screen
// ---------------------------------------------------------------------------

function ActionScreen({
  screen,
  onNext,
}: {
  screen: Extract<IntroScreen, { kind: "action" }>;
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  const handleAction = useCallback(() => {
    setRevealed(true);
  }, []);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Wand2}>{screen.message}</FriendlyMessage>

      {!revealed && (
        <Button
          onClick={handleAction}
          className="w-full"
          size="lg"
          variant="outline"
        >
          <Wand2 className="size-4 mr-2" />
          {screen.buttonText}
        </Button>
      )}

      {revealed && (
        <div className="space-y-4 interactive-fade-up">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">
              {screen.resultMessage}
            </p>
            {screen.resultHighlight && (
              <p className="text-sm text-primary font-medium">
                {screen.resultHighlight}
              </p>
            )}
          </div>
          <Button onClick={onNext} className="w-full" size="lg">
            Continuar
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Solve Screen
// ---------------------------------------------------------------------------

function SolveScreen({
  screen,
  onNext,
  onConfetti,
}: {
  screen: Extract<IntroScreen, { kind: "solve" }>;
  onNext: () => void;
  onConfetti: () => void;
}) {
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseNumericInput(input);
    if (num === null) return;
    if (isApproximatelyEqual(screen.answer, num)) {
      setDone(true);
      setWrongFeedback(null);
      onConfetti();
      // Avanço acontece via botão "Continuar →"
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setWrongFeedback(
        nextAttempts >= 2
          ? screen.wrongMsg ?? "Quase. Use o passo anterior como pista."
          : "Ainda não. Faça a conta com calma."
      );
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [attempts, input, onConfetti, screen.answer, screen.wrongMsg]);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Sparkles}>{screen.message}</FriendlyMessage>

      <div className="text-center py-2">
        <p className="text-4xl sm:text-5xl font-bold tracking-wide text-foreground">
          {screen.equationDisplay}
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
            className="text-center text-xl h-12"
          />
          <Button onClick={handleSubmit} disabled={input.trim() === ""} size="lg" className="shrink-0">
            Essa!
          </Button>
        </div>
      )}

      {wrongFeedback && !done && (
        <p className="text-center text-sm text-muted-foreground">
          {wrongFeedback}
        </p>
      )}

      {done && (
        <div className="space-y-4 interactive-fade-up">
          <div className="text-center interactive-number-reveal">
            <p className="text-5xl sm:text-6xl font-bold text-success">
              = {screen.answer}
            </p>
          </div>
          <MicroWin message={screen.winMsg} />
          <Button onClick={onNext} className="w-full" size="lg">
            Continuar
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary Screen
// ---------------------------------------------------------------------------

function SummaryScreen({
  screen,
  onContinue,
}: {
  screen: Extract<IntroScreen, { kind: "summary" }>;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6 interactive-fade-up">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-6 space-y-5">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="size-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Voce descobriu o truque!
          </h3>
        </div>

        <div className="space-y-3">
          {screen.recapSteps.map((step, i) => (
            <RecapStep
              key={i}
              number={i + 1}
              color={step.color}
              text={step.text}
            />
          ))}
        </div>

        <p className="text-caption text-muted-foreground text-center">
          {screen.closingMsg}
        </p>
      </div>

      <Button onClick={onContinue} className="w-full" size="lg">
        Entendi! Vamos praticar
        <ArrowRight className="size-4 ml-2" />
      </Button>
    </div>
  );
}
