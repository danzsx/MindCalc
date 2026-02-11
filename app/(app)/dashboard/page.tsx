import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { EvolutionChart } from "@/components/dashboard/EvolutionChart";
import { WeakPointsList } from "@/components/dashboard/WeakPointsList";
import { LessonsOverviewCard } from "@/components/dashboard/LessonsOverviewCard";
import { TablesCard } from "@/components/tables/TablesCard";
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
    (p: { id: string; operation: string; range_min: number; range_max: number; mastered_percentage: number; last_practiced_at: string | null }) => ({
      id: p.id,
      operation: p.operation as TablesProgress["operation"],
      rangeMin: p.range_min,
      rangeMax: p.range_max,
      masteredPercentage: Number(p.mastered_percentage),
      lastPracticedAt: p.last_practiced_at,
    })
  );

  const orderedSessions: Session[] = (sessions ?? []).reverse();
  const totalSessions = orderedSessions.length;

  // Calculate average accuracy across all fetched sessions
  const avgAccuracy =
    totalSessions > 0
      ? orderedSessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions
      : 0;

  // Fetch exercise logs for weak points analysis (last 10 sessions)
  const sessionIds = orderedSessions.map((s) => s.id);
  const operatorMap: Record<string, { weightedErrors: number; weightedTotal: number }> = {};

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

  return (
    <main className="flex flex-col fade-in" style={{ gap: 'var(--section-gap)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" style={{ gap: 'var(--space-lg)' }}>
        <h1 className="text-page-title text-foreground">Seu painel</h1>
        <Link
          href="/train"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground
            px-6 py-3 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg
            transform hover:-translate-y-0.5 transition-all duration-300 min-h-[48px] text-body-emphasis"
        >
          Bora treinar
        </Link>
      </div>

      <StatsSummary
        level={profile.level}
        streak={profile.streak}
        avgAccuracy={avgAccuracy}
        totalSessions={totalSessions}
      />

      {/* Learning row: Lessons + Tables side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--grid-gap)' }}>
        <LessonsOverviewCard
          completedCount={completedLessons ?? 0}
          totalCount={totalLessons ?? 0}
        />
        <TablesCard progress={tablesProgress} />
      </div>

      {/* Analytics row: Chart (2/3) + Weak Points (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--grid-gap)' }}>
        <div className="lg:col-span-2">
          <EvolutionChart sessions={orderedSessions} />
        </div>
        <div className="lg:col-span-1">
          <WeakPointsList weakPoints={weakPoints} />
        </div>
      </div>
    </main>
  );
}
