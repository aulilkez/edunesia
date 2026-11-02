import { useLingui } from "@lingui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpenText,
  FlaskConical,
  Globe2,
  Palette,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Badge } from "@edunesia/ui/components/badge";
import { Button } from "@edunesia/ui/components/button";
import { Card } from "@edunesia/ui/components/card";
import { Progress } from "@edunesia/ui/components/progress";

import { LanguageSelect } from "../components/language-select";
import { ThemeSwitch } from "../components/theme-switch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Edunesia — Open Knowledge. Unlimited Possibilities." },
      {
        name: "description",
        content:
          "Discover, learn, and share knowledge across every discipline with a global learning ecosystem built by the community.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { i18n } = useLingui();

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_74%_35%,var(--accent),transparent_48%)] opacity-60"
      />

      <header className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-4 sm:px-8 lg:px-12 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-3 xl:shrink-0">
          <a
            href="#home-title"
            className="group inline-flex min-h-11 items-center gap-3 rounded-lg"
          >
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

function StartLearningButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <Button asChild size="lg" className={`h-11 rounded-full px-4 text-sm sm:px-5 ${className}`}>
      <Link to="/learn">
        {label}
        <ArrowRight aria-hidden="true" />
      </Link>
    </Button>
  );
}

function LearningPreview() {
  const { i18n } = useLingui();
  const courses = [
    {
      title: i18n._("landing.preview.courseClimate"),
      category: i18n._("landing.preview.categoryScience"),
      lessons: i18n._("landing.preview.lessonsEight"),
      icon: FlaskConical,
    },
    {
      title: i18n._("landing.preview.courseDesign"),
      category: i18n._("landing.preview.categoryDesign"),
      lessons: i18n._("landing.preview.lessonsSix"),
      icon: Palette,
    },
  ];

  return (
    <figure id="learning-preview" className="relative mx-auto w-full max-w-2xl scroll-mt-8">
      <div
        aria-hidden="true"
        className="absolute -top-5 right-6 size-24 rounded-full border border-border/70 bg-accent/70 sm:-right-4 sm:size-32"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-5 -left-4 size-28 rounded-full bg-secondary/80 blur-2xl sm:size-40"
      />

      <Card className="relative gap-0 rounded-2xl border-border/80 bg-card shadow-2xl shadow-foreground/10">
        <div className="flex h-11 items-center border-b border-border/70 px-3 sm:px-4">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-destructive" />
            <span className="size-2.5 rounded-full bg-muted-foreground/35" />
            <span className="size-2.5 rounded-full bg-primary/65" />
          </div>
          <p className="mx-auto truncate px-3 text-xs font-medium text-muted-foreground">
            {i18n._("landing.preview.windowTitle")}
          </p>
          <Badge
            variant="secondary"
            className="hidden h-6 rounded-full px-2 text-[0.65rem] sm:inline-flex"
          >
            {i18n._("landing.preview.sampleData")}
          </Badge>
          <span className="size-7 sm:hidden" aria-hidden="true" />
        </div>

        <div className="min-w-0 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg leading-tight font-semibold tracking-tight sm:text-xl">
                {i18n._("landing.preview.welcome")}
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {i18n._("landing.preview.subtitle")}
              </p>
            </div>
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground"
              aria-hidden="true"
            >
              <UserRound className="size-4" />
            </span>
          </div>

          <div
            aria-hidden="true"
            className="mt-3 flex h-8 items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-xs text-muted-foreground"
          >
            <Search className="size-3.5" />
            <span>{i18n._("landing.preview.search")}</span>
          </div>

          <Card className="mt-3 gap-3 rounded-xl border-border/70 bg-background p-3 shadow-none sm:p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold">{i18n._("landing.preview.continueTitle")}</p>
              <span className="text-[0.62rem] text-muted-foreground">
                {i18n._("landing.preview.progressLabel")}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Atom className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge variant="outline" className="mb-1 h-5 rounded-full px-1.5 text-[0.6rem]">
                  {i18n._("landing.preview.categoryComputerScience")}
                </Badge>
                <h3 className="text-xs leading-4 font-semibold sm:text-sm">
                  {i18n._("landing.preview.courseComputerScience")}
                </h3>
                <p className="mt-1 text-[0.65rem] text-muted-foreground">
                  {i18n._("landing.preview.lessonCount")}
                </p>
              </div>
            </div>
            <Progress
              value={35}
              aria-label={i18n._("landing.preview.progressLabel")}
              className="h-1.5"
            />
            <Button
              type="button"
              size="sm"
              disabled
              aria-label={i18n._("landing.preview.continueUnavailable")}
              className="h-8 w-full rounded-lg text-xs"
            >
              {i18n._("landing.preview.continueButton")}
            </Button>
          </Card>

          <div className="mt-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold tracking-tight">
              {i18n._("landing.preview.exploreTitle")}
            </h3>
            <span className="text-[0.65rem] text-muted-foreground">
              {i18n._("landing.preview.sampleData")}
            </span>
          </div>

          <div className="mt-2 grid gap-2 min-[560px]:grid-cols-2">
            {courses.map(({ title, category, lessons, icon: Icon }) => (
              <Card
                key={title}
                className="gap-2 rounded-xl border-border/70 bg-background p-2.5 shadow-none"
              >
                <div className="flex items-start gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <h4 className="min-w-0 text-xs leading-4 font-semibold">{title}</h4>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-[0.62rem] text-muted-foreground">
                  <Badge variant="secondary" className="h-5 rounded-full px-1.5 text-[0.6rem]">
                    {category}
                  </Badge>
                  <span>{lessons}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Card className="gap-2 rounded-xl border-border/70 bg-muted/30 p-2.5 shadow-none">
              <p className="text-[0.65rem] text-muted-foreground">
                {i18n._("landing.preview.progressTitle")}
              </p>
              <Progress value={45} aria-label={i18n._("landing.preview.sampleMetric")} />
              <p className="text-[0.62rem] font-medium">{i18n._("landing.preview.sampleMetric")}</p>
            </Card>
            <Card className="gap-2 rounded-xl border-border/70 bg-muted/30 p-2.5 shadow-none">
              <p className="text-[0.65rem] text-muted-foreground">
                {i18n._("landing.preview.completedLessons")}
              </p>
              <p className="text-sm font-semibold tabular-nums">
                18 <span className="text-[0.62rem] font-normal text-muted-foreground">/ 40</span>
              </p>
              <p className="text-[0.62rem] text-muted-foreground">
                {i18n._("landing.preview.coursesInProgress")}: 2
              </p>
            </Card>
          </div>
        </div>
      </Card>

      <figcaption className="sr-only">{i18n._("landing.preview.description")}</figcaption>
    </figure>
  );
}
