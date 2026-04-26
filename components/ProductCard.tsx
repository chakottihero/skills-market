"use client";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { useLanguage } from "./LanguageContext";
import { localTitle, localShortDescription } from "@/lib/localizeProduct";
import { TOOL_MAP } from "@/lib/tools";

export default function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useLanguage();
  const title = localTitle(product, locale);
  const desc = localShortDescription(product, locale);
  const tools = product.compatible_tools?.length ? product.compatible_tools : [product.tool];

  return (
    <Link href={`/skills/${product.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 h-full flex flex-col">
        {/* Tool badges + price */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {tools.slice(0, 2).map((tid) => {
              const tool = TOOL_MAP[tid as keyof typeof TOOL_MAP];
              if (!tool) return null;
              return (
                <span key={tid} className={`text-xs font-medium px-2 py-0.5 rounded-full ${tool.badgeClass}`}>
                  {tool.name}
                </span>
              );
            })}
            {tools.length > 2 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                +{tools.length - 2}
              </span>
            )}
          </div>
          <span className="ml-2 flex-shrink-0">
            {product.price_type === "free" || product.price === 0 ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                {t.common.free}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-900 text-white">
                ¥{product.price.toLocaleString()}
              </span>
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
