import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Session, ExerciseLog } from "@/types";

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current session
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    redirect("/dashboard");
  }

  const currentSession = session as Session;

  // Fetch previous session for comparison
  const { data: prevSessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id)
    .lt("created_at", currentSession.created_at)
    .order("created_at", { ascending: false })
    .limit(1);

  const prevSession = (prevSessions?.[0] as Session) ?? null;

  // Fetch exercise logs for this session
  const { data: logs } = await supabase
    .from("exercise_logs")
    .select("*")
    .eq("session_id", sessionId)
    .order("id", { ascending: true });

  const exerciseLogs = (logs ?? []) as ExerciseLog[];
  const totalExercises = exerciseLogs.length;
  const correctCount = exerciseLogs.filter((l) => l.is_correct).length;
  const wrongLogs = exerciseLogs.filter((l) => !l.is_correct);

  // Compute deltas
  const accuracyDelta = prevSession
    ? currentSession.accuracy - prevSession.accuracy
    : null;
  const timeDelta = prevSession
    ? currentSession.avg_time - prevSession.avg_time
    : null;

  const operatorSymbols: Record<string, string> = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Resultado da Sessão</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-1 pt-6">
            <span className="text-3xl font-bold">
              {correctCount}/{totalExercises}
            </span>
            <span className="text-sm text-muted-foreground">Acertos</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-1 pt-6">
            <span className="text-3xl font-bold">
              {Math.round(currentSession.accuracy)}%
            </span>
            <span className="text-sm text-muted-foreground">Precisão</span>
            {accuracyDelta !== null && (
              <DeltaBadge value={accuracyDelta} suffix="%" higherIsBetter />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardContent className="flex flex-col items-center gap-1 pt-6">
            <span className="text-3xl font-bold">
              {currentSession.avg_time.toFixed(1)}s
            </span>
            <span className="text-sm text-muted-foreground">Tempo Médio</span>
            {timeDelta !== null && (
              <DeltaBadge
                value={timeDelta}
                suffix="s"
                higherIsBetter={false}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Wrong answers detail */}
      {wrongLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exercícios Errados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {wrongLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive shrink-0" />
                    <span>
                      {log.operand1} {operatorSymbols[log.operator] ?? log.operator}{" "}
                      {log.operand2} = {log.correct_answer}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Sua resposta: {log.user_answer ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {wrongLogs.length === 0 && (
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <span className="font-medium">
              Parabéns! Você acertou todos os exercícios!
            </span>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/train">Treinar Novamente</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

function DeltaBadge({
  value,
  suffix,
  higherIsBetter,
}: {
  value: number;
  suffix: string;
  higherIsBetter: boolean;
}) {
  const rounded = Math.abs(Math.round(value * 10) / 10);
  if (rounded === 0) return null;

  const isPositive = value > 0;
  const isGood = higherIsBetter ? isPositive : !isPositive;

  return (
    <span
      className={`text-xs font-medium ${
        isGood ? "text-green-500" : "text-red-500"
      }`}
    >
      {isPositive ? "+" : "−"}
      {rounded}
      {suffix}
    </span>
  );
}
