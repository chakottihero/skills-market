"use client";
import { useEffect, useState, useCallback, KeyboardEvent } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import type { UserProfile, Availability, Tool, WorkEntry, EducationEntry, AwardEntry, PortfolioEntry } from "@/types";

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

const AVAIL: { value: Availability; label: string; cls: string }[] = [
  { value: "available", label: "対応可能", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "depends",   label: "内容による", cls: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "busy",      label: "多忙",    cls: "bg-red-100 text-red-700 border-red-300" },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">{children}</h2>;
}

function Input({ label, value, onChange, placeholder, maxLength, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
      />
      {maxLength && (
        <div className="text-right text-xs text-gray-400 mt-0.5">{value.length}/{maxLength}</div>
      )}
    </div>
  );
}

// ── TagInput ─────────────────────────────────────────────────────────────────

function TagInput({ label, tags, onChange, max = 15, placeholder }: {
  label: string; tags: string[]; onChange: (v: string[]) => void; max?: number; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v) && tags.length < max) {
      onChange([...tags, v]);
    }
    setInput("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        disabled={tags.length >= max}
      />
    </div>
  );
}

// ── Checkbox group ────────────────────────────────────────────────────────────

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

// ── Array entry editors ───────────────────────────────────────────────────────

function WorkEditor({ entries, onChange }: { entries: WorkEntry[]; onChange: (v: WorkEntry[]) => void }) {
  const update = (i: number, f: Partial<WorkEntry>) =>
    onChange(entries.map((e, idx) => idx === i ? { ...e, ...f } : e));
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const add = () => onChange([...entries, { company: "", role: "", period: "", description: "" }]);
  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="会社名・組織名" value={e.company} onChange={(ev) => update(i, { company: ev.target.value })}
              className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
            <input placeholder="役職・肩書" value={e.role} onChange={(ev) => update(i, { role: ev.target.value })}
              className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
          </div>
          <input placeholder="期間（例: 2022-2024）" value={e.period} onChange={(ev) => update(i, { period: ev.target.value })}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
          <textarea placeholder="説明" value={e.description} onChange={(ev) => update(i, { description: ev.target.value })}
            rows={2} className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none" />
          <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">削除</button>
        </div>
      ))}
      {entries.length < 5 && (
        <button onClick={add} type="button" className="text-sm text-purple-600 hover:underline">+ 職歴を追加</button>
      )}
    </div>
  );
}

function EduEditor({ entries, onChange }: { entries: EducationEntry[]; onChange: (v: EducationEntry[]) => void }) {
  const update = (i: number, f: Partial<EducationEntry>) =>
    onChange(entries.map((e, idx) => idx === i ? { ...e, ...f } : e));
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const add = () => onChange([...entries, { school: "", major: "", period: "" }]);
  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="学校名" value={e.school} onChange={(ev) => update(i, { school: ev.target.value })}
              className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
            <input placeholder="専攻" value={e.major} onChange={(ev) => update(i, { major: ev.target.value })}
              className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
          </div>
          <input placeholder="期間（例: 2018-2022）" value={e.period} onChange={(ev) => update(i, { period: ev.target.value })}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
          <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">削除</button>
        </div>
      ))}
      {entries.length < 3 && (
        <button onClick={add} type="button" className="text-sm text-purple-600 hover:underline">+ 学歴を追加</button>
      )}
    </div>
  );
}

function AwardEditor({ entries, onChange }: { entries: AwardEntry[]; onChange: (v: AwardEntry[]) => void }) {
  const update = (i: number, f: Partial<AwardEntry>) =>
    onChange(entries.map((e, idx) => idx === i ? { ...e, ...f } : e));
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const add = () => onChange([...entries, { title: "", year: new Date().getFullYear(), description: "" }]);
  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="タイトル" value={e.title} onChange={(ev) => update(i, { title: ev.target.value })}
              className="col-span-2 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
            <input type="number" placeholder="年" value={e.year} onChange={(ev) => update(i, { year: parseInt(ev.target.value) || 0 })}
              className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
          </div>
          <textarea placeholder="説明" value={e.description} onChange={(ev) => update(i, { description: ev.target.value })}
            rows={2} className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none" />
          <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">削除</button>
        </div>
      ))}
      {entries.length < 5 && (
        <button onClick={add} type="button" className="text-sm text-purple-600 hover:underline">+ 受賞歴を追加</button>
      )}
    </div>
  );
}

