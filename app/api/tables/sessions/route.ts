import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateMasteredPercentage } from "@/lib/tables/engine";
import type {
  TablesConfig,
  TablesBlock,
  TablesQuestion,
  TablesOperation,
} from "@/types";

interface RequestBody {
  userId: string;
  config: TablesConfig;
  blocks: TablesBlock[];
  difficultCombinations: TablesQuestion[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const { userId, config, blocks, difficultCombinations } = body;

    if (!userId || !config || !blocks || !Array.isArray(blocks)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate totals from blocks
    let totalQuestions = 0;
    let correctAnswers = 0;
    for (const block of blocks) {
      for (const answer of block.answers) {
        totalQuestions++;
        if (answer.isCorrect) correctAnswers++;
      }
    }

    const accuracy =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const supabase = await createClient();

    // Insert session record
    const { data: session, error: sessionError } = await supabase
      .from("tables_sessions")
      .insert({
        user_id: userId,
        operation: config.operation,
        range_min: config.range.min,
        range_max: config.range.max,
        mode: config.mode,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        accuracy: Math.round(accuracy * 100) / 100,
      })
      .select("id")
      .single();

    if (sessionError) {
      console.error("Tables session insert error:", sessionError);
      return NextResponse.json(
        { error: "Failed to save session" },
        { status: 500 }
      );
    }

    // Insert individual question logs
    const logs = blocks.flatMap((block) =>
      block.questions.map((question, i) => {
        const answer = block.answers[i];
        return {
          session_id: session.id,
          user_id: userId,
          operand1: question.operand1,
          operand2: question.operand2,
          operator: question.operator as TablesOperation,
          correct_answer: question.correctAnswer,
          user_answer: answer?.userAnswer ?? null,
          is_correct: answer?.isCorrect ?? false,
          attempts: answer?.attempts ?? 1,
        };
      })
    );

    if (logs.length > 0) {
      const { error: logsError } = await supabase
        .from("tables_question_logs")
        .insert(logs);

      if (logsError) {
        console.error("Tables question logs insert error:", logsError);
      }
    }

    // Recalculate mastered percentage using all user logs for this operation/range
    const { data: allLogs } = await supabase
      .from("tables_question_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("operator", config.operation);

    const masteredPercentage = calculateMasteredPercentage(
      allLogs ?? [],
      config.operation,
      config.range
    );

    // Upsert tables_progress
    const { error: progressError } = await supabase
      .from("tables_progress")
      .upsert(
        {
          user_id: userId,
          operation: config.operation,
          range_min: config.range.min,
          range_max: config.range.max,
          mastered_percentage: Math.round(masteredPercentage * 100) / 100,
          last_practiced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,operation,range_min,range_max" }
      );

    if (progressError) {
      console.error("Tables progress upsert error:", progressError);
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("tables/sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
