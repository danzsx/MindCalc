"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Sparkles,
  Eye,
  ArrowRightLeft,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberBar } from "./NumberBar";
import { isApproximatelyEqual, parseNumericInput } from "@/lib/lessons/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Screen =
  | "observe"
  | "identify"
  | "gap"
  | "transfer"
  | "solve"
  | "summary";

const SCREEN_ORDER: Screen[] = [
  "observe",
  "identify",
  "gap",
  "transfer",
  "solve",
  "summary",
];

interface InteractiveLessonIntroProps {
  title: string;
  operand1: number;
  operand2: number;
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ScreenProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            i <= current
              ? "bg-primary w-6"
              : "bg-muted w-1.5"
          )}
        />
      ))}
    </div>
  );
}

function MicroWin({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 interactive-micro-win">
      <Sparkles className="size-4 text-emerald-500 shrink-0" />
      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {message}
      </span>
    </div>
  );
}

function FriendlyMessage({
  icon: Icon,
  children,
}: {
  icon: typeof Lightbulb;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/15 p-4 interactive-fade-up">
      <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <p
        className="text-body-primary text-foreground leading-relaxed pt-0.5"
        style={{ lineHeight: "var(--leading-relaxed)" }}
      >
        {children}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function InteractiveLessonIntro({
  title,
  operand1,
  operand2,
  onContinue,
}: InteractiveLessonIntroProps) {
  const [screen, setScreen] = useState<Screen>("observe");
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [identifyFeedback, setIdentifyFeedback] = useState(false);
  const [gapInput, setGapInput] = useState("");
  const [gapCorrect, setGapCorrect] = useState(false);
  const [transferStarted, setTransferStarted] = useState(false);
  const [transferDone, setTransferDone] = useState(false);
  const [solveInput, setSolveInput] = useState("");
  const [solveCorrect, setSolveCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const gapInputRef = useRef<HTMLInputElement>(null);
  const solveInputRef = useRef<HTMLInputElement>(null);

  // Computed values
  const targetTen = Math.ceil(operand2 / 10) * 10;
  const gap = targetTen - operand2;
  const adjustedOp1 = operand1 - gap;
  const result = adjustedOp1 + targetTen;
  const screenIndex = SCREEN_ORDER.indexOf(screen);

  // Other number's distance (for the "identify" screen choice)
  const otherTargetTen = Math.ceil(operand1 / 10) * 10;
  const otherGap = otherTargetTen - operand1;

  // Auto-focus inputs
  useEffect(() => {
    if (screen === "gap") {
      setTimeout(() => gapInputRef.current?.focus(), 400);
    }
    if (screen === "solve") {
      setTimeout(() => solveInputRef.current?.focus(), 400);
    }
  }, [screen]);

  const goNext = useCallback(() => {
    const nextIndex = screenIndex + 1;
    if (nextIndex < SCREEN_ORDER.length) {
      setScreen(SCREEN_ORDER[nextIndex]);
    }
  }, [screenIndex]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleIdentify = useCallback(
    (chosen: number) => {
      setSelectedNumber(chosen);
      if (chosen === operand2) {
        setIdentifyFeedback(true);
        setTimeout(() => goNext(), 1200);
      }
    },
    [operand2, goNext]
  );

  const handleGapSubmit = useCallback(() => {
    const num = parseNumericInput(gapInput);
    if (num === null) return;
    if (isApproximatelyEqual(gap, num)) {
      setGapCorrect(true);
      setTimeout(() => goNext(), 1200);
    } else {
      // Gentle shake
      gapInputRef.current?.classList.add("shake");
      setTimeout(
        () => gapInputRef.current?.classList.remove("shake"),
        500
      );
    }
  }, [gapInput, gap, goNext]);

  const handleTransfer = useCallback(() => {
    setTransferStarted(true);
    setTimeout(() => {
      setTransferDone(true);
    }, 800);
  }, []);

  const handleSolveSubmit = useCallback(() => {
    const num = parseNumericInput(solveInput);
    if (num === null) return;
    if (isApproximatelyEqual(result, num)) {
      setSolveCorrect(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      setTimeout(() => goNext(), 1500);
    } else {
      solveInputRef.current?.classList.add("shake");
      setTimeout(
        () => solveInputRef.current?.classList.remove("shake"),
        500
      );
    }
  }, [solveInput, result, goNext]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-section-title">{title}</h2>
        <ScreenProgress current={screenIndex} total={SCREEN_ORDER.length} />
      </div>

      {/* Confetti overlay */}
      {showConfetti && <IntroConfetti />}

      {/* ── Screen: Observe ── */}
      {screen === "observe" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Eye}>
            Olha esses dois numeros. Vamos somar eles de um jeito mais facil?
          </FriendlyMessage>

          {/* The expression */}
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold tracking-wide">
              <span className="text-primary">{operand1}</span>
              <span className="text-muted-foreground mx-3">+</span>
              <span className="text-amber-500">{operand2}</span>
            </p>
          </div>

          {/* Visual bars */}
          <div className="flex items-end justify-center gap-8 sm:gap-12 py-4">
            <NumberBar value={operand1} color="teal" />
            <div className="text-2xl font-bold text-muted-foreground/50 pb-8">+</div>
            <NumberBar value={operand2} color="amber" />
          </div>

          <Button onClick={goNext} className="w-full" size="lg">
            Bora!
            <Rocket className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Screen: Identify ── */}
      {screen === "identify" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Lightbulb}>
            Qual desses numeros esta mais pertinho de uma dezena redonda?
          </FriendlyMessage>

          <div className="grid grid-cols-2 gap-4">
            {/* Card for operand1 */}
            <button
              onClick={() => handleIdentify(operand1)}
              disabled={identifyFeedback}
              className={cn(
                "flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300",
                selectedNumber === operand1 && !identifyFeedback
                  ? "border-destructive/50 bg-destructive/5"
                  : selectedNumber === operand1
                    ? "border-muted bg-muted/30"
                    : "border-border hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <span
                className="text-3xl font-bold text-primary"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {operand1}
              </span>
              <span className="text-caption text-muted-foreground">
                falta {otherGap} pro {otherTargetTen}
              </span>
            </button>

            {/* Card for operand2 */}
            <button
              onClick={() => handleIdentify(operand2)}
              disabled={identifyFeedback}
              className={cn(
                "flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300",
                identifyFeedback && selectedNumber === operand2
                  ? "border-emerald-400 bg-emerald-500/10 ring-4 ring-emerald-400/20"
                  : "border-border hover:border-amber-400/40 hover:bg-amber-400/5"
              )}
            >
              <span
                className="text-3xl font-bold text-amber-500"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {operand2}
              </span>
              <span className="text-caption text-muted-foreground">
                falta {gap} pro {targetTen}
              </span>
            </button>
          </div>

          {/* Wrong choice feedback */}
          {selectedNumber === operand1 && !identifyFeedback && (
            <div className="text-center text-sm text-muted-foreground interactive-fade-up">
              Hmm, o {operand1} esta a {otherGap} do {otherTargetTen}. Tem um
              mais perto...
            </div>
          )}

          {/* Correct feedback */}
          {identifyFeedback && (
            <MicroWin
              message={`Isso! ${operand2} esta a so ${gap} de ${targetTen}!`}
            />
          )}
        </div>
      )}

      {/* ── Screen: Gap ── */}
      {screen === "gap" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Lightbulb}>
            Quanto falta pro <strong>{operand2}</strong> virar{" "}
            <strong>{targetTen}</strong>?
          </FriendlyMessage>

          {/* Visual: operand2's bar with gap visible */}
          <div className="flex justify-center py-2">
            <NumberBar
              value={operand2}
              color="amber"
              showGap
              gapFilled={gapCorrect ? gap : 0}
            />
          </div>

          {!gapCorrect && (
            <div className="flex gap-3 max-w-xs mx-auto">
              <Input
                ref={gapInputRef}
                type="number"
                inputMode="numeric"
                value={gapInput}
                onChange={(e) => setGapInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGapSubmit()}
                placeholder="?"
                className="text-center text-lg"
              />
              <Button
                onClick={handleGapSubmit}
                disabled={gapInput.trim() === ""}
              >
                Isso!
              </Button>
            </div>
          )}

          {gapCorrect && (
            <MicroWin message={`Exato! Faltam so ${gap}!`} />
          )}
        </div>
      )}

      {/* ── Screen: Transfer ── */}
      {screen === "transfer" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={ArrowRightLeft}>
            {!transferDone ? (
              <>
                Vamos pegar {gap} emprestado do{" "}
                <strong className="text-primary">{operand1}</strong> e dar
                pro <strong className="text-amber-500">{operand2}</strong>!
              </>
            ) : (
              <>
                Agora ficou{" "}
                <strong className="text-primary">{adjustedOp1}</strong> +{" "}
                <strong className="text-emerald-500">{targetTen}</strong> — bem
                mais facil!
              </>
            )}
          </FriendlyMessage>

          {/* Visual transfer */}
          <div className="relative flex items-end justify-center gap-8 sm:gap-12 py-4">
            <NumberBar
              value={operand1}
              color="teal"
              highlightTransfer={gap}
              transferDone={transferDone}
            />

            {/* Transfer arrow */}
            <div className="flex flex-col items-center gap-1 pb-8">
              {transferStarted && !transferDone && (
                <div className="interactive-transfer-arrow">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: gap }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-sm bg-amber-400 interactive-transfer-block"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {!transferStarted && (
                <ArrowRightLeft className="size-5 text-muted-foreground/50" />
              )}
              {transferDone && (
                <span className="text-xs text-emerald-500 font-medium">
                  +{gap}
                </span>
              )}
            </div>

            <NumberBar
              value={operand2}
              color="amber"
              showGap
              gapFilled={transferDone ? gap : 0}
            />
          </div>

          {!transferStarted && (
            <Button
              onClick={handleTransfer}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <ArrowRightLeft className="size-4 mr-2" />
              Transferir {gap}!
            </Button>
          )}

          {transferDone && (
            <div className="space-y-4">
              <MicroWin
                message={`Agora e so ${adjustedOp1} + ${targetTen}!`}
              />
              <Button onClick={goNext} className="w-full" size="lg">
                Vamos resolver!
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Screen: Solve ── */}
      {screen === "solve" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Sparkles}>
            Agora resolve essa conta mais facil:
          </FriendlyMessage>

          <div className="text-center py-2">
            <p className="text-4xl sm:text-5xl font-bold tracking-wide">
              <span className="text-primary">{adjustedOp1}</span>
              <span className="text-muted-foreground mx-3">+</span>
              <span className="text-emerald-500">{targetTen}</span>
              <span className="text-muted-foreground mx-2">=</span>
              <span className="text-foreground">?</span>
            </p>
          </div>

          {!solveCorrect && (
            <div className="flex gap-3 max-w-sm mx-auto">
              <Input
                ref={solveInputRef}
                type="number"
                inputMode="numeric"
                value={solveInput}
                onChange={(e) => setSolveInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSolveSubmit()}
                placeholder="Sua resposta"
                className="text-center text-xl"
              />
              <Button
                onClick={handleSolveSubmit}
                disabled={solveInput.trim() === ""}
                size="lg"
              >
                Essa!
              </Button>
            </div>
          )}

          {solveCorrect && (
            <div className="space-y-4">
              <div className="text-center interactive-number-reveal">
                <p className="text-5xl sm:text-6xl font-bold text-success">
                  = {result}
                </p>
              </div>
              <MicroWin message="Voce resolveu! Sem complicacao!" />
            </div>
          )}
        </div>
      )}

      {/* ── Screen: Summary ── */}
      {screen === "summary" && (
        <div className="space-y-6 interactive-fade-up">
          {/* Strategy recap card */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-6 space-y-5">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Voce descobriu o truque!
              </h3>
            </div>

            {/* Visual strategy recap */}
            <div className="space-y-3">
              <RecapStep
                number={1}
                color="cyan"
                text={
                  <>
                    <strong>{operand2}</strong> esta pertinho de{" "}
                    <strong>{targetTen}</strong> (falta {gap})
                  </>
                }
              />
              <RecapStep
                number={2}
                color="amber"
                text={
                  <>
                    Transferimos {gap} do <strong>{operand1}</strong> pro{" "}
                    <strong>{operand2}</strong>
                  </>
                }
              />
              <RecapStep
                number={3}
                color="emerald"
                text={
                  <>
                    <strong>
                      {adjustedOp1} + {targetTen} = {result}
                    </strong>{" "}
                    — facil!
                  </>
                }
              />
            </div>

            <p className="text-caption text-muted-foreground text-center">
              Esse truque funciona sempre que um numero esta pertinho de uma
              dezena!
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
// Sub-components
// ---------------------------------------------------------------------------

function RecapStep({
  number,
  color,
  text,
}: {
  number: number;
  color: "cyan" | "amber" | "emerald";
  text: React.ReactNode;
}) {
  const colorMap = {
    cyan: {
      badge: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-400/20",
      bg: "bg-cyan-500/5",
    },
    amber: {
      badge: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
      border: "border-amber-400/20",
      bg: "bg-amber-500/5",
    },
    emerald: {
      badge: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-400/20",
      bg: "bg-emerald-500/5",
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 interactive-fade-up",
        c.bg,
        c.border
      )}
      style={{ animationDelay: `${(number - 1) * 150}ms` }}
    >
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          c.badge
        )}
      >
        {number}
      </div>
      <span className="text-sm leading-relaxed">{text}</span>
    </div>
  );
}

const CONFETTI_COLORS = [
  "#22d3ee",
  "#fbbf24",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
];

function IntroConfetti() {
  return (
    <div className="confetti-container">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 + Math.random() * 20}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random() * 1}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
