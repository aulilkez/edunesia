import { setupI18n, type I18n, type Messages } from "@lingui/core";
import { defaultLocale, type Locale } from "./config";
import { messages as idMessages } from "./locales/id-ID";
import { messages as enMessages } from "./locales/en-US";
import { messages as jaMessages } from "./locales/ja-JP";

export * from "./config";

export const catalogs = {
  "id-ID": idMessages,
  "en-US": enMessages,
  "ja-JP": jaMessages,
} satisfies Record<Locale, Messages>;

export function createI18n(locale: Locale = defaultLocale): I18n {
  const i18n = setupI18n({ locale, messages: { [locale]: catalogs[locale] } });
  i18n.activate(locale);
  return i18n;
}

export function activateLocale(i18n: I18n, locale: Locale): void {
  i18n.load(locale, catalogs[locale]);
  i18n.activate(locale);
}
