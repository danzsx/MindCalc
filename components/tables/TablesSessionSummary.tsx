import { motion } from "motion/react";
import { Trophy, Target, CheckCircle2, XCircle, Hash, Sparkles } from "lucide-react";
import type { TablesQuestionLog } from "@/types";

interface TablesSession {
  id: string;
  operation: string;
  range_min: number;
  range_max: number;
  mode: string;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
}

interface TablesSessionSummaryProps {
  session: TablesSession;
  logs: TablesQuestionLog[];
  difficultCombinations: TablesQuestionLog[];
}

const operatorLabels: Record<string, string> = {
  "+": "Adição",
  "-": "Subtração",
  "*": "Multiplicação",
  "/": "Divisão",
};

const operatorSymbols: Record<string, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

export function TablesSessionSummary({
  session,
  logs,
  difficultCombinations,
}: TablesSessionSummaryProps) {
  const stats = [
    {
      icon: Hash,
      label: "Questões",
      value: `${session.total_questions}`,
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Trophy,
      label: "Acertos",
      value: `${session.correct_answers}/${session.total_questions}`,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Target,
      label: "Precisão",
      value: `${Math.round(session.accuracy)}%`,
      gradient: "from-teal-500 to-cyan-500",
    },
  ];

  const wrongLogs = logs.filter((l) => !l.is_correct);

  return (
    <div className="space-y-6">
      {/* Main card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-full mb-4"
            >
              <Sparkles className="h-7 w-7 text-white" />
            </motion.div>
            <h2
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Treino feito!
            </h2>
            <p className="text-sm text-white/50">
              {operatorLabels[session.operation] ?? session.operation} — {session.range_min} a{" "}
              {session.range_max}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ icon: Icon, label, value, gradient }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-4"
              >
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
                  <Icon className="size-5 text-white" />
                </div>
                <span
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  {value}
                </span>
                <span className="text-xs text-white/50">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Accuracy bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/50">Aproveitamento</span>
              <span className="font-bold text-white">
                {Math.round(session.accuracy)}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(session.accuracy, 100)}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full relative overflow-hidden ${
                  session.accuracy >= 60
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                    : "bg-gradient-to-r from-orange-500 to-red-500"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* All correct message */}
      {wrongLogs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <CheckCircle2 className="size-5 text-white" />
            </div>
            <span className="font-semibold text-white">
              Tudo certo! Isso já está ficando automático.
            </span>
          </div>
        </motion.div>
      )}

      {/* Difficult combinations */}
      {difficultCombinations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl opacity-5 blur-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2.5 rounded-xl">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <h2
                className="text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Pra revisar com calma
              </h2>
            </div>
            <ul className="space-y-2">
              {difficultCombinations.map((log, index) => (
                <motion.li
                  key={log.id ?? index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-500/15 border border-red-500/20">
                    <XCircle className="size-4 text-red-400" />
                  </div>
                  <span className="text-white font-medium">
                    {log.operand1}{" "}
                    {operatorSymbols[log.operator] ?? log.operator}{" "}
                    {log.operand2} = {log.correct_answer}
                  </span>
                  {log.attempts > 1 && (
                    <span className="text-xs text-white/40 ml-auto bg-white/5 px-2 py-1 rounded-full">
                      {log.attempts} tentativas
                    </span>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
