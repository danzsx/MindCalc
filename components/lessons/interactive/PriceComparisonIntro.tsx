"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Sparkles,
  Lightbulb,
  Rocket,
  ShoppingCart,
  Tag,
  Trophy,
  Scale,
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Screen =
  | "welcome"
  | "show-products"
  | "trap"
  | "reveal"
  | "calc-a"
  | "calc-b"
  | "compare"
  | "summary";

const SCREENS: Screen[] = [
  "welcome",
  "show-products",
  "trap",
  "reveal",
  "calc-a",
  "calc-b",
  "compare",
  "summary",
];

interface PriceComparisonIntroProps {
  title: string;
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// SVG Visual Components
// ---------------------------------------------------------------------------

function ProductBox({
  label,
  price,
  quantity,
  color,
  accent,
  size = 140,
  animate = false,
  showUnitPrice,
  unitPrice,
  isWinner = false,
}: {
  label: string;
  price: number;
  quantity: number;
  color: string;
  accent: string;
  size?: number;
  animate?: boolean;
  showUnitPrice?: boolean;
  unitPrice?: number;
  isWinner?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 transition-all duration-500",
        animate && "price-product-pop"
      )}
    >
      {/* Box */}
      <div
        className={cn(
          "relative rounded-2xl border-2 p-3 transition-all duration-500",
          isWinner
            ? "border-emerald-400 ring-4 ring-emerald-400/20 bg-emerald-500/5"
            : "border-border bg-card"
        )}
        style={{ width: size, minHeight: size }}
      >
        {/* Winner crown */}
        {isWinner && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 price-winner-crown">
            <Trophy className="size-6 text-amber-500" />
          </div>
        )}

        {/* Product label */}
        <div
          className="text-center font-bold text-xs mb-2"
          style={{
            fontFamily: "var(--font-family-display)",
            color: accent,
          }}
        >
          {label}
        </div>

        {/* Items grid */}
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: quantity }).map((_, i) => (
            <div
              key={i}
              className="price-item-pop"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="12"
                  rx="3"
                  fill={color}
                  opacity={0.2}
                  stroke={color}
                  strokeWidth="1.5"
                />
                <rect x="6" y="7" width="8" height="2" rx="1" fill={color} opacity={0.5} />
                <rect x="6" y="11" width="5" height="2" rx="1" fill={color} opacity={0.3} />
              </svg>
            </div>
          ))}
        </div>

        {/* Quantity label */}
        <div className="text-center mt-2">
          <span className="text-xs text-muted-foreground">{quantity} und.</span>
        </div>
      </div>

      {/* Price tag */}
      <div
        className={cn(
          "price-tag-pop relative px-3 py-1.5 rounded-xl text-center",
          "border-2 font-bold"
        )}
        style={{
          borderColor: accent,
          backgroundColor: `${accent}15`,
          fontFamily: "var(--font-family-display)",
        }}
      >
        <span style={{ color: accent }} className="text-lg">
          R${price}
        </span>
      </div>

      {/* Unit price (conditionally shown) */}
      {showUnitPrice && unitPrice !== undefined && (
        <div className="price-unit-reveal text-center">
          <span
            className="text-sm font-bold"
            style={{ color: accent }}
          >
            R${unitPrice}/und.
          </span>
        </div>
      )}
    </div>
  );
}

