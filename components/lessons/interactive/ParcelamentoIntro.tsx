"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Sparkles,
  CreditCard,
  Banknote,
  TrendingUp,
  Brain,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenProgress, MicroWin, Confetti } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Stage = "intuition" | "discovery" | "reveal" | "reflection";

const STAGES: Stage[] = ["intuition", "discovery", "reveal", "reflection"];

const STAGE_LABELS: Record<Stage, string> = {
  intuition: "Sua intuição",
  discovery: "Descobrindo",
  reveal: "O resultado",
  reflection: "Reflexão",
};

interface ParcelamentoIntroProps {
  title: string;
  cashPrice: number;
  installmentValue: number;
  installmentCount: number;
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBRL(value: number): string {
  return `R$\u00A0${value.toLocaleString("pt-BR")}`;
}

function useCountUp(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, active]);

  return value;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ParcelamentoIntro({
  title,
  cashPrice,
  installmentValue,
  installmentCount,
  onContinue,
}: ParcelamentoIntroProps) {
  const [stage, setStage] = useState<Stage>("intuition");
  const [showConfetti, setShowConfetti] = useState(false);

  const totalInstallment = installmentValue * installmentCount;
  const difference = totalInstallment - cashPrice;

  const stageIndex = STAGES.indexOf(stage);

  const goNext = useCallback(() => {
    const idx = STAGES.indexOf(stage);
    if (idx + 1 < STAGES.length) {
      setStage(STAGES[idx + 1]);
    }
  }, [stage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2
          className="text-section-title"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {title}
        </h2>

        {/* Progress */}
        <ScreenProgress current={stageIndex} total={STAGES.length} />

        {/* Stage micro-label */}
        <p className="parc-micro-label text-caption text-muted-foreground">
          Etapa {stageIndex + 1}: {STAGE_LABELS[stage]}
        </p>
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti intensity={2} />}

      {/* Stages */}
      <div className="parc-stage-container">
        {stage === "intuition" && (
          <IntuitionStage
            cashPrice={cashPrice}
            installmentValue={installmentValue}
            installmentCount={installmentCount}
            onNext={goNext}
          />
        )}

        {stage === "discovery" && (
          <DiscoveryStage
            installmentValue={installmentValue}
            installmentCount={installmentCount}
            totalInstallment={totalInstallment}
            onNext={goNext}
            onConfetti={() => {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 2800);
            }}
          />
        )}

        {stage === "reveal" && (
          <RevealStage
            cashPrice={cashPrice}
            totalInstallment={totalInstallment}
            difference={difference}
            onNext={goNext}
          />
        )}

        {stage === "reflection" && (
          <ReflectionStage
            cashPrice={cashPrice}
            totalInstallment={totalInstallment}
            difference={difference}
            installmentValue={installmentValue}
            installmentCount={installmentCount}
            onContinue={onContinue}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stage 1: Intuition Activation
// ---------------------------------------------------------------------------

function IntuitionStage({
  cashPrice,
  installmentValue,
  installmentCount,
  onNext,
}: {
  cashPrice: number;
  installmentValue: number;
  installmentCount: number;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleChoice = useCallback(
    (choice: string) => {
      setSelected(choice);
      // No "wrong/right" feedback — just acknowledge and move on
      setTransitioning(true);
      setTimeout(() => onNext(), 1400);
    },
    [onNext]
  );

  return (
    <div className="space-y-6 parc-fade-up">
      {/* Prompt */}
      <div className="parc-prompt-bubble">
        <Brain className="size-5 text-primary shrink-0" />
        <p className="text-body-primary leading-relaxed">
          Antes de calcular, use sua intuição.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid gap-4">
        {/* Cash card */}
        <div className="parc-comparison-card parc-card-cash parc-stagger-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="parc-card-icon parc-icon-cash">
              <Banknote className="size-5" />
            </div>
            <span className="text-caption-medium uppercase tracking-wider text-muted-foreground">
              À vista
            </span>
          </div>
          <p
            className="parc-price-display"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {formatBRL(cashPrice)}
          </p>
          <p className="text-caption text-muted-foreground mt-1">
            Pagamento único
          </p>
        </div>

        {/* Installment card */}
        <div className="parc-comparison-card parc-card-installment parc-stagger-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="parc-card-icon parc-icon-installment">
              <CreditCard className="size-5" />
            </div>
            <span className="text-caption-medium uppercase tracking-wider text-muted-foreground">
              Parcelado
            </span>
          </div>
          <p
            className="parc-price-display"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {installmentCount}x de {formatBRL(installmentValue)}
          </p>
          <p className="text-caption text-muted-foreground mt-1">
            Total: <span className="parc-mystery-badge">?</span>
          </p>
        </div>
      </div>

      {/* Question */}
      <p
        className="text-center text-lg font-medium text-foreground parc-stagger-3"
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        Qual você acha que é mais caro?
      </p>

      {/* Choice Buttons */}
      {!selected && (
        <div className="grid grid-cols-3 gap-3 parc-stagger-4">
          <button
            onClick={() => handleChoice("parcelado")}
            className="parc-choice-btn"
          >
            <CreditCard className="size-4 mx-auto mb-1 opacity-60" />
            Parcelado
          </button>
          <button
            onClick={() => handleChoice("igual")}
            className="parc-choice-btn"
          >
            <span className="text-lg mb-0.5">=</span>
            Igual
          </button>
          <button
            onClick={() => handleChoice("avista")}
            className="parc-choice-btn"
          >
            <Banknote className="size-4 mx-auto mb-1 opacity-60" />
            À vista
          </button>
        </div>
      )}

      {/* After selection */}
      {selected && (
        <div className="text-center parc-fade-up">
          <p className="text-body-primary text-muted-foreground">
            {selected === "parcelado"
              ? "Hmm, interessante... Vamos descobrir juntos!"
              : selected === "igual"
                ? "Será mesmo igual? Vamos fazer as contas..."
                : "Será? Vamos verificar!"}
          </p>
          <div className="parc-thinking-dots mt-3">
            <span /><span /><span />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stage 2: Guided Cognitive Decomposition
// ---------------------------------------------------------------------------

function DiscoveryStage({
  installmentValue,
  installmentCount,
  totalInstallment,
  onNext,
  onConfetti,
}: {
  installmentValue: number;
  installmentCount: number;
  totalInstallment: number;
  onNext: () => void;
  onConfetti: () => void;
}) {
  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hesitation hint: show after 8 seconds of inactivity
  useEffect(() => {
    if (solved) return;
    timerRef.current = setTimeout(() => setShowHint(true), 8000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [solved, input]);

  // Reset timer on input change
  useEffect(() => {
    if (solved || showHint) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowHint(true), 8000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [input, solved, showHint]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseInt(input.replace(/\D/g, ""), 10);
    if (isNaN(num)) return;
    if (num === totalInstallment) {
      setSolved(true);
      onConfetti();
      // Show cumulative visualization after solve
      setTimeout(() => setShowVisualization(true), 800);
    } else {
      setAttempts((a) => a + 1);
      inputRef.current?.classList.add("shake");
      setTimeout(() => inputRef.current?.classList.remove("shake"), 500);
    }
  }, [input, totalInstallment, onConfetti]);

  // Build cumulative values
  const cumulativeValues = useMemo(() => {
    const vals: number[] = [];
    for (let i = 1; i <= installmentCount; i++) {
      vals.push(installmentValue * i);
    }
    return vals;
  }, [installmentValue, installmentCount]);

  return (
    <div className="space-y-6 parc-fade-up">
      {/* Section header */}
      <div className="parc-prompt-bubble">
        <Zap className="size-5 text-amber-500 shrink-0" />
        <p className="text-body-primary leading-relaxed">
          Vamos descobrir juntos. Multiplicar por {installmentCount} é simples!
        </p>
      </div>

      {/* Micro insight */}
      {installmentCount === 10 && (
        <div className="parc-insight-card parc-stagger-1">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">Dica rápida:</span>{" "}
            Multiplicar por 10 é só acrescentar um zero.
          </p>
        </div>
      )}

      {/* Interactive equation */}
      <div className="parc-equation-card parc-stagger-2">
        <div className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-bold">
          <span
            className="text-primary"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {installmentValue}
          </span>
          <span className="text-muted-foreground">×</span>
          <span
            className="text-amber-500"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {installmentCount}
          </span>
          <span className="text-muted-foreground">=</span>

          {!solved ? (
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="?"
                className="parc-solve-input w-28 text-center text-2xl font-bold"
              />
            </div>
          ) : (
            <span
              className="text-success parc-number-pop"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {totalInstallment}
            </span>
          )}
        </div>

        {/* Submit button */}
        {!solved && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleSubmit}
              disabled={input.trim() === ""}
              size="lg"
              className="parc-submit-btn"
            >
              <Sparkles className="size-4 mr-2" />
              Conferir
            </Button>
          </div>
        )}

        {/* Wrong feedback */}
        {attempts > 0 && !solved && (
          <p className="text-center text-sm text-muted-foreground mt-2 parc-fade-up">
            {attempts >= 2
              ? `Quase! Pense: ${installmentValue} × ${installmentCount}...`
              : "Ainda não. Tente mais uma vez com calma."}
          </p>
        )}

        {/* Hesitation hint */}
        {showHint && !solved && (
          <div className="parc-hint-reveal mt-4">
            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
              <span className="parc-hint-arrow">→</span>
              <span>
                {installmentValue}{" "}
                <span className="parc-hint-zero-add">
                  + 0 = {totalInstallment}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Success state */}
      {solved && <MicroWin message={`Total parcelado: ${formatBRL(totalInstallment)}!`} />}

      {/* Cumulative Visualization */}
      {showVisualization && (
        <div className="space-y-4 parc-fade-up">
          <p className="text-caption-medium text-center text-muted-foreground">
            Visualize cada parcela somando:
          </p>
          <div className="parc-cumulative-container">
            {cumulativeValues.map((val, i) => (
              <div
                key={i}
                className="parc-cumulative-bar"
                style={{
                  width: `${(val / totalInstallment) * 100}%`,
                  animationDelay: `${i * 120}ms`,
                }}
              >
                <div className="parc-cumulative-fill">
                  <span className="parc-cumulative-label">
                    {i + 1}ª: {formatBRL(val)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onNext} className="w-full mt-2" size="lg">
            Ver o resultado
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stage 3: Emotional Reveal
// ---------------------------------------------------------------------------

function RevealStage({
  cashPrice,
  totalInstallment,
  difference,
  onNext,
}: {
  cashPrice: number;
  totalInstallment: number;
  difference: number;
  onNext: () => void;
}) {
  const [showDifference, setShowDifference] = useState(false);
  const animatedCash = useCountUp(cashPrice, 1200, true);
  const animatedTotal = useCountUp(totalInstallment, 1500, true);
  const animatedDiff = useCountUp(difference, 1000, showDifference);

  useEffect(() => {
    const timer = setTimeout(() => setShowDifference(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 parc-fade-up">
      {/* Comparison display */}
      <div className="parc-reveal-grid">
        {/* Cash */}
        <div className="parc-reveal-card parc-reveal-cash parc-stagger-1">
          <div className="flex items-center gap-2 mb-3">
            <Banknote className="size-4 text-emerald-500" />
            <span className="text-caption-medium text-muted-foreground uppercase tracking-wider">
              À vista
            </span>
          </div>
          <p
            className="text-3xl sm:text-4xl font-bold text-emerald-500"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {formatBRL(animatedCash)}
          </p>
        </div>

        {/* Installment total */}
        <div className="parc-reveal-card parc-reveal-installment parc-stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="size-4 text-amber-500" />
            <span className="text-caption-medium text-muted-foreground uppercase tracking-wider">
              Parcelado
            </span>
          </div>
          <p
            className="text-3xl sm:text-4xl font-bold text-amber-500"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            {formatBRL(animatedTotal)}
          </p>
        </div>
      </div>

      {/* Difference highlight */}
      {showDifference && (
        <div className="parc-difference-card parc-fade-up">
          <TrendingUp className="size-5 text-amber-500 shrink-0" />
          <div>
            <p className="text-body-emphasis text-foreground">
              Você pagaria{" "}
              <span
                className="text-amber-500 font-bold text-xl"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {formatBRL(animatedDiff)}
              </span>{" "}
              a mais apenas para parcelar.
            </p>
            <p className="text-caption text-muted-foreground mt-1">
              Isso é dinheiro que poderia ficar no seu bolso.
            </p>
          </div>
        </div>
      )}

      {showDifference && (
        <Button onClick={onNext} className="w-full parc-fade-up" size="lg">
          Entendi — próxima etapa
          <ArrowRight className="size-4 ml-2" />
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stage 4: Reflection
// ---------------------------------------------------------------------------

function ReflectionStage({
  cashPrice,
  totalInstallment,
  difference,
  installmentValue,
  installmentCount,
  onContinue,
}: {
  cashPrice: number;
  totalInstallment: number;
  difference: number;
  installmentValue: number;
  installmentCount: number;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6 parc-fade-up">
      {/* Summary card */}
      <div className="parc-reflection-card">
        <div className="flex items-center gap-2 justify-center mb-5">
          <ShieldCheck className="size-5 text-primary" />
          <h3
            className="text-lg font-semibold text-foreground"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            O que você descobriu
          </h3>
        </div>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="parc-recap-step parc-recap-cyan" style={{ animationDelay: "0ms" }}>
            <div className="parc-recap-number parc-recap-number-cyan">1</div>
            <span className="text-sm leading-relaxed">
              Total parcelado = parcela × número de vezes
            </span>
          </div>

          {/* Step 2 */}
          <div className="parc-recap-step parc-recap-amber" style={{ animationDelay: "150ms" }}>
            <div className="parc-recap-number parc-recap-number-amber">2</div>
            <span className="text-sm leading-relaxed">
              {installmentValue} × {installmentCount} = {formatBRL(totalInstallment)}
            </span>
          </div>

          {/* Step 3 */}
          <div className="parc-recap-step parc-recap-emerald" style={{ animationDelay: "300ms" }}>
            <div className="parc-recap-number parc-recap-number-emerald">3</div>
            <span className="text-sm leading-relaxed">
              Diferença: {formatBRL(totalInstallment)} − {formatBRL(cashPrice)} ={" "}
              <strong className="text-amber-500">{formatBRL(difference)} a mais</strong>
            </span>
          </div>
        </div>

        <p className="text-caption text-muted-foreground text-center mt-5">
          Sempre calcule o total antes de parcelar!
        </p>
      </div>

      {/* Micro reinforcement */}
      <div className="parc-reinforcement parc-stagger-3">
        <Sparkles className="size-4 text-primary shrink-0" />
        <p className="text-sm text-foreground font-medium">
          Você acabou de aplicar matemática a uma decisão real.
        </p>
      </div>

      {/* CTA */}
      <Button onClick={onContinue} className="w-full" size="lg">
        Entendi — vamos praticar!
        <ArrowRight className="size-4 ml-2" />
      </Button>
    </div>
  );
}
