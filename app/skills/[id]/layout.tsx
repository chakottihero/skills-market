import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    siteName: "AI Skill Market",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Skill Market" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
};

export default function SkillDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
