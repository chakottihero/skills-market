"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    icon: "🏠",
    labelJa: "ホーム",
    labelEn: "Home",
    subJa: "トップページへ",
    subEn: "Go to top page",
    href: "/",
    exact: true,
  },
  {
    icon: "🔍",
    labelJa: "スキルを探す",
    labelEn: "Browse Skills",
    subJa: "キーワードで検索する",
    subEn: "Search by keyword",
    href: "/skills",
    exact: false,
  },
  {
    icon: "📁",
    labelJa: "カテゴリ",
    labelEn: "Categories",
    subJa: "分野別に探す",
    subEn: "Browse by category",
    href: "/categories",
    exact: false,
  },
  {
    icon: "💰",
    labelJa: "出品・販売",
    labelEn: "Sell a Skill",
    subJa: "スキルを出品する",
    subEn: "List your AI skill",
    href: "/sell",
    exact: false,
  },
];

const SIDEBAR_CATEGORIES = [
  { id: "dev-tools",      icon: "🔧", nameJa: "開発ツール",       nameEn: "Dev Tools" },
  { id: "web-dev",        icon: "🌐", nameJa: "Web開発",           nameEn: "Web Dev" },
  { id: "data-analytics", icon: "📊", nameJa: "データ・分析",      nameEn: "Data & Analytics" },
  { id: "devops",         icon: "⚙️", nameJa: "DevOps",            nameEn: "DevOps" },
  { id: "ai-ml",          icon: "🤖", nameJa: "AI・機械学習",      nameEn: "AI & ML" },
  { id: "docs",           icon: "📄", nameJa: "ドキュメント",      nameEn: "Docs" },
  { id: "business",       icon: "💼", nameJa: "ビジネス・業務",    nameEn: "Business" },
  { id: "utility",        icon: "🛠️", nameJa: "ユーティリティ",   nameEn: "Utilities" },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const isEn = locale === "en";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const [aboutOpen, setAboutOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        id="sidebar-panel"
        className={`fixed top-0 left-0 z-[70] h-full w-80 max-w-[85vw] bg-[#1a1a2e] text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <span className="font-bold text-purple-300">Skills Market</span>
          </div>
          <button
            id="sidebar-close-btn"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── About — accordion (moved to TOP) ── */}
          <div className="px-4 pt-3 pb-2">
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              className="w-full flex items-center justify-between px-1 py-1 group"
            >
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider group-hover:text-purple-300 transition-colors">
                {isEn ? "About Skills Market" : "Skills Marketとは？"}
              </p>
              <span className={`text-purple-400 text-xs transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {aboutOpen && (
              <div className="mt-2 px-1 space-y-3 text-xs text-gray-400 leading-relaxed">
                {isEn ? (
                  <>
                    <p className="font-medium text-gray-300">What is Skills Market?</p>
                    <p>A marketplace for buying and selling skill files (SKILL.md) for AI agents.</p>
                    <p className="font-medium text-gray-300">What is SKILL.md?</p>
                    <p>A Markdown configuration file that adds specific capabilities to AI agents (Claude Code, Cursor, Codex, etc.). Place them in your repository&apos;s <code className="bg-white/10 px-1 rounded">.claude/skills/</code> or <code className="bg-white/10 px-1 rounded">.cursor/skills/</code> directory.</p>
                    <p className="font-medium text-gray-300">Supported Tools</p>
                    <ul className="space-y-1 pl-2">
                      <li>· Claude Code — Anthropic&apos;s AI coding assistant</li>
                      <li>· Cursor — AI-powered code editor</li>
                      <li>· Codex — OpenAI&apos;s coding model</li>
                      <li>· Copilot — GitHub&apos;s AI pair programmer</li>
                    </ul>
                    <p className="font-medium text-gray-300">How to use</p>
                    <ol className="space-y-1 pl-2 list-decimal list-inside">
                      <li>Search and find a skill</li>
                      <li>Purchase or download</li>
                      <li>Run the install command</li>
                      <li>Give instructions to your AI agent</li>
                    </ol>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-300">Skills Marketとは？</p>
                    <p>AIエージェント向けのスキルファイル（SKILL.md）を売買できるマーケットプレイスです。</p>
                    <p className="font-medium text-gray-300">SKILL.mdとは？</p>
                    <p>AIエージェント（Claude Code、Cursor、Codexなど）に特定の能力を追加するためのMarkdown形式の設定ファイルです。リポジトリの <code className="bg-white/10 px-1 rounded">.claude/skills/</code> などに配置します。</p>
                    <p className="font-medium text-gray-300">対応ツール</p>
                    <ul className="space-y-1 pl-2">
                      <li>· Claude Code — AnthropicのAIコーディングアシスタント</li>
                      <li>· Cursor — AI搭載コードエディタ</li>
                      <li>· Codex — OpenAIのコーディングモデル</li>
                      <li>· Copilot — GitHubのAIペアプログラマー</li>
                    </ul>
                    <p className="font-medium text-gray-300">使い方</p>
                    <ol className="space-y-1 pl-2 list-decimal list-inside">
                      <li>スキルを検索して選ぶ</li>
                      <li>購入またはダウンロード</li>
                      <li>インストールコマンドを実行</li>
                      <li>AIに指示を出す</li>
                    </ol>
                  </>
                )}
                <Link href="/about" onClick={onClose} className="inline-block text-purple-400 hover:text-purple-300 transition-colors mt-1">
                  {isEn ? "Learn more →" : "詳しく見る →"}
                </Link>
              </div>
            )}
          </div>

          <div className="mx-4 my-3 h-px bg-white/10" />

          {/* Navigation */}
          <div className="px-4 pb-2">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 px-1">
              {isEn ? "Navigation" : "ナビゲーション"}
            </p>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                      active
                        ? "bg-purple-600/30 border border-purple-500/40"
                        : "hover:bg-white/8 border border-transparent"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium leading-tight ${active ? "text-purple-300" : "text-white"}`}>
                        {isEn ? item.labelEn : item.labelJa}
                      </div>
                      <div className="text-xs text-gray-400 leading-tight mt-0.5">
                        {isEn ? item.subEn : item.subJa}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mx-4 my-3 h-px bg-white/10" />

          {/* Popular categories */}
          <div className="px-4 pb-2">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 px-1">
              {isEn ? "Popular Categories" : "人気カテゴリ"}
            </p>
            <div className="space-y-1">
              {SIDEBAR_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/skills?category=${cat.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors group"
                >
                  <span className="text-base flex-shrink-0">{cat.icon}</span>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {isEn ? cat.nameEn : cat.nameJa}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/categories"
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 mt-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              {isEn ? "All categories →" : "すべてのカテゴリ →"}
            </Link>
          </div>

          <div className="mx-4 my-3 h-px bg-white/10" />

          {/* My Page */}
          <div className="px-4 pb-2" id="sidebar-mypage-section">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 px-1">
              {isEn ? "My Account" : "マイアカウント"}
            </p>
            <div className="space-y-1">
              {[
                { href: "/mypage", icon: "👤", labelJa: "マイページ", labelEn: "My Page" },
                { href: "/mypage/purchases", icon: "🛍️", labelJa: "購入履歴", labelEn: "Purchase History" },
                { href: "/mypage/bookmarks", icon: "🔖", labelJa: "ブックマーク", labelEn: "Bookmarks" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors group ${
                    pathname === item.href ? "bg-purple-600/20 border border-purple-500/30" : "border border-transparent"
                  }`}
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <span className={`text-sm ${pathname === item.href ? "text-purple-300 font-medium" : "text-gray-300 group-hover:text-white"} transition-colors`}>
                    {isEn ? item.labelEn : item.labelJa}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-4 my-3 h-px bg-white/10" />

          {/* Links */}
          <div className="px-4 pb-4">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 px-1">
              {isEn ? "Links" : "リンク"}
            </p>
            <div className="space-y-1">
              <a
                href="https://search.aiskill-market.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors text-gray-300 hover:text-white"
              >
                <span>🔍</span>
                <div>
                  <div className="text-sm">Skill Search</div>
                  <div className="text-xs text-gray-500">74,000+ skills</div>
                </div>
              </a>
              <a
                href="mailto:chakotti@gmail.com"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors text-gray-300 hover:text-white"
              >
                <span>✉️</span>
                <span className="text-sm">{isEn ? "Contact" : "お問い合わせ"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 text-xs text-gray-500 text-center">
          © 2026 Skills Market
        </div>
      </aside>
    </>
  );
}
