"use client";

import { Delete, Check } from "lucide-react";

interface KeypadProps {
  onInput: (digit: string) => void;
  onSubmit: () => void;
}

export function Keypad({ onInput, onSubmit }: KeypadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div
      role="group"
      aria-label="Teclado numérico"
      className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto"
    >
      {keys.map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => onInput(digit)}
          aria-label={digit}
          className="flex items-center justify-center rounded-lg bg-muted text-foreground text-xl font-semibold h-14 transition-colors active:bg-primary active:text-primary-foreground"
        >
          {digit}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onInput("backspace")}
        aria-label="Apagar"
        className="flex items-center justify-center rounded-lg bg-muted text-muted-foreground h-14 transition-colors active:bg-destructive active:text-white"
      >
        <Delete className="size-5" />
      </button>

      <button
        type="button"
        onClick={() => onInput("0")}
        aria-label="0"
        className="flex items-center justify-center rounded-lg bg-muted text-foreground text-xl font-semibold h-14 transition-colors active:bg-primary active:text-primary-foreground"
      >
        0
      </button>

      <button
        type="button"
        onClick={onSubmit}
        aria-label="Confirmar resposta"
        className="flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-14 transition-colors active:bg-primary/80"
      >
        <Check className="size-5" />
      </button>
    </div>
  );
}
