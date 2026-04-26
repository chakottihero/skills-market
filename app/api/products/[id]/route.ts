import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readProducts, writeProducts, getProduct } from "@/lib/products";
import type { Product } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const login = (session.user as { login?: string }).login ?? session.user.name;
  if (products[idx].author.name !== login) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as Partial<Product>;
  products[idx] = { ...products[idx], ...body, id, author: products[idx].author };
  writeProducts(products);

  return NextResponse.json({ product: products[idx] });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const login = (session.user as { login?: string }).login ?? session.user.name;
  if (products[idx].author.name !== login) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  products.splice(idx, 1);
  writeProducts(products);

  return NextResponse.json({ success: true });
}
