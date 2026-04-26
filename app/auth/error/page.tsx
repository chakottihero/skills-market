"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const isConfigError =
    !error ||
    error === "Configuration" ||
    error === "OAuthSignin" ||
    error === "OAuthCallback";

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
        <div className="text-5xl mb-4">{isConfigError ? "⚙️" : "⚠️"}</div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">
          {isConfigError ? "GitHub OAuth 未設定" : "ログインエラー"}
        </h1>
        <p className="text-gray-600 mb-2 leading-relaxed">
          {isConfigError
            ? "GitHub OAuth が未設定のため、現在ログインできません。"
            : "ログイン処理中にエラーが発生しました。"}
        </p>
        {isConfigError && (
          <p className="text-sm text-gray-500 mb-6">
            管理者にお問い合わせいただくか、しばらくお待ちください。
          </p>
        )}
        {error && !isConfigError && (
          <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 rounded px-3 py-2">
            エラーコード: {error}
          </p>
        )}
        <Link
          href="/"
          className="inline-block bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-400">読み込み中...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
