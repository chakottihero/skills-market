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

  const [{ data: likeRow }, { data: skill }] = await Promise.all([
    supabaseAdmin.from("likes").select("id").eq("skill_id", id).eq("user_id", login).maybeSingle(),
    supabaseAdmin.from("skills").select("like_count").eq("id", id).single(),
  ]);

  return NextResponse.json({ liked: !!likeRow, count: skill?.like_count ?? 0 });
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "";

  const { data: existing } = await supabaseAdmin
    .from("likes")
    .select("id")
    .eq("skill_id", id)
    .eq("user_id", login)
    .maybeSingle();

  let liked: boolean;
  if (existing) {
    await supabaseAdmin.from("likes").delete().eq("id", existing.id);
    liked = false;
  } else {
    await supabaseAdmin.from("likes").insert({ user_id: login, skill_id: id });
    liked = true;
  }

  const { count } = await supabaseAdmin
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("skill_id", id);

  const newCount = count ?? 0;
  await supabaseAdmin.from("skills").update({ like_count: newCount }).eq("id", id);

  return NextResponse.json({ liked, count: newCount });
}
