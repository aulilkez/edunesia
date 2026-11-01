import { useId } from "react";
import { useLingui } from "@lingui/react";
import { activateLocale, locales, type Locale } from "@edunesia/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@edunesia/ui/components/select";

const languageOptions: { value: Locale; label: string }[] = [
  { value: "en-US", label: "🇺🇸 English" },
  { value: "id-ID", label: "🇮🇩 Indonesian" },
  { value: "ja-JP", label: "🇯🇵 日本語" },
];

type LanguageSelectProps = {
  label?: string;
  ariaLabel?: string;
  triggerClassName?: string;
};

export function LanguageSelect({ label, ariaLabel, triggerClassName }: LanguageSelectProps) {
  const { i18n } = useLingui();
  const labelId = useId();

  function changeLocale(value: string) {
    const locale = locales.find((candidate) => candidate === value);
    if (!locale) return;
    activateLocale(i18n, locale);
    document.documentElement.lang = locale;
  }

  return (
    <div className={label ? "grid gap-1.5" : undefined}>
      {label ? (
        <span id={labelId} className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      ) : null}
      <Select value={i18n.locale} onValueChange={changeLocale}>
        <SelectTrigger
          className={triggerClassName}
          aria-label={label ? undefined : (ariaLabel ?? "Language")}
          aria-labelledby={label ? labelId : undefined}
        >
          <SelectValue>
            {languageOptions.find((option) => option.value === i18n.locale)?.label ?? i18n.locale}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="min-h-11">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
