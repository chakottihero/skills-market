import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { skillToProduct } from "@/lib/skillMapper";
import type { SkillRow } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category  = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const priceType = searchParams.get("price_type");
  const tool      = searchParams.get("tool");
  const sellerId  = searchParams.get("seller_id");
  const q         = searchParams.get("q")?.toLowerCase();
  const sort      = searchParams.get("sort") ?? "newest";

  let query = supabaseAdmin.from("skills").select("*");
  if (category)   query = query.eq("category", category);
  if (subcategory) query = query.eq("subcategory", subcategory);
  if (priceType)  query = query.eq("price_type", priceType);
  if (sellerId)   query = query.eq("seller_id", sellerId);
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
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";
  const formData = await req.formData();

  const title          = formData.get("title") as string;
  const shortDesc      = formData.get("short_description") as string;
  const description    = formData.get("description") as string;
  const category       = (formData.get("category") as string) || "other";
  const subcategory    = formData.get("subcategory") as string | null;
  const priceType      = (formData.get("price_type") as "free" | "paid") ?? "free";
  const price          = priceType === "free" ? 0 : (parseInt(formData.get("price") as string) || 0);
  const tags           = JSON.parse((formData.get("tags") as string) ?? "[]") as string[];
  const compatibleTools = JSON.parse((formData.get("compatible_tools") as string) ?? "[]") as string[];
  const file           = formData.get("file") as File | null;

  let skillFilePath: string | null = null;
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const fileName = `${login}/${crypto.randomUUID()}/${file.name}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("skill-files")
      .upload(fileName, arrayBuffer, { contentType: "text/markdown" });
    if (!uploadError) skillFilePath = fileName;
  }

  const { data, error } = await supabaseAdmin
    .from("skills")
    .insert({
      title,
      short_description: shortDesc || title,
      description: description || shortDesc || title,
      category,
      subcategory: subcategory || null,
      price_type: priceType,
      price,
      tags,
      compatible_tools: compatibleTools.length ? compatibleTools : ["other"],
      skill_file_path: skillFilePath,
      seller_id: login,
      seller_name: session.user.name ?? login,
      seller_avatar: session.user.image ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, skill: skillToProduct(data as SkillRow) }, { status: 201 });
}
