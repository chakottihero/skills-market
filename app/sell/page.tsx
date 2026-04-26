"use client";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import type { Lang } from "@/types";

const LANGS: Lang[] = ["ja", "en", "zh"];

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
  content: "",
  repoUrl: "",
  lang: "ja" as Lang,
};

export default function SellPage() {
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      const price = form.priceType === "free" ? 0 : parseInt(form.price) || 0;
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10);
      const tools = form.compatible_tools.length ? form.compatible_tools : ["other"];

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          shortDescription: form.shortDescription,
          description: form.description,
          price,
          price_type: form.priceType,
          tool: tools[0],
          compatible_tools: tools,
          category: form.category || "other",
          subcategory: form.subcategory || undefined,
          tags,
          content: form.content,
          repoUrl: form.repoUrl || undefined,
          lang: form.lang,
          stars: 0,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.sell.title}</h1>
      <p className="text-gray-500 mb-8">{t.sell.subtitle}</p>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 mb-6">
          {t.sell.success}
        </div>
      )}
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

        {/* Price type toggle */}
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

        {/* Price (shown only when paid) */}
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

        {/* Subcategory (dynamic) */}
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

        {/* Tools (multi-select checkboxes) */}
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
            {t.sell.formTags} <span className="text-gray-400 font-normal text-xs">(comma separated, max 10)</span>
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className={inputCls}
            placeholder="python, automation, review"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formContent}</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={8}
            className={`${inputCls} font-mono`}
            required
          />
        </div>

        {/* Repo URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formRepoUrl}</label>
          <input
            type="url"
            value={form.repoUrl}
            onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
            className={inputCls}
            placeholder="https://github.com/..."
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formLang}</label>
          <select
            value={form.lang}
            onChange={(e) => setForm({ ...form, lang: e.target.value as Lang })}
            className={`${inputCls} bg-white`}
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !form.title || !form.content}
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t.common.loading : t.sell.submit}
        </button>
      </form>
    </div>
  );
}
