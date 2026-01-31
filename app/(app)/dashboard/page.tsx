import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { EvolutionChart } from "@/components/dashboard/EvolutionChart";
import { WeakPointsList } from "@/components/dashboard/WeakPointsList";
import { LessonsOverviewCard } from "@/components/dashboard/LessonsOverviewCard";
import type { Session, ExerciseLog } from "@/types";

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

  const orderedSessions: Session[] = (sessions ?? []).reverse();
  const totalSessions = orderedSessions.length;

  // Calculate average accuracy across all fetched sessions
  const avgAccuracy =
    totalSessions > 0
      ? orderedSessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions
      : 0;

  // Fetch exercise logs for weak points analysis (last 10 sessions)
  const sessionIds = orderedSessions.map((s) => s.id);
  let weakPoints: { operation: string; errorRate: number }[] = [];

  if (sessionIds.length > 0) {
    const { data: logs } = await supabase
      .from("exercise_logs")
      .select("operator, is_correct")
      .in("session_id", sessionIds);

    if (logs && logs.length > 0) {
      const operatorMap: Record<string, { total: number; errors: number }> = {};

      for (const log of logs as Pick<ExerciseLog, "operator" | "is_correct">[]) {
        const op = log.operator;
        if (!operatorMap[op]) {
          operatorMap[op] = { total: 0, errors: 0 };
        }
        operatorMap[op].total++;
        if (!log.is_correct) {
          operatorMap[op].errors++;
        }
      }

      const operatorLabels: Record<string, string> = {
        "+": "Adição (+)",
        "-": "Subtração (−)",
        "*": "Multiplicação (×)",
        "/": "Divisão (÷)",
      };

      weakPoints = Object.entries(operatorMap)
        .filter(([, data]) => data.errors > 0)
        .map(([op, data]) => ({
          operation: operatorLabels[op] ?? op,
          errorRate: data.errors / data.total,
        }));
    }
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-foreground">Dashboard</h1>
        <Link
          href="/train"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground
            px-6 py-3 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg
            transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium"
        >
          Iniciar Treino
        </Link>
      </div>

      <StatsSummary
        level={profile.level}
        streak={profile.streak}
        avgAccuracy={avgAccuracy}
        totalSessions={totalSessions}
      />

      <LessonsOverviewCard
        completedCount={completedLessons ?? 0}
        totalCount={totalLessons ?? 0}
      />

      <EvolutionChart sessions={orderedSessions} />

      <WeakPointsList weakPoints={weakPoints} />
    </main>
  );
}
