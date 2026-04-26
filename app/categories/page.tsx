"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { toolColors } from "@/lib/toolColors";
import type { Product } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  "Webフロントエンド": "🌐",
  "バックエンド・API": "⚙️",
  "開発ツール・環境": "🛠️",
  "AI・機械学習": "🤖",
  "データサイエンス": "📊",
  "コード品質・レビュー": "✅",
  "金融・経済": "💰",
  "医療・ヘルスケア": "🏥",
  "その他": "📦",
};

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products as Product[]); setLoading(false); });
  }, []);

  // Group by category
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const sorted = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.categories.title}</h1>

      {loading ? (
        <div className="text-center text-gray-400 py-20">{t.common.loading}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(([category, items]) => (
            <Link
              key={category}
              href={`/skills?category=${encodeURIComponent(category)}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="text-3xl mb-3">{CATEGORY_ICONS[category] ?? "📦"}</div>
              <h2 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                {category}
              </h2>
              <p className="text-sm text-gray-400">
                {items.length} {t.categories.skillCount}
              </p>

              {/* Tool breakdown */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.entries(
                  items.reduce<Record<string, number>>((acc, p) => {
                    acc[p.tool] = (acc[p.tool] ?? 0) + 1;
                    return acc;
                  }, {})
                ).map(([tool, count]) => {
                  const tc = toolColors[tool as keyof typeof toolColors] ?? toolColors.other;
                  return (
                    <span
                      key={tool}
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: tc.bg + "20", color: tc.bg }}
                    >
                      {tc.label} {count}
                    </span>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
