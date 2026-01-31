import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId: string;
      lessonSlug: string;
    };

    const { userId, lessonSlug } = body;

    if (!userId || !lessonSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Look up lesson by slug
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("id, operator")
      .eq("slug", lessonSlug)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // 2. Upsert lesson_progress
    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("id, times_completed")
      .eq("user_id", userId)
      .eq("lesson_id", lesson.id)
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from("lesson_progress")
        .update({
          times_completed: existing.times_completed + 1,
          completed_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Lesson progress update error:", updateError);
        return NextResponse.json(
          { error: "Failed to update lesson progress" },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await supabase
        .from("lesson_progress")
        .insert({
          user_id: userId,
          lesson_id: lesson.id,
        });

      if (insertError) {
        console.error("Lesson progress insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to save lesson progress" },
          { status: 500 }
        );
      }
    }

    // 3. Insert learned technique (ignore if already exists)
    const { error: techniqueError } = await supabase
      .from("learned_techniques")
      .upsert(
        {
          user_id: userId,
          lesson_id: lesson.id,
          operator: lesson.operator,
        },
        { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
      );

    if (techniqueError) {
      console.error("Learned technique insert error:", techniqueError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("lesson complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
