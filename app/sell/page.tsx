"use client";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";
import { toolColors } from "@/lib/toolColors";
import type { Tool, Lang } from "@/types";

const TOOLS: Tool[] = ["claude-code", "cursor", "copilot", "codex", "other"];
const LANGS: Lang[] = ["ja", "en", "zh"];
const CATEGORIES = [
  "Webフロントエンド", "バックエンド・API", "開発ツール・環境", "AI・機械学習",
  "データサイエンス", "コード品質・レビュー", "金融・経済", "医療・ヘルスケア", "その他",
];

export default function SellPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title: "", description: "", price: "0", tool: "claude-code" as Tool,
    category: "その他", tags: "", content: "", repoUrl: "", lang: "en" as Lang, stars: "0",
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseInt(form.price) || 0,
          tool: form.tool,
          category: form.category,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          content: form.content,
          repoUrl: form.repoUrl,
          lang: form.lang,
          stars: parseInt(form.stars) || 0,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setForm({ title: "", description: "", price: "0", tool: "claude-code", category: "その他", tags: "", content: "", repoUrl: "", lang: "en", stars: "0" });
    } catch {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: string, type = "text", multiline = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={(form as Record<string, string>)[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          rows={6}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
        />
      ) : (
        <input
          type={type}
          value={(form as Record<string, string>)[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      )}
    </div>
  );

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
        {field(t.sell.formTitle, "title")}
        {field(t.sell.formDesc, "description", "text", true)}
        {field(t.sell.formPrice, "price", "number")}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formTool}</label>
          <select
            value={form.tool}
            onChange={(e) => setForm({ ...form, tool: e.target.value as Tool })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {TOOLS.map((tk) => (
              <option key={tk} value={tk}>{toolColors[tk].label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formCategory}</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {field(t.sell.formTags, "tags")}
        {field(t.sell.formContent, "content", "text", true)}
        {field(t.sell.formRepoUrl, "repoUrl", "url")}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.sell.formLang}</label>
          <select
            value={form.lang}
            onChange={(e) => setForm({ ...form, lang: e.target.value as Lang })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
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
