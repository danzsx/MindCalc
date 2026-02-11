"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ScreenProgress — dot progress indicator
// ---------------------------------------------------------------------------

export function ScreenProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            i <= current ? "bg-primary w-6" : "bg-muted w-1.5"
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MicroWin — small success feedback
// ---------------------------------------------------------------------------

export function MicroWin({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 interactive-micro-win">
      <Sparkles className="size-4 text-emerald-500 shrink-0" />
      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {message}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FriendlyMessage — icon + message bubble
// ---------------------------------------------------------------------------

export function FriendlyMessage({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
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
// RecapStep — strategy recap item
// ---------------------------------------------------------------------------

const RECAP_COLORS = {
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
} as const;

export function RecapStep({
  number,
  color,
  text,
}: {
  number: number;
  color: "cyan" | "amber" | "emerald";
  text: React.ReactNode;
}) {
  const c = RECAP_COLORS[color];

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

// ---------------------------------------------------------------------------
// Confetti — celebration overlay
// ---------------------------------------------------------------------------

const CONFETTI_COLORS = [
  "#22d3ee",
  "#fbbf24",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
];

export function Confetti({ intensity = 1 }: { intensity?: number }) {
  const count = Math.round(20 * intensity);
  return (
    <div className="confetti-container">
      {Array.from({ length: count }).map((_, i) => (
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

// ---------------------------------------------------------------------------
// Success messages
// ---------------------------------------------------------------------------

export const SUCCESS_MESSAGES: Record<string, string[]> = {
  full: [
    "Boa! Voce seguiu o caminho certinho.",
    "Mandou bem! Cada passo ficou claro.",
    "Exato! O truque ja ta ficando natural.",
  ],
  partial: [
    "Show! Ja ta pegando o ritmo.",
    "Quase sem ajuda e acertou!",
    "Isso ai! O caminho ja e automatico.",
  ],
  none: [
    "Calculou de cabeca! Impressionante.",
    "Sem dica nenhuma e acertou. Monstro!",
    "Esse truque ja e seu. Parabens!",
  ],
};
