"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getLocaleMeta,
  LOCALES,
  t as translate,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n/dictionaries";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "spc-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const fromDom = document.documentElement.lang;
    const isValid = (code: string | null): code is Locale =>
      !!code && LOCALES.some((l) => l.code === code);
    const next: Locale = isValid(stored)
      ? stored
      : isValid(fromDom)
        ? fromDom
        : "en";
    setLocaleState(next);
    const meta = getLocaleMeta(next);
    document.documentElement.lang = next;
    document.documentElement.dir = meta.dir;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    const meta = getLocaleMeta(next);
    document.documentElement.lang = next;
    document.documentElement.dir = meta.dir;
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translate(locale, key),
    [locale]
  );

  const dir = getLocaleMeta(locale).dir;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
