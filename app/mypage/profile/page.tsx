"use client";
import { useEffect, useState, useCallback, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import type { UserProfile, Tool } from "@/types";

const SPECIALTIES = [
  "Webフロントエンド", "バックエンド・API", "開発ツール・環境", "AI・機械学習",
  "データサイエンス", "コード品質・レビュー", "金融・経済", "医療・ヘルスケア",
  "デザイン・UI/UX", "ビジネス・マーケティング", "その他",
];

const TOOLS: { value: Tool; label: string }[] = [
  { value: "claude-code", label: "Claude Code" },
  { value: "cursor", label: "Cursor" },
  { value: "copilot", label: "GitHub Copilot" },
  { value: "windsurf", label: "Windsurf" },
  { value: "cline", label: "Cline" },
  { value: "roo-code", label: "Roo Code" },
  { value: "aider", label: "Aider" },
  { value: "other", label: "その他" },
];

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// ── helpers ───────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">
      {children}
    </h2>
  );
}

function Input({ label, value, onChange, placeholder, maxLength, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      {maxLength && (
        <div className="text-right text-xs text-gray-400 mt-0.5">{value.length}/{maxLength}</div>
      )}
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, maxLength, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  rows?: number; maxLength?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
      />
      {maxLength && (
        <div className="text-right text-xs text-gray-400 mt-0.5">{value.length}/{maxLength}</div>
      )}
    </div>
  );
}

function TagInput({ label, tags, onChange, max = 15, placeholder }: {
  label: string; tags: string[]; onChange: (v: string[]) => void; max?: number; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v) && tags.length < max) onChange([...tags, v]);
    setInput("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-purple-900">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={placeholder ?? `追加（Enter/カンマで確定）${tags.length}/${max}`}
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        disabled={tags.length >= max}
      />
    </div>
  );
}

