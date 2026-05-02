import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "AI Skill Market（aiskill-market.com）の利用規約。サービス概要・利用資格・出品者の責任・購入者の注意・手数料・禁止事項・免責事項を定めます。",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "利用規約 | AI Skill Market",
    description: "AI Skill Marketの利用規約です。",
    url: "https://aiskill-market.com/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
