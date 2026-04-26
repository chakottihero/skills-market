"use client";
import { useEffect, useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageContext";
import { toolColors } from "@/lib/toolColors";
import type { Product, Tool } from "@/types";

const TOOLS: Tool[] = ["claude-code", "cursor", "copilot", "codex", "other"];

export default function SkillsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tool, setTool] = useState("all");
  const [sort, setSort] = useState("newest");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (tool !== "all") params.set("tool", tool);
    if (query) params.set("q", query);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products as Product[]);
    setLoading(false);
  }, [query, tool, sort]);

  useEffect(() => {
    const id = setTimeout(fetch_, 300);
    return () => clearTimeout(id);
  }, [fetch_]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.skills.title}</h1>

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
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white"
        >
          <option value="all">{t.skills.allTools}</option>
          {TOOLS.map((tk) => (
            <option key={tk} value={tk}>{toolColors[tk].label}</option>
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
