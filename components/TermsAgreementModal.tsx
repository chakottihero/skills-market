"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";

const STORAGE_KEY = "terms_accepted";
const STORAGE_AT_KEY = "terms_accepted_at";
const SKIP_PATHS = ["/terms", "/privacy", "/legal"];

// ─── content ──────────────────────────────────────────────────────────────────

const TERMS_SECTIONS = {
  ja: [
    { h: "第1条　サービス概要", b: "Skills Market（以下「本サービス」）は、SKILL.md（AIエージェント向けスキルファイル）を売買できるオンラインマーケットプレイスです。本サービスは個人が運営しています。" },
    { h: "第2条　利用資格", b: "本サービスの閲覧はどなたでも可能です。スキルの出品・購入にはアカウント登録（GitHub認証）が必要です。アカウント登録をもって本規約に同意したものとみなします。" },
    { h: "第3条　出品者の責任", b: "出品するスキルの著作権は出品者に帰属します。出品者は以下の行為を行ってはなりません。\n・著作権を侵害するスキルの出品\n・悪意あるコードや有害なスクリプトを含むスキルの出品\n・虚偽または誤解を招く説明によるスキルの出品\nスキルの動作保証は出品者の責任とします。プラットフォームはスキルの品質を保証しません。" },
    { h: "第4条　購入者の注意", b: "デジタル商品の性質上、購入後の返金は原則として行いません。ただし以下の場合に限り、購入後7日以内に返金申請を受け付けます。\n・ファイルが破損しており利用できない場合\n・スキルの内容が説明と著しく異なる場合\n返金は運営が確認の上、Stripe経由で処理します。" },
    { h: "第5条　手数料", b: "有料スキルの売上に対し、プラットフォーム手数料として10%を徴収します。Stripe決済手数料（3.6%）は別途発生します。出品者の受取額 = 売上 × 90% - Stripe手数料となります。" },
    { h: "第6条　禁止事項", b: "利用者は以下の行為を行ってはなりません。\n・購入したスキルの転売・再配布\n・不正アクセス、スクレイピング、サービス妨害行為\n・他のユーザーへの嫌がらせ、脅迫、詐欺行為\n・本サービスの運営を妨げる一切の行為" },
    { h: "第7条　免責事項", b: "本サービスは出品者と購入者の仲介プラットフォームであり、スキルの品質・動作を保証しません。サービスの一時停止・終了、システム障害による損害について、運営は責任を負いません。" },
    { h: "第8条　規約の変更", b: "本規約は事前通知なく変更される場合があります。変更後も本サービスを継続して利用した場合、変更後の規約に同意したものとみなします。" },
    { h: "第9条　準拠法", b: "本規約は日本法に準拠し、日本の裁判所を管轄裁判所とします。" },
  ],
  en: [
    { h: "Article 1 — Service Overview", b: 'Skills Market (the "Service") is an online marketplace where users can buy and sell SKILL.md files (skill packages for AI agents). The Service is operated by an individual.' },
    { h: "Article 2 — Eligibility", b: "Anyone may browse the Service. Account registration (via GitHub) is required to list or purchase skills. By registering, you agree to these Terms." },
    { h: "Article 3 — Seller Responsibilities", b: "Copyright of listed skills belongs to the seller. Sellers must not:\n• List skills that infringe third-party copyrights\n• Include malicious code or harmful scripts in skills\n• Use false or misleading descriptions\nSellers are responsible for the functionality of their skills. The platform does not guarantee skill quality." },
    { h: "Article 4 — Buyer Notice", b: "Due to the nature of digital goods, refunds are not available in principle after purchase. Exceptions apply within 7 days of purchase in the following cases:\n• The file is corrupted and cannot be used\n• The content significantly differs from the description\nRefunds are processed via Stripe after verification by the operator." },
    { h: "Article 5 — Fees", b: "A platform fee of 10% is charged on paid skill sales. Stripe payment processing fees (3.6%) apply separately. Seller earnings = Revenue × 90% − Stripe fees." },
    { h: "Article 6 — Prohibited Activities", b: "Users must not:\n• Resell or redistribute purchased skills\n• Attempt unauthorized access, scraping, or denial-of-service attacks\n• Harass, threaten, or defraud other users\n• Take any action that disrupts the operation of the Service" },
    { h: "Article 7 — Disclaimer", b: "The Service is an intermediary platform between sellers and buyers and does not guarantee the quality or functionality of skills. The operator is not liable for damages resulting from temporary suspension, termination, or system failures." },
    { h: "Article 8 — Changes to Terms", b: "These Terms may be changed without prior notice. Continued use of the Service after changes constitutes acceptance of the revised Terms." },
    { h: "Article 9 — Governing Law", b: "These Terms are governed by the laws of Japan, and the courts of Japan shall have exclusive jurisdiction." },
  ],
};

