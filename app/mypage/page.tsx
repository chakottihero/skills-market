"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

export default function MyPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const login = (session.user as { login?: string }).login ?? session.user?.name ?? "";
        setListings((d.products as Product[]).filter((p) => p.author.name === login));
        setLoading(false);
      });
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((p) => p.id !== id));
  };

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <p className="text-gray-600 mb-6">{t.mypage.loginRequired}</p>
        <button
          onClick={() => signIn("github")}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t.nav.login}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Profile */}
      <div className="flex items-center gap-5 mb-10">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "avatar"}
            width={72}
            height={72}
            className="rounded-full border-2 border-purple-200"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{session.user?.name}</h1>
          <p className="text-gray-500 text-sm">{session.user?.email}</p>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">{t.mypage.listings}</h2>
          <Link
            href="/sell"
            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            + 新規出品
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">{t.common.loading}</div>
        ) : listings.length === 0 ? (
          <div className="text-center text-gray-400 py-10 border border-dashed border-gray-200 rounded-xl">
            {t.mypage.noListings}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((p) => (
              <div key={p.id} className="relative">
                <ProductCard product={p} />
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                  >
                    {t.mypage.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchases placeholder */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">{t.mypage.purchases}</h2>
        <div className="text-center text-gray-400 py-10 border border-dashed border-gray-200 rounded-xl">
          {t.mypage.noPurchases}
        </div>
      </div>
    </div>
  );
}
