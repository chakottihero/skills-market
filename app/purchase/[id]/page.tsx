"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import { localTitle } from "@/lib/localizeProduct";
import { TOOL_MAP } from "@/lib/tools";
import type { Product } from "@/types";

export default function PurchasePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, locale } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Notify modal state
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState((session?.user?.email ?? "") as string);
  const [submitting, setSubmitting] = useState(false);
  const [notified, setNotified] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { signIn("github"); return; }
    if (status === "loading") return;
    fetch(`/api/products/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {
        const p = d.product as Product;
        if (p.price_type === "free" || p.price === 0) {
          router.replace(`/skills/${id}`);
          return;
        }
        setProduct(p);
        setLoading(false);
      })
      .catch(() => router.push("/skills"));
  }, [id, router, status]);

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  const handleNotify = async () => {
    setEmailError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("有効なメールアドレスを入力してください");
      return;
    }
    setSubmitting(true);
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, skillId: id }),
    });
    setSubmitting(false);
    setNotified(true);
  };

  if (loading || !product) {
    return <div className="text-center py-20 text-gray-400">{t.common.loading}</div>;
  }

  const title = localTitle(product, locale);
  const tm = TOOL_MAP[product.tool as keyof typeof TOOL_MAP];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href={`/skills/${id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← {t.common.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Product overview — col-span-3 */}
        <div className="lg:col-span-3 space-y-5">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {tm && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tm.badgeClass}`}>
                  {tm.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          </div>

          {/* Seller */}
          <Link href={`/users/${product.author.login}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src={product.author.avatar}
              alt={product.author.name}
              width={36}
              height={36}
              className="rounded-full flex-shrink-0"
              unoptimized
            />
            <span className="text-sm text-gray-700">{product.author.name}</span>
          </Link>

          {/* Content preview (truncated) */}
          <div className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
            {product.content.slice(0, 400)}{product.content.length > 400 ? "\n..." : ""}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Order summary — col-span-2 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{t.purchase.summary}</h2>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="line-clamp-1 flex-1 pr-2">{title}</span>
                <span className="font-medium whitespace-nowrap">¥{product.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="font-semibold text-gray-900">{t.purchase.total}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">¥{product.price.toLocaleString()}</div>
                <div className="text-xs text-gray-400">{t.purchase.taxIncluded}</div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t.purchase.confirm}
            </button>

            <p className="text-xs text-gray-400 text-center">
              決済機能は近日公開予定です
            </p>
          </div>
        </div>
      </div>

      {/* "Payment coming soon" modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { if (!submitting) setShowModal(false); }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {notified ? (
              <>
                <div className="text-4xl mb-3 text-center">📬</div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">登録完了</h3>
                <p className="text-sm text-gray-500 text-center mb-5">
                  決済機能が公開されたらお知らせします。
                </p>
                <button
                  onClick={() => { setShowModal(false); setNotified(false); }}
                  className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  閉じる
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl mb-3 text-center">🚧</div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">決済機能は近日公開予定</h3>
                <p className="text-sm text-gray-500 text-center mb-5">
                  準備ができたらメールでお知らせします。
                </p>
                <div className="space-y-2 mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.purchase.emailPlaceholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleNotify}
                    disabled={submitting}
                    className="flex-1 bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-60"
                  >
                    {submitting ? t.purchase.preparing : t.purchase.notifyMe}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
