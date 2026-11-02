import { Link, useSearch } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@edunesia/ui/components/button";

import { courseHref, courses } from "../../services/course-catalog";
import { LearnHeader } from "../shared/learn-header";
import { CourseCard, CourseBrandMark } from "./course-card";

export function LearnExplore() {
  const search = useSearch({ strict: false }) as { query?: string };
  const [query, setQuery] = useState(search.query ?? "");
  const [subject, setSubject] = useState("All subjects");
  const [sort, setSort] = useState("recommended");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const subjectItems = ["All subjects", "Computer science", "Data", "Mathematics", "Productivity"];
  const filtered = useMemo(() => {
    const results = courses.filter(
      (course) =>
        `${course.title} ${course.subject} ${course.description}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (subject === "All subjects" || course.subject === subject),
    );
    if (sort === "title") return [...results].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "duration") return [...results].sort((a, b) => a.minutes - b.minutes);
    return results;
  }, [query, subject, sort]);
  const featuredCourses = [
    "javascript-foundations",
    "mathematics-foundations",
    "sql-foundations",
    "excel-essentials",
    "word-essentials",
    "powerpoint-essentials",
  ].map((slug) => courses.find((course) => course.slug === slug)!);
  const featured = featuredCourses[featuredIndex]!;
  const moveFeatured = (offset: number) => {
    setFeaturedIndex((index) => (index + offset + featuredCourses.length) % featuredCourses.length);
  };
  return (
    <div className="min-h-svh bg-muted/25 text-foreground">
      <LearnHeader />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-7 lg:px-10">
        <div className="border-b py-6 sm:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">LEARNING CATALOG</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Course library</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse open courses and learn at your own pace.
              </p>
            </div>
            <Link
              to="/learn/my-learning"
              className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              Learner preview
            </Link>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border bg-background px-3 focus-within:ring-2 focus-within:ring-[#155eef]/30 sm:max-w-[560px]">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Search published courses</span>
              <input
                id="course-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, skills, or topics"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setQuery("")}>
                  Clear
                </Button>
              )}
            </label>
            <label className="flex h-10 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground sm:w-[210px]">
              <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Sort courses</span>
              <select
                aria-label="Sort courses"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="title">Title</option>
                <option value="duration">Shortest first</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-7 pt-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-9">
          <aside className="min-w-0" aria-label="Course filters">
            <div className="flex items-center justify-between lg:block">
              <h2 className="text-sm font-semibold">Subjects</h2>
              <span className="text-xs text-muted-foreground lg:mt-1 lg:block">
                {courses.length} published courses
              </span>
            </div>
            <nav
              id="subjects"
              aria-label="Filter by subject"
              className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1 lg:overflow-visible"
            >
              {subjectItems.map((item) => {
                const count =
                  item === "All subjects"
                    ? courses.length
                    : courses.filter((course) => course.subject === item).length;
                return (
                  <button
                    key={item}
                    onClick={() => setSubject(item)}
                    aria-pressed={subject === item}
                    className={`flex min-h-10 shrink-0 items-center justify-between gap-3 rounded-md border px-3 text-sm transition-colors lg:border-transparent ${subject === item ? "border-blue-200 bg-blue-50 font-medium text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 lg:border-blue-200 lg:border-l-2 lg:border-l-[#155eef]" : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground lg:bg-transparent"}`}
                  >
                    <span>{item}</span>
                    <span className="text-xs tabular-nums opacity-70">{count}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-6 hidden rounded-lg border bg-background p-4 lg:block">
              <p className="text-sm font-semibold">Learning paths</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                A few ways to begin with the published catalog.
              </p>
              <div className="mt-3 divide-y">
                {[
                  ["Start programming", "javascript-foundations"],
                  ["Work with documents", "word-essentials"],
                  ["Think with models", "mathematics-foundations"],
                ].map(([label, slug]) => (
                  <a
                    key={slug}
                    href={courseHref(slug!)}
                    className="block py-2.5 text-sm hover:text-[#155eef]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            {!query && subject === "All subjects" && (
              <article
                className="overflow-hidden rounded-lg border bg-background"
                aria-live="polite"
              >
                <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
                  <div>
                    <p className="text-xs font-medium text-[#155eef]">START HERE</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                      {featured.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      {featured.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {featured.lessons} {featured.lessons === 1 ? "lesson" : "lessons"}
                      </span>
                      <span>{featured.minutes} min</span>
                      <span>{featured.level}</span>
                      <span className="font-medium text-foreground">Free</span>
                    </div>
                    <a
                      href={courseHref(featured.slug)}
                      className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-[#155eef] px-3.5 text-sm font-medium text-white hover:bg-[#124fce]"
                    >
                      Open course <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="flex min-h-32 items-center justify-center rounded-lg border bg-muted/30 p-5 md:aspect-square">
                    <CourseBrandMark course={featured} large />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-4 py-2.5 sm:px-6">
                  <p className="text-xs text-muted-foreground">
                    Browse programming, math, data, and productivity
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Previous suggested course"
                      onClick={() => moveFeatured(-1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <div
                      className="flex items-center gap-1.5 px-1"
                      aria-label="Choose a suggested course"
                    >
                      {featuredCourses.map((course, index) => (
                        <button
                          key={course.slug}
                          type="button"
                          aria-label={`Show ${course.title}`}
                          aria-current={index === featuredIndex ? "true" : undefined}
                          onClick={() => setFeaturedIndex(index)}
                          className={`h-2 rounded-full transition-[width,background-color] ${index === featuredIndex ? "w-5 bg-[#155eef]" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`}
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Next suggested course"
                      onClick={() => moveFeatured(1)}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
              </article>
            )}

            <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {subject === "All subjects" ? "All courses" : subject}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Published courses from the Edunesia repository.
                </p>
              </div>
              <span className="text-xs text-muted-foreground" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "course" : "courses"}
              </span>
            </div>

            {filtered.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course) => (
                  <CourseCard key={course.slug} course={course} compact />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed bg-background p-8 text-center">
                <p className="font-medium">No published courses match those filters.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try another search or clear the selected subject.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setQuery("");
                    setSubject("All subjects");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}

            <div className="mt-8 rounded-lg border bg-background p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">Browse topics</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select a topic to filter the catalog.
                  </p>
                </div>
                {query && (
                  <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Java",
                  "Go",
                  "Rust",
                  "Python",
                  "HTML",
                  "SQL",
                  "Excel",
                  "Word",
                  "PowerPoint",
                  "Calculus",
                ].map((topic) => (
                  <button
                    key={topic}
                    aria-pressed={query.toLowerCase() === topic.toLowerCase()}
                    className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${query.toLowerCase() === topic.toLowerCase() ? "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    onClick={() => setQuery(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
