import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { TablesSessionSummary } from "@/components/tables/TablesSessionSummary";
import type { TablesQuestionLog } from "@/types";

interface ResultPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function TabuadaResultPage({ params }: ResultPageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch session
  const { data: session } = await supabase
    .from("tables_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    redirect("/dashboard");
  }

  // Fetch question logs
  const { data: logs } = await supabase
    .from("tables_question_logs")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const questionLogs = (logs ?? []) as TablesQuestionLog[];

  // Filter difficult combinations (incorrect with 2+ attempts)
  const difficultCombinations = questionLogs.filter(
    (log) => !log.is_correct && log.attempts >= 2
  );

  // --- Lesson suggestion (Section 10.1) ---
  let suggestedLesson: { slug: string; title: string } | null = null;

  // Check if user has >= 3 sessions with this operation below 70% accuracy
  const { count: lowAccuracyCount } = await supabase
    .from("tables_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("operation", session.operation)
    .lt("accuracy", 70);

  if ((lowAccuracyCount ?? 0) >= 3) {
    // Find a related lesson not yet completed by the user
    const { data: lesson } = await supabase
      .from("lessons")
      .select("slug, title, id")
      .eq("operator", session.operation)
      .order("sort_order")
      .limit(10);

    if (lesson && lesson.length > 0) {
      // Check which lessons the user has already completed
      const lessonIds = lesson.map((l: { id: string }) => l.id);
      const { data: completed } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds);

      const completedIds = new Set(
        (completed ?? []).map((c: { lesson_id: string }) => c.lesson_id)
      );

      const notCompleted = lesson.find(
        (l: { id: string }) => !completedIds.has(l.id)
      );

      if (notCompleted) {
        suggestedLesson = {
          slug: notCompleted.slug,
          title: notCompleted.title,
        };
      }
    }
  }

  const operatorSymbols: Record<string, string> = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-foreground">Como foi sua tabuada</h1>
        <p className="mt-1 text-muted-foreground">
          {operatorSymbols[session.operation] ?? session.operation} Tabuada do{" "}
          {session.range_min} ao {session.range_max}
        </p>
      </div>

      <TablesSessionSummary
        session={session}
        logs={questionLogs}
        difficultCombinations={difficultCombinations}
      />

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          asChild
          className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px] font-medium"
        >
          <Link
            href={`/tabuada/session?op=${encodeURIComponent(session.operation)}&min=${session.range_min}&max=${session.range_max}&mode=${session.mode}`}
          >
            Quero repetir
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full min-h-[56px]">
          <Link href="/tabuada">Tentar outra operação</Link>
        </Button>
        {suggestedLesson && (
          <Button variant="secondary" asChild className="w-full min-h-[56px]">
            <Link href={`/lessons/${suggestedLesson.slug}`}>
              Aula sugerida: {suggestedLesson.title}
            </Link>
          </Button>
        )}
        <Button variant="ghost" asChild className="w-full min-h-[56px]">
          <Link href="/dashboard">Voltar ao painel</Link>
        </Button>
      </div>
    </main>
  );
}
