import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { skillToProduct } from "@/lib/skillMapper";
import type { SkillRow } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin.from("skills").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product: skillToProduct(data as SkillRow) });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";

  const { data: skill } = await supabaseAdmin.from("skills").select("seller_id").eq("id", id).single();
  if (!skill || skill.seller_id !== login) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("skills")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: skillToProduct(data as SkillRow) });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";

  const { data: skill } = await supabaseAdmin
    .from("skills")
    .select("seller_id, skill_file_path")
    .eq("id", id)
    .single();

  if (!skill || skill.seller_id !== login) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (skill.skill_file_path) {
    await supabaseAdmin.storage.from("skill-files").remove([skill.skill_file_path]);
  }

  const { error } = await supabaseAdmin.from("skills").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
