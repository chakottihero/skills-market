"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, { icon: string; title: string; body: string; hint?: string }> = {
  Configuration: {
    icon: "⚙️",
    title: "GitHub OAuth 未設定",
    body: "GitHub OAuth が正しく設定されていないため、ログインできません。",
    hint: "管理者にお問い合わせください。",
  },
  OAuthSignin: {
    icon: "🔗",
    title: "OAuth 開始エラー",
    body: "GitHub への接続開始時にエラーが発生しました。",
    hint: "しばらく待ってから再度お試しください。",
  },
  OAuthCallback: {
    icon: "🔄",
    title: "認証コールバックエラー",
    body: "GitHub からの認証応答処理中にエラーが発生しました。",
    hint: "GITHUB_ID・GITHUB_SECRET・コールバックURLの設定を確認してください。",
  },
  OAuthCreateAccount: {
    icon: "👤",
    title: "アカウント作成エラー",
    body: "GitHubアカウント情報の取得に失敗しました。",
    hint: "再度ログインをお試しください。",
  },
  Callback: {
    icon: "⚠️",
    title: "コールバックエラー",
    body: "認証コールバック処理中にエラーが発生しました。",
    hint: "再度ログインをお試しください。",
  },
  AccessDenied: {
    icon: "🚫",
    title: "アクセス拒否",
    body: "GitHubアカウントへのアクセスが拒否されました。",
    hint: "GitHubの認証画面で「Authorize」をクリックしてください。",
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Configuration";

  const info = ERROR_MESSAGES[error] ?? {
    icon: "⚠️",
    title: "ログインエラー",
    body: "ログイン処理中にエラーが発生しました。",
    hint: `エラーコード: ${error}`,
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
        <div className="text-5xl mb-4">{info.icon}</div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h1>
        <p className="text-gray-600 mb-2 leading-relaxed">{info.body}</p>
        {info.hint && (
          <p className="text-sm text-gray-400 mb-6">{info.hint}</p>
        )}
        {error === "OAuthCallback" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-left text-xs text-amber-700 space-y-1">
            <p className="font-semibold">確認事項:</p>
            <p>・GitHub OAuth App の Authorization callback URL</p>
            <p className="font-mono break-all pl-2">
              https://aiskill-market.com/api/auth/callback/github
            </p>
            <p>・Vercel 環境変数 GITHUB_ID / GITHUB_SECRET が正しいか</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
          >
            トップへ戻る
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-block border border-gray-200 text-gray-600 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
          読み込み中...
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
