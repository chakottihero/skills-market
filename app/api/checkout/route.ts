import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { readProducts } from "@/lib/products";

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

  if (priceType === "free") {
    return NextResponse.json({ success: true, free: true });
  }

  const products = readProducts();
  const product = products.find((p) => p.id === skillId);
  if (!product) {
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
          unit_amount: product.price,
          product_data: {
            name: product.title,
            description: product.description?.slice(0, 500) ?? undefined,
          },
        },
      },
    ],
    success_url: `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/skills/${skillId}`,
    metadata: { skillId },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
