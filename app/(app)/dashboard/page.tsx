import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { EvolutionChart } from "@/components/dashboard/EvolutionChart";
import { WeakPointsList } from "@/components/dashboard/WeakPointsList";
import { LessonsOverviewCard } from "@/components/dashboard/LessonsOverviewCard";
import { TablesCard } from "@/components/tables/TablesCard";
import { ConfidenceCard } from "@/components/dashboard/ConfidenceCard";
import type { Session, ExerciseLog, TablesProgress } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("level, streak")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // Fetch last 10 sessions (ordered oldest → newest for the chart)
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch lesson counts for LessonsOverviewCard
  const [{ count: totalLessons }, { count: completedLessons }] =
    await Promise.all([
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  // Fetch tables progress
  const { data: tablesProgressRaw } = await supabase
    .from("tables_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const tablesProgress: TablesProgress[] = (tablesProgressRaw ?? []).map(
    (p: {
      id: string;
      operation: string;
      range_min: number;
      range_max: number;
      mastered_percentage: number;
      last_practiced_at: string | null;
    }) => ({
      id: p.id,
      operation: p.operation as TablesProgress["operation"],
      rangeMin: p.range_min,
      rangeMax: p.range_max,
      masteredPercentage: Number(p.mastered_percentage),
      lastPracticedAt: p.last_practiced_at,
    })
  );

  // Fetch confidence surveys
  const { data: confidenceSurveysRaw } = await supabase
    .from("confidence_surveys")
    .select("score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const confidenceSurveys = (confidenceSurveysRaw ?? []) as {
    score: number;
    created_at: string;
  }[];

  const orderedSessions: Session[] = (sessions ?? []).reverse();
  const totalSessions = orderedSessions.length;

  // Calculate average accuracy across all fetched sessions
  const avgAccuracy =
    totalSessions > 0
      ? orderedSessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions
      : 0;

  // Fetch exercise logs for weak points analysis (last 10 sessions)
  const sessionIds = orderedSessions.map((s) => s.id);
  const operatorMap: Record<
    string,
    { weightedErrors: number; weightedTotal: number }
  > = {};

  if (sessionIds.length > 0) {
    const { data: logs } = await supabase
      .from("exercise_logs")
      .select("operator, is_correct")
      .in("session_id", sessionIds);

    if (logs && logs.length > 0) {
      for (const log of logs as Pick<ExerciseLog, "operator" | "is_correct">[]) {
        const op = log.operator;
        if (!operatorMap[op]) {
          operatorMap[op] = { weightedErrors: 0, weightedTotal: 0 };
        }
        operatorMap[op].weightedTotal += 1.0;
        if (!log.is_correct) {
          operatorMap[op].weightedErrors += 1.0;
        }
      }
    }
  }

  // Include tabuada logs with 0.7 weight
  const { data: tablesLogs } = await supabase
    .from("tables_question_logs")
    .select("operator, is_correct")
    .eq("user_id", user.id);

  if (tablesLogs && tablesLogs.length > 0) {
    for (const log of tablesLogs as { operator: string; is_correct: boolean }[]) {
      const op = log.operator;
      if (!operatorMap[op]) {
        operatorMap[op] = { weightedErrors: 0, weightedTotal: 0 };
      }
      operatorMap[op].weightedTotal += 0.7;
      if (!log.is_correct) {
        operatorMap[op].weightedErrors += 0.7;
      }
    }
  }

  const operatorLabels: Record<string, string> = {
    "+": "Adição (+)",
    "-": "Subtração (−)",
    "*": "Multiplicação (×)",
    "/": "Divisão (÷)",
  };

  const weakPoints = Object.entries(operatorMap)
    .filter(([, data]) => data.weightedErrors > 0)
    .map(([op, data]) => ({
      operation: operatorLabels[op] ?? op,
      errorRate: data.weightedErrors / data.weightedTotal,
    }));

  const firstName =
    user.user_metadata?.name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "aluno";

  return (
    <main className="flex flex-col gap-8">
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden rounded-[32px] p-8 md:p-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,29,58,0.85) 0%, rgba(8,15,30,0.7) 100%)",
          border: "1px solid rgba(141, 194, 255, 0.12)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(55,112,191,0.18) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(206,242,109,0.05) 0%, transparent 70%)",
            transform: "translate(-20%, 20%)",
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Greeting */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              Numetria · Painel
            </p>
            <h1
              className="mb-3 leading-none"
              style={{
                fontFamily: "var(--font-family-display)",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                color: "var(--color-text-primary)",
                fontWeight: 700,
              }}
            >
              Olá, {firstName}.
            </h1>
            <p
              className="text-base font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Continue de onde parou — seu progresso está esperando.
            </p>
          </div>

          {/* Right: Badges + CTA */}
          <div className="flex flex-col gap-3">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(55, 112, 191, 0.15)",
                  border: "1px solid rgba(55, 112, 191, 0.3)",
                  color: "#8dc2ff",
                }}
              >
                Nível {profile.level}
              </span>
              {profile.streak > 0 && (
                <span
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(206, 242, 109, 0.1)",
                    border: "1px solid rgba(206, 242, 109, 0.22)",
                    color: "#cef26d",
                  }}
                >
                  🔥 {profile.streak} dias
                </span>
              )}
            </div>

            {/* CTA */}
            <Link
              href="/lessons"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 group"
              style={{
                background: "#cef26d",
                color: "#080f1e",
                boxShadow: "0 4px 20px rgba(206, 242, 109, 0.25)",
              }}
            >
              Continuar Aula
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ── */}
      <StatsSummary
        level={profile.level}
        streak={profile.streak}
        avgAccuracy={avgAccuracy}
        totalSessions={totalSessions}
      />

      {/* ── Bento Grid: Lessons (2/3) + Tabuada (1/3) ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <LessonsOverviewCard
            completedCount={completedLessons ?? 0}
            totalCount={totalLessons ?? 0}
          />
        </div>
        <div className="lg:col-span-1">
          <TablesCard progress={tablesProgress} />
        </div>
      </div>

      {/* ── Analytics: Chart (2/3) + Weak Points (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <EvolutionChart sessions={orderedSessions} />
        </div>
        <div className="lg:col-span-1">
          <WeakPointsList weakPoints={weakPoints} />
        </div>
      </div>

      {/* ── Confidence row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
        <ConfidenceCard surveys={confidenceSurveys} />
      </div>
    </main>
  );
}