const PRIVACY_SECTIONS = {
  ja: [
    { h: "1. はじめに", b: "Skills Market（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報を適切に管理します。本ポリシーは、当サービスにおける個人情報の収集・利用・管理方法について定めます。" },
    { h: "2. 収集する情報", b: "当サービスは以下の情報を収集します。\n\n【アカウント登録時】\n・メールアドレス、表示名（GitHub認証から取得）\n\n【決済時】\n・クレジットカード情報はStripeが直接処理し、当サービスでは保持しません\n\n【自動収集】\n・IPアドレス、ブラウザ情報、アクセスログ（サービス改善・不正利用防止のため）" },
    { h: "3. 利用目的", b: "収集した情報は以下の目的で利用します。\n・アカウントの管理・認証\n・決済処理（Stripe経由）\n・サービスの改善・統計分析\n・重要なお知らせの送信\n・不正利用の検知・防止" },
    { h: "4. 第三者提供", b: "当サービスは以下のサービスに限り、必要な情報を共有します。\n・Stripe（決済処理）\n・Supabase（データベース・認証）\n・Vercel（ホスティング）\n\n上記以外への第三者提供は原則行いません。ただし法令に基づく開示が求められた場合はこの限りではありません。" },
    { h: "5. Cookieの使用", b: "当サービスは認証セッションの維持のためにCookieを使用します。ブラウザ設定でCookieを無効化することは可能ですが、ログインなど一部機能が制限される場合があります。" },
    { h: "6. データの保存と削除", b: "アカウント情報はアカウント削除まで保持します。購入履歴は法令に基づき一定期間保持します。ユーザーはアカウント削除を申請でき、削除後30日以内にデータを完全消去します。" },
    { h: "7. ユーザーの権利", b: "ユーザーは以下の権利を有します。\n・自身のデータの開示請求\n・データの訂正・削除の請求\n\n請求はお問い合わせメールにてお受けします。" },
    { h: "8. ポリシーの変更", b: "本ポリシーは変更される場合があります。重要な変更があった場合はサイト上でお知らせします。変更後も当サービスをご利用いただいた場合、変更後のポリシーに同意したものとみなします。" },
    { h: "9. お問い合わせ", b: "個人情報に関するお問い合わせは下記までご連絡ください。\nメール：skillsmarket.contact@gmail.com" },
  ],
  en: [
    { h: "1. Introduction", b: 'Skills Market (the "Service") respects user privacy and manages personal information appropriately. This policy describes how we collect, use, and manage personal information.' },
    { h: "2. Information We Collect", b: "We collect the following information:\n\n[Account Registration]\n• Email address and display name (obtained via GitHub authentication)\n\n[Payments]\n• Credit card information is processed directly by Stripe and is never stored by the Service\n\n[Automatically Collected]\n• IP address, browser information, and access logs (for service improvement and fraud prevention)" },
    { h: "3. How We Use Information", b: "Collected information is used for:\n• Account management and authentication\n• Payment processing (via Stripe)\n• Service improvement and statistical analysis\n• Sending important notices\n• Detecting and preventing fraudulent activity" },
    { h: "4. Third-Party Sharing", b: "We share information only with the following services as necessary:\n• Stripe (payment processing)\n• Supabase (database and authentication)\n• Vercel (hosting)\n\nWe do not share information with other third parties, except as required by law." },
    { h: "5. Use of Cookies", b: "We use cookies to maintain authentication sessions. You may disable cookies in your browser settings, but some features such as login may become unavailable." },
    { h: "6. Data Retention and Deletion", b: "Account information is retained until account deletion. Purchase history is retained for a period required by applicable law. Users may request account deletion, after which all data will be fully erased within 30 days." },
    { h: "7. User Rights", b: "Users have the following rights:\n• Right to request disclosure of their own data\n• Right to request correction or deletion of data\n\nRequests can be submitted via our contact email." },
    { h: "8. Changes to This Policy", b: "This policy may be updated. Significant changes will be announced on the site. Continued use of the Service after changes constitutes acceptance of the revised policy." },
    { h: "9. Contact Us", b: "For inquiries regarding personal information, please contact:\nEmail: skillsmarket.contact@gmail.com" },
  ],
};

const TEXT = {
  ja: {
    title: "ご利用にあたって",
    body: "Skills Marketをご利用いただきありがとうございます。本サービスはAIエージェント向けスキルファイル（SKILL.md）の売買プラットフォームです。ご利用にあたり、利用規約およびプライバシーポリシーへの同意が必要です。有料スキルの購入は決済完了後即時ダウンロードとなり、デジタル商品の性質上、原則として返金はできません。出品者への支払いは売上の90%（プラットフォーム手数料10%）となります。",
    termsLabel: "利用規約",
    privacyLabel: "プライバシーポリシー",
    expand: "全文を読む",
    collapse: "全文を閉じる",
    button: "同意して始める",
    hint: "両方のチェックが必要です",
    updated: "最終更新日：2025年5月",
  },
  en: {
    title: "Before You Begin",
    body: "Welcome to Skills Market — a platform for buying and selling SKILL.md files (AI agent skill packages). By using this service, you agree to our Terms of Service and Privacy Policy. Paid skills are available for immediate download upon payment completion. Due to the nature of digital goods, refunds are not available in principle. Sellers receive 90% of revenue (platform fee: 10%).",
    termsLabel: "Terms of Service",
    privacyLabel: "Privacy Policy",
    expand: "Read full text",
    collapse: "Close full text",
    button: "Agree and Continue",
    hint: "Both checkboxes required",
    updated: "Last updated: May 2025",
  },
  zh: {
    title: "使用须知",
    body: "欢迎使用 Skills Market——这是一个买卖 SKILL.md 文件（AI 代理技能包）的平台。使用本服务即表示您同意我们的服务条款和隐私政策。付费技能在付款完成后可立即下载。由于数字商品的性质，原则上不提供退款。卖家获得销售额的 90%（平台手续费 10%）。",
    termsLabel: "服务条款",
    privacyLabel: "隐私政策",
    expand: "阅读全文",
    collapse: "收起全文",
    button: "同意并继续",
    hint: "需要勾选两项",
    updated: "最后更新：2025年5月",
  },
};

