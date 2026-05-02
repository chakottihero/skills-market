"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "tutorial_completed";
const SKIP_PATHS = ["/terms", "/privacy", "/legal"];
const TOTAL_STEPS = 7; // steps 0-6

// ─── text ─────────────────────────────────────────────────────────────────────

const T = {
  ja: {
    step0Title: "言語を選択してください",
    langs: [{ code: "ja", label: "🇯🇵 日本語" }, { code: "en", label: "🇺🇸 English" }, { code: "zh", label: "🇨🇳 中文" }],
    skip: "スキップ",
    next: "次へ →",
    step1Title: "Skills Marketへようこそ！",
    step1Body: "AIエージェント向けスキルファイル（SKILL.md）を検索・売買できるプラットフォームです。簡単なガイドをご紹介します。",
    step2Tooltip: "ここから言語を変更できます。日本語・English・中文に対応しています。",
    step3Tooltip: "上部のタブからホーム画面、スキル検索、スキル販売に素早くアクセスできます。",
    step4Tooltip: "このメニューボタンをタップしてみましょう！",
    step4Tap: "☰ タップして開く",
    step5Title: "メニューの内容",
    step5Body: "📖 Skills Marketとは → サービスの詳しい説明\n🏠 ホーム → トップページ\n🔍 スキルを探す → キーワード検索\n📁 カテゴリ → 分野別に探す\n💰 出品・販売 → スキルを出品\n👤 マイページ → プロフィールや設定\n🛍️ 購入履歴 → 購入したスキル一覧\n🔖 ブックマーク → 保存したスキル一覧",
    step6Title: "ガイド完了！",
    step6Body: "これで基本的な使い方は以上です。まずはスキルを探してみましょう！",
    step6Browse: "スキルを探す",
    step6Home: "ホームに戻る",
    dots: (current: number) => `ステップ ${current + 1} / ${TOTAL_STEPS}`,
  },
  en: {
    step0Title: "Select your language",
    langs: [{ code: "ja", label: "🇯🇵 日本語" }, { code: "en", label: "🇺🇸 English" }, { code: "zh", label: "🇨🇳 中文" }],
    skip: "Skip",
    next: "Next →",
    step1Title: "Welcome to Skills Market!",
    step1Body: "A platform where you can search, buy, and sell skill files (SKILL.md) for AI agents. Let us walk you through the basics.",
    step2Tooltip: "You can change the language here. We support 日本語, English, and 中文.",
    step3Tooltip: "Use the tabs at the top to quickly navigate to Home, Skill Search, or Sell a Skill.",
    step4Tooltip: "Try tapping this menu button!",
    step4Tap: "☰ Tap to open",
    step5Title: "What's in the menu",
    step5Body: "📖 About Skills Market → Learn about the service\n🏠 Home → Top page\n🔍 Browse Skills → Keyword search\n📁 Categories → Browse by category\n💰 Sell a Skill → List your skill\n👤 My Page → Profile & settings\n🛍️ Purchase History → Your purchased skills\n🔖 Bookmarks → Saved skills",
    step6Title: "Guide Complete!",
    step6Body: "That's all for the basics. Let's start by searching for some skills!",
    step6Browse: "Browse Skills",
    step6Home: "Back to Home",
    dots: (current: number) => `Step ${current + 1} / ${TOTAL_STEPS}`,
  },
  zh: {
    step0Title: "请选择语言",
    langs: [{ code: "ja", label: "🇯🇵 日本語" }, { code: "en", label: "🇺🇸 English" }, { code: "zh", label: "🇨🇳 中文" }],
    skip: "跳过",
    next: "下一步 →",
    step1Title: "欢迎来到Skills Market！",
    step1Body: "这是一个可以搜索、买卖AI代理技能文件（SKILL.md）的平台。让我们快速了解基本使用方法。",
    step2Tooltip: "您可以在这里切换语言，支持日本語、English 和中文。",
    step3Tooltip: "通过顶部的标签页，可以快速进入首页、技能搜索或出售技能页面。",
    step4Tooltip: "请试着点击这个菜单按钮！",
    step4Tap: "☰ 点击打开",
    step5Title: "菜单内容",
    step5Body: "📖 关于Skills Market → 服务详细说明\n🏠 首页 → 顶部页面\n🔍 浏览技能 → 关键词搜索\n📁 分类 → 按类别浏览\n💰 出售技能 → 上传您的技能\n👤 我的页面 → 个人资料与设置\n🛍️ 购买记录 → 已购技能列表\n🔖 书签 → 已保存的技能",
    step6Title: "引导完成！",
    step6Body: "基本使用方法就介绍到这里。现在开始搜索技能吧！",
    step6Browse: "浏览技能",
    step6Home: "返回首页",
    dots: (current: number) => `步骤 ${current + 1} / ${TOTAL_STEPS}`,
  },
} as const;

