"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import type { PurchaseRow } from "@/types";

const T = {
  ja: {
    title: "購入履歴",
    back: "← マイページ",
    loading: "読み込み中…",
    loginRequired: "購入履歴を見るにはログインが必要です。",
    login: "GitHubでログイン",
    empty: "まだ購入したスキルはありません",
    browseSkills: "スキルを探す →",
    download: "ダウンロード",
    downloading: "処理中…",
    free: "無料",
  },
  en: {
    title: "Purchase History",
    back: "← My Page",
    loading: "Loading…",
    loginRequired: "Please log in to view your purchase history.",
    login: "Login with GitHub",
    empty: "You haven't purchased any skills yet.",
    browseSkills: "Browse Skills →",
    download: "Download",
    downloading: "Processing…",
    free: "Free",
  },
};

export default function PurchasesPage() {
  const { data: session } = useSession();
  const { locale } = useLanguage();
  const t = locale === "en" ? T.en : T.ja;
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetch("/api/purchases")
      .then((r) => r.json())
      .then((d) => { setPurchases(d.purchases ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  const handleDownload = async (skillId: string) => {
    setDownloading((prev) => ({ ...prev, [skillId]: true }));
    try {
      const res = await fetch(`/api/download/${skillId}`, { method: "POST" });
      const data = await res.json() as { fileUrl?: string };
      if (data.fileUrl) window.open(data.fileUrl, "_blank");
    } finally {
      setDownloading((prev) => ({ ...prev, [skillId]: false }));
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
      ) : purchases.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="text-4xl mb-4">🛍️</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t.empty}</p>
          <Link href="/skills" className="text-purple-600 hover:underline">{t.browseSkills}</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/skills/${p.skill_id}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 text-sm line-clamp-1"
                >
                  {p.skills?.title ?? p.skill_id}
                </Link>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {p.price === 0
                    ? t.free
                    : `¥${p.price.toLocaleString()}`}
                  {" · "}
                  {p.created_at.slice(0, 10)}
                </p>
              </div>
              <button
                onClick={() => handleDownload(p.skill_id)}
                disabled={downloading[p.skill_id]}
                className="ml-4 flex-shrink-0 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {downloading[p.skill_id] ? t.downloading : t.download}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
