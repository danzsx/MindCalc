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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getOperatorSymbol } from "@/lib/lessons/utils";
import {
  ScreenProgress,
  MicroWin,
  FriendlyMessage,
  RecapStep,
  Confetti,
} from "./shared";
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
        <p className="text-3xl sm:text-4xl font-bold tracking-wide">
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

  const handleChoice = useCallback(
    (value: string) => {
      setSelected(value);
      if (value === screen.correct) {
        setCorrect(true);
        setTimeout(() => onNext(), 1200);
      }
    },
    [screen.correct, onNext]
  );

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Lightbulb}>{screen.question}</FriendlyMessage>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {screen.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleChoice(opt.value)}
            disabled={correct}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all duration-300",
              correct && selected === opt.value && opt.value === screen.correct
                ? "border-emerald-400 bg-emerald-500/10 ring-4 ring-emerald-400/20"
                : selected === opt.value && opt.value !== screen.correct
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            <span
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {opt.label}
            </span>
            {opt.sublabel && (
              <span className="text-caption text-muted-foreground">
                {opt.sublabel}
              </span>
            )}
          </button>
        ))}
      </div>

      {selected && !correct && (
        <div className="text-center text-sm text-muted-foreground interactive-fade-up">
          {screen.wrongMsg}
        </div>
      )}

      {correct && <MicroWin message={screen.winMsg} />}
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = Number(input.trim());
    if (isNaN(num)) return;
    if (num === screen.answer) {
      setDone(true);
      setTimeout(() => onNext(), 1200);
    } else {
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [input, screen.answer, onNext]);

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
      )}

      {done && <MicroWin message={screen.winMsg} />}
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = Number(input.trim());
    if (isNaN(num)) return;
    if (num === screen.answer) {
      setDone(true);
      onConfetti();
      setTimeout(() => onNext(), 1500);
    } else {
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [input, screen.answer, onNext, onConfetti]);

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
            className="text-center text-xl"
          />
          <Button onClick={handleSubmit} disabled={input.trim() === ""} size="lg">
            Essa!
          </Button>
        </div>
      )}

      {done && (
        <div className="space-y-4">
          <div className="text-center interactive-number-reveal">
            <p className="text-5xl sm:text-6xl font-bold text-success">
              = {screen.answer}
            </p>
          </div>
          <MicroWin message={screen.winMsg} />
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
