import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_SECRET = process.env.ADMIN_SEED_SECRET || "";

export async function POST(req: NextRequest) {
  const { secret } = await req.json() as { secret?: string };
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Add preview_content column if it doesn't exist
  const { error } = await supabaseAdmin.rpc("exec_sql", {
    sql: "ALTER TABLE skills ADD COLUMN IF NOT EXISTS preview_content boolean DEFAULT false;",
  });

  if (error) {
    // Column might already exist or RPC not available — try a no-op select to verify
    const { error: selectErr } = await supabaseAdmin
      .from("skills")
      .select("preview_content")
      .limit(1);

    if (selectErr) {
      return NextResponse.json({ error: `Migration failed: ${error.message}`, rpcError: true }, { status: 500 });
    }
    return NextResponse.json({ ok: true, note: "Column may already exist" });
  }

  return NextResponse.json({ ok: true, migrated: true });
}
