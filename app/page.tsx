"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageContext";
import type { Product } from "@/types";

export default function HomePage() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?sort=popular")
      .then((r) => r.json())
      .then((d) => setFeatured((d.products as Product[]).slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {t.home.hero}
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
            {t.home.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/skills"
              className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full hover:bg-purple-50 transition-colors"
            >
              {t.home.browseSkills}
            </Link>
            <Link
              href="/sell"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              {t.home.sellSkill}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "5+", label: t.home.totalSkills },
            { value: "3+", label: t.home.totalSellers },
            { value: "1,235", label: t.home.totalPurchases },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-purple-600">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skill Search Banner */}
      <section className="bg-indigo-50 border-b border-indigo-100 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-700">🔍 {t.home.searchHero}</p>
          </div>
          <a
            href="https://skill-search-ten.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Skill Search →
          </a>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t.home.featuredSkills}</h2>
          <Link href="/skills" className="text-sm text-purple-600 hover:underline">
            {t.home.viewAll} →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="text-center text-gray-400 py-16">{t.common.loading}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Tool badges */}
      <section className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-6">Supported AI Tools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Claude Code", color: "#8B5CF6" },
              { label: "Cursor", color: "#3B82F6" },
              { label: "Copilot", color: "#10B981" },
              { label: "Codex", color: "#F59E0B" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
