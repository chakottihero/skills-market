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
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const c: Record<string, number> = {};
        (d.products as Product[]).forEach((p) => {
          c[p.category] = (c[p.category] ?? 0) + 1;
        });
        setCounts(c);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.categories.title}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/skills?category=${cat.id}`}
            className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all flex flex-col items-center text-center"
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <h2 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors leading-tight mb-1">
              {getCategoryName(cat.id, locale)}
            </h2>
            <p className="text-xs text-gray-400">
              {counts[cat.id] ?? 0} {t.categories.skillCount}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
