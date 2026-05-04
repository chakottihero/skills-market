import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スキルを探す",
  description: "AIエージェント向けスキルファイル（SKILL.md）をキーワード・カテゴリ・対応ツールで検索。Claude Code・Cursor・GitHub Copilot対応スキルが見つかります。",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "スキルを探す | AI Skill Market",
    description: "AIエージェント向けスキルファイル（SKILL.md）をキーワード・カテゴリ・対応ツールで検索。Claude Code・Cursor・GitHub Copilot対応スキルが見つかります。",
    url: "https://aiskill-market.com/skills",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Skill Market" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "スキルを探す | AI Skill Market",
    description: "AIエージェント向けスキルファイル（SKILL.md）をキーワード・カテゴリ・対応ツールで検索。",
    images: ["/og-image.png"],
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
