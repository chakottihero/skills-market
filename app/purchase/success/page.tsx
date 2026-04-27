"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

function SuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [skillId, setSkillId] = useState<string | null>(null);

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

  if (status === "loading") {
    return (
      <div className="text-center py-20 text-gray-400">{t.common.loading}</div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-gray-900 mb-4">{t.purchase.failed}</h1>
        <Link
          href="/skills"
          className="inline-block bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {t.purchase.backToSkills}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.purchase.success}</h1>
      <p className="text-gray-500 mb-8">スキルの購入が完了しました。</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {skillId && (
          <Link
            href={`/skills/${skillId}`}
            className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {t.purchase.download}
          </Link>
        )}
        <Link
          href="/skills"
          className="border border-gray-200 text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t.purchase.backToSkills}
        </Link>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">{t.common.loading}</div>}>
      <SuccessContent />
    </Suspense>
  );
}
