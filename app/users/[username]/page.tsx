"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/components/LanguageContext";
import ProductCard from "@/components/ProductCard";
import { toolColors } from "@/lib/toolColors";
import type { Product, UserProfile, Availability } from "@/types";

const AVAILABILITY_STYLE: Record<Availability, { label: string; cls: string }> = {
  available: { label: "対応可能", cls: "bg-emerald-100 text-emerald-700" },
  depends:   { label: "内容による", cls: "bg-amber-100 text-amber-700" },
  busy:      { label: "多忙", cls: "bg-red-100 text-red-700" },
};

const TOOL_LABELS: Record<string, string> = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  copilot: "GitHub Copilot",
  codex: "Codex",
  windsurf: "Windsurf",
  other: "Other",
};

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${username}`).then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      }),
      fetch(`/api/products?author=${username}`).then((r) => r.json()),
    ])
      .then(([ud, pd]) => {
        setProfile(ud.profile as UserProfile);
        setListings((pd.products as Product[]).filter((p) => p.author.login === username));
        setLoading(false);
      })
      .catch(() => router.push("/skills"));
  }, [username, router]);

  if (loading) return <div className="text-center py-20 text-gray-400">{t.common.loading}</div>;
  if (!profile) return null;

  const avail = AVAILABILITY_STYLE[profile.availability];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Cover image */}
      {profile.coverImage && (
        <div className="w-full h-48 rounded-2xl overflow-hidden mb-0 -mb-16 relative">
          <Image
            src={profile.coverImage}
            alt="cover"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Avatar + name row */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-end gap-4 ${profile.coverImage ? "mt-20" : "mt-0"} mb-6`}>
        {profile.avatar && (
          <div className={`flex-shrink-0 ${profile.coverImage ? "border-4 border-white rounded-full shadow-md" : ""}`}>
            <Image
              src={profile.avatar}
              alt={profile.displayName || profile.username}
              width={88}
              height={88}
              className="rounded-full"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.displayName || profile.username}
            </h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${avail.cls}`}>
              {avail.label}
            </span>
          </div>
          {profile.catchphrase && (
            <p className="text-gray-500 text-sm">{profile.catchphrase}</p>
          )}
        </div>
        {/* SNS links */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {profile.sns.github && (
            <a href={profile.sns.github} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
          {profile.sns.twitter && (
            <a href={profile.sns.twitter} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-sky-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {profile.sns.other && (
            <a href={profile.sns.other} target="_blank" rel="noopener noreferrer"
              className="text-xs text-purple-600 hover:underline border border-purple-200 px-2 py-1 rounded-lg">
              Web
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio */}
          {profile.bio && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">自己紹介</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown>{profile.bio}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Work history */}
          {profile.experience.work.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.profile.work}</h2>
              <div className="space-y-4">
                {profile.experience.work.map((w, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-400" />
                    <div>
                      <div className="font-semibold text-gray-900">{w.role}</div>
                      <div className="text-sm text-gray-500">{w.company} · {w.period}</div>
                      {w.description && <p className="text-sm text-gray-600 mt-1">{w.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.experience.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.profile.education}</h2>
              <div className="space-y-3">
                {profile.experience.education.map((e, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                    <div>
                      <div className="font-semibold text-gray-900">{e.school}</div>
                      <div className="text-sm text-gray-500">{e.major} · {e.period}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {profile.experience.awards.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.profile.awards}</h2>
              <div className="space-y-3">
                {profile.experience.awards.map((a, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-amber-400" />
                    <div>
                      <div className="font-semibold text-gray-900">{a.title}
                        <span className="ml-2 text-xs text-gray-400 font-normal">{a.year}</span>
                      </div>
                      {a.description && <p className="text-sm text-gray-600 mt-0.5">{a.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {profile.portfolio.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.profile.portfolio}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.portfolio.map((p, i) => (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="font-semibold text-gray-900 mb-1 line-clamp-1">{p.title}</div>
                    {p.description && <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>}
                    <div className="text-xs text-purple-500 mt-2 truncate">{p.url}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Listings */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{t.publicProfile.sellerSkills}</h2>
            {listings.length === 0 ? (
              <div className="text-center text-gray-400 py-10 border border-dashed border-gray-200 rounded-xl">
                {t.publicProfile.noSkills}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Availability + schedule */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">{t.profile.availability}</div>
            <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${avail.cls}`}>
              {avail.label}
            </span>
            {profile.schedule && (
              <p className="text-sm text-gray-600 mt-3">{profile.schedule}</p>
            )}
          </div>

          {/* Specialties */}
          {profile.specialties.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-2">{t.profile.specialties}</div>
              <div className="flex flex-wrap gap-1.5">
                {profile.specialties.map((s) => (
                  <span key={s} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Supported tools */}
          {profile.supportedTools.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-2">{t.profile.supportedTools}</div>
              <div className="flex flex-wrap gap-1.5">
                {profile.supportedTools.map((tool) => {
                  const tc = toolColors[tool as keyof typeof toolColors] ?? toolColors.other;
                  return (
                    <span
                      key={tool}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: tc.bg, color: tc.text }}
                    >
                      {TOOL_LABELS[tool] ?? tool}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Skills / tags */}
          {profile.skills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-2">{t.profile.skills}</div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => (
                  <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    #{s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <Link href="/skills" className="block text-center text-sm text-gray-500 hover:text-gray-700 pt-2">
            ← {t.common.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
