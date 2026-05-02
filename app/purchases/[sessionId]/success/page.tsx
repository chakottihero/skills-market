"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

const T = {
  ja: {
    loading: "確認中…",
    successTitle: "購入完了！",
    successMsg: "スキルの購入が完了しました。下のボタンからダウンロードできます。",
    download: "ダウンロード",
    backToSkills: "スキル一覧へ",
    failedTitle: "確認に失敗しました",
    failedMsg: "決済の確認ができませんでした。購入履歴から再試行してください。",
    myPurchases: "購入履歴を見る",
  },
  en: {
    loading: "Verifying…",
    successTitle: "Purchase Complete!",
    successMsg: "Your purchase was successful. You can download the skill below.",
    download: "Download",
    backToSkills: "Back to Skills",
    failedTitle: "Verification Failed",
    failedMsg: "Could not verify your payment. Please check your purchase history.",
    myPurchases: "View Purchase History",
  },
};

export default function PurchaseSuccessPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { locale } = useLanguage();
  const t = locale === "en" ? T.en : T.ja;

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [skillId, setSkillId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!sessionId) { setStatus("failed"); return; }
    fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSkillId(d.skillId ?? null);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [sessionId]);

  const handleDownload = async () => {
    if (!skillId) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/download/${skillId}`, { method: "POST" });
      const data = await res.json() as { fileUrl?: string };
      if (data.fileUrl) {
        setFileUrl(data.fileUrl);
        window.open(data.fileUrl, "_blank");
      }
    } finally {
      setDownloading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-20 text-gray-400">{t.loading}</div>;
  }

  if (status === "failed") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.failedTitle}</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-8">{t.failedMsg}</p>
        <div className="flex flex-col gap-3 justify-center">
          <Link href="/mypage/purchases" className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            {t.myPurchases}
          </Link>
          <Link href="/skills" className="border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {t.backToSkills}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.successTitle}</h1>
      <p className="text-gray-500 dark:text-gray-300 mb-8">{t.successMsg}</p>
      <div className="flex flex-col gap-3 justify-center">
        {skillId && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {downloading ? "…" : t.download}
          </button>
        )}
        {fileUrl && (
          <a href={fileUrl} download className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            {t.download} (direct)
          </a>
        )}
        {skillId && (
          <Link href={`/skills/${skillId}`} className="border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {locale === "en" ? "View skill page" : "スキルページへ"}
          </Link>
        )}
        <Link href="/skills" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          {t.backToSkills}
        </Link>
      </div>
    </div>
  );
}
