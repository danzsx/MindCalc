import type { SupabaseClient } from "@supabase/supabase-js";

export type UserPlan = "free" | "pro";

export const FREE_DAILY_SESSIONS = 1;
export const FREE_MAX_LEVEL = 5;
export const PRO_MAX_LEVEL = 10;

/**
 * Gets the user's current plan from their profile.
 */
export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPlan> {
  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  return (data?.plan as UserPlan) ?? "free";
}

/**
 * Checks whether a user can start a new training session.
 * Free users are limited to FREE_DAILY_SESSIONS per day.
 */
export async function canStartSession(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; reason?: string; sessionsToday: number }> {
  const plan = await getUserPlan(supabase, userId);

  if (plan === "pro") {
    return { allowed: true, sessionsToday: -1 };
  }

  // Count sessions created today (UTC)
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", todayStart.toISOString());

  const sessionsToday = count ?? 0;

  if (sessionsToday >= FREE_DAILY_SESSIONS) {
    return { allowed: false, reason: "daily_limit", sessionsToday };
  }

  return { allowed: true, sessionsToday };
}

/**
 * Returns the maximum level a user can reach based on their plan.
 */
export function getMaxLevel(plan: UserPlan): number {
  return plan === "pro" ? PRO_MAX_LEVEL : FREE_MAX_LEVEL;
}
