import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "";

  const [{ data: bookmarkRow }, { data: skill }] = await Promise.all([
    supabaseAdmin.from("bookmarks").select("id").eq("skill_id", id).eq("user_id", login).maybeSingle(),
    supabaseAdmin.from("skills").select("bookmark_count").eq("id", id).single(),
  ]);

  return NextResponse.json({ bookmarked: !!bookmarkRow, count: skill?.bookmark_count ?? 0 });
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "";

  const { data: existing } = await supabaseAdmin
    .from("bookmarks")
    .select("id")
    .eq("skill_id", id)
    .eq("user_id", login)
    .maybeSingle();

  let bookmarked: boolean;
  if (existing) {
    await supabaseAdmin.from("bookmarks").delete().eq("id", existing.id);
    bookmarked = false;
  } else {
    await supabaseAdmin.from("bookmarks").insert({ user_id: login, skill_id: id });
    bookmarked = true;
  }

  const { count } = await supabaseAdmin
    .from("bookmarks")
    .select("*", { count: "exact", head: true })
    .eq("skill_id", id);

  const newCount = count ?? 0;
  await supabaseAdmin.from("skills").update({ bookmark_count: newCount }).eq("id", id);

  return NextResponse.json({ bookmarked, count: newCount });
}
