import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Product, ProductsData } from "@/types";

const DATA_PATH = join(process.cwd(), "data", "products.json");

export function readProducts(): Product[] {
  const raw = readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(raw) as ProductsData;
  return data.products;
}

export function writeProducts(products: Product[]): void {
  const data: ProductsData = { products };
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function getProduct(id: string): Product | undefined {
  return readProducts().find((p) => p.id === id);
}
