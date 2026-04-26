"use client";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { toolColors } from "@/lib/toolColors";
import { useLanguage } from "./LanguageContext";
import { localTitle, localDescription } from "@/lib/localizeProduct";

export default function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useLanguage();
  const tool = toolColors[product.tool] ?? toolColors.other;
  const title = localTitle(product, locale);
  const desc = localDescription(product, locale);

  return (
    <Link href={`/skills/${product.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: tool.bg, color: tool.text }}
          >
            {tool.label}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {product.price === 0 ? (
              <span className="text-emerald-600">{t.common.free}</span>
            ) : (
              `¥${product.price.toLocaleString()}`
            )}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">
          {desc}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <Link
            href={`/users/${product.author.login}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src={product.author.avatar}
              alt={product.author.name}
              width={20}
              height={20}
              className="rounded-full"
              unoptimized
            />
            <span className="text-xs text-gray-500">{product.author.name}</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>⭐ {product.stars}</span>
            <span>🛒 {product.purchases}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
