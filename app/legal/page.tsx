"use client";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

const CONTENT = {
  ja: {
    title: "特定商取引法に基づく表記",
    back: "← ホームに戻る",
    rows: [
      { label: "販売事業者名", value: "請求があった場合に遅滞なく開示いたします" },
      { label: "運営統括責任者", value: "請求があった場合に遅滞なく開示いたします" },
      { label: "所在地", value: "請求があった場合に遅滞なく開示いたします" },
      { label: "電話番号", value: "請求があった場合に遅滞なく開示いたします" },
      { label: "メールアドレス", value: "skillsmarket.contact@gmail.com" },
      { label: "販売URL", value: "https://aiskill-market.com" },
      { label: "販売価格", value: "各商品ページに表示された価格（税込）" },
      { label: "商品代金以外の費用", value: "なし（通信料はお客様のご負担となります）" },
      { label: "支払方法", value: "クレジットカード（Stripe経由）" },
      { label: "支払時期", value: "購入時に即時決済" },
      { label: "商品の引渡し時期", value: "決済完了後、即時ダウンロード可能" },
      {
        label: "返品・返金について",
        value:
          "デジタル商品の性質上、原則として返品・返金は承っておりません。ただし、ファイルの破損や説明と著しく異なる場合は、購入後7日以内に限り返金申請を受け付けます。",
      },
      { label: "動作環境", value: "各商品ページに記載の対応AIツール（Claude Code、Cursor 等）" },
    ],
  },
  en: {
    title: "Notation Based on the Specified Commercial Transactions Act",
    back: "← Back to Home",
    rows: [
      { label: "Business Name", value: "Will be disclosed without delay upon request" },
      { label: "Responsible Officer", value: "Will be disclosed without delay upon request" },
      { label: "Address", value: "Will be disclosed without delay upon request" },
      { label: "Phone Number", value: "Will be disclosed without delay upon request" },
      { label: "Email Address", value: "skillsmarket.contact@gmail.com" },
      { label: "Sales URL", value: "https://aiskill-market.com" },
      { label: "Prices", value: "As displayed on each product page (tax included)" },
      { label: "Additional Fees", value: "None (customer is responsible for internet connection costs)" },
      { label: "Payment Methods", value: "Credit card (via Stripe)" },
      { label: "Payment Timing", value: "Charged immediately upon purchase" },
      { label: "Delivery", value: "Available for immediate download upon payment completion" },
      {
        label: "Returns & Refunds",
        value:
          "Due to the nature of digital goods, returns and refunds are not available in principle. However, refund requests will be accepted within 7 days of purchase in cases of file corruption or significant discrepancy from the description.",
      },
      { label: "System Requirements", value: "Compatible AI tools listed on each product page (Claude Code, Cursor, etc.)" },
    ],
  },
};

export default function LegalPage() {
  const { locale } = useLanguage();
  const c = locale === "en" ? CONTENT.en : CONTENT.ja;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-purple-600 hover:underline mb-8 inline-block">
        {c.back}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">{c.title}</h1>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {c.rows.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 sm:grid-cols-[200px_1fr] ${
              i % 2 === 0
                ? "bg-gray-50 dark:bg-gray-800/50"
                : "bg-white dark:bg-gray-800"
            }`}
          >
            <div className="px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 sm:border-r border-gray-200 dark:border-gray-700">
              {row.label}
            </div>
            <div className="px-5 py-3.5 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
