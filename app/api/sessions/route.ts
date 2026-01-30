import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateLevel } from "@/lib/engine";
import type { Exercise, Operator } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId: string;
      exercises: Exercise[];
      answers: (number | null)[];
      times: number[];
      level: number;
    };

    const { userId, exercises, answers, times, level } = body;

    if (!userId || !exercises || !answers || !times || !level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate accuracy and average time
    let correctCount = 0;
    for (let i = 0; i < exercises.length; i++) {
      if (answers[i] === exercises[i].correctAnswer) {
        correctCount++;
      }
    }

    const accuracy = (correctCount / exercises.length) * 100;
    const avgTime =
      times.reduce((sum, t) => sum + t, 0) / times.length;

    const supabase = await createClient();

    // Insert session record
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        user_id: userId,
        accuracy,
        avg_time: avgTime,
        level_at_time: level,
        exercises_count: exercises.length,
      })
      .select("id")
      .single();

    if (sessionError) {
      console.error("Session insert error:", sessionError);
      return NextResponse.json(
        { error: "Failed to save session" },
        { status: 500 }
      );
    }

    // Insert individual exercise logs
    const logs = exercises.map((ex, i) => ({
      session_id: session.id,
      user_id: userId,
      operand1: ex.operand1,
      operand2: ex.operand2,
      operator: ex.operator as Operator,
      correct_answer: ex.correctAnswer,
      user_answer: answers[i],
      time_spent: times[i],
      is_correct: answers[i] === ex.correctAnswer,
    }));

    const { error: logsError } = await supabase
      .from("exercise_logs")
      .insert(logs);

    if (logsError) {
      console.error("Exercise logs insert error:", logsError);
    }

    // Calculate new level and update profile
    const newLevel = calculateLevel(accuracy, avgTime, level);

    // Fetch current profile for streak logic
    const { data: profile } = await supabase
      .from("profiles")
      .select("streak, updated_at")
      .eq("id", userId)
      .single();

    let newStreak = 1;
    if (profile) {
      const lastUpdate = new Date(profile.updated_at);
      const now = new Date();

      // Check if last session was yesterday (streak continues)
      const lastDateStr = lastUpdate.toISOString().slice(0, 10);
      const yesterdayStr = new Date(now.getTime() - 86400000)
        .toISOString()
        .slice(0, 10);
      const todayStr = now.toISOString().slice(0, 10);

      if (lastDateStr === yesterdayStr) {
        // Last activity was yesterday → increment streak
        newStreak = profile.streak + 1;
      } else if (lastDateStr === todayStr) {
        // Already trained today → keep current streak
        newStreak = profile.streak;
      }
      // Otherwise reset to 1 (default)
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        level: newLevel,
        streak: newStreak,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
