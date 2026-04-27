import type { UserProfile } from "@/types";

export function calcCompletion(p: UserProfile): number {
  const checks = [
    !!p.displayName,
    !!p.catchphrase,
    !!p.bio,
    !!p.coverImage,
    !!p.avatar,
    p.specialties.length > 0,
    p.tools.length > 0,
    p.skillTags.length > 0,
    p.career.work.length > 0,
    p.career.education.length > 0,
    p.portfolio.length > 0,
    !!p.schedule,
    !!p.sns.twitter,
    !!p.sns.website,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
