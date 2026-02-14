"use client";

import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from "lucide-react";
import type { TablesQuestion, TablesAnswer } from "@/types";

interface TablesFeedbackProps {
  question: TablesQuestion;
  answer: TablesAnswer;
  onContinue: () => void;
}

const correctMessages = [
  "Boa! Esse caminho é rápido.",
  "Isso! Já tá pegando o jeito.",
  "Acertou. Esse raciocínio funciona.",
  "Isso já tá ficando automático.",
];

function formatOperator(op: string): string {
  switch (op) {
    case "*": return "×";
    case "/": return "÷";
    case "-": return "−";
    default: return op;
  }
}

export function TablesFeedback({
  question,
  answer,
  onContinue,
}: TablesFeedbackProps) {
  const message = useMemo(() => {
    if (answer.isCorrect) {
      return correctMessages[Math.floor(Math.random() * correctMessages.length)];
    }
    return "Quase. Vamos pensar juntos:";
  }, [answer.isCorrect]);

  useEffect(() => {
    if (answer.isCorrect) {
      const timer = setTimeout(onContinue, 1500);
      return () => clearTimeout(timer);
    }
  }, [answer.isCorrect, onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="space-y-5"
    >
      {/* Icon + message */}
      <div className="flex flex-col items-center gap-3 text-center">
        {answer.isCorrect ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="bg-emerald-500/15 p-4 rounded-full border border-emerald-500/20"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="bg-red-500/15 p-4 rounded-full border border-red-500/20"
          >
            <XCircle className="h-8 w-8 text-red-400" />
          </motion.div>
        )}
        <p className="text-lg font-semibold text-white">{message}</p>
      </div>

      {/* Question recap */}
      <div className="text-center text-white/50">
        <p className="text-lg">
          {question.operand1} {formatOperator(question.operator)}{" "}
          {question.operand2}
        </p>
      </div>

      {/* Show explanation for wrong answers */}
      {!answer.isCorrect && (
        <>
          {/* Correct answer */}
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-5 text-center">
            <p className="text-sm text-white/50 mb-1">A resposta é</p>
            <p
              className="text-3xl font-bold text-teal-400"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {question.correctAnswer}
            </p>
          </div>

          {/* Explanation */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-white/50">Explicação</p>
            </div>
            <p className="text-white font-medium">{question.explanation}</p>
          </div>
        </>
      )}

      {answer.isCorrect && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <p className="text-sm text-white/50">Explicação</p>
          </div>
          <p className="text-white font-medium">{question.explanation}</p>
        </div>
      )}

      {/* Continue button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/25"
      >
        {answer.isCorrect ? "Bora pra próxima" : "Ahhh, agora fez sentido"}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
