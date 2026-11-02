import { useLingui } from "@lingui/react";
import { ArrowUpRight, BookOpenText } from "lucide-react";

import { LanguageSelect } from "../../../components/shared/language-select";
import { ThemeSwitch } from "../../../components/shared/theme-switch";
import { StartLearningButton } from "./start-learning-button";

export function PublicNavbar() {
  const { i18n } = useLingui();
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-4 sm:px-8 lg:px-12 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center justify-between gap-3 xl:shrink-0">
        <a href="#home-title" className="group inline-flex min-h-11 items-center gap-3 rounded-lg">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:-rotate-3">
            <BookOpenText className="size-5" aria-hidden="true" />
          </span>
          <span className="text-base leading-tight font-semibold tracking-tight">Edunesia</span>
        </a>
        <StartLearningButton label={i18n._("landing.startLearning")} className="xl:hidden" />
      </div>

      <div className="flex items-center justify-between gap-2 xl:flex-1 xl:justify-end">
        <nav
          aria-label={i18n._("landing.nav.explore")}
          className="hidden items-center gap-1 min-[500px]:flex xl:mr-auto xl:ml-10"
        >
          <a
            href="#learning-preview"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {i18n._("landing.nav.explore")}
          </a>
          <a
            href="https://github.com/aulilkez/edunesia"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {i18n._("landing.nav.community")}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <LanguageSelect ariaLabel={i18n._("landing.language")} flagOnly />
          <ThemeSwitch />
          <StartLearningButton
            label={i18n._("landing.startLearning")}
            className="hidden xl:inline-flex"
          />
        </div>
      </div>
    </header>
  );
}
