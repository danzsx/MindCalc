"use client";

import { useMemo } from "react";
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


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="space-y-6"
    >
      {/* Icon + message */}
      <div className="flex flex-col items-center gap-4 text-center">
        {answer.isCorrect ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="bg-emerald-500/10 p-5 rounded-full"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="bg-red-500/10 p-5 rounded-full"
          >
            <XCircle className="h-10 w-10 text-red-400" />
          </motion.div>
        )}
        <p className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">{message}</p>
      </div>

      {/* Question recap */}
      <div className="text-center text-[var(--color-text-secondary)]">
        <p className="text-lg font-medium">
          {question.operand1} {formatOperator(question.operator)}{" "}
          {question.operand2}
        </p>
      </div>

      {/* Show explanation for wrong answers */}
      {!answer.isCorrect && (
        <>
          {/* Correct answer */}
          <div className="bg-[#3770bf]/15 border border-[#3770bf]/25 rounded-2xl p-6 text-center">
            <p className="text-sm font-bold text-[#8dc2ff] uppercase tracking-wide mb-1">A resposta é</p>
            <p
              className="text-4xl font-bold text-[#8dc2ff]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {question.correctAnswer}
            </p>
          </div>

          {/* Explanation */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wide">Explicação</p>
            </div>
            <p className="text-[var(--color-text-secondary)] font-medium text-lg leading-relaxed">{question.explanation}</p>
          </div>
        </>
      )}

      {answer.isCorrect && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Explicação</p>
          </div>
          <p className="text-gray-700 font-medium text-lg leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Continue button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-[#3770bf] to-[#8dc2ff] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-[#3770bf]/25"
      >
        {answer.isCorrect ? "Bora pra próxima" : "Ahhh, agora fez sentido"}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
