"use client";
import Link from "next/link";

// このページは NextAuth の pages.signIn から除外済み。
// 直接アクセスされた場合のフォールバック表示のみ。
export default function SignInPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">ログイン</h1>
        <p className="text-gray-600 mb-6 text-sm">
          トップページのナビバーからログインしてください。
        </p>
        <Link
          href="/"
          className="inline-block bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
        >
          トップページへ
        </Link>
      </div>
    </div>
  );
}
