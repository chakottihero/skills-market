"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import ProductCard from "@/components/ProductCard";
import type { Product, UserProfile } from "@/types";
import { calcCompletion } from "@/lib/profileUtils";

export default function MyPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [listings, setListings] = useState<Product[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (session?.user as { login?: string })?.login ?? session?.user?.name ?? "";

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      login ? fetch(`/api/users/${login}`).then((r) => r.ok ? r.json() : null) : Promise.resolve(null),
    ]).then(([pd, ud]) => {
      setListings((pd.products as Product[]).filter((p) => p.author.login === login));
      if (ud) setProfile(ud.profile as UserProfile);
      setLoading(false);
    });
  }, [session, login]);

  const handleDelete = async (id: string) => {
    if (!confirm("このスキルを削除しますか？")) return;
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

  const completion = profile ? calcCompletion(profile) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "avatar"}
            width={72}
            height={72}
            className="rounded-full border-2 border-purple-200 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{profile?.displayName ?? session.user?.name}</h1>
          {profile?.catchphrase && <p className="text-gray-500 text-sm mt-0.5">{profile.catchphrase}</p>}
          <p className="text-gray-400 text-xs mt-1">{session.user?.email}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/mypage/profile"
            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            ✏️ {t.mypage.profileLink}
          </Link>
          {login && (
            <Link
              href={`/users/${login}`}
              className="text-xs text-purple-500 hover:underline"
            >
              公開プロフィールを見る →
            </Link>
          )}
        </div>
      </div>

      {/* Profile completion */}
      {session && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{t.mypage.completion}</span>
            <span className="text-sm font-bold text-purple-600">{completion}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
          {completion < 100 && (
            <p className="text-xs text-gray-400 mt-1.5">
              <Link href="/mypage/profile" className="text-purple-500 hover:underline">
                プロフィールを充実させると
              </Link>
              、信頼度が上がります
            </p>
          )}
        </div>
      )}

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
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-3 right-3 text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  {t.mypage.delete}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Downloads placeholder */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5">{t.mypage.downloads}</h2>
        <div className="text-center text-gray-400 py-10 border border-dashed border-gray-200 rounded-xl">
          {t.mypage.noDownloads}
        </div>
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
