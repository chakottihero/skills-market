import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    siteName: "AI Skill Market",
  },
  twitter: { card: "summary_large_image" },
};

export default function SkillDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