// ─── spotlight overlay ─────────────────────────────────────────────────────────

function SpotlightOverlay({ targetId, padding = 8 }: { targetId: string; padding?: number }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById(targetId);
      if (el) setRect(el.getBoundingClientRect());
    };
    update();
    const timer = setInterval(update, 200);
    window.addEventListener("resize", update);
    return () => { clearInterval(timer); window.removeEventListener("resize", update); };
  }, [targetId]);

  if (!rect) {
    return <div className="fixed inset-0 z-[9990] bg-black/70" />;
  }

  const t = Math.max(0, rect.top - padding);
  const b = rect.bottom + padding;
  const l = Math.max(0, rect.left - padding);
  const r = rect.right + padding;

  return (
    <>
      {/* top */}
      <div className="fixed z-[9990] bg-black/70" style={{ top: 0, left: 0, right: 0, height: t }} />
      {/* bottom */}
      <div className="fixed z-[9990] bg-black/70" style={{ top: b, left: 0, right: 0, bottom: 0 }} />
      {/* left */}
      <div className="fixed z-[9990] bg-black/70" style={{ top: t, left: 0, width: l, height: b - t }} />
      {/* right */}
      <div className="fixed z-[9990] bg-black/70" style={{ top: t, left: r, right: 0, height: b - t }} />
      {/* highlight ring */}
      <div className="fixed z-[9990] border-2 border-purple-400 rounded-lg pointer-events-none"
           style={{ top: t, left: l, width: r - l, height: b - t }} />
    </>
  );
}

// ─── step dots ────────────────────────────────────────────────────────────────

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center mt-4">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-3 h-3 bg-purple-500"
              : i < current
              ? "w-2 h-2 bg-purple-300"
              : "w-2 h-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

// ─── tooltip card ─────────────────────────────────────────────────────────────

function TooltipCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`fixed z-[9991] bg-white rounded-xl shadow-2xl p-4 max-w-xs w-[calc(100vw-32px)] sm:w-72 ${className}`}
      style={{ animation: "tutFade 0.3s ease" }}
    >
      {children}
    </div>
  );
}

// ─── full-screen modal card ────────────────────────────────────────────────────

function ModalCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7"
        style={{ animation: "tutFade 0.3s ease" }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Tutorial() {
  const { setLocale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<"ja" | "en" | "zh">("ja");

  const txt = T[lang];

  // ── show/hide logic ────────────────────────────────────────────
  useEffect(() => {
    // never show on skip paths or while session is still loading
    if (SKIP_PATHS.includes(pathname)) return;
    if (status === "loading") return;

    // hide immediately if user is logged in
    if (status === "authenticated") {
      setVisible(false);
      return;
    }

    // status === "unauthenticated": apply localStorage checks
    const shouldShow = () => {
      try {
        return (
          localStorage.getItem("terms_accepted") === "true" &&
          localStorage.getItem(STORAGE_KEY) !== "true"
        );
      } catch { return false; }
    };

    if (shouldShow()) setVisible(true);

    const handler = () => {
      if (shouldShow()) setVisible(true);
    };
    window.addEventListener("terms-accepted", handler);
    return () => window.removeEventListener("terms-accepted", handler);
  }, [pathname, status]);

  // ── scroll lock ────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [visible]);

  const complete = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      localStorage.setItem(`${STORAGE_KEY}_at`, new Date().toISOString());
    } catch {}
    // close sidebar if open
    window.dispatchEvent(new CustomEvent("tutorial:close-sidebar"));
    setVisible(false);
  }, []);

  const skip = useCallback(() => complete(), [complete]);

  const pickLang = (code: string) => {
    const l = code as Locale;
    setLang(l as "ja" | "en" | "zh");
    setLocale(l);
    setStep(1);
  };

  const handleNext = () => {
    if (step === 4) {
      // open sidebar, then advance
      window.dispatchEvent(new CustomEvent("tutorial:open-sidebar"));
      setTimeout(() => setStep(5), 420);
    } else if (step === 5) {
      window.dispatchEvent(new CustomEvent("tutorial:close-sidebar"));
      setStep(6);
    } else {
      setStep((s) => s + 1);
    }
  };

  if (!visible) return null;

  // ── render ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes tutFade {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* ── Step 0: language selection ── */}
      {step === 0 && (
        <ModalCard>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            {T.ja.step0Title}
            <br />
            <span className="text-base font-normal text-gray-500">{T.en.step0Title}</span>
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { code: "ja", label: "🇯🇵 日本語" },
              { code: "en", label: "🇺🇸 English" },
              { code: "zh", label: "🇨🇳 中文" },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => pickLang(l.code)}
                className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 text-lg font-semibold text-gray-800 transition-all"
              >
                {l.label}
              </button>
            ))}
          </div>
          <StepDots current={0} />
        </ModalCard>
      )}

      {/* ── Step 1: welcome ── */}
      {step === 1 && (
        <ModalCard>
          <button
            onClick={skip}
            className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600"
          >
            {txt.skip}
          </button>
          <div className="text-4xl text-center mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-3">{txt.step1Title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed text-center mb-6">{txt.step1Body}</p>
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {txt.next}
          </button>
          <StepDots current={1} />
        </ModalCard>
      )}

      {/* ── Step 2: language selector highlight ── */}
      {step === 2 && (
        <>
          <SpotlightOverlay targetId="nav-locale-select" padding={6} />
          {/* overlay click-blocker */}
          <div className="fixed inset-0 z-[9989] pointer-events-none" />
          <TooltipCard className="top-16 right-4">
            <button
              onClick={skip}
              className="absolute top-2 right-3 text-xs text-gray-400 hover:text-gray-600"
            >
              {txt.skip}
            </button>
            <p className="text-xs font-semibold text-purple-600 mb-1">Step 2</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{txt.step2Tooltip}</p>
            <button
              onClick={handleNext}
              className="w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              {txt.next}
            </button>
            <StepDots current={2} />
          </TooltipCard>
        </>
      )}

      {/* ── Step 3: sub-nav highlight ── */}
      {step === 3 && (
        <>
          <SpotlightOverlay targetId="nav-subnav" padding={4} />
          <div className="fixed inset-0 z-[9989] pointer-events-none" />
          <TooltipCard className="top-24 left-1/2 -translate-x-1/2">
            <button
              onClick={skip}
              className="absolute top-2 right-3 text-xs text-gray-400 hover:text-gray-600"
            >
              {txt.skip}
            </button>
            <p className="text-xs font-semibold text-purple-600 mb-1">Step 3</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{txt.step3Tooltip}</p>
            <button
              onClick={handleNext}
              className="w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              {txt.next}
            </button>
            <StepDots current={3} />
          </TooltipCard>
        </>
      )}

      {/* ── Step 4: hamburger highlight ── */}
      {step === 4 && (
        <>
          <SpotlightOverlay targetId="nav-hamburger" padding={8} />
          <div className="fixed inset-0 z-[9989] pointer-events-none" />
          <TooltipCard className="top-16 left-4">
            <button
              onClick={skip}
              className="absolute top-2 right-3 text-xs text-gray-400 hover:text-gray-600"
            >
              {txt.skip}
            </button>
            <p className="text-xs font-semibold text-purple-600 mb-1">Step 4</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{txt.step4Tooltip}</p>
            {/* tap button that programmatically opens sidebar */}
            <button
              onClick={handleNext}
              className="w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              {txt.step4Tap}
            </button>
            <StepDots current={4} />
          </TooltipCard>
        </>
      )}

      {/* ── Step 5: sidebar open ── */}
      {step === 5 && (
        <>
          {/* dark overlay only on the right side of the sidebar */}
          <div
            className="fixed top-0 bottom-0 z-[9990] bg-black/50 pointer-events-none"
            style={{ left: "min(320px, 85vw)" }}
          />
          {/* tooltip card — bottom sheet on mobile, right-side card on sm+ */}
          <div
            className="fixed z-[9991] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5
                       bottom-0 left-0 right-0
                       sm:bottom-auto sm:top-1/2 sm:left-auto sm:right-4 sm:-translate-y-1/2 sm:w-72"
            style={{ animation: "tutFade 0.3s ease" }}
          >
            <button
              onClick={skip}
              className="absolute top-3 right-4 text-xs text-gray-400 hover:text-gray-600"
            >
              {txt.skip}
            </button>
            <p className="text-xs font-semibold text-purple-600 mb-1">Step 5</p>
            <p className="text-sm font-bold text-gray-900 mb-2">{txt.step5Title}</p>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mb-4">{txt.step5Body}</p>
            <button
              onClick={handleNext}
              className="w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              {txt.next}
            </button>
            <StepDots current={5} />
          </div>
        </>
      )}

      {/* ── Step 6: completion ── */}
      {step === 6 && (
        <ModalCard>
          <div className="text-4xl text-center mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-3">{txt.step6Title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed text-center mb-6">{txt.step6Body}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { complete(); router.push("/skills"); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {txt.step6Browse}
            </button>
            <button
              onClick={complete}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              {txt.step6Home}
            </button>
          </div>
          <StepDots current={6} />
        </ModalCard>
      )}
    </>
  );
}
