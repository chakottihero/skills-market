import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function serializeError(e: unknown): object {
  if (!(e instanceof Error)) return { raw: String(e) };
  const cause = (e as NodeJS.ErrnoException & { cause?: unknown }).cause;
  return {
    message: e.message,
    name: e.name,
    cause: cause instanceof Error
      ? { message: cause.message, code: (cause as NodeJS.ErrnoException).code }
      : cause,
  };
}

export async function GET() {
  const configured = supabaseConfigured();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "(unset)";

  // Direct fetch test to Supabase REST endpoint (bypasses supabase-js)
  let fetchTest: object = { ok: false, error: "skipped" };
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" },
      cache: "no-store",
    });
    fetchTest = { ok: res.ok, status: res.status };
  } catch (e) {
    fetchTest = { ok: false, ...serializeError(e) };
  }

  // supabase-js client test
  let dbTest: object = { ok: false, error: "skipped" };
  if (configured) {
    try {
      const { error } = await supabaseAdmin.from("skills").select("id").limit(1);
      dbTest = error ? { ok: false, error: error.message, code: error.code } : { ok: true };
    } catch (e) {
      dbTest = { ok: false, ...serializeError(e) };
    }
  }

  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    node_version: process.version,
    supabase_url: supabaseUrl,
    supabase_configured: configured,
    service_role_key_length: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").length,
    fetch_test: fetchTest,
    db_test: dbTest,
  });
}
