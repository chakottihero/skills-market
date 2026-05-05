"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useLanguage } from "@/components/LanguageContext";
import { localTitle, localDescription } from "@/lib/localizeProduct";
import { TOOL_MAP } from "@/lib/tools";
import { CATEGORY_MAP, getCategoryName } from "@/lib/categories";
import type { Product, UserProfile, Availability } from "@/types";

const AVAILABILITY_STYLE: Record<Availability, { label: string; cls: string }> = {
  available: { label: "対応可能", cls: "bg-emerald-100 text-emerald-700" },
  closed:    { label: "受付停止", cls: "bg-gray-100 text-gray-500" },
  busy:      { label: "多忙",     cls: "bg-red-100 text-red-700" },
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  "dev-tools":      "from-green-400 to-emerald-600",
  "web-dev":        "from-blue-400 to-indigo-600",
  "data-analytics": "from-yellow-400 to-orange-500",
  devops:           "from-orange-400 to-red-500",
  "ai-ml":          "from-violet-400 to-purple-600",
  docs:             "from-cyan-400 to-blue-500",
  business:         "from-pink-400 to-rose-600",
  utility:          "from-teal-400 to-cyan-600",
  other:            "from-gray-400 to-gray-600",
};

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading…</div>}>
      <ProductPageInner />
    </Suspense>
  );
}

function ProductPageInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { t, locale } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [canceledBanner, setCanceledBanner] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showPaymentSuspended, setShowPaymentSuspended] = useState(false);

  // User-specific state
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [savingRating, setSavingRating] = useState(false);

  const login = (session?.user as { login?: string })?.login ?? session?.user?.name ?? "";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (searchParams.get("canceled") === "true") setCanceledBanner(true);
  }, [searchParams]);

  useEffect(() => {
    fetch(`/api/skills/${id}`)
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(async (d) => {
        const p = d.product as Product;
        setProduct(p);
        setLikeCount(p.like_count ?? 0);
        setBookmarkCount(p.bookmark_count ?? 0);
        setAvgRating(p.avg_rating ?? 0);
        setRatingCount(p.rating_count ?? 0);
        setLoading(false);
        try {
          const pr = await fetch(`/api/users/${p.author.login}`);
          if (pr.ok) setSeller((await pr.json()).profile as UserProfile);
        } catch {}
      })
      .catch(() => router.push("/skills"));
  }, [id, router]);

  useEffect(() => {
    if (!login || !id || !product) return;
    Promise.all([
      fetch(`/api/skills/${id}/like`).then((r) => r.json()),
      fetch(`/api/skills/${id}/bookmark`).then((r) => r.json()),
      fetch(`/api/skills/${id}/rating`).then((r) => r.json()),
    ]).then(([likeData, bookmarkData, ratingData]) => {
      setHasLiked(likeData.liked ?? false);
      setLikeCount(likeData.count ?? likeCount);
      setHasBookmarked(bookmarkData.bookmarked ?? false);
      setBookmarkCount(bookmarkData.count ?? bookmarkCount);
      setMyRating(ratingData.myRating ?? null);
      setAvgRating(ratingData.avgRating ?? avgRating);
      setRatingCount(ratingData.ratingCount ?? ratingCount);
      setHasPurchased(ratingData.hasPurchased ?? false);
      setHasDownloaded(ratingData.hasDownloaded ?? false);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, id, product?.id]);

  const handleLike = async () => {
    if (!session) {
      showToast(locale === "en" ? "Login to like" : "いいねにはログインが必要です");
      return;
    }
    const res = await fetch(`/api/skills/${id}/like`, { method: "POST" });
    const data = await res.json() as { liked: boolean; count: number };
    setHasLiked(data.liked);
    setLikeCount(data.count);
  };

  const handleBookmark = async () => {
    if (!session) {
      showToast(locale === "en" ? "Login to bookmark" : "ブックマークにはログインが必要です");
      return;
    }
    const res = await fetch(`/api/skills/${id}/bookmark`, { method: "POST" });
    const data = await res.json() as { bookmarked: boolean; count: number };
    setHasBookmarked(data.bookmarked);
    setBookmarkCount(data.count);
  };

  const handleRate = async (rating: number) => {
    if (!hasPurchased) return;
    setSavingRating(true);
    try {
      const res = await fetch(`/api/skills/${id}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      const data = await res.json() as { myRating: number; avgRating: number; ratingCount: number };
      setMyRating(data.myRating);
      setAvgRating(data.avgRating);
      setRatingCount(data.ratingCount);
    } finally {
      setSavingRating(false);
    }
  };

  const handleDownload = async () => {
    if (!session) { signIn("github"); return; }
    setDownloading(true);
    try {
      const res = await fetch(`/api/download/${id}`, { method: "POST" });
      const data = await res.json() as { fileUrl?: string };
      if (data.fileUrl) {
        setFileUrl(data.fileUrl);
        setShowDownloadModal(true);
        setHasDownloaded(true);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleCheckout = async () => {
    if (!session) { signIn("github"); return; }
    if (!product) return;
    const isFree = product.price_type === "free" || product.price === 0;

    if (isFree || hasPurchased) {
      await handleDownload();
      return;
    }

    // 決済機能一時停止中
    setShowPaymentSuspended(true);
  };

  const handleDelete = async () => {
    if (!confirm("このスキルを削除しますか？")) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/skills");
  };

  if (loading) return <div className="text-center py-20 text-gray-400">{t.common.loading}</div>;
  if (!product) return null;

  const title = localTitle(product, locale);
  const desc = localDescription(product, locale);
  const avail = seller ? AVAILABILITY_STYLE[seller.availability] : null;
  const isOwner = !!login && login === product.author.login;
  const galleryImages = product.images?.filter(Boolean) ?? [];
  const catGradient = CATEGORY_GRADIENTS[product.category] ?? CATEGORY_GRADIENTS.other;
  const catIcon = CATEGORY_MAP[product.category]?.icon ?? "🤖";
  const isFree = product.price_type === "free" || product.price === 0;

  const actionBtn = (fullWidth = true) => {
    if (isOwner) return null;
    const w = fullWidth ? "w-full" : "";
    if (!session) {
      if (isFree) {
        return (
          <button onClick={() => signIn("github")} className={`${w} mt-4 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors`}>
            {locale === "en" ? "Free Download (Login with GitHub)" : "無料ダウンロード（GitHubでログイン）"}
          </button>
        );
      }
      return (
        <button onClick={() => signIn("github")} className={`${w} mt-4 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors`}>
          {t.purchase.login}
        </button>
      );
    }
    if (hasPurchased || isFree) {
      return (
        <div className={`${w} mt-4 space-y-2`}>
          {hasDownloaded && isFree && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {locale === "en" ? "Already downloaded" : "ダウンロード済み"}
            </div>
          )}
          <button onClick={handleDownload} disabled={downloading} className={`w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60`}>
            {downloading ? t.purchase.preparing : isFree ? (locale === "en" ? "Free Download" : "無料ダウンロード") : t.purchase.download}
          </button>
        </div>
      );
    }
    return (
      <button onClick={handleCheckout} disabled={downloading} className={`${w} mt-4 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60`}>
        {downloading ? t.purchase.preparing : t.purchase.buy.replace("{price}", product.price.toLocaleString())}
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-28 sm:pb-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Payment suspended modal */}
      {showPaymentSuspended && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowPaymentSuspended(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-3xl mb-3">🔒</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">決済機能を一時停止中</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              現在セキュリティ対策強化のため、決済機能を一時停止しています。<br />
              再開時期は X でお知らせします。
            </p>
            <button
              onClick={() => setShowPaymentSuspended(false)}
              className="mt-5 w-full bg-purple-600 text-white font-semibold py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Canceled banner */}
      {canceledBanner && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
          <span>{locale === "en" ? "Payment was canceled. Please try again." : "決済がキャンセルされました。再度お試しください。"}</span>
          <button onClick={() => setCanceledBanner(false)} className="ml-4 text-amber-500 hover:text-amber-700">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/skills" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          ← {t.common.back}
        </Link>
        {isOwner && (
          <div className="flex gap-2">
            <Link href={`/skills/${id}/edit`} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors">
              {locale === "en" ? "Edit" : "編集"}
            </Link>
            <button onClick={handleDelete} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
              {t.mypage.delete}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div>
            {galleryImages.length > 0 ? (
              <>
                <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  <Image src={galleryImages[activeImage]} alt={`${title} - image ${activeImage + 1}`} fill className="object-cover" unoptimized />
                  {galleryImages.length > 1 && (
                    <>
                      <button onClick={() => setActiveImage((i) => (i - 1 + galleryImages.length) % galleryImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">‹</button>
                      <button onClick={() => setActiveImage((i) => (i + 1) % galleryImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">›</button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {galleryImages.map((_, i) => (
                          <button key={i} onClick={() => setActiveImage(i)} className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? "bg-white" : "bg-white/50"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {galleryImages.map((img, i) => (
                      <button key={i} onClick={() => setActiveImage(i)} className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-colors ${i === activeImage ? "border-purple-500" : "border-transparent"}`}>
                        <Image src={img} alt="" fill className="object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={`rounded-xl overflow-hidden aspect-video bg-gradient-to-br ${catGradient} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-6xl mb-3 opacity-90">{catIcon}</div>
                  <p className="text-white/80 text-sm font-medium">{getCategoryName(product.category, locale)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Title + rating */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {(product.compatible_tools?.length ? product.compatible_tools : [product.tool]).map((tid) => {
                const tm = TOOL_MAP[tid as keyof typeof TOOL_MAP];
                if (!tm) return null;
                return <span key={tid} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tm.badgeClass}`}>{tm.name}</span>;
              })}
              <span className="text-xs text-gray-400 dark:text-gray-400">{getCategoryName(product.category, locale)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>

            {/* Avg rating display */}
            {ratingCount > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({ratingCount}{locale === "en" ? " ratings" : "件"})</span>
              </div>
            )}

            {/* Like + Bookmark + Action row */}
            <div className="flex items-center gap-3 mt-3 mb-4">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-sm ${
                  hasLiked
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-500"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-red-200 hover:text-red-400"
                }`}
                style={{ transform: hasLiked ? "scale(1)" : undefined }}
              >
                <svg className="w-4 h-4" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likeCount}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-sm ${
                  hasBookmarked
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-500"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-blue-200 hover:text-blue-400"
                }`}
              >
                <svg className="w-4 h-4" fill={hasBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{bookmarkCount}</span>
              </button>
            </div>

            {/* Description */}
            <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (match) {
                      return (
                        <SyntaxHighlighter style={atomOneDark as Record<string, React.CSSProperties>} language={match[1]} PreTag="div" className="rounded-lg text-sm">
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    }
                    return <code className={`${className || ""} bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm`} {...props}>{children}</code>;
                  },
                }}
              >{desc}</ReactMarkdown>
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content Preview — only shown when seller enables it */}
          {product.previewContent && product.content && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.product.preview}</h2>
              <div className="prose prose-sm prose-gray dark:prose-invert max-w-none rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900/50 max-h-96 overflow-y-auto">
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      if (match) {
                        return (
                          <SyntaxHighlighter style={atomOneDark as Record<string, React.CSSProperties>} language={match[1]} PreTag="div" className="rounded-lg text-sm">
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        );
                      }
                      return <code className={`${className || ""} bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm`} {...props}>{children}</code>;
                    },
                  }}
                >{product.content}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Star rating input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              {locale === "en" ? "Rate this skill" : "このスキルを評価する"}
            </h2>
            {!session ? (
              <p className="text-xs text-gray-400">{locale === "en" ? "Login to rate" : "評価にはログインが必要です"}</p>
            ) : !hasPurchased ? (
              <p className="text-xs text-gray-400">{locale === "en" ? "Purchase this skill to leave a rating" : "購入後に評価できます"}</p>
            ) : (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={savingRating}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-colors disabled:opacity-50"
                  >
                    <span className={
                      (hoverRating || myRating || 0) >= star
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }>★</span>
                  </button>
                ))}
                {myRating && (
                  <span className="ml-2 text-xs text-gray-400">
                    {locale === "en" ? `Your rating: ${myRating}/5` : `あなたの評価: ${myRating}/5`}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {product.price === 0 ? (
                <span className="text-emerald-600">{t.common.free}</span>
              ) : (
                `¥${product.price.toLocaleString()}`
              )}
            </div>
            {actionBtn()}
            {product.repoUrl && (
              <a href={product.repoUrl} target="_blank" rel="noopener noreferrer" className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                {t.product.repoLink}
              </a>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-400 mb-2">{t.product.author}</div>
              <Link href={`/users/${product.author.login}`} className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                <Image src={seller?.avatar ?? product.author.avatar} alt={product.author.name} width={44} height={44} className="rounded-full flex-shrink-0" unoptimized />
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    {seller?.displayName ?? product.author.name}
                    {avail && <span className={`text-xs px-1.5 py-0.5 rounded-full ${avail.cls}`}>{avail.label}</span>}
                  </div>
                  {seller?.catchphrase && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{seller.catchphrase}</div>}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
          <div className="font-bold text-gray-900 dark:text-white">
            {product.price === 0 ? <span className="text-emerald-600">{t.common.free}</span> : `¥${product.price.toLocaleString()}`}
          </div>
          <div className="flex-1">{actionBtn(true)}</div>
        </div>
      )}

      {/* Download modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowDownloadModal(false); setFileUrl(null); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-3 text-center">✅</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">ダウンロード完了</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-5">スキルを取得しました。</p>
            <div className="space-y-2">
              {fileUrl && (
                <a href={fileUrl} download className="block w-full text-center bg-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors">
                  {t.purchase.download}
                </a>
              )}
              <button onClick={() => { setShowDownloadModal(false); setFileUrl(null); }} className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-700 transition-colors">
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
