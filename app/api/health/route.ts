import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(unset)",
    supabase_configured:
      (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").startsWith("https://") &&
      !(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").includes("placeholder"),
  });
}
