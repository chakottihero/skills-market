import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";

  const { data: skill } = await supabaseAdmin
    .from("skills")
    .select("price_type, price, skill_file_path")
    .eq("id", id)
    .single();

  if (!skill) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isFree = skill.price_type === "free" || skill.price === 0;

  if (!isFree) {
    const { data: purchase } = await supabaseAdmin
      .from("purchases")
      .select("id")
      .eq("skill_id", id)
      .eq("buyer_id", login)
      .eq("status", "completed")
      .maybeSingle();

    if (!purchase) {
      return NextResponse.json({ error: "Purchase required" }, { status: 403 });
    }
  }

  await supabaseAdmin.from("downloads").insert({ skill_id: id, user_id: login });

  let fileUrl: string | null = null;
  if (skill.skill_file_path) {
    const { data: signed } = await supabaseAdmin.storage
      .from("skill-files")
      .createSignedUrl(skill.skill_file_path, 60);
    fileUrl = signed?.signedUrl ?? null;
  }

  return NextResponse.json({ success: true, skillId: id, fileUrl });
}
