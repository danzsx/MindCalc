import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TablesSessionSummary } from "@/components/tables/TablesSessionSummary";
import { Grid3X3, RotateCcw, Shuffle, BookOpen, ArrowLeft } from "lucide-react";
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
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      {/* Hero header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl mb-4">
          <Grid3X3 className="h-7 w-7 text-white" />
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent mb-2"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Como foi sua tabuada
        </h1>
        <p className="text-white/50">
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
        <Link
          href={`/tabuada/session?op=${encodeURIComponent(session.operation)}&min=${session.range_min}&max=${session.range_max}&mode=${session.mode}`}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-blue-400 hover:to-purple-400 hover:shadow-lg hover:shadow-blue-500/25"
        >
          <RotateCcw className="w-5 h-5" />
          Quero repetir
        </Link>

        <Link
          href="/tabuada"
          className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
        >
          <Shuffle className="w-5 h-5" />
          Tentar outra operação
        </Link>

        {suggestedLesson && (
          <Link
            href={`/lessons/${suggestedLesson.slug}`}
            className="w-full bg-gradient-to-r from-teal-500/15 to-cyan-500/15 border border-teal-500/20 text-teal-300 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-teal-500/25 hover:to-cyan-500/25"
          >
            <BookOpen className="w-5 h-5" />
            Aula sugerida: {suggestedLesson.title}
          </Link>
        )}

        <Link
          href="/dashboard"
          className="w-full text-white/50 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
