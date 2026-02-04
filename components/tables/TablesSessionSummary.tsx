import { Trophy, Target, CheckCircle2, XCircle, Hash } from "lucide-react";
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
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Trophy,
      label: "Acertos",
      value: `${session.correct_answers}/${session.total_questions}`,
      iconBg: "bg-secondary/20",
      iconColor: "text-secondary-foreground",
    },
    {
      icon: Target,
      label: "Precisão",
      value: `${Math.round(session.accuracy)}%`,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
  ];

  const wrongLogs = logs.filter((l) => !l.is_correct);

  return (
    <div className="space-y-6">
      {/* Main card */}
      <div className="rounded-[20px] bg-card p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-success/10 p-3 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Treino feito!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {operatorLabels[session.operation] ?? session.operation} — {session.range_min} a{" "}
            {session.range_max}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-4"
            >
              <div
                className={`flex size-10 items-center justify-center rounded-full ${iconBg}`}
              >
                <Icon className={`size-5 ${iconColor}`} />
              </div>
              <span className="text-xl font-bold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Accuracy bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Aproveitamento</span>
            <span className="font-medium text-foreground">
              {Math.round(session.accuracy)}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-primary/20">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                session.accuracy >= 60
                  ? "bg-gradient-to-r from-primary to-success"
                  : "bg-[#FB923C]"
              }`}
              style={{ width: `${Math.min(session.accuracy, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* All correct message */}
      {wrongLogs.length === 0 && (
        <div className="rounded-[20px] bg-card p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-5 text-success" />
            </div>
            <span className="font-medium text-foreground">
              Tudo certo! Isso já está ficando automático.
            </span>
          </div>
        </div>
      )}

      {/* Difficult combinations */}
      {difficultCombinations.length > 0 && (
        <div className="rounded-[20px] bg-card p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-destructive/10 p-2 rounded-lg">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Pra revisar com calma
            </h2>
          </div>
          <ul className="space-y-2">
            {difficultCombinations.map((log, index) => (
              <li
                key={log.id ?? index}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="size-4 text-destructive" />
                </div>
                <span className="text-foreground font-medium">
                  {log.operand1}{" "}
                  {operatorSymbols[log.operator] ?? log.operator}{" "}
                  {log.operand2} = {log.correct_answer}
                </span>
                {log.attempts > 1 && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {log.attempts} tentativas
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
