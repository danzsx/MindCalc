"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {isRetry && (
        <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Revisão
        </span>
      )}

      {/* Question display */}
      <div className="text-center py-6">
        <p
          className="text-6xl font-bold text-[var(--color-text-primary)] tracking-tight"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {question.operand1}{" "}
          <span className="text-[#8dc2ff]">{formatOperator(question.operator)}</span>{" "}
          {question.operand2}{" "}
          <span className="text-white/20">=</span>{" "}
          <span className="text-[#8dc2ff]">?</span>
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
          className="w-full px-6 py-5 bg-white/5 text-[var(--color-text-primary)] rounded-[20px] border-2 border-white/15 focus:border-[#8dc2ff] focus:ring-4 focus:ring-[#8dc2ff]/10 focus:outline-none focus:shadow-xl transition-all duration-300 text-2xl text-center font-bold placeholder:text-[var(--color-text-muted)] shadow-sm"
        />
      </div>

      {/* Submit button */}
      <motion.button
        whileHover={{ scale: answer.trim() ? 1.02 : 1 }}
        whileTap={{ scale: answer.trim() ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={answer.trim() === ""}
        className="w-full bg-gradient-to-r from-[#3770bf] to-[#8dc2ff] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-[#3770bf]/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Send className="w-5 h-5" />
        Responder
      </motion.button>
    </motion.div>
  );
}
