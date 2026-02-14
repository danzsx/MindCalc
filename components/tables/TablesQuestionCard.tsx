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
        <span className="inline-flex items-center gap-1.5 bg-orange-500/15 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Revisão
        </span>
      )}

      {/* Question display */}
      <div className="text-center py-6">
        <motion.p
          key={question.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {question.operand1}{" "}
          <span className="text-teal-400">{formatOperator(question.operator)}</span>{" "}
          {question.operand2}{" "}
          <span className="text-white/40">=</span>{" "}
          <span className="text-teal-300">?</span>
        </motion.p>
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
          className="w-full px-6 py-4 bg-white/5 text-white rounded-2xl border-2 border-white/10 focus:border-teal-400 focus:bg-white/10 focus:outline-none focus:shadow-lg focus:shadow-teal-500/10 transition-all duration-300 text-xl text-center font-bold placeholder:text-white/30"
        />
      </div>

      {/* Submit button */}
      <motion.button
        whileHover={{ scale: answer.trim() ? 1.02 : 1 }}
        whileTap={{ scale: answer.trim() ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={answer.trim() === ""}
        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        <Send className="w-5 h-5" />
        Essa é minha resposta
      </motion.button>
    </motion.div>
  );
}
