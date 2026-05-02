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

  const { data: skill } = await supabaseAdmin
    .from("skills")
    .select("avg_rating, rating_count, price_type, price")
    .eq("id", id)
    .single();

  const isFree = !skill || skill.price_type === "free" || skill.price === 0;

  let hasPurchased = false;
  if (isFree) {
    const { data: dl } = await supabaseAdmin
      .from("downloads")
      .select("id")
      .eq("skill_id", id)
      .eq("user_id", login)
      .maybeSingle();
    hasPurchased = !!dl;
  } else {
    const { data: purchase } = await supabaseAdmin
      .from("purchases")
      .select("id")
      .eq("skill_id", id)
      .eq("buyer_id", login)
      .eq("status", "completed")
      .maybeSingle();
    hasPurchased = !!purchase;
  }

  const [{ data: myRatingRow }, { data: dlRow }] = await Promise.all([
    supabaseAdmin
      .from("ratings")
      .select("rating")
      .eq("skill_id", id)
      .eq("user_id", login)
      .maybeSingle(),
    supabaseAdmin
      .from("downloads")
      .select("id")
      .eq("skill_id", id)
      .eq("user_id", login)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    myRating: myRatingRow?.rating ?? null,
    avgRating: skill?.avg_rating ?? 0,
    ratingCount: skill?.rating_count ?? 0,
    hasPurchased,
    hasDownloaded: !!dlRow,
  });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "";
  const { rating } = await req.json() as { rating: number };

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const { data: skill } = await supabaseAdmin
    .from("skills")
    .select("price_type, price")
    .eq("id", id)
    .single();

  const isFree = !skill || skill.price_type === "free" || skill.price === 0;
  let hasPurchased = false;
  if (isFree) {
    const { data: dl } = await supabaseAdmin
      .from("downloads")
      .select("id")
      .eq("skill_id", id)
      .eq("user_id", login)
      .maybeSingle();
    hasPurchased = !!dl;
  } else {
    const { data: purchase } = await supabaseAdmin
      .from("purchases")
      .select("id")
      .eq("skill_id", id)
      .eq("buyer_id", login)
      .eq("status", "completed")
      .maybeSingle();
    hasPurchased = !!purchase;
  }

  if (!hasPurchased) {
    return NextResponse.json({ error: "Purchase required to rate" }, { status: 403 });
  }

  await supabaseAdmin.from("ratings").upsert(
    { user_id: login, skill_id: id, rating, updated_at: new Date().toISOString() },
    { onConflict: "user_id,skill_id" }
  );

  // Recalculate avg
  const { data: rows } = await supabaseAdmin
    .from("ratings")
    .select("rating")
    .eq("skill_id", id);

  const count = rows?.length ?? 0;
  const avg = count > 0 ? (rows!.reduce((s, r) => s + r.rating, 0) / count) : 0;

  await supabaseAdmin
    .from("skills")
    .update({ avg_rating: Math.round(avg * 10) / 10, rating_count: count })
    .eq("id", id);

  return NextResponse.json({ myRating: rating, avgRating: avg, ratingCount: count });
}
