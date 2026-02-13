import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trophy, Target, Clock, Timer } from "lucide-react";
import { ConfidenceSurveyTrigger } from "@/components/training/ConfidenceSurveyTrigger";
import { allLessons } from "@/lib/lessons";
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

  // Build technique title map for hints
  const techniqueTitleMap: Record<string, string> = {};
  for (const lesson of allLessons) {
    techniqueTitleMap[lesson.slug] = lesson.title;
  }

  const isTimed = currentSession.mode === "timed";

  const stats = [
    {
      icon: Trophy,
      label: "Acertos",
      value: `${correctCount}/${totalExercises}`,
      iconBg: "bg-secondary/20",
      iconColor: "text-secondary-foreground",
      delta: null as { value: number; suffix: string; higherIsBetter: boolean } | null,
    },
    {
      icon: Target,
      label: "Precisão",
      value: `${Math.round(currentSession.accuracy)}%`,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      delta: accuracyDelta !== null ? { value: accuracyDelta, suffix: "%", higherIsBetter: true } : null,
    },
    {
      icon: Clock,
      label: "Tempo Médio",
      value: `${currentSession.avg_time.toFixed(1)}s`,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      delta: timeDelta !== null ? { value: timeDelta, suffix: "s", higherIsBetter: false } : null,
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-foreground">Como foi seu treino</h1>
        <div className="mt-1 flex items-center justify-center gap-2">
          <p className="text-muted-foreground">Veja o que já está fluindo e onde focar</p>
          {isTimed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              <Timer className="size-3" />
              Cronometrado
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, iconBg, iconColor, delta }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 rounded-[20px] bg-card p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]"
          >
            <div className={`flex size-10 items-center justify-center rounded-full ${iconBg}`}>
              <Icon className={`size-5 ${iconColor}`} />
            </div>
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
            {delta && <DeltaBadge {...delta} />}
          </div>
        ))}
      </div>

      {/* Wrong answers detail */}
      {wrongLogs.length > 0 && (
        <div className="rounded-[20px] bg-card p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] lg:p-8">
          <h2 className="mb-4 font-semibold text-foreground">Pra revisar com calma</h2>
          <ul className="space-y-3">
            {wrongLogs.map((log) => {
              const techniqueTitle = log.technique_slug
                ? techniqueTitleMap[log.technique_slug]
                : null;

              return (
                <li
                  key={log.id}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10">
                        <XCircle className="size-4 text-destructive" />
                      </div>
                      <span className="text-foreground">
                        {log.operand1} {operatorSymbols[log.operator] ?? log.operator}{" "}
                        {log.operand2} = {log.correct_answer}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {log.timed_out ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Tempo esgotado</span>
                      ) : (
                        <>Sua resposta: {log.user_answer ?? "—"}</>
                      )}
                    </span>
                  </div>
                  {techniqueTitle && (
                    <p className="mt-2 ml-11 text-sm text-primary">
                      Dica: use a tecnica{" "}
                      <Link
                        href={`/lessons/${log.technique_slug}`}
                        className="underline underline-offset-2 hover:text-primary/80"
                      >
                        {techniqueTitle}
                      </Link>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {wrongLogs.length === 0 && (
        <div className="rounded-[20px] bg-card p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-5 text-success" />
            </div>
            <span className="font-medium text-foreground">
              Tudo certo! Você acertou todos. Isso já está ficando automático.
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/train">Bora pra próxima</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/dashboard">Voltar ao painel</Link>
        </Button>
      </div>

      {/* Confidence survey trigger */}
      <ConfidenceSurveyTrigger userId={user.id} />
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
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isGood
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {isPositive ? "+" : "−"}
      {rounded}
      {suffix}
    </span>
  );
}
