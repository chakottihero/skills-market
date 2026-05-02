import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "AI Skill Market（aiskill-market.com）のプライバシーポリシー。収集する情報・利用目的・第三者提供・Cookie・データの保存と削除について定めます。",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "プライバシーポリシー | AI Skill Market",
    description: "AI Skill Marketのプライバシーポリシーです。",
    url: "https://aiskill-market.com/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
