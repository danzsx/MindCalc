import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { EvolutionChart } from "@/components/dashboard/EvolutionChart";
import { WeakPointsList } from "@/components/dashboard/WeakPointsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/train">Iniciar Treino</Link>
        </Button>
      </div>

      <StatsSummary
        level={profile.level}
        streak={profile.streak}
        avgAccuracy={avgAccuracy}
        totalSessions={totalSessions}
      />

      <Card>
        <CardHeader>
          <CardTitle>Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <EvolutionChart sessions={orderedSessions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pontos Fracos</CardTitle>
        </CardHeader>
        <CardContent>
          <WeakPointsList weakPoints={weakPoints} />
        </CardContent>
      </Card>
    </main>
  );
}
