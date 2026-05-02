import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { skillToProduct } from "@/lib/skillMapper";
import type { SkillRow } from "@/types";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "";

  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .select("skill_id, created_at, skills(*)")
    .eq("user_id", login)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const products = (data ?? [])
    .filter((b) => b.skills)
    .map((b) => ({
      ...skillToProduct(b.skills as unknown as SkillRow),
      bookmarkedAt: b.created_at,
    }));

  return NextResponse.json({ products });
}
