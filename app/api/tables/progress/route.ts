import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { TablesProgress } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("tables_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Tables progress fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch progress" },
        { status: 500 }
      );
    }

    const progress: TablesProgress[] = (data ?? []).map((row) => ({
      id: row.id,
      operation: row.operation,
      rangeMin: row.range_min,
      rangeMax: row.range_max,
      masteredPercentage: row.mastered_percentage,
      lastPracticedAt: row.last_practiced_at,
    }));

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("tables/progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
