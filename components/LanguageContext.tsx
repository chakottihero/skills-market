"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, defaultLocale, getTranslations, type Translations } from "@/lib/i18n";

const STORAGE_KEY = "sm-locale";
const VALID_LOCALES: Locale[] = ["ja", "en", "zh"];

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

  // localStorageから復元（クライアントのみ）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale;
      if (saved && VALID_LOCALES.includes(saved)) {
        setLocaleState(saved);
      }
    } catch {}
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
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
