import { useLingui } from "@lingui/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe2, Sparkles } from "lucide-react";

import { Badge } from "@edunesia/ui/components/badge";
import { Button } from "@edunesia/ui/components/button";

import { LearningPreview } from "./learning-preview";
import { PublicNavbar } from "./public-navbar";
import { StartLearningButton } from "./start-learning-button";

export function HomePage() {
  const { i18n } = useLingui();

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_74%_35%,var(--accent),transparent_48%)] opacity-60"
      />

      <PublicNavbar />

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pt-8 pb-14 sm:px-8 sm:pt-10 sm:pb-16 xl:grid-cols-[0.92fr_1.08fr] xl:gap-10 xl:px-12 xl:pt-12 xl:pb-20">
        <div className="mx-auto w-full max-w-2xl xl:mx-0">
          <Badge
            variant="outline"
            className="mb-6 h-8 gap-2 rounded-full border-border/80 bg-background/70 px-3 text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground sm:mb-7"
          >
            <Globe2 className="size-3.5 text-primary" aria-hidden="true" />
            {i18n._("landing.eyebrow")}
          </Badge>

          <h1
            id="home-title"
            className="max-w-[13ch] text-5xl leading-[1.04] font-semibold tracking-[-0.055em] text-foreground sm:text-6xl xl:text-7xl"
          >
            {i18n._("landing.headlineLead")}{" "}
            <span className="mt-2 inline-block rounded-xl bg-primary px-3 py-1 text-primary-foreground">
              {i18n._("landing.headlineEmphasis")}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-8">
            {i18n._("landing.description")}
          </p>

          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center sm:mt-8">
            <StartLearningButton label={i18n._("landing.startLearning")} className="h-12 px-6" />
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 rounded-full px-6 text-sm sm:text-base"
            >
              <a
                href="https://github.com/aulilkez/edunesia"
                target="_blank"
                rel="noreferrer"
                aria-label={`${i18n._("landing.exploreCommunity")} (GitHub, opens in a new tab)`}
              >
                {i18n._("landing.exploreCommunity")}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>

          <div className="mt-7 flex max-w-max items-center gap-3 rounded-2xl border border-border/70 bg-card/70 px-3.5 py-3 shadow-sm sm:mt-8 sm:gap-4 sm:px-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-5 font-semibold tracking-tight text-foreground">
                {i18n._("landing.tagline")}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {i18n._("landing.freeToLearn")} <span aria-hidden="true">·</span>{" "}
                {i18n._("landing.openToContribute")}
              </p>
            </div>
          </div>
          <Link
            to="/learn/sample"
            className="mt-5 inline-flex min-h-11 items-center rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {i18n._("landing.sampleLesson")}
          </Link>
        </div>

        <LearningPreview />
      </section>
    </main>
  );
}
