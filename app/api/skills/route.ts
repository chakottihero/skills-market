import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { skillToProduct } from "@/lib/skillMapper";
import type { SkillRow } from "@/types";

function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && !url.includes("placeholder");
}

export async function GET(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ products: [] });
  }

  const { searchParams } = new URL(req.url);
  const category   = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const priceType  = searchParams.get("price_type");
  const tool       = searchParams.get("tool");
  const sellerId   = searchParams.get("seller_id");
  const q          = searchParams.get("q")?.toLowerCase();
  const sort       = searchParams.get("sort") ?? "newest";

  try {
    let query = supabaseAdmin.from("skills").select("*");
    if (category)    query = query.eq("category", category);
    if (subcategory) query = query.eq("subcategory", subcategory);
    if (priceType)   query = query.eq("price_type", priceType);
    if (sellerId)    query = query.eq("seller_id", sellerId);
    if (tool && tool !== "all") query = query.contains("compatible_tools", [tool]);

    if (sort === "price") query = query.order("price", { ascending: true });
    else query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let products = (data as SkillRow[]).map(skillToProduct);

    if (q) {
      products = products.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ products });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase が設定されていません。環境変数を確認してください。" },
      { status: 503 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";

  let body: {
    title: string;
    short_description?: string;
    description?: string;
    category?: string;
    subcategory?: string;
    price_type?: "free" | "paid";
    price?: number;
    tags?: string[];
    ai_tools?: string[];
    skill_content?: string;
    github_url?: string;
    language?: string;
  };

  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    title,
    short_description,
    description,
    category = "other",
    subcategory,
    price_type = "free",
    price: rawPrice,
    tags = [],
    ai_tools = [],
    skill_content,
    github_url,
    language,
  } = body;

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const price = price_type === "free" ? 0 : (rawPrice ?? 0);
  const compatibleTools = ai_tools.length ? ai_tools : ["other"];

  let skillFilePath: string | null = null;

  if (skill_content && skill_content.trim()) {
    try {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(skill_content);
      const fileName = `${login}/${crypto.randomUUID()}/SKILL.md`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("skill-files")
        .upload(fileName, bytes, { contentType: "text/markdown" });
      if (!uploadError) skillFilePath = fileName;
    } catch {
      // Storage upload failure is non-fatal
    }
  }

  const shortDesc = short_description || title;
  const fullDesc  = description || shortDesc;
  const descWithMeta = github_url
    ? `${fullDesc}\n\nGitHub: ${github_url}`
    : fullDesc;

  try {
    const { data, error } = await supabaseAdmin
      .from("skills")
      .insert({
        title,
        short_description: shortDesc,
        description: descWithMeta,
        category,
        subcategory: subcategory || null,
        price_type,
        price,
        tags,
        compatible_tools: compatibleTools,
        skill_file_path: skillFilePath,
        seller_id: login,
        seller_name: session.user.name ?? login,
        seller_avatar: session.user.image ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, skill: skillToProduct(data as SkillRow) },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
