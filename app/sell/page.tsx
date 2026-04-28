"use client";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import type { Product } from "@/types";

const EMPTY_FORM = {
  title: "",
  shortDescription: "",
  description: "",
  priceType: "free" as "free" | "paid",
  price: "",
  category: "",
  subcategory: "",
  ai_tools: [] as string[],
  tags: "",
  skill_content: "",
  github_url: "",
  language: "ja" as "ja" | "en" | "zh",
};

export default function SellPage() {
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState<Product | null>(null);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <p className="text-gray-600 mb-6">{t.sell.loginRequired}</p>
        <button
          onClick={() => signIn("github")}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t.nav.login}
        </button>
      </div>
    );
  }

  const selectedCat = CATEGORIES.find((c) => c.id === form.category);

  const toggleTool = (id: string) => {
    setForm((f) => ({
      ...f,
      ai_tools: f.ai_tools.includes(id)
        ? f.ai_tools.filter((t) => t !== id)
        : [...f.ai_tools, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10);

      const body = {
        title: form.title,
        short_description: form.shortDescription || form.title,
        description: form.description || form.shortDescription || form.title,
        category: form.category || "other",
        subcategory: form.subcategory || undefined,
        price_type: form.priceType,
        price: form.priceType === "paid" ? Number(form.price) : 0,
        tags,
        ai_tools: form.ai_tools,
        skill_content: form.skill_content || undefined,
        github_url: form.github_url || undefined,
        language: form.language,
      };

      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed");
      }
      const d = await res.json() as { skill: Product };
      setNewSkill(d.skill);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400";

  if (newSkill) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.sell.success}</h2>
        <p className="text-gray-500 mb-8">{newSkill.title}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/skills/${newSkill.id}`}
            className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            スキルページを見る →
          </Link>
          <button
            onClick={() => setNewSkill(null)}
            className="border border-gray-200 text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            続けて出品する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.sell.title}</h1>
      <p className="text-gray-500 mb-8">{t.sell.subtitle}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formTitle}</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
            required
          />
        </div>

        {/* Short description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formDesc} (short)</label>
          <input
            type="text"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className={inputCls}
            maxLength={120}
          />
        </div>

        {/* Full description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formDesc}</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            className={inputCls}
          />
        </div>

        {/* Price type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.sell.formPriceType}</label>
          <div className="flex gap-2">
            {(["free", "paid"] as const).map((pt) => (
              <button
                key={pt}
                type="button"
                onClick={() => setForm({ ...form, priceType: pt })}
                className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.priceType === pt
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
              >
                {pt === "free" ? t.sell.priceFree : t.sell.pricePaid}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        {form.priceType === "paid" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formPrice} (¥)</label>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className={inputCls}
              required
            />
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formCategory}</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
            className={`${inputCls} bg-white`}
          >
            <option value="">{t.skills.allCategories}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {getCategoryName(cat.id, locale)}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {selectedCat && selectedCat.subcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formSubcategory}</label>
            <select
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              className={`${inputCls} bg-white`}
            >
              <option value="">— {t.sell.formSubcategory} —</option>
              {selectedCat.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {locale === "en" ? sub.name_en : locale === "zh" ? sub.name_zh : sub.name_ja}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tools */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.sell.formTools}</label>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((tk) => (
              <button
                key={tk.id}
                type="button"
                onClick={() => toggleTool(tk.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  form.ai_tools.includes(tk.id)
                    ? `${tk.badgeClass} border-transparent`
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {tk.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.sell.formTags}{" "}
            <span className="text-gray-400 font-normal text-xs">(comma separated, max 10)</span>
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className={inputCls}
            placeholder="python, automation, review"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub URL
            <span className="text-gray-400 font-normal text-xs ml-1">(任意)</span>
          </label>
          <input
            type="url"
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            className={inputCls}
            placeholder="https://github.com/yourname/repo"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">言語 / Language</label>
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value as "ja" | "en" | "zh" })}
            className={`${inputCls} bg-white`}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>

        {/* SKILL.md content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKILL.md の内容
            <span className="text-gray-400 font-normal text-xs ml-1">(任意・Markdown形式)</span>
          </label>
          <textarea
            value={form.skill_content}
            onChange={(e) => setForm({ ...form, skill_content: e.target.value })}
            rows={8}
            className={`${inputCls} font-mono text-xs`}
            placeholder={"# スキル名\n\n## 概要\n\n## 使い方\n\n## 例"}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !form.title}
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t.common.loading : t.sell.submit}
        </button>
      </form>
    </div>
  );
}
