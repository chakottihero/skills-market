"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import { toolColors } from "@/lib/toolColors";
import { localTitle, localDescription } from "@/lib/localizeProduct";
import { TOOL_MAP } from "@/lib/tools";
import { getCategoryName } from "@/lib/categories";
import type { Product, UserProfile, Availability } from "@/types";

const AVAILABILITY_STYLE: Record<Availability, { label: string; cls: string }> = {
  available: { label: "対応可能", cls: "bg-emerald-100 text-emerald-700" },
  depends:   { label: "内容による", cls: "bg-amber-100 text-amber-700" },
  busy:      { label: "多忙", cls: "bg-red-100 text-red-700" },
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(async (d) => {
        const p = d.product as Product;
        setProduct(p);
        setLoading(false);
        // 出品者プロフィールを非同期で取得
        try {
          const pr = await fetch(`/api/users/${p.author.login}`);
          if (pr.ok) setSeller((await pr.json()).profile as UserProfile);
        } catch {}
      })
      .catch(() => router.push("/skills"));
  }, [id, router]);

  if (loading) return <div className="text-center py-20 text-gray-400">{t.common.loading}</div>;
  if (!product) return null;

  const tool = toolColors[product.tool] ?? toolColors.other;
  const title = localTitle(product, locale);
  const desc = localDescription(product, locale);
  const avail = seller ? AVAILABILITY_STYLE[seller.availability] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/skills" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← {t.common.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {(product.compatible_tools?.length ? product.compatible_tools : [product.tool]).map((tid) => {
                const tm = TOOL_MAP[tid as keyof typeof TOOL_MAP];
                if (!tm) return null;
                return (
                  <span key={tid} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tm.badgeClass}`}>
                    {tm.name}
                  </span>
                );
              })}
              <span className="text-xs text-gray-400">{getCategoryName(product.category, locale)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-gray-600 leading-relaxed">{desc}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Content Preview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t.product.preview}</h2>
            <div className="bg-gray-900 text-gray-100 rounded-xl p-5 text-sm font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
              {product.content}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Purchase card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {product.price === 0 ? (
                <span className="text-emerald-600">{t.common.free}</span>
              ) : (
                `¥${product.price.toLocaleString()}`
              )}
            </div>
            <button className="w-full mt-4 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors">
              {product.price === 0 ? t.product.free : t.product.buy}
            </button>
            {product.repoUrl && (
              <a
                href={product.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {t.product.repoLink}
              </a>
            )}

            {/* Seller */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400 mb-2">{t.product.author}</div>
              <Link href={`/users/${product.author.login}`} className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                <Image
                  src={seller?.avatar ?? product.author.avatar}
                  alt={product.author.name}
                  width={44}
                  height={44}
                  className="rounded-full flex-shrink-0"
                  unoptimized
                />
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                    {seller?.displayName ?? product.author.name}
                    {avail && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${avail.cls}`}>{avail.label}</span>
                    )}
                  </div>
                  {seller?.catchphrase && (
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{seller.catchphrase}</div>
                  )}
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-3 text-center mt-4">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-gray-900">⭐ {product.stars}</div>
                  <div className="text-xs text-gray-400">{t.product.stars}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-gray-900">🛒 {product.purchases}</div>
                  <div className="text-xs text-gray-400">{t.product.purchases}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
