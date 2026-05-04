import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カテゴリ一覧",
  description: "開発ツール・Web開発・AI/ML・データ分析・DevOpsなどカテゴリ別にAIエージェントスキルを探せます。",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "カテゴリ一覧 | AI Skill Market",
    description: "開発ツール・Web開発・AI/ML・データ分析・DevOpsなどカテゴリ別にAIエージェントスキルを探せます。",
    url: "https://aiskill-market.com/categories",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Skill Market" }],
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
