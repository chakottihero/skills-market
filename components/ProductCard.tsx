"use client";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { useLanguage } from "./LanguageContext";
import { localTitle, localShortDescription } from "@/lib/localizeProduct";
import { TOOL_MAP } from "@/lib/tools";
import { CATEGORY_MAP, getCategoryName } from "@/lib/categories";

const CATEGORY_COLORS: Record<string, string> = {
  "dev-tools":      "from-green-400 to-emerald-600",
  "web-dev":        "from-blue-400 to-indigo-600",
  "data-analytics": "from-yellow-400 to-orange-500",
  devops:           "from-orange-400 to-red-500",
  "ai-ml":          "from-violet-400 to-purple-600",
  docs:             "from-cyan-400 to-blue-500",
  business:         "from-pink-400 to-rose-600",
  utility:          "from-teal-400 to-cyan-600",
  other:            "from-gray-400 to-gray-600",
};

export default function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useLanguage();
  const title = localTitle(product, locale);
  const desc = localShortDescription(product, locale);
  const tools = product.compatible_tools?.length ? product.compatible_tools : [product.tool];
  const thumbnail = product.images?.[0];
  const gradient = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS.other;

  return (
    <Link href={`/skills/${product.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col overflow-hidden">
        {/* Thumbnail */}
        <div className="relative h-40 flex-shrink-0 overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-4xl opacity-80">
                {CATEGORY_MAP[product.category]?.icon ?? "🤖"}
              </span>
            </div>
          )}
          {/* Price badge */}
          <div className="absolute top-2 right-2">
            {product.price_type === "free" || product.price === 0 ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                {t.common.free}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-900/90 text-white shadow-sm">
                ¥{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          {/* Tool badges */}
          <div className="flex flex-wrap gap-1 mb-2">
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
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                +{tools.length - 2}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm leading-snug">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {CATEGORY_MAP[product.category]?.icon} {getCategoryName(product.category, locale)}
          </p>
          <p className="text-xs text-[#4b5563] dark:text-[#d1d5db] line-clamp-2 flex-1 mb-3">
            {desc}
          </p>

          {/* Footer: author + stats */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <Link
              href={`/users/${product.author.login}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity min-w-0 flex-1"
            >
              {product.author.avatar ? (
                <Image src={product.author.avatar} alt={product.author.name} width={18} height={18} className="rounded-full flex-shrink-0" unoptimized />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-20">{product.author.name}</span>
            </Link>

            {/* Stats */}
            <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
              {(product.avg_rating ?? 0) > 0 && (
                <span className="flex items-center gap-0.5">
                  <span className="text-yellow-400">★</span>
                  {(product.avg_rating ?? 0).toFixed(1)}
                </span>
              )}
              {(product.like_count ?? 0) > 0 && (
                <span className="flex items-center gap-0.5">
                  <span className="text-red-400">♥</span>
                  {product.like_count}
                </span>
              )}
              {(product.bookmark_count ?? 0) > 0 && (
                <span className="flex items-center gap-0.5">
                  <span className="text-blue-400">🔖</span>
                  {product.bookmark_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
