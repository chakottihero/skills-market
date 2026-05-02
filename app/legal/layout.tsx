import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "AI Skill Market（aiskill-market.com）の特定商取引法に基づく表記。販売事業者・所在地・返品・支払方法・商品引渡し時期などを掲載しています。",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "特定商取引法に基づく表記 | AI Skill Market",
    description: "AI Skill Marketの特定商取引法に基づく表記です。",
    url: "https://aiskill-market.com/legal",
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
