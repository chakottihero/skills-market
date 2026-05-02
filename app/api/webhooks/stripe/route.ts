import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type Stripe from "stripe";

// Disable Next.js body parsing — we need the raw body for Stripe signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const buf = Buffer.from(rawBody);
  const sig = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("[Stripe Webhook] Signature error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeSessionId = session.id;
    const skillId = session.metadata?.skillId ?? session.metadata?.skill_id;
    const buyerId = session.metadata?.buyer_id;
    const amount = session.amount_total ?? 0;

    if (!stripeSessionId) {
      console.error("[Stripe Webhook] Missing session id");
      return NextResponse.json({ error: "Missing session id" }, { status: 400 });
    }

    // Update existing pending purchase to completed
    const { error: updateError } = await supabaseAdmin
      .from("purchases")
      .update({
        status: "completed",
        price: amount,
      })
      .eq("stripe_session_id", stripeSessionId);

    if (updateError) {
      console.error("[Stripe Webhook] DB update error:", updateError.message);
      // If no existing record (e.g. created outside checkout flow), insert one
      if (skillId && buyerId) {
        const { error: insertError } = await supabaseAdmin.from("purchases").insert({
          skill_id: skillId,
          buyer_id: buyerId,
          stripe_session_id: stripeSessionId,
          price: amount,
          status: "completed",
        });
        if (insertError) {
          console.error("[Stripe Webhook] DB insert error:", insertError.message);
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
      }
    }

    console.log(`[Stripe Webhook] checkout.session.completed processed: ${stripeSessionId}`);
  }

  return NextResponse.json({ received: true });
}
