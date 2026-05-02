"use client";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

const CONTENT = {
  ja: {
    title: "利用規約",
    updated: "最終更新日：2025年5月",
    back: "← ホームに戻る",
    sections: [
      {
        heading: "第1条　サービス概要",
        body: "Skills Market（以下「本サービス」）は、SKILL.md（AIエージェント向けスキルファイル）を売買できるオンラインマーケットプレイスです。本サービスは個人が運営しています。",
      },
      {
        heading: "第2条　利用資格",
        body: "本サービスの閲覧はどなたでも可能です。スキルの出品・購入にはアカウント登録（GitHub認証）が必要です。アカウント登録をもって本規約に同意したものとみなします。",
      },
      {
        heading: "第3条　出品者の責任",
        body: "出品するスキルの著作権は出品者に帰属します。出品者は以下の行為を行ってはなりません。\n・著作権を侵害するスキルの出品\n・悪意あるコードや有害なスクリプトを含むスキルの出品\n・虚偽または誤解を招く説明によるスキルの出品\nスキルの動作保証は出品者の責任とします。プラットフォームはスキルの品質を保証しません。",
      },
      {
        heading: "第4条　購入者の注意",
        body: "デジタル商品の性質上、購入後の返金は原則として行いません。ただし以下の場合に限り、購入後7日以内に返金申請を受け付けます。\n・ファイルが破損しており利用できない場合\n・スキルの内容が説明と著しく異なる場合\n返金は運営が確認の上、Stripe経由で処理します。",
      },
      {
        heading: "第5条　手数料",
        body: "有料スキルの売上に対し、プラットフォーム手数料として10%を徴収します。Stripe決済手数料（3.6%）は別途発生します。出品者の受取額 = 売上 × 90% - Stripe手数料となります。",
      },
      {
        heading: "第6条　禁止事項",
        body: "利用者は以下の行為を行ってはなりません。\n・購入したスキルの転売・再配布\n・不正アクセス、スクレイピング、サービス妨害行為\n・他のユーザーへの嫌がらせ、脅迫、詐欺行為\n・本サービスの運営を妨げる一切の行為",
      },
      {
        heading: "第7条　免責事項",
        body: "本サービスは出品者と購入者の仲介プラットフォームであり、スキルの品質・動作を保証しません。サービスの一時停止・終了、システム障害による損害について、運営は責任を負いません。",
      },
      {
        heading: "第8条　規約の変更",
        body: "本規約は事前通知なく変更される場合があります。変更後も本サービスを継続して利用した場合、変更後の規約に同意したものとみなします。",
      },
      {
        heading: "第9条　準拠法",
        body: "本規約は日本法に準拠し、日本の裁判所を管轄裁判所とします。",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated: May 2025",
    back: "← Back to Home",
    sections: [
      {
        heading: "Article 1 — Service Overview",
        body: "Skills Market (the \"Service\") is an online marketplace where users can buy and sell SKILL.md files (skill packages for AI agents). The Service is operated by an individual.",
      },
      {
        heading: "Article 2 — Eligibility",
        body: "Anyone may browse the Service. Account registration (via GitHub) is required to list or purchase skills. By registering, you agree to these Terms.",
      },
      {
        heading: "Article 3 — Seller Responsibilities",
        body: "Copyright of listed skills belongs to the seller. Sellers must not:\n• List skills that infringe third-party copyrights\n• Include malicious code or harmful scripts in skills\n• Use false or misleading descriptions\nSellers are responsible for the functionality of their skills. The platform does not guarantee skill quality.",
      },
      {
        heading: "Article 4 — Buyer Notice",
        body: "Due to the nature of digital goods, refunds are not available in principle after purchase. Exceptions apply within 7 days of purchase in the following cases:\n• The file is corrupted and cannot be used\n• The content significantly differs from the description\nRefunds are processed via Stripe after verification by the operator.",
      },
      {
        heading: "Article 5 — Fees",
        body: "A platform fee of 10% is charged on paid skill sales. Stripe payment processing fees (3.6%) apply separately. Seller earnings = Revenue × 90% − Stripe fees.",
      },
      {
        heading: "Article 6 — Prohibited Activities",
        body: "Users must not:\n• Resell or redistribute purchased skills\n• Attempt unauthorized access, scraping, or denial-of-service attacks\n• Harass, threaten, or defraud other users\n• Take any action that disrupts the operation of the Service",
      },
      {
        heading: "Article 7 — Disclaimer",
        body: "The Service is an intermediary platform between sellers and buyers and does not guarantee the quality or functionality of skills. The operator is not liable for damages resulting from temporary suspension, termination, or system failures.",
      },
      {
        heading: "Article 8 — Changes to Terms",
        body: "These Terms may be changed without prior notice. Continued use of the Service after changes constitutes acceptance of the revised Terms.",
      },
      {
        heading: "Article 9 — Governing Law",
        body: "These Terms are governed by the laws of Japan, and the courts of Japan shall have exclusive jurisdiction.",
      },
    ],
  },
};

export default function TermsPage() {
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
