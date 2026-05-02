"use client";
import { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import type { Product } from "@/types";

const EMPTY_FORM = {
  title: "",
  shortDescription: "",
  description: "",
  description_en: "",
  priceType: "free" as "free" | "paid",
  price: "",
  category: "",
  subcategory: "",
  ai_tools: [] as string[],
  tags: "",
  skill_content: "",
  github_url: "",
  language: "ja" as "ja" | "en" | "zh",
  skill_file_path: "",
  previewContent: false,
};

interface UploadedImage {
  publicUrl: string;
  preview: string;
  uploading: boolean;
  error?: string;
}

// ── Per-locale form strings ──────────────────────────────────────────────────
const FI = {
  ja: {
    required: "*必須", optional: "任意",
    steps: ["基本情報", "詳細・内容", "画像", "公開設定"],
    titlePlaceholder: "例: ChatGPT プロンプト最適化スキル",
    titleHint: "購入者がまず目にするタイトル。具体的・簡潔に書くと効果的です。",
    catchcopyLabel: "概要（キャッチコピー）",
    catchcopyPlaceholder: "例: 業務効率を3倍にするプロンプト集",
    catchcopyHint: "一覧画面に表示される短い説明文（最大120文字）",
    subcatPlaceholder: "— サブカテゴリを選択 —",
    langLabel: "言語 / Language", langHint: "スキルの主な言語を選択してください。",
    descLabel: "詳細説明（日本語）",
    descHint: "Markdown記法が使えます。購入者への詳しい説明を書いてください。",
    descEnLabel: "英語説明 (English Description)",
    descEnHint: "英語モードで表示される説明文。未入力の場合は日本語説明が表示されます。",
    toolsHint: "使用するAIツールを選択してください（複数選択可）",
    tagsPlaceholder: "python, automation, review",
    tagsHint: "カンマ区切りで入力（最大10個）。検索に使われます。",
    githubHint: "関連リポジトリがあれば入力してください。",
    skillmdLabel: "SKILL.md の内容", skillmdHint: "購入者がダウンロードできるMarkdownファイルの内容です。",
    imageLabel: "スキル画像", imageHint: "スキルを視覚的にアピールする画像を最大5枚アップロードできます。",
    dropTitle: "ここにドラッグ＆ドロップ", dropOr: "または クリックして選択",
    priceFreeHint: "無料スキルは購入手続き不要で取得できます。",
    priceHint: "購入者が支払う金額（最低1円）",
    summaryTitle: "出品内容の確認",
    summaryLabels: ["タイトル", "カテゴリ", "価格", "画像"],
    summaryFree: "無料", summaryImages: (n: number) => `${n}枚`,
    prev: "← 前へ", next: "次へ →",
    errTitle: "タイトルは必須です",
    errSummary: "概要は必須です",
    errCategory: "カテゴリを選択してください",
    errPrice: "価格を入力してください（1円以上）",
    viewSkill: "スキルページを見る →", continueList: "続けて出品する",
  },
  en: {
    required: "*Required", optional: "Optional",
    steps: ["Basic Info", "Details", "Images", "Publish"],
    titlePlaceholder: "e.g. ChatGPT Prompt Optimization Skill",
    titleHint: "The first thing buyers see. Be specific and concise.",
    catchcopyLabel: "Summary (Tagline)",
    catchcopyPlaceholder: "e.g. Triple your productivity with this prompt set",
    catchcopyHint: "Short description shown in the listing (max 120 chars)",
    subcatPlaceholder: "— Select subcategory —",
    langLabel: "Language", langHint: "Select the primary language of this skill.",
    descLabel: "Description (Japanese)",
    descHint: "Markdown supported. Write a detailed description for buyers.",
    descEnLabel: "English Description",
    descEnHint: "Shown in English mode. Falls back to Japanese if left blank.",
    toolsHint: "Select the AI tools used (multiple selection allowed)",
    tagsPlaceholder: "python, automation, review",
    tagsHint: "Comma-separated, max 10. Used for search.",
    githubHint: "Link to a related GitHub repository if applicable.",
    skillmdLabel: "SKILL.md Content", skillmdHint: "The Markdown file content buyers can download.",
    imageLabel: "Skill Images", imageHint: "Upload up to 5 images to showcase your skill visually.",
    dropTitle: "Drag & drop here", dropOr: "or click to select",
    priceFreeHint: "Free skills can be obtained without any payment.",
    priceHint: "Amount buyers will pay (minimum ¥1)",
    summaryTitle: "Review your listing",
    summaryLabels: ["Title", "Category", "Price", "Images"],
    summaryFree: "Free", summaryImages: (n: number) => `${n} image${n !== 1 ? "s" : ""}`,
    prev: "← Back", next: "Next →",
    errTitle: "Title is required",
    errSummary: "Summary is required",
    errCategory: "Please select a category",
    errPrice: "Please enter a price (minimum ¥1)",
    viewSkill: "View skill page →", continueList: "List another skill",
  },
  zh: {
    required: "*必填", optional: "可选",
    steps: ["基本信息", "详情内容", "图片", "发布设置"],
    titlePlaceholder: "例：ChatGPT 提示词优化技能",
    titleHint: "买家首先看到的标题。具体、简洁的标题更有效。",
    catchcopyLabel: "概要（标语）",
    catchcopyPlaceholder: "例：将工作效率提升3倍的提示词集合",
    catchcopyHint: "显示在列表中的简短描述（最多120字）",
    subcatPlaceholder: "— 选择子分类 —",
    langLabel: "语言", langHint: "选择此技能的主要语言。",
    descLabel: "详细说明（日文）",
    descHint: "支持Markdown。为买家提供详细说明。",
    descEnLabel: "英文说明",
    descEnHint: "英语模式下显示。未填写时显示日文说明。",
    toolsHint: "选择使用的AI工具（可多选）",
    tagsPlaceholder: "python, automation, review",
    tagsHint: "逗号分隔，最多10个。用于搜索。",
    githubHint: "如有相关GitHub仓库请填写。",
    skillmdLabel: "SKILL.md 内容", skillmdHint: "买家可下载的Markdown文件内容。",
    imageLabel: "技能图片", imageHint: "最多上传5张图片来展示您的技能。",
    dropTitle: "拖放到此处", dropOr: "或点击选择",
    priceFreeHint: "免费技能无需付款即可获取。",
    priceHint: "买家需支付的金额（最低¥1）",
    summaryTitle: "确认发布内容",
    summaryLabels: ["标题", "分类", "价格", "图片"],
    summaryFree: "免费", summaryImages: (n: number) => `${n}张`,
    prev: "← 返回", next: "下一步 →",
    errTitle: "标题为必填项",
    errSummary: "概要为必填项",
    errCategory: "请选择分类",
    errPrice: "请输入价格（最低¥1）",
    viewSkill: "查看技能页面 →", continueList: "继续上架",
  },
} as const;

export default function SellPage() {
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const fi = FI[locale] ?? FI.ja;

  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [skillFileName, setSkillFileName] = useState("");
  const [skillFileUploading, setSkillFileUploading] = useState(false);
  const [skillFileProgress, setSkillFileProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skillFileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <p className="text-gray-600 mb-6">{t.sell.loginRequired}</p>
        <button
          onClick={() => signIn("github")}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t.nav.login}
        </button>
      </div>
    );
  }

  const selectedCat = CATEGORIES.find((c) => c.id === form.category);

  const toggleTool = (id: string) => {
    setForm((f) => ({
      ...f,
      ai_tools: f.ai_tools.includes(id)
        ? f.ai_tools.filter((tid) => tid !== id)
        : [...f.ai_tools, id],
    }));
  };

  const uploadFile = async (file: File, idx: number) => {
    const preview = URL.createObjectURL(file);
    setImages((prev) => [...prev, { publicUrl: "", preview, uploading: true }]);
    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });
      if (!res.ok) throw new Error("Upload URL failed");
      const { signedUrl, publicUrl } = await res.json() as { signedUrl: string; publicUrl: string };
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      setImages((prev) => prev.map((img, i) => i === idx ? { ...img, publicUrl, uploading: false } : img));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload error";
      setImages((prev) => prev.map((img, i) => i === idx ? { ...img, uploading: false, error: msg } : img));
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 5 - images.length;
    const eligible = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, remaining);
    eligible.forEach((f, i) => uploadFile(f, images.length + i));
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dragRef.current?.classList.add("border-purple-400", "bg-purple-50");
  };
  const handleDragLeave = () => {
    dragRef.current?.classList.remove("border-purple-400", "bg-purple-50");
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragRef.current?.classList.remove("border-purple-400", "bg-purple-50");
    handleFiles(e.dataTransfer.files);
  };

  const validateStep = (s: number, currentForm = form): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!currentForm.title.trim()) errs.title = fi.errTitle;
      if (!currentForm.shortDescription.trim()) errs.shortDescription = fi.errSummary;
      if (!currentForm.category) errs.category = fi.errCategory;
    }
    if (s === 4) {
      if (currentForm.priceType === "paid" && (!currentForm.price || Number(currentForm.price) < 1))
        errs.price = fi.errPrice;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, 4)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Prevent accidental Enter-key submission inside the form
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const uploadSkillFile = async (file: File) => {
    if (file.size > 1024 * 1024) {
      setError("ファイルサイズは1MB以下にしてください");
      return;
    }
    setSkillFileUploading(true);
    setSkillFileProgress(10);
    try {
      const res = await fetch("/api/upload-skill-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });
      if (!res.ok) throw new Error("Upload URL failed");
      const { signedUrl, path } = await res.json() as { signedUrl: string; path: string };
      setSkillFileProgress(40);
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "text/markdown" },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      setSkillFileProgress(100);
      setForm((f) => ({ ...f, skill_file_path: path }));
      setSkillFileName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload error");
    } finally {
      setSkillFileUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setLoading(true);
    setError("");
    try {
      const tags = form.tags.split(",").map((tg) => tg.trim()).filter(Boolean).slice(0, 10);
      const uploadedUrls = images.filter((img) => img.publicUrl).map((img) => img.publicUrl);
      const body = {
        title: form.title,
        short_description: form.shortDescription || form.title,
        description: form.description || form.shortDescription || form.title,
        category: form.category || "other",
        subcategory: form.subcategory || undefined,
        price_type: form.priceType,
        price: form.priceType === "paid" ? Number(form.price) : 0,
        tags,
        ai_tools: form.ai_tools,
        skill_content: form.skill_file_path ? undefined : (form.skill_content || undefined),
        file_path: form.skill_file_path || undefined,
        github_url: form.github_url || undefined,
        language: form.language,
        images: uploadedUrls,
        description_en: form.description_en || undefined,
        preview_content: form.previewContent,
      };
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed");
      }
      const d = await res.json() as { skill: Product };
      setNewSkill(d.skill);
      setForm(EMPTY_FORM);
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  };

  // Submit button disabled: loading, no title, OR paid with no valid price
  const submitDisabled =
    loading ||
    !form.title.trim() ||
    (form.priceType === "paid" && (!form.price || Number(form.price) < 1));

  // ── Shared CSS ──────────────────────────────────────────────────────────────
  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400";
  const selectCls = `${inputCls} bg-white`;
  const labelCls = "block text-sm font-semibold text-gray-800 mb-1";
  const errCls = "text-xs text-red-500 mt-1";
  const hintCls = "text-xs text-gray-400 mt-1";

  const Req = () => <span className="ml-1 text-xs font-normal text-red-500">{fi.required}</span>;
  const Opt = () => <span className="ml-1 text-xs font-normal text-gray-400">{fi.optional}</span>;

  if (newSkill) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.sell.success}</h2>
        <p className="text-gray-500 mb-8">{newSkill.title}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/skills/${newSkill.id}`}
            className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {fi.viewSkill}
          </Link>
          <button
            type="button"
            onClick={() => setNewSkill(null)}
            className="border border-gray-200 text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {fi.continueList}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.sell.title}</h1>
      <p className="text-gray-500 mb-8">{t.sell.subtitle}</p>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {fi.steps.map((label, i) => {
          const num = i + 1;
          return (
            <div key={num} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => step > num && setStep(num)}
                className={`flex flex-col items-center gap-1 flex-1 ${step > num ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === num ? "bg-purple-600 text-white" : step > num ? "bg-purple-200 text-purple-700" : "bg-gray-100 text-gray-400"
                }`}>
                  {step > num ? "✓" : num}
                </div>
                <span className={`text-xs hidden sm:block ${step === num ? "text-purple-600 font-medium" : "text-gray-400"}`}>
                  {label}
                </span>
              </button>
              {i < fi.steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 transition-colors ${step > num ? "bg-purple-300" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* ── Form: Enter key blocked on non-textarea elements ── */}
      <form onKeyDown={handleFormKeyDown} onSubmit={(e) => e.preventDefault()}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

          {/* ── Step 1: 基本情報 ── */}
          {step === 1 && (
            <>
              <div>
                <label className={labelCls}>{t.sell.formTitle}<Req /></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputCls}
                  placeholder={fi.titlePlaceholder}
                />
                {errors.title && <p className={errCls}>{errors.title}</p>}
                <p className={hintCls}>{fi.titleHint}</p>
              </div>

              <div>
                <label className={labelCls}>{fi.catchcopyLabel}<Req /></label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className={inputCls}
                  maxLength={120}
                  placeholder={fi.catchcopyPlaceholder}
                />
                {errors.shortDescription && <p className={errCls}>{errors.shortDescription}</p>}
                <p className={hintCls}>{fi.catchcopyHint}</p>
              </div>

              <div>
                <label className={labelCls}>{t.sell.formCategory}<Req /></label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
                  className={selectCls}
                >
                  <option value="">{t.skills.allCategories}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {getCategoryName(cat.id, locale)}</option>
                  ))}
                </select>
                {errors.category && <p className={errCls}>{errors.category}</p>}
              </div>

              {selectedCat && selectedCat.subcategories.length > 0 && (
                <div>
                  <label className={labelCls}>{t.sell.formSubcategory}<Opt /></label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">{fi.subcatPlaceholder}</option>
                    {selectedCat.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {locale === "en" ? sub.name_en : locale === "zh" ? sub.name_zh : sub.name_ja}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={labelCls}>{fi.langLabel}<Req /></label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value as "ja" | "en" | "zh" })}
                  className={selectCls}
                >
                  <option value="ja">🇯🇵 日本語</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="zh">🇨🇳 中文</option>
                </select>
                <p className={hintCls}>{fi.langHint}</p>
              </div>
            </>
          )}

          {/* ── Step 2: 詳細・内容 ── */}
          {step === 2 && (
            <>
              <div>
                <label className={labelCls}>{fi.descLabel}<Opt /></label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  className={inputCls}
                  placeholder={fi.descLabel}
                />
                <p className={hintCls}>{fi.descHint}</p>
              </div>

              <div>
                <label className={labelCls}>{fi.descEnLabel}<Opt /></label>
                <textarea
                  value={form.description_en}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                  rows={4}
                  className={inputCls}
                  placeholder="English description..."
                />
                <p className={hintCls}>{fi.descEnHint}</p>
              </div>

              <div>
                <label className={labelCls}>{t.sell.formTools}<Opt /></label>
                <p className={hintCls + " mb-2"}>{fi.toolsHint}</p>
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map((tk) => (
                    <button
                      key={tk.id}
                      type="button"
                      onClick={() => toggleTool(tk.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        form.ai_tools.includes(tk.id)
                          ? `${tk.badgeClass} border-transparent`
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {tk.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>{t.sell.formTags}<Opt /></label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className={inputCls}
                  placeholder={fi.tagsPlaceholder}
                />
                <p className={hintCls}>{fi.tagsHint}</p>
              </div>

              <div>
                <label className={labelCls}>GitHub URL<Opt /></label>
                <input
                  type="url"
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                  className={inputCls}
                  placeholder="https://github.com/yourname/repo"
                />
                <p className={hintCls}>{fi.githubHint}</p>
              </div>

              <div>
                <label className={labelCls}>{fi.skillmdLabel}<Opt /></label>
                <textarea
                  value={form.skill_content}
                  onChange={(e) => setForm({ ...form, skill_content: e.target.value })}
                  rows={8}
                  className={`${inputCls} font-mono text-xs`}
                  placeholder={"# スキル名\n\n## 概要\n\n## 使い方\n\n## 例"}
                />
                <p className={hintCls}>{fi.skillmdHint}</p>
              </div>

              {/* Skill file upload */}
              <div>
                <label className={labelCls}>
                  {locale === "en" ? "Or upload SKILL.md file" : "またはSKILL.mdファイルをアップロード"}
                  <Opt />
                </label>
                <p className={hintCls + " mb-2"}>
                  {locale === "en" ? "Upload a .md or .txt file (max 1MB). If uploaded, this takes priority over the textarea above." : ".md / .txt ファイルをアップロード（最大1MB）。アップロード済みのファイルが優先されます。"}
                </p>
                {skillFileName ? (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <span className="text-emerald-600 text-sm">📄 {skillFileName}</span>
                    <button
                      type="button"
                      onClick={() => { setForm((f) => ({ ...f, skill_file_path: "" })); setSkillFileName(""); setSkillFileProgress(0); }}
                      className="ml-auto text-xs text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => skillFileRef.current?.click()}
                      disabled={skillFileUploading}
                      className="border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors disabled:opacity-50 w-full text-left"
                    >
                      {skillFileUploading ? `${locale === "en" ? "Uploading" : "アップロード中"} ${skillFileProgress}%` : (locale === "en" ? "Click to select .md / .txt" : "クリックして .md / .txt を選択")}
                    </button>
                    <input
                      ref={skillFileRef}
                      type="file"
                      accept=".md,.txt,text/markdown,text/plain"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadSkillFile(f); }}
                    />
                    {skillFileUploading && (
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${skillFileProgress}%` }} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Step 3: 画像 ── */}
          {step === 3 && (
            <div>
              <label className={labelCls}>{fi.imageLabel}<Opt /></label>
              <p className={hintCls + " mb-3"}>{fi.imageHint}</p>

              {images.length < 5 && (
                <div
                  ref={dragRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm text-gray-700 font-medium">{fi.dropTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{fi.dropOr}</p>
                  <p className="text-xs text-gray-400 mt-1">PNG / JPG / WEBP（{images.length}/5）</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                      <Image src={img.preview} alt={`image-${i}`} fill className="object-cover" unoptimized />
                      {img.uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {img.error && (
                        <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                          <span className="text-white text-xs p-1 text-center">{img.error}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/80 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: 公開設定 ── */}
          {step === 4 && (
            <>
              <div>
                <label className={labelCls}>{t.sell.formPriceType}<Req /></label>
                <div className="flex gap-2 mt-1">
                  {(["free", "paid"] as const).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => { setForm((f) => ({ ...f, priceType: pt, price: pt === "free" ? "" : f.price })); setErrors({}); }}
                      className={`flex-1 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                        form.priceType === pt
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      {pt === "free" ? `🆓 ${t.sell.priceFree}` : `💰 ${t.sell.pricePaid}`}
                    </button>
                  ))}
                </div>
                <p className={hintCls}>{fi.priceFreeHint}</p>
              </div>

              {form.priceType === "paid" && (
                <div>
                  <label className={labelCls}>{t.sell.formPrice} (¥)<Req /></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">¥</span>
                    <input
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                      className={`${inputCls} pl-8`}
                      placeholder="500"
                    />
                  </div>
                  {errors.price && <p className={errCls}>{errors.price}</p>}
                  <p className={hintCls}>{fi.priceHint}</p>
                </div>
              )}

              {/* Preview content toggle */}
              <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {locale === "en" ? "Show SKILL.md content before purchase" : "スキルファイルの中身を購入前に公開する"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {locale === "en"
                      ? "When ON, buyers can preview the SKILL.md content before downloading."
                      : "ONにすると、購入前にSKILL.mdの内容をプレビュー表示します。"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, previewContent: !f.previewContent }))}
                  className={`flex-shrink-0 relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    form.previewContent ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.previewContent ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Confirmation summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">{fi.summaryTitle}</h3>
                {[
                  [fi.summaryLabels[0], form.title || "—"],
                  [fi.summaryLabels[1], form.category ? getCategoryName(form.category, locale) : "—"],
                  [fi.summaryLabels[2], form.priceType === "free"
                    ? fi.summaryFree
                    : form.price ? `¥${Number(form.price).toLocaleString()}` : "—"],
                  [fi.summaryLabels[3], fi.summaryImages(images.filter((img) => img.publicUrl).length)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-gray-600">
                    <span>{label}</span>
                    <span className={`font-medium text-gray-900 max-w-xs text-right truncate ${
                      label === fi.summaryLabels[2] && form.priceType === "free" ? "text-emerald-600" : ""
                    }`}>{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation / Submit */}
        <div className="flex justify-between mt-6 gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {fi.prev}
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              {fi.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitDisabled}
              className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.common.loading : t.sell.submit}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
