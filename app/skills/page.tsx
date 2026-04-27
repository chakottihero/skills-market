"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageContext";
import { CATEGORIES, CATEGORY_MAP, getCategoryName, getSubcategoryName } from "@/lib/categories";
import { TOOLS, TOOL_MAP } from "@/lib/tools";
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
  const [query, setQuery]             = useState(searchParams.get("q") ?? "");
  const [category, setCategory]       = useState(searchParams.get("category") ?? "");
  const [subcategory, setSubcategory] = useState(searchParams.get("subcategory") ?? "");
  const [tool, setTool]               = useState(searchParams.get("tool") ?? "");
  const [priceType, setPriceType]     = useState(searchParams.get("price_type") ?? "");
  const [sort, setSort]               = useState(searchParams.get("sort") ?? "newest");
  const [showAllCats, setShowAllCats] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (category)    params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (tool)        params.set("tool", tool);
    if (priceType)   params.set("price_type", priceType);
    if (query)       params.set("q", query);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products as Product[]);
    setLoading(false);
  }, [query, category, subcategory, tool, priceType, sort]);

  useEffect(() => {
    const id = setTimeout(fetchProducts, 300);
    return () => clearTimeout(id);
  }, [fetchProducts]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (query)       p.set("q", query);
    if (category)    p.set("category", category);
    if (subcategory) p.set("subcategory", subcategory);
    if (tool)        p.set("tool", tool);
    if (priceType)   p.set("price_type", priceType);
    if (sort !== "newest") p.set("sort", sort);
    router.replace(`/skills${p.toString() ? `?${p}` : ""}`, { scroll: false });
  }, [query, category, subcategory, tool, priceType, sort, router]);

  const handleSetCategory = (cat: string) => {
    setCategory(cat);
    setSubcategory("");
  };

  const PRICE_TABS = [
    { value: "",     label: t.skills.priceAll },
    { value: "free", label: t.skills.priceFree },
    { value: "paid", label: t.skills.pricePaid },
  ];

  const SORT_OPTIONS = [
    { value: "newest",  label: t.skills.sortNewest },
    { value: "popular", label: t.skills.sortPopular },
    { value: "price",   label: t.skills.sortPrice },
  ];

  const chipCls = (val: string, active: string) =>
    `flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
      val === active
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
    }`;

  const subChipCls = (val: string, active: string) =>
    `flex-shrink-0 px-2.5 py-1 rounded-full text-xs border transition-colors whitespace-nowrap ${
      val === active
        ? "bg-purple-100 text-purple-700 border-purple-300 font-medium"
        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
    }`;

  const selectedCat = category ? CATEGORY_MAP[category] : null;
  const hasActiveFilters = !!(category || tool || priceType);
  const expandBtnLabel = showAllCats
    ? `${t.filter.showLess} ▲`
    : `${t.filter.showMore} (${t.filter.allCategories.replace("{count}", String(CATEGORIES.length))}) ▼`;

  const subName = (sub: { name_ja: string; name_en: string; name_zh: string }) =>
    locale === "en" ? sub.name_en : locale === "zh" ? sub.name_zh : sub.name_ja;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.skills.title}</h1>

      {/* Filter card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">

        {/* Row 1: Search + Sort */}
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.skills.searchPlaceholder}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="hidden sm:block border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Desktop: Row 2 — Category dropdown (+ subcategory) + Tool + Price tabs */}
        <div className="hidden sm:flex gap-3 items-start flex-wrap">
          <div className="flex flex-col gap-2">
            <select
              value={category}
              onChange={(e) => handleSetCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">{t.skills.allCategories}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {getCategoryName(cat.id, locale)}
                </option>
              ))}
            </select>
            {selectedCat && selectedCat.subcategories.length > 0 && (
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="border border-purple-200 rounded-lg px-3 py-2 text-sm bg-white text-purple-700"
              >
                <option value="">{t.filter.allSubcategories}</option>
                {selectedCat.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{subName(sub)}</option>
                ))}
              </select>
            )}
          </div>
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white self-start"
          >
            <option value="">{t.skills.allTools}</option>
            {TOOLS.map((tk) => (
              <option key={tk.id} value={tk.id}>{tk.name}</option>
            ))}
          </select>
          <div className="flex gap-1 ml-auto bg-gray-100 rounded-lg p-1 self-start">
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
        </div>

        {/* Mobile: chip rows */}
        <div className="sm:hidden space-y-2.5">
          {/* Price + Sort */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {PRICE_TABS.map(({ value, label }) => (
              <button key={value} onClick={() => setPriceType(value)} className={chipCls(value, priceType)}>
                {label}
              </button>
            ))}
            <span className="flex-shrink-0 w-px bg-gray-200 self-stretch mx-1" />
            {SORT_OPTIONS.map(({ value, label }) => (
              <button key={value} onClick={() => setSort(value)} className={chipCls(value, sort)}>
                {label}
              </button>
            ))}
          </div>

          {/* Category: All + expand button only */}
          <div className="space-y-2">
            <div className="flex gap-2 pb-1">
              <button onClick={() => handleSetCategory("")} className={chipCls("", category)}>
                {t.skills.allCategories}
              </button>
              <button
                onClick={() => setShowAllCats(!showAllCats)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-purple-300 text-purple-600 whitespace-nowrap hover:bg-purple-50 transition-colors"
              >
                {expandBtnLabel}
              </button>
            </div>
            {showAllCats && (
              <div className="grid grid-cols-3 gap-1.5 py-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { handleSetCategory(cat.id); setShowAllCats(false); }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors text-left leading-tight ${
                      cat.id === category
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {cat.icon} {getCategoryName(cat.id, locale)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subcategory chips — appear when a category is selected */}
          {selectedCat && selectedCat.subcategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              <button onClick={() => setSubcategory("")} className={subChipCls("", subcategory)}>
                {t.filter.allSubcategories}
              </button>
              {selectedCat.subcategories.map((sub) => (
                <button key={sub.id} onClick={() => setSubcategory(sub.id)} className={subChipCls(sub.id, subcategory)}>
                  {subName(sub)}
                </button>
              ))}
            </div>
          )}

          {/* Tool chips — flex-wrap so all 8 are visible */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setTool("")} className={chipCls("", tool)}>
              {t.skills.allTools}
            </button>
            {TOOLS.map((tk) => (
              <button key={tk.id} onClick={() => setTool(tk.id)} className={chipCls(tk.id, tool)}>
                {tk.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-xs text-gray-500">{t.filter.activeFilters}:</span>
          {category && (
            <button
              onClick={() => { setCategory(""); setSubcategory(""); }}
              className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full hover:bg-purple-200 transition-colors"
            >
              {selectedCat?.icon} {getCategoryName(category, locale)}
              <span className="text-purple-400 ml-0.5">×</span>
            </button>
          )}
          {category && subcategory && (
            <button
              onClick={() => setSubcategory("")}
              className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              {selectedCat?.icon} {getCategoryName(category, locale)} › {getSubcategoryName(category, subcategory, locale)}
              <span className="text-purple-400 ml-0.5">×</span>
            </button>
          )}
          {tool && (
            <button
              onClick={() => setTool("")}
              className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              {TOOL_MAP[tool as keyof typeof TOOL_MAP]?.name ?? tool}
              <span className="text-blue-400 ml-0.5">×</span>
            </button>
          )}
          {priceType && (
            <button
              onClick={() => setPriceType("")}
              className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full hover:bg-emerald-200 transition-colors"
            >
              {priceType === "free" ? t.skills.priceFree : t.skills.pricePaid}
              <span className="text-emerald-400 ml-0.5">×</span>
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-20">{t.common.loading}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 py-20">{t.skills.noResults}</div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {t.filter.results.replace("{count}", String(products.length))}
          </p>
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
