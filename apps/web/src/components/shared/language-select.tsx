import { useLingui } from "@lingui/react";
import { useId } from "react";

import { localeDisplayNames, locales, type Locale } from "@edunesia/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@edunesia/ui/components/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@edunesia/ui/components/tooltip";

import { setLocalePreference } from "../../i18n/locale-preferences";

const languageOptions: { value: Locale; label: string; flag: string }[] = [
  { value: "en-US", label: localeDisplayNames["en-US"].nativeLabel, flag: "🇺🇸" },
  { value: "id-ID", label: localeDisplayNames["id-ID"].nativeLabel, flag: "🇮🇩" },
  { value: "ja-JP", label: localeDisplayNames["ja-JP"].nativeLabel, flag: "🇯🇵" },
];

type LanguageSelectProps = {
  label?: string;
  ariaLabel?: string;
  triggerClassName?: string;
  flagOnly?: boolean;
};

export function LanguageSelect({
  label,
  ariaLabel,
  triggerClassName,
  flagOnly = false,
}: LanguageSelectProps) {
  const { i18n } = useLingui();
  const labelId = useId();
  const selectedLanguage = languageOptions.find((option) => option.value === i18n.locale);

  function changeLocale(value: string) {
    const locale = locales.find((candidate) => candidate === value);
    if (!locale) return;
    setLocalePreference(i18n, locale);
  }

  return (
    <div className={label ? "grid gap-1.5" : undefined}>
      {label ? (
        <span id={labelId} className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      ) : null}
      <Select value={i18n.locale} onValueChange={changeLocale}>
        {flagOnly ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger
                className="size-11 rounded-full border-0 bg-transparent p-0 shadow-none hover:bg-muted/70 focus-visible:ring-2 [&>svg]:hidden dark:bg-transparent"
                aria-label={`${ariaLabel ?? i18n._("landing.language")}: ${selectedLanguage?.label ?? i18n.locale}`}
              >
                <SelectValue>
                  <span
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-xl leading-none shadow-sm"
                  >
                    {selectedLanguage?.flag ?? "🌐"}
                  </span>
                </SelectValue>
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {selectedLanguage?.label} · {i18n._("landing.selected")}
            </TooltipContent>
          </Tooltip>
        ) : (
          <SelectTrigger
            className={triggerClassName}
            aria-label={label ? undefined : (ariaLabel ?? "Language")}
            aria-labelledby={label ? labelId : undefined}
          >
            <SelectValue>{selectedLanguage?.label ?? i18n.locale}</SelectValue>
          </SelectTrigger>
        )}
        <SelectContent>
          {languageOptions.map(({ value, label: optionLabel, flag }) => (
            <SelectItem key={value} value={value} className="min-h-11">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-full border border-border bg-background text-base leading-none"
                >
                  {flag}
                </span>
                <span>{optionLabel}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