// ─── accordion section ────────────────────────────────────────────────────────

function AccordionSection({
  label,
  checked,
  onCheck,
  expandLabel,
  collapseLabel,
  sections,
  updated,
}: {
  label: string;
  checked: boolean;
  onCheck: (v: boolean) => void;
  expandLabel: string;
  collapseLabel: string;
  sections: { h: string; b: string }[];
  updated: string;
}) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* header row: checkbox + label + expand button */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="w-4 h-4 flex-shrink-0 cursor-pointer"
          style={{ accentColor: checked ? "#16a34a" : undefined }}
        />
        <span
          className="text-sm font-semibold flex-1 cursor-pointer select-none"
          style={{ color: checked ? "#16a34a" : undefined }}
          onClick={() => onCheck(!checked)}
        >
          {label}
          {checked && <span className="ml-1.5 text-emerald-500">✓</span>}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline flex-shrink-0 whitespace-nowrap"
        >
          {open ? collapseLabel : expandLabel}
          <span
            className="inline-block transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </button>
      </div>

      {/* accordion body */}
      <div
        ref={bodyRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
          <div className="px-4 py-3 space-y-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">{updated}</p>
            {sections.map((s, i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-0.5">{s.h}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function TermsAgreementModal() {
  const { data: session } = useSession();
  const { locale } = useLanguage();
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [chkTerms, setChkTerms] = useState(false);
  const [chkPrivacy, setChkPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scrollYRef = useRef(0);

  const login = (session?.user as { login?: string })?.login ?? session?.user?.name ?? "";
  const txt = TEXT[locale as keyof typeof TEXT] ?? TEXT.ja;
  const allChecked = chkTerms && chkPrivacy;

  const termsSections = locale === "en" ? TERMS_SECTIONS.en : TERMS_SECTIONS.ja;
  const privacySections = locale === "en" ? PRIVACY_SECTIONS.en : PRIVACY_SECTIONS.ja;

  // ── visibility ─────────────────────────────────────────────────
  useEffect(() => {
    if (SKIP_PATHS.includes(pathname)) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return;
    } catch {}
    if (login) {
      fetch(`/api/users/${login}`)
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (d?.profile?.terms_accepted_at) {
            try {
              localStorage.setItem(STORAGE_KEY, "true");
              localStorage.setItem(STORAGE_AT_KEY, d.profile.terms_accepted_at);
            } catch {}
            return;
          }
          setVisible(true);
        })
        .catch(() => setVisible(true));
    } else {
      setVisible(true);
    }
  }, [login, pathname]);

  // ── iOS-safe scroll lock ───────────────────────────────────────
  useEffect(() => {
    if (visible) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (scrollYRef.current) window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [visible]);

  // ── accept ─────────────────────────────────────────────────────
  const handleAccept = async () => {
    if (!allChecked || submitting) return;
    setSubmitting(true);
    const now = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      localStorage.setItem(STORAGE_AT_KEY, now);
    } catch {}
    if (login) {
      try {
        await fetch(`/api/users/${login}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ terms_accepted_at: now }),
        });
      } catch {}
    }
    setVisible(false);
    setSubmitting(false);
    window.dispatchEvent(new CustomEvent("terms-accepted"));
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
    >
      <div
        className="bg-white dark:bg-gray-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "80dvh", animation: "fadeInModal 0.25s ease" }}
      >
        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{txt.title}</h2>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
          {/* description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {txt.body}
          </p>

          {/* terms accordion */}
          <AccordionSection
            label={txt.termsLabel}
            checked={chkTerms}
            onCheck={setChkTerms}
            expandLabel={txt.expand}
            collapseLabel={txt.collapse}
            sections={termsSections}
            updated={txt.updated}
          />

          {/* privacy accordion */}
          <AccordionSection
            label={txt.privacyLabel}
            checked={chkPrivacy}
            onCheck={setChkPrivacy}
            expandLabel={txt.expand}
            collapseLabel={txt.collapse}
            sections={privacySections}
            updated={txt.updated}
          />
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={handleAccept}
            disabled={!allChecked || submitting}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "…" : txt.button}
          </button>
          {!allChecked && (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">{txt.hint}</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
