"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, defaultLocale, getTranslations, type Translations } from "@/lib/i18n";

const STORAGE_KEY = "sm-locale";
const VALID_LOCALES: Locale[] = ["ja", "en", "zh"];

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale;
    if (saved && VALID_LOCALES.includes(saved)) return saved;
    // navigator.language から自動判定
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith("zh")) return "zh";
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("en")) return "en";
  } catch {}
  return defaultLocale;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: getTranslations(defaultLocale),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: getTranslations(locale) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
