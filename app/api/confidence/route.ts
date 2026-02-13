import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SURVEY_INTERVAL = 5; // Show survey every N training sessions

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get the latest survey timestamp
    const { data: lastSurvey } = await supabase
      .from("confidence_surveys")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Count sessions since last survey (or all sessions if no survey yet)
    let query = supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (lastSurvey) {
      query = query.gt("created_at", lastSurvey.created_at);
    }

    const { count } = await query;
    const sessionsSinceLast = count ?? 0;

    return NextResponse.json({
      shouldShow: sessionsSinceLast >= SURVEY_INTERVAL,
      sessionsSinceLast,
    });
  } catch (error) {
    console.error("confidence GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId: string;
      score: number;
    };

    const { userId, score } = body;

    if (!userId || !score || score < 1 || score > 10) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("confidence_surveys")
      .insert({ user_id: userId, score })
      .select("id")
      .single();

    if (error) {
      console.error("confidence insert error:", error);
      return NextResponse.json(
        { error: "Failed to save survey" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("confidence POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
