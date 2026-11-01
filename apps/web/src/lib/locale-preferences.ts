import { activateLocale, createI18n, defaultLocale, locales, type Locale } from "@edunesia/i18n";

type I18nInstance = ReturnType<typeof createI18n>;

const localeStorageKey = "edunesia-app-locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  try {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    return locales.find((locale) => locale === storedLocale) ?? defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export function setLocalePreference(i18n: I18nInstance, locale: Locale): void {
  activateLocale(i18n, locale);

  if (typeof document !== "undefined") document.documentElement.lang = locale;

  try {
    if (typeof window !== "undefined") window.localStorage.setItem(localeStorageKey, locale);
  } catch {
    // Locale switching still works when browser storage is unavailable.
  }
}

export function restoreLocalePreference(i18n: I18nInstance): void {
  const locale = getStoredLocale();
  if (i18n.locale !== locale) activateLocale(i18n, locale);
  if (typeof document !== "undefined") document.documentElement.lang = locale;
}
