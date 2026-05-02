import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills Marketについて",
  description: "AI Skill Marketは、AIエージェント向けスキルファイル（SKILL.md）を売買できるマーケットプレイスです。Claude Code・Cursor・Copilot対応スキルの出品・購入ができます。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Skills Marketについて | AI Skill Market",
    description: "AI Skill Marketは、AIエージェント向けスキルファイル（SKILL.md）を売買できるマーケットプレイスです。",
    url: "https://aiskill-market.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
