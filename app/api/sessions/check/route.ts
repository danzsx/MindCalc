import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canStartSession } from "@/lib/subscription";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await canStartSession(supabase, user.id);

    return NextResponse.json({
      canTrain: result.allowed,
      reason: result.reason,
      sessionsToday: result.sessionsToday,
    });
  } catch (error) {
    console.error("sessions/check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
