"use client";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

const CONTENT = {
  ja: {
    title: "プライバシーポリシー",
    updated: "最終更新日：2025年5月",
    back: "← ホームに戻る",
    contact: "お問い合わせ：skillsmarket.contact@gmail.com",
    sections: [
      {
        heading: "1. はじめに",
        body: "Skills Market（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報を適切に管理します。本ポリシーは、当サービスにおける個人情報の収集・利用・管理方法について定めます。",
      },
      {
        heading: "2. 収集する情報",
        body: "当サービスは以下の情報を収集します。\n\n【アカウント登録時】\n・メールアドレス、表示名（GitHub認証から取得）\n\n【決済時】\n・クレジットカード情報はStripeが直接処理し、当サービスでは保持しません\n\n【自動収集】\n・IPアドレス、ブラウザ情報、アクセスログ（サービス改善・不正利用防止のため）",
      },
      {
        heading: "3. 利用目的",
        body: "収集した情報は以下の目的で利用します。\n・アカウントの管理・認証\n・決済処理（Stripe経由）\n・サービスの改善・統計分析\n・重要なお知らせの送信\n・不正利用の検知・防止",
      },
      {
        heading: "4. 第三者提供",
        body: "当サービスは以下のサービスに限り、必要な情報を共有します。\n・Stripe（決済処理）\n・Supabase（データベース・認証）\n・Vercel（ホスティング）\n\n上記以外への第三者提供は原則行いません。ただし法令に基づく開示が求められた場合はこの限りではありません。",
      },
      {
        heading: "5. Cookieの使用",
        body: "当サービスは認証セッションの維持のためにCookieを使用します。ブラウザ設定でCookieを無効化することは可能ですが、ログインなど一部機能が制限される場合があります。",
      },
      {
        heading: "6. データの保存と削除",
        body: "アカウント情報はアカウント削除まで保持します。購入履歴は法令に基づき一定期間保持します。ユーザーはアカウント削除を申請でき、削除後30日以内にデータを完全消去します。",
      },
      {
        heading: "7. ユーザーの権利",
        body: "ユーザーは以下の権利を有します。\n・自身のデータの開示請求\n・データの訂正・削除の請求\n\n請求はお問い合わせメールにてお受けします。",
      },
      {
        heading: "8. ポリシーの変更",
        body: "本ポリシーは変更される場合があります。重要な変更があった場合はサイト上でお知らせします。変更後も当サービスをご利用いただいた場合、変更後のポリシーに同意したものとみなします。",
      },
      {
        heading: "9. お問い合わせ",
        body: "個人情報に関するお問い合わせは下記までご連絡ください。\nメール：skillsmarket.contact@gmail.com",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 2025",
    back: "← Back to Home",
    contact: "Contact: skillsmarket.contact@gmail.com",
    sections: [
      {
        heading: "1. Introduction",
        body: "Skills Market (the \"Service\") respects user privacy and manages personal information appropriately. This policy describes how we collect, use, and manage personal information.",
      },
      {
        heading: "2. Information We Collect",
        body: "We collect the following information:\n\n[Account Registration]\n• Email address and display name (obtained via GitHub authentication)\n\n[Payments]\n• Credit card information is processed directly by Stripe and is never stored by the Service\n\n[Automatically Collected]\n• IP address, browser information, and access logs (for service improvement and fraud prevention)",
      },
      {
        heading: "3. How We Use Information",
        body: "Collected information is used for:\n• Account management and authentication\n• Payment processing (via Stripe)\n• Service improvement and statistical analysis\n• Sending important notices\n• Detecting and preventing fraudulent activity",
      },
      {
        heading: "4. Third-Party Sharing",
        body: "We share information only with the following services as necessary:\n• Stripe (payment processing)\n• Supabase (database and authentication)\n• Vercel (hosting)\n\nWe do not share information with other third parties, except as required by law.",
      },
      {
        heading: "5. Use of Cookies",
        body: "We use cookies to maintain authentication sessions. You may disable cookies in your browser settings, but some features such as login may become unavailable.",
      },
      {
        heading: "6. Data Retention and Deletion",
        body: "Account information is retained until account deletion. Purchase history is retained for a period required by applicable law. Users may request account deletion, after which all data will be fully erased within 30 days.",
      },
      {
        heading: "7. User Rights",
        body: "Users have the following rights:\n• Right to request disclosure of their own data\n• Right to request correction or deletion of data\n\nRequests can be submitted via our contact email.",
      },
      {
        heading: "8. Changes to This Policy",
        body: "This policy may be updated. Significant changes will be announced on the site. Continued use of the Service after changes constitutes acceptance of the revised policy.",
      },
      {
        heading: "9. Contact Us",
        body: "For inquiries regarding personal information, please contact:\nEmail: skillsmarket.contact@gmail.com",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { locale } = useLanguage();
  const c = locale === "en" ? CONTENT.en : CONTENT.ja;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-200">
      <Link href="/" className="text-sm text-purple-600 hover:underline mb-8 inline-block">
        {c.back}
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{c.title}</h1>
      <p className="text-sm mb-10 text-gray-400">{c.updated}</p>

      <div className="space-y-8">
        {c.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{s.heading}</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