function DivisionVisual({
  total,
  quantity,
  result,
  color,
  showResult,
}: {
  total: number;
  quantity: number;
  result: number;
  color: string;
  showResult: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div
        className="flex flex-col items-center price-coin-stack"
      >
        <div
          className="rounded-xl px-4 py-2 font-bold text-2xl"
          style={{
            fontFamily: "var(--font-family-display)",
            color,
            backgroundColor: `${color}15`,
            border: `2px solid ${color}40`,
          }}
        >
          R${total}
        </div>
      </div>

      <span className="text-2xl text-muted-foreground font-bold">/</span>

      <div className="flex flex-col items-center">
        <div
          className="rounded-xl px-4 py-2 font-bold text-2xl"
          style={{
            fontFamily: "var(--font-family-display)",
            color: "var(--foreground)",
            backgroundColor: "var(--muted)",
          }}
        >
          {quantity}
        </div>
      </div>

      <span className="text-2xl text-muted-foreground font-bold">=</span>

      <div className="flex flex-col items-center">
        {showResult ? (
          <div
            className="rounded-xl px-4 py-2 font-bold text-2xl interactive-number-reveal"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "2px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            R${result}
          </div>
        ) : (
          <div
            className="rounded-xl px-4 py-2 font-bold text-2xl text-primary"
            style={{
              fontFamily: "var(--font-family-display)",
              backgroundColor: "var(--muted)",
            }}
          >
            ?
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonScale({
  priceA,
  priceB,
  revealed,
}: {
  priceA: number;
  priceB: number;
  revealed: boolean;
}) {
  return (
    <div className={cn("relative py-6", revealed && "price-scale-reveal")}>
      {/* Scale bar */}
      <div className="relative mx-auto" style={{ maxWidth: 280 }}>
        {/* Center pivot */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-10">
          <Scale className="size-5 text-muted-foreground" />
        </div>

        {/* Bar */}
        <div
          className={cn(
            "h-1 rounded-full bg-muted mx-8 mt-3 transition-transform duration-700",
            revealed && "origin-center"
          )}
          style={{
            transform: revealed ? "rotate(-3deg)" : "rotate(0deg)",
          }}
        />

        {/* Pans */}
        <div className="flex justify-between mt-3">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={cn(
                "rounded-xl px-3 py-2 text-center transition-all duration-500",
                revealed
                  ? "bg-emerald-500/10 border-2 border-emerald-400 ring-4 ring-emerald-400/20"
                  : "bg-cyan-500/10 border border-cyan-400/30"
              )}
            >
              <span
                className="text-lg font-bold"
                style={{
                  fontFamily: "var(--font-family-display)",
                  color: revealed ? "#10B981" : "#22d3ee",
                }}
              >
                R${priceA}
              </span>
              <p className="text-xs text-muted-foreground">cada (A)</p>
            </div>
            {revealed && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 price-winner-crown">
                Mais barato!
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={cn(
                "rounded-xl px-3 py-2 text-center transition-all duration-500",
                revealed
                  ? "bg-destructive/5 border border-destructive/30 opacity-60"
                  : "bg-amber-500/10 border border-amber-400/30"
              )}
            >
              <span
                className="text-lg font-bold"
                style={{
                  fontFamily: "var(--font-family-display)",
                  color: revealed ? "var(--destructive)" : "#fbbf24",
                }}
              >
                R${priceB}
              </span>
              <p className="text-xs text-muted-foreground">cada (B)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function PriceComparisonIntro({
  title,
  onContinue,
}: PriceComparisonIntroProps) {
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
          <FriendlyMessage icon={ShoppingCart}>
            Imagine que voce esta no mercado e precisa escolher entre{" "}
            <strong>dois pacotes do mesmo produto</strong>. Qual vale mais a
            pena? Vamos descobrir!
          </FriendlyMessage>

          <div className="flex justify-center py-4">
            <div className="price-cart-bounce relative">
              <div className="rounded-full bg-primary/10 p-6">
                <ShoppingCart className="size-12 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 price-tag-pop">
                <div className="rounded-full bg-amber-500 text-white text-xs font-bold px-2 py-0.5">
                  R$?
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            O preco total pode enganar... vamos aprender a comparar direito!
          </p>

          <Button onClick={goNext} className="w-full" size="lg">
            Bora pro mercado!
            <Rocket className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Screen: Show Products ── */}
      {screen === "show-products" && (
        <div className="space-y-6 interactive-fade-up">
          <FriendlyMessage icon={Tag}>
            Olha so essas duas opcoes na prateleira. Preste atencao no{" "}
            <strong>preco</strong> e na <strong>quantidade</strong>:
          </FriendlyMessage>

          <div className="flex items-start justify-center gap-6 sm:gap-8 py-2">
            <ProductBox
              label="Pacote A"
              price={24}
              quantity={6}
              color="#22d3ee"
              accent="#22d3ee"
              animate
            />
            <ProductBox
              label="Pacote B"
              price={20}
              quantity={4}
              color="#fbbf24"
              accent="#fbbf24"
              animate
            />
          </div>

          <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>A:</strong> R$24 por 6 unidades &nbsp;&bull;&nbsp;{" "}
              <strong>B:</strong> R$20 por 4 unidades
            </p>
          </div>

          <Button onClick={goNext} className="w-full" size="lg">
            Vi os dois! E agora?
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── Screen: Trap ── */}
      {screen === "trap" && <TrapScreen onNext={goNext} />}

      {/* ── Screen: Reveal ── */}
      {screen === "reveal" && <RevealScreen onNext={goNext} />}

      {/* ── Screen: Calc A ── */}
      {screen === "calc-a" && (
        <CalcScreen
          label="Pacote A"
          price={24}
          quantity={6}
          answer={4}
          color="#22d3ee"
          onNext={goNext}
        />
      )}

      {/* ── Screen: Calc B ── */}
      {screen === "calc-b" && (
        <CalcScreen
          label="Pacote B"
          price={20}
          quantity={4}
          answer={5}
          color="#fbbf24"
          onNext={goNext}
        />
      )}

      {/* ── Screen: Compare ── */}
      {screen === "compare" && (
        <CompareScreen onNext={goNext} onConfetti={triggerConfetti} />
      )}

      {/* ── Screen: Summary ── */}
      {screen === "summary" && (
        <div className="space-y-6 interactive-fade-up">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-6 space-y-5">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Voce descobriu o truque!
              </h3>
            </div>

            {/* Visual comparison */}
            <div className="flex items-start justify-center gap-6 py-2">
              <ProductBox
                label="A"
                price={24}
                quantity={6}
                color="#22d3ee"
                accent="#22d3ee"
                size={100}
                showUnitPrice
                unitPrice={4}
                isWinner
              />
              <ProductBox
                label="B"
                price={20}
                quantity={4}
                color="#fbbf24"
                accent="#fbbf24"
                size={100}
                showUnitPrice
                unitPrice={5}
              />
            </div>

            <div className="space-y-3">
              <RecapStep
                number={1}
                color="cyan"
                text="Divida o preco total pela quantidade = preco unitario"
              />
              <RecapStep
                number={2}
                color="amber"
                text={
                  <>
                    A: 24 / 6 = <strong>R$4</strong> &nbsp;vs&nbsp; B: 20 / 4 ={" "}
                    <strong>R$5</strong>
                  </>
                }
              />
              <RecapStep
                number={3}
                color="emerald"
                text="Compare os precos unitarios. O menor vence!"
              />
            </div>

            <p className="text-caption text-muted-foreground text-center">
              Agora voce nunca mais paga caro no mercado!
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
// Trap Screen — intuition test
// ---------------------------------------------------------------------------

function TrapScreen({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<"a" | "b" | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleChoice = useCallback(
    (choice: "a" | "b") => {
      setSelected(choice);
      setTimeout(() => {
        setRevealed(true);
      }, 600);
    },
    []
  );

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Lightbulb}>
        Sem pensar muito: <strong>qual parece mais barato</strong>?
      </FriendlyMessage>

      {!revealed && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleChoice("a")}
            disabled={selected !== null}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300",
              selected === "a"
                ? "border-cyan-400 bg-cyan-500/10 ring-4 ring-cyan-400/20"
                : "border-border hover:border-cyan-400/40 hover:bg-cyan-500/5"
            )}
          >
            <span
              className="text-2xl font-bold text-cyan-600 dark:text-cyan-400"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Pacote A
            </span>
            <span className="text-sm text-muted-foreground">
              R$24 por 6 und.
            </span>
          </button>

          <button
            onClick={() => handleChoice("b")}
            disabled={selected !== null}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300",
              selected === "b"
                ? "border-amber-400 bg-amber-500/10 ring-4 ring-amber-400/20"
                : "border-border hover:border-amber-400/40 hover:bg-amber-500/5"
            )}
          >
            <span
              className="text-2xl font-bold text-amber-600 dark:text-amber-400"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Pacote B
            </span>
            <span className="text-sm text-muted-foreground">
              R$20 por 4 und.
            </span>
          </button>
        </div>
      )}

      {revealed && (
        <div className="space-y-4 interactive-fade-up">
          <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-center space-y-2">
            {selected === "b" ? (
              <>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Pegadinha! A maioria escolhe B porque R$20 &lt; R$24...
                </p>
                <p className="text-xs text-muted-foreground">
                  Mas o preco total nao conta a historia toda! Vamos descobrir
                  por que.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                  Boa intuicao! Mas como voce sabe que A e melhor?
                </p>
                <p className="text-xs text-muted-foreground">
                  Vamos aprender o truque pra ter certeza sempre!
                </p>
              </>
            )}
          </div>

          <Button onClick={onNext} className="w-full" size="lg">
            Quero saber o truque!
            <Sparkles className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reveal Screen — show the strategy
// ---------------------------------------------------------------------------

function RevealScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Lightbulb}>
        O segredo e simples: <strong>descubra quanto custa CADA unidade</strong>
        ! Ai sim da pra comparar de verdade.
      </FriendlyMessage>

      {step === 0 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Tag className="size-5 text-primary" />
              <span className="font-bold text-foreground text-lg">
                A formula magica:
              </span>
            </div>
            <div
              className="text-2xl sm:text-3xl font-bold text-foreground price-formula-reveal"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              <span className="text-primary">Preco Total</span>
              <span className="text-muted-foreground mx-2">/</span>
              <span className="text-amber-500">Quantidade</span>
              <span className="text-muted-foreground mx-2">=</span>
              <span className="text-emerald-500">Preco Unitario</span>
            </div>
          </div>

          <Button
            onClick={() => setStep(1)}
            className="w-full"
            size="lg"
            variant="outline"
          >
            Ah, faz sentido!
            <Lightbulb className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 interactive-fade-up">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 p-4 text-center space-y-2">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Quem tem o menor preco por unidade vence!
            </p>
            <p className="text-xs text-muted-foreground">
              Mesmo que o pacote custe mais no total, pode ser melhor negocio.
            </p>
          </div>

          <Button onClick={onNext} className="w-full" size="lg">
            Vamos calcular!
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calc Screen — calculate unit price interactively
// ---------------------------------------------------------------------------

function CalcScreen({
  label,
  price,
  quantity,
  answer,
  color,
  onNext,
}: {
  label: string;
  price: number;
  quantity: number;
  answer: number;
  color: string;
  onNext: () => void;
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
    if (isApproximatelyEqual(answer, num)) {
      setDone(true);
      setTimeout(() => onNext(), 1400);
    } else {
      setWrongCount((c) => c + 1);
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [input, answer, onNext]);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Tag}>
        Hora de calcular! Quanto custa <strong>cada unidade</strong> do{" "}
        <strong style={{ color }}>{label}</strong>?
      </FriendlyMessage>

      {/* Visual product reminder */}
      <div className="flex justify-center">
        <ProductBox
          label={label}
          price={price}
          quantity={quantity}
          color={color}
          accent={color}
          size={120}
        />
      </div>

      {/* Division visual */}
      <DivisionVisual
        total={price}
        quantity={quantity}
        result={answer}
        color={color}
        showResult={done}
      />

      {/* Input */}
      {!done && (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {price} / {quantity} ={" "}
              <span className="text-primary">?</span>
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
                ? `Dica: divida ${price} por ${quantity}. Pense: ${quantity} x ? = ${price}`
                : "Quase! Tente novamente."}
            </p>
          )}
        </div>
      )}

      {done && (
        <MicroWin
          message={`Cada unidade do ${label} custa R$${answer}!`}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compare Screen — reveal winner
// ---------------------------------------------------------------------------

function CompareScreen({
  onNext,
  onConfetti,
}: {
  onNext: () => void;
  onConfetti: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    onConfetti();
  }, [onConfetti]);

  return (
    <div className="space-y-5 interactive-fade-up">
      <FriendlyMessage icon={Scale}>
        Agora vamos comparar os precos por unidade lado a lado:
      </FriendlyMessage>

      {/* Side by side products */}
      <div className="flex items-start justify-center gap-6 sm:gap-8">
        <ProductBox
          label="Pacote A"
          price={24}
          quantity={6}
          color="#22d3ee"
          accent="#22d3ee"
          size={110}
          showUnitPrice={revealed}
          unitPrice={4}
          isWinner={revealed}
        />
        <ProductBox
          label="Pacote B"
          price={20}
          quantity={4}
          color="#fbbf24"
          accent="#fbbf24"
          size={110}
          showUnitPrice={revealed}
          unitPrice={5}
        />
      </div>

      {/* Scale comparison */}
      <ComparisonScale priceA={4} priceB={5} revealed={revealed} />

      {!revealed && (
        <Button
          onClick={handleReveal}
          className="w-full"
          size="lg"
          variant="outline"
        >
          <Trophy className="size-4 mr-2" />
          Revelar o vencedor!
        </Button>
      )}

      {revealed && (
        <div className="space-y-4 interactive-fade-up">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-center space-y-2">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              Pacote A vence! R$4/und vs R$5/und
            </p>
            <p className="text-xs text-muted-foreground">
              Mesmo custando R$24 no total (mais que R$20), cada unidade sai
              mais barata!
            </p>
          </div>

          <Button onClick={onNext} className="w-full" size="lg">
            Agora eu entendi!
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
