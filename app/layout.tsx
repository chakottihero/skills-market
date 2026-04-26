import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skills Market - AI Agent Skills Marketplace",
  description: "Buy and sell SKILL.md packages and AI knowledge bundles for Claude Code, Cursor, Copilot, and Codex",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-gray-200 bg-white mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
              <p>
                Skills Market — Powered by{" "}
                <a
                  href="https://skill-search-ten.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Skill Search
                </a>
                {" "}(74,000+ skills)
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
