"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useLanguage } from "./LanguageContext";
import { localeLabels, type Locale } from "@/lib/i18n";
import Image from "next/image";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const SUB_NAV = [
  { href: "/",      labelJa: "ホーム",  labelEn: "Home",   labelZh: "首页",   exact: true  },
  { href: "/skills",labelJa: "検索",    labelEn: "Search", labelZh: "搜索",   exact: false },
  { href: "/sell",  labelJa: "販売",    labelEn: "Sell",   labelZh: "出售",   exact: false },
] as const;

export default function Navbar() {
  const { data: session } = useSession();
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const [toast, setToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const open = () => setSidebarOpen(true);
    const close = () => setSidebarOpen(false);
    window.addEventListener("tutorial:open-sidebar", open);
    window.addEventListener("tutorial:close-sidebar", close);
    return () => {
      window.removeEventListener("tutorial:open-sidebar", open);
      window.removeEventListener("tutorial:close-sidebar", close);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/status");
      const { configured } = await res.json();
      if (!configured) {
        showToast("GitHub OAuth 未設定です。管理者に連絡してください。");
        return;
      }
      signIn("github", { callbackUrl: "/" });
    } catch {
      showToast("エラーが発生しました。しばらくお待ちください。");
    }
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const subLabel = (item: typeof SUB_NAV[number]) =>
    locale === "en" ? item.labelEn : locale === "zh" ? item.labelZh : item.labelJa;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-amber-50 border border-amber-300 text-amber-800 text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 max-w-sm w-full mx-4">
          <span>⚙️</span>
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-auto text-amber-500 hover:text-amber-700">✕</button>
        </div>
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Row 1: Hamburger + Logo + Auth */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Left: hamburger + logo */}
            <div className="flex items-center gap-3">
              <button
                id="nav-hamburger"
                onClick={() => setSidebarOpen(true)}
                className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Open menu"
              >
                <span className="block w-5 h-0.5 bg-gray-600" />
                <span className="block w-5 h-0.5 bg-gray-600" />
                <span className="block w-5 h-0.5 bg-gray-600" />
              </button>

              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-purple-600 flex-shrink-0">
                <span>🛒</span>
                <span>Skills Market</span>
              </Link>
            </div>

            {/* Right: locale + auth */}
            <div className="flex items-center gap-2">
              <select
                id="nav-locale-select"
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600 cursor-pointer"
              >
                {(Object.keys(localeLabels) as Locale[]).map((l) => (
                  <option key={l} value={l}>{localeLabels[l]}</option>
                ))}
              </select>

              {session ? (
                <div className="flex items-center gap-2">
                  <Link href="/mypage" className="flex items-center gap-2">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? "avatar"}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    )}
                    <span className="hidden sm:block text-sm text-gray-700">{session.user?.name}</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block"
                  >
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="hidden sm:inline">{t.nav.login}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Text sub-nav */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div id="nav-subnav" className="flex items-center justify-center gap-8 h-9">
              {SUB_NAV.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition-colors py-1 ${
                      active
                        ? "text-purple-700 font-semibold border-b-2 border-purple-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {subLabel(item)}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
