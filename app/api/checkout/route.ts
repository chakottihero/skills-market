import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId, priceType } = await req.json() as {
    skillId: string;
    priceType: "free" | "paid";
  };

  if (!skillId || !priceType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const login = (session.user as { login?: string }).login ?? session.user?.name ?? "unknown";

  if (priceType === "free") {
    return NextResponse.json({ success: true, free: true });
  }

  // Duplicate purchase check
  const { data: existing } = await supabaseAdmin
    .from("purchases")
    .select("id, status")
    .eq("skill_id", skillId)
    .eq("buyer_id", login)
    .maybeSingle();

  if (existing?.status === "completed") {
    return NextResponse.json({ error: "already_purchased" }, { status: 409 });
  }

  const { data: skill } = await supabaseAdmin
    .from("skills")
    .select("title, price")
    .eq("id", skillId)
    .single();

  if (!skill) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "jpy",
          unit_amount: skill.price,
          product_data: { name: skill.title },
        },
      },
    ],
    success_url: `${origin}/purchases/${"{CHECKOUT_SESSION_ID}"}/success`,
    cancel_url: `${origin}/skills/${skillId}?canceled=true`,
    customer_email: session.user?.email ?? undefined,
    metadata: { skillId, buyer_id: login },
  });

  // Upsert pending purchase (overwrite any previous pending)
  await supabaseAdmin.from("purchases").upsert(
    {
      skill_id: skillId,
      buyer_id: login,
      buyer_email: session.user?.email ?? null,
      stripe_session_id: checkoutSession.id,
      price: skill.price,
      status: "pending",
    },
    { onConflict: "buyer_id,skill_id", ignoreDuplicates: false }
  );

  return NextResponse.json({ url: checkoutSession.url });
}
