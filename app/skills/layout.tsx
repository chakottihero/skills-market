import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スキルを探す",
  description: "AIエージェント向けスキルファイル（SKILL.md）をキーワード・カテゴリ・対応ツールで検索。Claude Code・Cursor・GitHub Copilot対応スキルが見つかります。",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "スキルを探す | AI Skill Market",
    description: "AIエージェント向けスキルファイル（SKILL.md）をキーワード・カテゴリ・対応ツールで検索。Claude Code・Cursor・GitHub Copilot対応スキルが見つかります。",
    url: "https://aiskill-market.com/skills",
  },
  twitter: {
    title: "スキルを探す | AI Skill Market",
    description: "AIエージェント向けスキルファイル（SKILL.md）をキーワード・カテゴリ・対応ツールで検索。",
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
