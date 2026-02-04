"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { TablesQuestion, TablesMode } from "@/types";

interface TablesQuestionCardProps {
  question: TablesQuestion;
  onSubmit: (answer: number) => void;
  mode: TablesMode;
  isRetry?: boolean;
}

function formatOperator(op: string): string {
  switch (op) {
    case "*": return "×";
    case "/": return "÷";
    case "-": return "−";
    default: return op;
  }
}

export function TablesQuestionCard({
  question,
  onSubmit,
  isRetry,
}: TablesQuestionCardProps) {
  const [answer, setAnswer] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer("");
    inputRef.current?.focus();
  }, [question.id]);

  const handleSubmit = useCallback(() => {
    const trimmed = answer.trim();
    if (trimmed === "") return;

    const value = parseInt(trimmed, 10);
    if (isNaN(value)) return;

    if (value !== question.correctAnswer) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    setAnswer("");
    onSubmit(value);
  }, [answer, onSubmit, question.correctAnswer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="space-y-6">
      {isRetry && (
        <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full">
          Revisão
        </span>
      )}

      {/* Question display */}
      <div className="text-center py-4">
        <p
          className="text-4xl font-semibold text-foreground"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {question.operand1} {formatOperator(question.operator)}{" "}
          {question.operand2} = ?
        </p>
      </div>

      {/* Input */}
      <div className={isShaking ? "shake" : ""}>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Sua resposta"
          autoFocus
          className="w-full px-6 py-4 bg-muted text-foreground rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg text-center font-medium"
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={answer.trim() === ""}
        className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-md"
      >
        Essa é minha resposta
      </button>
    </div>
  );
}
