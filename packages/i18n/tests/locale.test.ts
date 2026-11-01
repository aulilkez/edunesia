import { expect, test } from "vite-plus/test";
import { activateLocale, createI18n, defaultLocale, locales } from "../src";

test("i18n instances load localized catalogs independently", () => {
  const first = createI18n();
  const second = createI18n();
  expect(defaultLocale).toBe("en-US");
  expect(first.locale).toBe(defaultLocale);
  expect(first._("app.title")).toBe("Admin Data Intelligence");
  activateLocale(first, "en-US");
  expect(first.locale).toBe("en-US");
  expect(second.locale).toBe(defaultLocale);
  expect(locales).toEqual(["id-ID", "en-US", "ja-JP"]);
});
