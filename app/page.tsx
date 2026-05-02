"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageContext";
import { TOOLS } from "@/lib/tools";
import { CATEGORIES } from "@/lib/categories";
import type { Product } from "@/types";

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [priceTab, setPriceTab] = useState<"" | "free" | "paid">("");
  const [stats, setStats] = useState({ skills: 0, sellers: 0 });
  const [heroSearch, setHeroSearch] = useState("");

  useEffect(() => {
    fetch("/api/skills?sort=popular")
      .then((r) => r.json())
      .then((d) => {
        const products = (d.products as Product[]) ?? [];
        setAllProducts(products);
        const uniqueSellers = new Set(products.map((p) => p.author.login)).size;
        setStats({ skills: products.length, sellers: uniqueSellers });
      })
      .catch(() => {});
  }, []);

  const featured = (priceTab ? allProducts.filter((p) => p.price_type === priceTab) : allProducts).slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) router.push(`/skills?q=${encodeURIComponent(heroSearch.trim())}`);
    else router.push("/skills");
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {t.home.hero}
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            {t.home.heroSub}
          </p>

          {/* Hero search bar */}
          <form onSubmit={handleHeroSearch} className="max-w-lg mx-auto mb-8 flex gap-2">
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="ChatGPT, Claude, プロンプト..."
              className="flex-1 px-5 py-3 rounded-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-colors text-sm flex-shrink-0"
            >
              検索
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/skills"
              className="bg-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/30 transition-colors border border-white/30"
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
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            {
              value: stats.skills > 0 ? `${stats.skills.toLocaleString()}${t.stats.unit.skills}` : "—",
              label: t.stats.skillsListed,
            },
            {
              value: stats.sellers > 0 ? `${stats.sellers.toLocaleString()}${t.stats.unit.people}` : "—",
              label: t.stats.sellers,
            },
            {
              value: String(CATEGORIES.length),
              label: t.stats.categories,
            },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-purple-600">{value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skill Search Banner */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-purple-300 text-sm font-medium mb-1">🔍 Skill Search</p>
            <div className="text-2xl font-bold text-white mb-1">74,000+</div>
            <p className="text-purple-200 text-sm">{t.home.searchHero}</p>
          </div>
          <a
            href="https://search.aiskill-market.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap text-base shadow-lg"
          >
            Explore Skill Search →
          </a>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.home.featuredSkills}</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {([["", t.home.tabAll], ["free", t.home.tabFree], ["paid", t.home.tabPaid]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setPriceTab(val)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    priceTab === val ? "bg-white dark:bg-gray-600 text-purple-700 dark:text-purple-300 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link href="/skills" className="text-sm text-purple-600 hover:underline whitespace-nowrap">
              {t.home.viewAll} →
            </Link>
          </div>
        </div>
        {allProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500 dark:text-gray-300 font-medium mb-1">{t.empty.noSkills}</p>
            <p className="text-gray-400 dark:text-gray-400 text-sm mb-6">{t.empty.beFirst}</p>
            <Link
              href="/sell"
              className="inline-block bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors"
            >
              {t.empty.listSkill} →
            </Link>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 py-16">{t.skills.noResults}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Tool badges */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">Supported AI Tools</p>
          <div className="flex flex-wrap justify-center gap-2">
            {TOOLS.filter((tk) => tk.id !== "other").map((tk) => (
              <Link
                key={tk.id}
                href={`/skills?tool=${tk.id}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 ${tk.badgeClass}`}
              >
                {tk.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
