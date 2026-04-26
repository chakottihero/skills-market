import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readProducts, writeProducts } from "@/lib/products";
import type { Product } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const products = readProducts();
  const { searchParams } = new URL(req.url);
  const tool = searchParams.get("tool");
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.toLowerCase();
  const sort = searchParams.get("sort") ?? "newest";
  const author = searchParams.get("author"); // filter by author login

  let filtered = products;
  if (tool && tool !== "all") filtered = filtered.filter((p) => p.tool === tool);
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (author) filtered = filtered.filter((p) => p.author.login === author);
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.title_en ?? "").toLowerCase().includes(q) ||
        (p.title_zh ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === "popular") filtered.sort((a, b) => b.purchases - a.purchases);
  else if (sort === "price") filtered.sort((a, b) => a.price - b.price);
  else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ products: filtered });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as Omit<Product, "id" | "author" | "purchases" | "createdAt">;
  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";
  const profileUrl = (session.user as { profileUrl?: string }).profileUrl ?? `https://github.com/${login}`;

  const newProduct: Product = {
    ...body,
    id: uuidv4(),
    author: {
      name: session.user.name ?? login,
      login,
      githubUrl: profileUrl,
      avatar: session.user.image ?? "",
    },
    purchases: 0,
    createdAt: new Date().toISOString(),
  };

  const products = readProducts();
  products.push(newProduct);
  writeProducts(products);

  return NextResponse.json({ product: newProduct }, { status: 201 });
}
