import { useLanguage } from "./LanguageContext";

/**
 * Returns a `t(key)` translation function bound to the active language.
 * Falls back to English, then to the raw key when a string is missing.
 */
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
