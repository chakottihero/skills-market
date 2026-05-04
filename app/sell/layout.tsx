import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スキルを出品する",
  description: "あなたのAIエージェント向けスキルファイル（SKILL.md）を出品・販売しましょう。無料・有料どちらにも対応。Claude Code・Cursor・Copilot対応スキルを世界中のユーザーに届けられます。",
  alternates: { canonical: "/sell" },
  openGraph: {
    title: "スキルを出品する | AI Skill Market",
    description: "あなたのAIエージェント向けスキルファイルを出品・販売しましょう。無料・有料どちらにも対応。",
    url: "https://aiskill-market.com/sell",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Skill Market" }],
  },
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
