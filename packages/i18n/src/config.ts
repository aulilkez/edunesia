export const locales = ["id-ID", "en-US", "ja-JP"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en-US";

export const localeToPathSegment: Record<Locale, string> = {
  "id-ID": "id",
  "en-US": "en",
  "ja-JP": "ja",
};

export const pathSegmentToLocale: Record<string, Locale> = {
  id: "id-ID",
  en: "en-US",
  ja: "ja-JP",
};

export const localeDisplayNames: Record<Locale, { label: string; nativeLabel: string }> = {
  "id-ID": { label: "Indonesian", nativeLabel: "Bahasa Indonesia" },
  "en-US": { label: "English", nativeLabel: "English" },
  "ja-JP": { label: "Japanese", nativeLabel: "日本語" },
};
