import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/lessons/:path*",
    "/tabuada/:path*",
    "/train/:path*",
    "/onboarding/:path*",
    "/results/:path*",
    "/billing/:path*",
  ],
};
