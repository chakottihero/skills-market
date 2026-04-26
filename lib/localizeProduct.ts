import type { Product } from "@/types";
import type { Locale } from "@/lib/i18n";

export function localTitle(p: Product, locale: Locale): string {
  if (locale === "en" && p.title_en) return p.title_en;
  if (locale === "zh" && p.title_zh) return p.title_zh;
  return p.title;
}

export function localShortDescription(p: Product, locale: Locale): string {
  if (locale === "en" && p.shortDescription_en) return p.shortDescription_en;
  if (locale === "zh" && p.shortDescription_zh) return p.shortDescription_zh;
  return p.shortDescription;
}

export function localDescription(p: Product, locale: Locale): string {
  if (locale === "en" && p.description_en) return p.description_en;
  if (locale === "zh" && p.description_zh) return p.description_zh;
  return p.description;
}
