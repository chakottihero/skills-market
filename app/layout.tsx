import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import TermsAgreementModal from "@/components/TermsAgreementModal";
import Tutorial from "@/components/Tutorial";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({ subsets: ["latin"] });

const SITE_URL = "https://aiskill-market.com";
const SITE_NAME = "AI Skill Market";
const DEFAULT_TITLE = "AI Skill Market - AIスキル売買プラットフォーム";
const DEFAULT_DESC = "AIエージェント向けスキルファイル（SKILL.md）を売買できるマーケットプレイス。Claude Code・Cursor・Copilot対応スキルを検索・出品・購入できます。";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESC,
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/skills?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "skillsmarket.contact@gmail.com",
        contactType: "customer support",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESC,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ja_JP",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <Providers>
          <TermsAgreementModal />
          <Tutorial />
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400 space-y-3">
              <p>
                Skills Market — Powered by{" "}
                <a
                  href="https://search.aiskill-market.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Skill Search
                </a>
                {" "}(74,000+ skills)
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <a href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline transition-colors">
                  利用規約
                </a>
                <a href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline transition-colors">
                  プライバシーポリシー
                </a>
                <a href="/legal" className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline transition-colors">
                  特定商取引法に基づく表記
                </a>
              </div>
            </div>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
