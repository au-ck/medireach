import en from "./en.json";
import hi from "./hi.json";
import te from "./te.json";

export type LanguageCode = "en" | "te" | "hi";

export type TranslationDictionary = typeof en;

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en,
  te,
  hi,
};

export const LANGUAGE_STORAGE_KEY = "medireach.language";

export const languageNames: Record<LanguageCode, string> = {
  en: "English",
  te: "తెలుగు",
  hi: "हिंदी",
};

export const languageLabels: Record<LanguageCode, string> = {
  en: "EN",
  te: "తెలుగు",
  hi: "हिंदी",
};

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const SUPPORTED_LANGUAGES: LanguageCode[] = ["en", "te", "hi"];

export function isLanguageCode(value: string | null): value is LanguageCode {
  return value !== null && SUPPORTED_LANGUAGES.includes(value as LanguageCode);
}

export function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isLanguageCode(stored)) return stored;
  return DEFAULT_LANGUAGE;
}
