"use client";
import { useRef, useState } from "react";
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
  compatible_tools: [] as string[],
  tags: "",
};

export default function SellPage() {
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
      compatible_tools: f.compatible_tools.includes(id)
        ? f.compatible_tools.filter((t) => t !== id)
        : [...f.compatible_tools, id],
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
      const tools = form.compatible_tools.length ? form.compatible_tools : ["other"];

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("short_description", form.shortDescription || form.title);
      fd.append("description", form.description || form.shortDescription || form.title);
      fd.append("category", form.category || "other");
      if (form.subcategory) fd.append("subcategory", form.subcategory);
      fd.append("price_type", form.priceType);
      if (form.priceType === "paid") fd.append("price", form.price);
      fd.append("tags", JSON.stringify(tags));
      fd.append("compatible_tools", JSON.stringify(tools));
      if (file) fd.append("file", file);

      const res = await fetch("/api/skills", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed");
      }
      const d = await res.json() as { skill: Product };
      setNewSkill(d.skill);
      setForm(EMPTY_FORM);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
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
                  form.compatible_tools.includes(tk.id)
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

        {/* SKILL.md file upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKILL.md ファイル
            <span className="text-gray-400 font-normal text-xs ml-1">(任意・.md)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".md,text/markdown,text/plain"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
          />
          {file && (
            <p className="text-xs text-emerald-600 mt-1">
              選択済み: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
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
