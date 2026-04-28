import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";

  const { data, error } = await supabaseAdmin
    .from("purchases")
    .select("*, skills(title, price, category)")
    .eq("buyer_id", login)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ purchases: data });
}
