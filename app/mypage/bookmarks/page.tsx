"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

const T = {
  ja: {
    title: "ブックマーク",
    back: "← マイページ",
    loading: "読み込み中…",
    loginRequired: "ブックマークを見るにはログインが必要です。",
    login: "GitHubでログイン",
    empty: "まだブックマークしたスキルはありません",
    browseSkills: "スキルを探す →",
    remove: "解除",
  },
  en: {
    title: "Bookmarks",
    back: "← My Page",
    loading: "Loading…",
    loginRequired: "Please log in to view your bookmarks.",
    login: "Login with GitHub",
    empty: "You haven't bookmarked any skills yet.",
    browseSkills: "Browse Skills →",
    remove: "Remove",
  },
};

export default function BookmarksPage() {
  const { data: session } = useSession();
  const { locale } = useLanguage();
  const t = locale === "en" ? T.en : T.ja;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  const handleRemove = async (skillId: string) => {
    setRemoving((prev) => ({ ...prev, [skillId]: true }));
    try {
      await fetch(`/api/skills/${skillId}/bookmark`, { method: "POST" });
      setProducts((prev) => prev.filter((p) => p.id !== skillId));
    } finally {
      setRemoving((prev) => ({ ...prev, [skillId]: false }));
    }
  };

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t.loginRequired}</p>
        <button
          onClick={() => signIn("github")}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t.login}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/mypage" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 inline-block">
        {t.back}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.title}</h1>

      {loading ? (
        <div className="text-center text-gray-400 py-10">{t.loading}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="text-4xl mb-4">🔖</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t.empty}</p>
          <Link href="/skills" className="text-purple-600 hover:underline">{t.browseSkills}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={() => handleRemove(p.id)}
                disabled={removing[p.id]}
                className="absolute top-3 right-3 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors disabled:opacity-60"
              >
                {removing[p.id] ? "…" : t.remove}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
