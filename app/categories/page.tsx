"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import type { Product } from "@/types";

export default function CategoriesPage() {
  const { t, locale } = useLanguage();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d) => {
        const c: Record<string, number> = {};
        (d.products as Product[]).forEach((p) => {
          c[p.category] = (c[p.category] ?? 0) + 1;
        });
        setCounts(c);
      });
  }, []);

  const subName = (sub: { name_ja: string; name_en: string; name_zh: string }) =>
    locale === "en" ? sub.name_en : locale === "zh" ? sub.name_zh : sub.name_ja;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.categories.title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-purple-200 transition-all"
          >
            {/* Category header */}
            <Link
              href={`/skills?category=${cat.id}`}
              className="flex items-center gap-3 mb-3 group"
            >
              <div className="text-3xl flex-shrink-0">{cat.icon}</div>
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                  {getCategoryName(cat.id, locale)}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {counts[cat.id] ?? 0} {t.categories.skillCount}
                </p>
              </div>
            </Link>

            {/* Subcategory chips */}
            {cat.subcategories.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/skills?category=${cat.id}&subcategory=${sub.id}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors whitespace-nowrap"
                  >
                    {subName(sub)}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">—</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
