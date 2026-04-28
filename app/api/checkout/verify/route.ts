import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json() as { sessionId: string };

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      await supabaseAdmin
        .from("purchases")
        .update({ status: "completed" })
        .eq("stripe_session_id", sessionId);

      return NextResponse.json({
        success: true,
        skillId: session.metadata?.skillId ?? null,
      });
    }
    return NextResponse.json({ success: false });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
