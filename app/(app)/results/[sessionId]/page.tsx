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

  const { data: prevSessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id)
    .lt("created_at", currentSession.created_at)
    .order("created_at", { ascending: false })
    .limit(1);

  const prevSession = (prevSessions?.[0] as Session) ?? null;

  const { data: logs } = await supabase
    .from("exercise_logs")
    .select("*")
    .eq("session_id", sessionId)
    .order("id", { ascending: true });

  const exerciseLogs = (logs ?? []) as ExerciseLog[];
  const totalExercises = exerciseLogs.length;
  const correctCount = exerciseLogs.filter((l) => l.is_correct).length;
  const wrongLogs = exerciseLogs.filter((l) => !l.is_correct);

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
      delta: null as { value: number; suffix: string; higherIsBetter: boolean } | null,
    },
    {
      icon: Target,
      label: "Precisão",
      value: `${Math.round(currentSession.accuracy)}%`,
      delta: accuracyDelta !== null ? { value: accuracyDelta, suffix: "%", higherIsBetter: true } : null,
    },
    {
      icon: Clock,
      label: "Tempo Médio",
      value: `${currentSession.avg_time.toFixed(1)}s`,
      delta: timeDelta !== null ? { value: timeDelta, suffix: "s", higherIsBetter: false } : null,
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      {/* Hero header */}
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{
            background: "rgba(55,112,191,0.15)",
            border: "1px solid rgba(55,112,191,0.3)",
          }}
        >
          <Zap className="h-7 w-7 text-[#8dc2ff]" />
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-[#f0f4ff] mb-2.5 tracking-tight"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Como foi seu treino
        </h1>
        <div className="flex items-center justify-center gap-3">
          <p className="text-base text-[#6b89b4] font-medium">
            Veja o que já está fluindo e onde focar
          </p>
          {isTimed && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border"
              style={{
                background: "rgba(141,194,255,0.08)",
                borderColor: "rgba(141,194,255,0.2)",
                color: "#8dc2ff",
              }}
            >
              <Timer className="size-3" />
              Cronometrado
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, delta }) => (
          <div key={label} className="relative">
            <div
              className="relative flex flex-col items-center gap-4 rounded-[1.5rem] p-6 border transition-all duration-300"
              style={{
                background: "rgba(13,29,58,0.7)",
                borderColor: "rgba(141,194,255,0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="flex size-12 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(55,112,191,0.12)",
                  border: "1px solid rgba(55,112,191,0.25)",
                }}
              >
                <Icon className="size-5 text-[#8dc2ff]" />
              </div>
              <div className="text-center">
                <span
                  className="block text-3xl font-bold text-[#f0f4ff] mb-1"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  {value}
                </span>
                <span className="text-sm font-medium text-[#6b89b4]">{label}</span>
              </div>
              {delta && <DeltaBadge {...delta} />}
            </div>
          </div>
        ))}
      </div>

      {/* Wrong answers detail */}
      {wrongLogs.length > 0 && (
        <div
          className="rounded-[2rem] p-7 border"
          style={{
            background: "rgba(13,29,58,0.65)",
            borderColor: "rgba(141,194,255,0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div
              className="p-3 rounded-2xl"
              style={{
                background: "rgba(141,194,255,0.08)",
                border: "1px solid rgba(141,194,255,0.18)",
              }}
            >
              <XCircle className="size-5 text-[#8dc2ff]" />
            </div>
            <h2
              className="text-xl font-bold text-[#f0f4ff]"
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
                  className="rounded-2xl border p-4 transition-all duration-200"
                  style={{
                    background: "rgba(13,29,58,0.5)",
                    borderColor: "rgba(141,194,255,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-9 items-center justify-center rounded-full shrink-0"
                        style={{
                          background: "rgba(141,194,255,0.08)",
                          border: "1px solid rgba(141,194,255,0.15)",
                        }}
                      >
                        <XCircle className="size-4 text-[#8dc2ff]" />
                      </div>
                      <span
                        className="text-xl font-bold text-[#f0f4ff] font-mono"
                      >
                        {log.operand1} {operatorSymbols[log.operator] ?? log.operator}{" "}
                        {log.operand2} = {log.correct_answer}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#6b89b4] shrink-0 text-right">
                      {log.timed_out ? (
                        <span
                          className="font-bold px-2 py-1 rounded-lg"
                          style={{
                            background: "rgba(206,242,109,0.08)",
                            color: "#cef26d",
                          }}
                        >
                          Tempo
                        </span>
                      ) : (
                        <>
                          Sua resp:{" "}
                          <span
                            className="line-through font-bold ml-1"
                            style={{ color: "#8dc2ff" }}
                          >
                            {log.user_answer ?? "—"}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  {techniqueTitle && (
                    <div className="mt-3 ml-12 flex items-center gap-2">
                      <span
                        className="text-sm font-medium px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(55,112,191,0.1)",
                          color: "#8dc2ff",
                        }}
                      >
                        Dica
                      </span>
                      <p className="text-sm text-[#6b89b4]">
                        Use a técnica{" "}
                        <Link
                          href={`/lessons/${log.technique_slug}`}
                          className="font-bold transition-colors"
                          style={{ color: "#8dc2ff" }}
                        >
                          {techniqueTitle}
                        </Link>
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* All correct */}
      {wrongLogs.length === 0 && (
        <div
          className="rounded-[2rem] p-7 border"
          style={{
            background: "rgba(13,29,58,0.65)",
            borderColor: "rgba(206,242,109,0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 0 0 1px rgba(206,242,109,0.06)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex size-14 items-center justify-center rounded-2xl"
              style={{
                background: "rgba(206,242,109,0.1)",
                border: "1px solid rgba(206,242,109,0.25)",
              }}
            >
              <CheckCircle2 className="size-7 text-[#cef26d]" />
            </div>
            <div>
              <h3
                className="text-xl font-bold text-[#f0f4ff] mb-1"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Mandou muito bem!
              </h3>
              <p className="text-[#6b89b4] text-sm leading-relaxed">
                Você acertou todas as questões. O cálculo mental já está virando automático pra você.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/train"
          className="flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #cef26d 0%, #a8cc47 100%)",
            color: "#080f1e",
            boxShadow: "0 4px 20px rgba(206,242,109,0.2)",
          }}
        >
          Bora pra próxima
          <ArrowRight className="size-5" />
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 border"
          style={{
            background: "rgba(13,29,58,0.6)",
            borderColor: "rgba(141,194,255,0.12)",
            color: "#a8c0e0",
          }}
        >
          <ArrowLeft className="size-5" />
          Voltar ao painel
        </Link>
      </div>

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
      className="absolute top-3.5 right-3.5 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold border"
      style={
        isGood
          ? {
              background: "rgba(206,242,109,0.1)",
              borderColor: "rgba(206,242,109,0.25)",
              color: "#cef26d",
            }
          : {
              background: "rgba(141,194,255,0.08)",
              borderColor: "rgba(141,194,255,0.2)",
              color: "#8dc2ff",
            }
      }
    >
      {isPositive ? "+" : "−"}
      {rounded}
      {suffix}
    </span>
  );
}
