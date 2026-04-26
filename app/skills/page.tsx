"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageContext";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import type { Product } from "@/types";

export default function SkillsPage() {
  return (
    <Suspense>
      <SkillsPageInner />
    </Suspense>
  );
}

function SkillsPageInner() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]       = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [tool, setTool]         = useState(searchParams.get("tool") ?? "");
  const [priceType, setPriceType] = useState(searchParams.get("price_type") ?? "");
  const [sort, setSort]         = useState(searchParams.get("sort") ?? "newest");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (category)  params.set("category", category);
    if (tool)      params.set("tool", tool);
    if (priceType) params.set("price_type", priceType);
    if (query)     params.set("q", query);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products as Product[]);
    setLoading(false);
  }, [query, category, tool, priceType, sort]);

  useEffect(() => {
    const id = setTimeout(fetchProducts, 300);
    return () => clearTimeout(id);
  }, [fetchProducts]);

  // sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (query)     p.set("q", query);
    if (category)  p.set("category", category);
    if (tool)      p.set("tool", tool);
    if (priceType) p.set("price_type", priceType);
    if (sort !== "newest") p.set("sort", sort);
    router.replace(`/skills${p.toString() ? `?${p}` : ""}`, { scroll: false });
  }, [query, category, tool, priceType, sort, router]);

  const PRICE_TABS = [
    { value: "",     label: t.skills.priceAll },
    { value: "free", label: t.skills.priceFree },
    { value: "paid", label: t.skills.pricePaid },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.skills.title}</h1>

      {/* Free/Paid tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        {PRICE_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPriceType(value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              priceType === value
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.skills.searchPlaceholder}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white"
        >
          <option value="">{t.skills.allCategories}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {getCategoryName(cat.id, locale)}
            </option>
          ))}
        </select>
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white"
        >
          <option value="">{t.skills.allTools}</option>
          {TOOLS.map((tk) => (
            <option key={tk.id} value={tk.id}>{tk.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white"
        >
          <option value="newest">{t.skills.sortNewest}</option>
          <option value="popular">{t.skills.sortPopular}</option>
          <option value="price">{t.skills.sortPrice}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">{t.common.loading}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 py-20">{t.skills.noResults}</div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{products.length} results</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
