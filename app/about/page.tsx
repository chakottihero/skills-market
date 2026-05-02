"use client";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

const SKILL_MD_EXAMPLE = `---
name: コードレビュー
description: プルリクエストを詳細にレビューします
---
## 役割
あなたは経験豊富なシニアエンジニアです。
コードの品質、パフォーマンス、セキュリティの
観点からレビューを行ってください。`;

const SKILL_MD_EXAMPLE_EN = `---
name: code-review
description: Performs detailed pull request reviews
---
## Role
You are an experienced senior engineer.
Review code for quality, performance, and
security concerns.`;

const TOOLS = [
  {
    name: "Claude Code",
    tagline_ja: "AnthropicのAIコーディングアシスタント",
    tagline_en: "Anthropic's AI coding assistant",
    color: "from-green-500 to-emerald-600",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    text: "text-green-400",
  },
  {
    name: "Cursor",
    tagline_ja: "AI搭載コードエディタ",
    tagline_en: "AI-powered code editor",
    color: "from-yellow-500 to-amber-500",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
  {
    name: "Codex",
    tagline_ja: "OpenAIのコーディングモデル",
    tagline_en: "OpenAI's coding model",
    color: "from-red-500 to-rose-600",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-400",
  },
  {
    name: "Copilot",
    tagline_ja: "GitHubのAIペアプログラマー",
    tagline_en: "GitHub's AI pair programmer",
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
];

const STEPS_JA = [
  {
    num: 1,
    title: "スキルを検索して選ぶ",
    desc: "Skills Marketでキーワード検索し、目的に合ったスキルを見つけます。カテゴリやツールでフィルタリングも可能です。",
    icon: "🔍",
  },
  {
    num: 2,
    title: "購入またはダウンロード",
    desc: "無料スキルはそのままダウンロード、有料スキルは購入後にダウンロードできます。",
    icon: "💾",
  },
  {
    num: 3,
    title: "インストールコマンドを実行",
    desc: "スキルカードに表示されているコマンドをターミナルで実行します。",
    icon: "⚡",
    code: "claude skills install <skill-name>",
  },
  {
    num: 4,
    title: "AIに指示を出す",
    desc: "インストール後、対応するAIエージェントでスキル名を呼び出すだけで機能を使えます。",
    icon: "🤖",
  },
];

const STEPS_EN = [
  {
    num: 1,
    title: "Search and find a skill",
    desc: "Browse Skills Market by keyword. Filter by category or AI tool to find exactly what you need.",
    icon: "🔍",
  },
  {
    num: 2,
    title: "Purchase or download",
    desc: "Free skills can be downloaded directly. Paid skills are available after purchase.",
    icon: "💾",
  },
  {
    num: 3,
    title: "Run the install command",
    desc: "Execute the command shown on the skill card in your terminal.",
    icon: "⚡",
    code: "claude skills install <skill-name>",
  },
  {
    num: 4,
    title: "Give instructions to AI",
    desc: "After installation, just call the skill name in your AI agent to activate it.",
    icon: "🤖",
  },
];

export default function AboutPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const steps = isEn ? STEPS_EN : STEPS_JA;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← {isEn ? "Back to Home" : "ホームに戻る"}
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-16 text-center">
        <div className="text-5xl mb-6">🛒</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {isEn ? "About Skills Market" : "Skills Marketとは？"}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "A marketplace for buying and selling SKILL.md packages for AI agents like Claude Code, Cursor, Codex, and Copilot."
            : "AIエージェント（Claude Code、Cursor、Codexなど）向けのスキルファイル（SKILL.md）を売買できるマーケットプレイスです。"}
        </p>
      </section>

      {/* Section 1: SKILL.md の仕組み */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2 text-white">
            {isEn ? "What is SKILL.md?" : "SKILL.md の仕組み"}
          </h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            {isEn
              ? "SKILL.md is a Markdown configuration file that adds specific capabilities to AI agents. Place the file in your repository's .claude/skills/ or .cursor/skills/ directory. The file begins with YAML frontmatter containing name and description, followed by detailed skill instructions."
              : "SKILL.mdは、AIエージェントに特定の能力を追加するためのMarkdown形式の設定ファイルです。リポジトリの .claude/skills/ や .cursor/skills/ などのディレクトリに配置します。ファイルの先頭にはYAMLフロントマターで name と description を記述し、本文にスキルの詳細な指示を書きます。"}
          </p>

          <div className="rounded-xl overflow-hidden border border-white/10">
            <div className="bg-gray-900/80 px-4 py-2 flex items-center gap-2 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-gray-500 ml-2">SKILL.md</span>
            </div>
            <pre className="bg-[#1a1a2e] text-sm text-green-300 p-5 overflow-x-auto leading-relaxed font-mono">
              {isEn ? SKILL_MD_EXAMPLE_EN : SKILL_MD_EXAMPLE}
            </pre>
          </div>
        </div>
      </section>

      {/* Section 2: 対応ツール */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-2 text-white text-center">
          {isEn ? "Supported Tools" : "対応ツール"}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isEn
            ? "Skills Market supports the following AI agents."
            : "Skills Marketは以下のAIエージェントに対応しています。"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className={`${tool.bg} border ${tool.border} rounded-xl p-5 flex items-start gap-4`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}>
                {tool.name[0]}
              </div>
              <div>
                <div className={`font-semibold ${tool.text} mb-1`}>{tool.name}</div>
                <div className="text-sm text-gray-400">
                  {isEn ? tool.tagline_en : tool.tagline_ja}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: 使い方 */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-2 text-white text-center">
          {isEn ? "How to Use" : "Skills Marketの使い方"}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isEn
            ? "Get started in 4 simple steps."
            : "4ステップで始められます。"}
        </p>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.num} className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center flex-shrink-0 font-bold text-purple-300 text-sm">
                {step.num}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{step.icon}</span>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                {"code" in step && step.code && (
                  <code className="mt-2 inline-block bg-gray-900 border border-white/10 text-green-400 text-xs px-3 py-1.5 rounded-lg font-mono">
                    {step.code}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: 出品について */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">💰</div>
          <h2 className="text-2xl font-bold mb-3 text-white">
            {isEn ? "Sell Your Skills" : "自分のスキルを販売しませんか？"}
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            {isEn
              ? "Anyone can list skills on Skills Market — both free and paid. Share your knowledge with the AI developer community."
              : "Skills Marketでは無料・有料どちらでもスキルを出品できます。あなたの知識をAI開発者コミュニティに共有しましょう。"}
          </p>
          <Link
            href="/sell"
            className="inline-block bg-purple-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            {isEn ? "List a Skill →" : "スキルを出品する →"}
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/skills"
          className="flex-1 sm:flex-none text-center border border-purple-500/40 text-purple-300 font-semibold px-8 py-3 rounded-full hover:bg-purple-500/10 transition-colors"
        >
          {isEn ? "Browse Skills" : "スキルを検索する"}
        </Link>
        <Link
          href="/categories"
          className="flex-1 sm:flex-none text-center border border-white/20 text-gray-300 font-semibold px-8 py-3 rounded-full hover:bg-white/5 transition-colors"
        >
          {isEn ? "View Categories" : "カテゴリを見る"}
        </Link>
      </section>
    </div>
  );
}
