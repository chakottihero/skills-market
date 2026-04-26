import type { UserProfile } from "@/types";

export function calcCompletion(p: UserProfile): number {
  const checks = [
    !!p.displayName,
    !!p.catchphrase,
    !!p.bio,
    !!p.coverImage,
    !!p.avatar,
    p.specialties.length > 0,
    p.supportedTools.length > 0,
    p.skills.length > 0,
    p.experience.work.length > 0,
    p.experience.education.length > 0,
    p.portfolio.length > 0,
    !!p.schedule,
    !!p.sns.twitter,
    !!p.sns.other,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