function CheckGroup({ label, options, selected, onChange, max }: {
  label: string; options: string[]; selected: string[];
  onChange: (v: string[]) => void; max?: number;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
    else if (!max || selected.length < max) onChange([...selected, opt]);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{max && <span className="text-gray-400 font-normal text-xs ml-1">（最大{max}個）</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                on ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
              } ${!on && max && selected.length >= max ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Avatar upload section ──────────────────────────────────────────────────────

function AvatarSection({ avatar, onAvatarChange }: {
  avatar: string;
  onAvatarChange: (url: string) => void;
}) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("対応形式: JPG, PNG, GIF, WebP");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("ファイルサイズは2MB以下にしてください");
      return;
    }

    // local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setProgress(10);

    try {
      // get signed upload URL
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });

      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "アップロードURLの取得に失敗しました");
      }

      const { signedUrl, publicUrl } = await res.json() as { signedUrl: string; publicUrl: string };
      setProgress(40);

      // upload to Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("アップロードに失敗しました");
      setProgress(100);

      onAvatarChange(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setPreview(null);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onAvatarChange]);

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const currentImage = preview || avatar;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">プロフィール画像</label>

      {/* Preview */}
      {currentImage && (
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200 flex-shrink-0">
            <Image src={currentImage} alt="avatar preview" fill className="object-cover" unoptimized />
          </div>
          <span className="text-xs text-gray-400">プレビュー</span>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden mb-3 w-fit">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "upload"
              ? "bg-purple-600 text-white"
              : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          }`}
        >
          画像をアップロード
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`px-4 py-1.5 text-sm font-medium transition-colors border-l border-gray-200 dark:border-gray-600 ${
            tab === "url"
              ? "bg-purple-600 text-white"
              : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          }`}
        >
          URLを入力
        </button>
      </div>

      {tab === "upload" ? (
        <div>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragging
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-200 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {uploading ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-500">アップロード中...</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">クリックまたはドラッグ&ドロップ</p>
                <p className="text-xs text-gray-400 mt-1">JPG / PNG / GIF / WebP · 最大2MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={onFileInput}
            className="hidden"
          />
          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={avatar}
          onChange={(e) => onAvatarChange(e.target.value)}
          placeholder="https://avatars.githubusercontent.com/..."
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const login = (session?.user as { login?: string })?.login ?? session?.user?.name ?? "";

  const [form, setForm] = useState<UserProfile>({
    username: "",
    displayName: "",
    avatar: "",
    coverImage: "",
    catchphrase: "",
    bio: "",
    specialties: [],
    tools: [],
    skillTags: [],
    career: { work: [], education: [], awards: [] },
    portfolio: [],
    availability: "available",
    schedule: "",
    sns: { github: "", twitter: "", website: "" },
    achievements: "",
    createdAt: "",
    updatedAt: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  const set = useCallback(<K extends keyof UserProfile>(key: K, val: UserProfile[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  }, []);

  useEffect(() => {
    if (!login) return;
    fetch(`/api/users/${login}`)
      .then((r) => {
        if (r.ok) return r.json();
        setForm((f) => ({
          ...f,
          username: login,
          displayName: session?.user?.name ?? login,
          avatar: session?.user?.image ?? "",
          sns: { ...f.sns, github: `https://github.com/${login}` },
        }));
        setLoaded(true);
        return null;
      })
      .then((d) => {
        if (d) {
          const p = d.profile as UserProfile;
          setForm(p);
          if (p.achievements) setAchievementsOpen(true);
          setLoaded(true);
        }
      });
  }, [login, session]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/users/${login}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <p className="text-gray-600 mb-6">ログインが必要です</p>
        <button onClick={() => signIn("github")} className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
          {t.nav.login}
        </button>
      </div>
    );
  }

  if (!loaded) {
    return <div className="text-center py-20 text-gray-400">{t.common.loading}</div>;
  }

  const toolLabels = Object.fromEntries(TOOLS.map((tk) => [tk.value, tk.label]));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/mypage" className="text-sm text-gray-500 hover:text-gray-700">← {t.mypage.title}</Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{t.profile.edit}</h1>
        </div>
        <div className="flex items-center gap-3">
          {login && (
            <Link href={`/users/${login}`} className="text-sm text-purple-600 hover:underline">
              {t.profile.viewPublic} →
            </Link>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="bg-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {saving ? "保存中..." : saved ? `✓ ${t.profile.saved}` : t.profile.save}
          </button>
        </div>
      </div>

      <div className="space-y-8">

        {/* ── 基本情報 ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <SectionTitle>基本情報</SectionTitle>

          <AvatarSection
            avatar={form.avatar}
            onAvatarChange={(url) => set("avatar", url)}
          />

          {form.coverImage && (
            <div className="h-24 rounded-lg overflow-hidden bg-gray-100">
              <img src={form.coverImage} alt="cover" loading="lazy" className="w-full h-full object-cover" />
            </div>
          )}
          <Input
            label={t.profile.coverImage}
            value={form.coverImage ?? ""}
            onChange={(v) => set("coverImage", v)}
            placeholder="https://..."
          />

          <Input
            label={t.profile.displayName}
            value={form.displayName}
            onChange={(v) => set("displayName", v)}
            placeholder={login}
          />
          <Input
            label={t.profile.catchphrase}
            value={form.catchphrase}
            onChange={(v) => set("catchphrase", v)}
            placeholder="Claude Code歴1年のフルスタック開発者"
            maxLength={50}
          />
          <Textarea
            label={t.profile.bio}
            value={form.bio}
            onChange={(v) => set("bio", v)}
            rows={6}
            maxLength={1000}
            placeholder={"## 自己紹介\n\n経歴・得意分野・実績を自由に記述..."}
          />
        </div>

        {/* ── スキル・専門分野 ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <SectionTitle>スキル・専門分野</SectionTitle>
          <CheckGroup
            label={t.profile.specialties}
            options={SPECIALTIES}
            selected={form.specialties}
            onChange={(v) => set("specialties", v)}
            max={5}
          />
          <CheckGroup
            label={t.profile.tools}
            options={TOOLS.map((x) => x.label)}
            selected={form.tools.map((v) => toolLabels[v] ?? v)}
            onChange={(v) =>
              set("tools", v.map((label) => TOOLS.find((tk) => tk.label === label)?.value ?? label as Tool))
            }
          />
          <TagInput
            label={t.profile.skillTags}
            tags={form.skillTags}
            onChange={(v) => set("skillTags", v)}
            max={15}
            placeholder="TypeScript, Next.js, Python..."
          />
        </div>

        {/* ── SNSリンク ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <SectionTitle>{t.profile.sns}</SectionTitle>
          <Input
            label="GitHub"
            value={form.sns.github ?? ""}
            onChange={(v) => set("sns", { ...form.sns, github: v })}
            placeholder="https://github.com/username"
          />
          <Input
            label="X (Twitter)"
            value={form.sns.twitter ?? ""}
            onChange={(v) => set("sns", { ...form.sns, twitter: v })}
            placeholder="https://x.com/username"
          />
          <Input
            label="Website"
            value={form.sns.website ?? ""}
            onChange={(v) => set("sns", { ...form.sns, website: v })}
            placeholder="https://..."
          />
        </div>

        {/* ── 実績（折りたたみ） ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <button
            type="button"
            onClick={() => setAchievementsOpen((v) => !v)}
            className="w-full flex items-center justify-between group"
          >
            <h2 className="text-base font-semibold text-gray-800 dark:text-white group-hover:text-purple-600 transition-colors">
              実績 <span className="text-xs text-gray-400 font-normal ml-1">任意</span>
            </h2>
            <span className={`text-gray-400 text-sm transition-transform duration-200 ${achievementsOpen ? "rotate-180" : ""}`}>
              {achievementsOpen ? "▲" : "▼ 追加する"}
            </span>
          </button>

          {achievementsOpen && (
            <div className="mt-4">
              <Textarea
                label=""
                value={form.achievements ?? ""}
                onChange={(v) => set("achievements", v)}
                rows={6}
                placeholder={"例:\n- AI系Webサービスを2つ開発・公開\n- note有料記事を執筆（累計売上10万円）\n- OSSコントリビューター（Stars 500+）\n- 〇〇ハッカソン 最優秀賞"}
              />
              <p className="text-xs text-gray-400 mt-1.5">Markdown記法が使えます。職歴・学歴・受賞歴・ポートフォリオを自由に記述できます。</p>
            </div>
          )}
        </div>

        {/* ── 保存ボタン ── */}
        <div className="flex justify-end pb-4">
          <button
            onClick={save}
            disabled={saving}
            className="bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {saving ? "保存中..." : saved ? `✓ ${t.profile.saved}` : t.profile.save}
          </button>
        </div>
      </div>
    </div>
  );
}
