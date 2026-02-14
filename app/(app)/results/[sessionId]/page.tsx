import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, XCircle, Trophy, Target, Clock, Timer, ArrowRight, ArrowLeft, Zap } from "lucide-react";
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
      gradient: "from-orange-500 to-red-500",
      delta: null as { value: number; suffix: string; higherIsBetter: boolean } | null,
    },
    {
      icon: Target,
      label: "Precisão",
      value: `${Math.round(currentSession.accuracy)}%`,
      gradient: "from-teal-500 to-cyan-500",
      delta: accuracyDelta !== null ? { value: accuracyDelta, suffix: "%", higherIsBetter: true } : null,
    },
    {
      icon: Clock,
      label: "Tempo Médio",
      value: `${currentSession.avg_time.toFixed(1)}s`,
      gradient: "from-emerald-500 to-teal-500",
      delta: timeDelta !== null ? { value: timeDelta, suffix: "s", higherIsBetter: false } : null,
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      {/* Hero header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl mb-4">
          <Zap className="h-7 w-7 text-white" />
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent mb-2"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Como foi seu treino
        </h1>
        <div className="flex items-center justify-center gap-2">
          <p className="text-white/50">Veja o que já está fluindo e onde focar</p>
          {isTimed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              <Timer className="size-3" />
              Cronometrado
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, gradient, delta }) => (
          <div key={label} className="relative group">
            {/* Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl opacity-0 blur-2xl group-hover:opacity-15 transition-opacity duration-500`} />
            {/* Card */}
            <div className="relative flex flex-col items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}>
                <Icon className="size-5 text-white" />
              </div>
              <span
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {value}
              </span>
              <span className="text-sm text-white/60">{label}</span>
              {delta && <DeltaBadge {...delta} />}
            </div>
          </div>
        ))}
      </div>

      {/* Wrong answers detail */}
      {wrongLogs.length > 0 && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl opacity-5 blur-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2.5 rounded-xl">
                <XCircle className="size-4 text-white" />
              </div>
              <h2
                className="text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Pra revisar com calma
              </h2>
            </div>
            <ul className="space-y-3">
              {wrongLogs.map((log) => {
                const techniqueTitle = log.technique_slug
                  ? techniqueTitleMap[log.technique_slug]
                  : null;

                return (
                  <li
                    key={log.id}
                    className="rounded-2xl bg-white/5 border border-white/5 p-4 hover:bg-white/8 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-red-500/15">
                          <XCircle className="size-4 text-red-400" />
                        </div>
                        <span className="text-white font-medium">
                          {log.operand1} {operatorSymbols[log.operator] ?? log.operator}{" "}
                          {log.operand2} = {log.correct_answer}
                        </span>
                      </div>
                      <span className="text-sm text-white/50">
                        {log.timed_out ? (
                          <span className="text-amber-400 font-medium">Tempo esgotado</span>
                        ) : (
                          <>Sua resposta: {log.user_answer ?? "—"}</>
                        )}
                      </span>
                    </div>
                    {techniqueTitle && (
                      <p className="mt-2 ml-11 text-sm text-teal-400">
                        Dica: use a tecnica{" "}
                        <Link
                          href={`/lessons/${log.technique_slug}`}
                          className="underline underline-offset-2 hover:text-teal-300 transition-colors"
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
        </div>
      )}

      {wrongLogs.length === 0 && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl opacity-10 blur-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
                <CheckCircle2 className="size-5 text-white" />
              </div>
              <span className="font-medium text-white">
                Tudo certo! Você acertou todos. Isso já está ficando automático.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/train"
          className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
        >
          Bora pra próxima
          <ArrowRight className="size-5" />
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          <ArrowLeft className="size-5" />
          Voltar ao painel
        </Link>
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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        isGood
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
          : "bg-red-500/15 text-red-400 border border-red-500/20"
      }`}
    >
      {isPositive ? "+" : "−"}
      {rounded}
      {suffix}
    </span>
  );
}