function PortfolioEditor({ entries, onChange }: { entries: PortfolioEntry[]; onChange: (v: PortfolioEntry[]) => void }) {
  const update = (i: number, f: Partial<PortfolioEntry>) =>
    onChange(entries.map((e, idx) => idx === i ? { ...e, ...f } : e));
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const add = () => onChange([...entries, { url: "", title: "", description: "" }]);
  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <input placeholder="URL（https://...）" value={e.url} onChange={(ev) => update(i, { url: ev.target.value })}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
          <input placeholder="タイトル" value={e.title} onChange={(ev) => update(i, { title: ev.target.value })}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
          <textarea placeholder="説明" value={e.description} onChange={(ev) => update(i, { description: ev.target.value })}
            rows={2} className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none" />
          <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">削除</button>
        </div>
      ))}
      {entries.length < 5 && (
        <button onClick={add} type="button" className="text-sm text-purple-600 hover:underline">+ ポートフォリオを追加</button>
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
    supportedTools: [],
    skills: [],
    experience: { work: [], education: [], awards: [] },
    portfolio: [],
    availability: "available",
    schedule: "",
    sns: { github: "", twitter: "", other: "" },
    createdAt: "",
    updatedAt: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const set = useCallback(<K extends keyof UserProfile>(key: K, val: UserProfile[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  }, []);

  useEffect(() => {
    if (!login) return;
    fetch(`/api/users/${login}`)
      .then((r) => {
        if (r.ok) return r.json();
        // プロフィール未作成なら session から初期値を設定
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
        if (d) { setForm(d.profile as UserProfile); setLoaded(true); }
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

  const toolLabels = Object.fromEntries(TOOLS.map((t) => [t.value, t.label]));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/mypage" className="text-sm text-gray-500 hover:text-gray-700">← {t.mypage.title}</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{t.profile.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {login && (
            <Link href={`/users/${login}`} className="text-sm text-purple-600 hover:underline">
              公開ページ →
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
        {/* 基本情報 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <SectionTitle>基本情報</SectionTitle>

          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            {form.avatar && (
              <Image src={form.avatar} alt="avatar" width={64} height={64} className="rounded-full border" unoptimized />
            )}
            <div className="flex-1">
              <Input label={t.profile.avatar} value={form.avatar} onChange={(v) => set("avatar", v)}
                placeholder="https://avatars.githubusercontent.com/..." />
            </div>
          </div>

          {/* Cover preview */}
          {form.coverImage && (
            <div className="h-24 rounded-lg overflow-hidden bg-gray-100">
              <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
            </div>
          )}
          <Input label={t.profile.coverImage} value={form.coverImage} onChange={(v) => set("coverImage", v)}
            placeholder="https://..." />

          <Input label={t.profile.displayName} value={form.displayName} onChange={(v) => set("displayName", v)}
            placeholder={login} />
          <Input label={t.profile.catchphrase} value={form.catchphrase} onChange={(v) => set("catchphrase", v)}
            placeholder="Claude Code歴1年のフルスタック開発者" maxLength={50} />
          <Textarea label={t.profile.bio} value={form.bio} onChange={(v) => set("bio", v)}
            rows={6} maxLength={1000} placeholder={"## 自己紹介\n\n経歴・得意分野・実績を自由に記述..."} />
        </div>

        {/* スキル・専門 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <SectionTitle>スキル・専門分野</SectionTitle>
          <CheckGroup label={t.profile.specialties} options={SPECIALTIES}
            selected={form.specialties} onChange={(v) => set("specialties", v)} max={5} />
          <CheckGroup label={t.profile.supportedTools}
            options={TOOLS.map((x) => x.label)}
            selected={form.supportedTools.map((v) => toolLabels[v] ?? v)}
            onChange={(v) => set("supportedTools", v.map((label) => TOOLS.find((t) => t.label === label)?.value ?? label as Tool))}
          />
          <TagInput label={t.profile.skills} tags={form.skills} onChange={(v) => set("skills", v)} max={15}
            placeholder="TypeScript, Next.js, Python..." />
        </div>

        {/* 稼働状況 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <SectionTitle>稼働状況・スケジュール</SectionTitle>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.availability}</label>
            <div className="flex gap-3">
              {AVAIL.map((a) => (
                <button key={a.value} type="button"
                  onClick={() => set("availability", a.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.availability === a.value ? a.cls : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <Input label={t.profile.schedule} value={form.schedule} onChange={(v) => set("schedule", v)}
            placeholder="平日18時以降、週末も対応可能" />
        </div>

        {/* 経歴 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <SectionTitle>{t.profile.experience}</SectionTitle>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.profile.work}</h3>
            <WorkEditor entries={form.experience.work}
              onChange={(v) => set("experience", { ...form.experience, work: v })} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.profile.education}</h3>
            <EduEditor entries={form.experience.education}
              onChange={(v) => set("experience", { ...form.experience, education: v })} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.profile.awards}</h3>
            <AwardEditor entries={form.experience.awards}
              onChange={(v) => set("experience", { ...form.experience, awards: v })} />
          </div>
        </div>

        {/* ポートフォリオ */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionTitle>{t.profile.portfolio}</SectionTitle>
          <PortfolioEditor entries={form.portfolio} onChange={(v) => set("portfolio", v)} />
        </div>

        {/* SNS */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionTitle>{t.profile.sns}</SectionTitle>
          <Input label="GitHub" value={form.sns.github} onChange={(v) => set("sns", { ...form.sns, github: v })}
            placeholder="https://github.com/username" />
          <Input label="X (Twitter)" value={form.sns.twitter} onChange={(v) => set("sns", { ...form.sns, twitter: v })}
            placeholder="https://x.com/username" />
          <Input label="その他URL" value={form.sns.other} onChange={(v) => set("sns", { ...form.sns, other: v })}
            placeholder="https://..." />
        </div>

        {/* Save button (bottom) */}
        <div className="flex justify-end">
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
