"use client";

import { useEffect, useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
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

  // Auto-advance in free mode for correct answers is handled by the hook,
  // but we still auto-continue after 1.5s for correct feedback display
  useEffect(() => {
    if (answer.isCorrect) {
      const timer = setTimeout(onContinue, 1500);
      return () => clearTimeout(timer);
    }
  }, [answer.isCorrect, onContinue]);

  return (
    <div className="space-y-5 zoom-in-95">
      {/* Icon + message */}
      <div className="flex flex-col items-center gap-3 text-center">
        {answer.isCorrect ? (
          <div className="bg-success/10 p-3 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
        ) : (
          <div className="bg-destructive/10 p-3 rounded-full">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        )}
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>

      {/* Question recap */}
      <div className="text-center text-muted-foreground">
        <p>
          {question.operand1} {formatOperator(question.operator)}{" "}
          {question.operand2}
        </p>
      </div>

      {/* Show explanation for wrong answers, or in guided mode for correct */}
      {!answer.isCorrect && (
        <>
          {/* Correct answer */}
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              A resposta é
            </p>
            <p
              className="text-2xl font-semibold text-primary"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {question.correctAnswer}
            </p>
          </div>

          {/* Explanation */}
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Explicação
            </p>
            <p className="text-foreground font-medium">
              {question.explanation}
            </p>
          </div>
        </>
      )}

      {answer.isCorrect && (
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Explicação</p>
          <p className="text-foreground font-medium">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium"
      >
        {answer.isCorrect ? "Bora pra próxima" : "Ahhh, agora fez sentido"}
      </button>
    </div>
  );
}
