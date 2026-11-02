import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
} from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { createElement, useState } from "react";

import { mdxComponents } from "@edunesia/content/components";
import { Badge } from "@edunesia/ui/components/badge";
import { Button } from "@edunesia/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@edunesia/ui/components/dialog";
import { Progress } from "@edunesia/ui/components/progress";
import { Separator } from "@edunesia/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@edunesia/ui/components/sheet";

import { getCourse, getLessonContent, courseHref, lessonHref } from "../../services/course-catalog";
import { CourseCurriculum } from "../curriculum/course-curriculum";
import { Quiz, ReflectionExercise } from "../quiz/lesson-quiz";
import { LearnHeader } from "../shared/learn-header";

export function PublicLesson({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
}) {
  const course = getCourse(courseSlug);
  const lesson =
    course.modules.flatMap((m) => m.lessons).find((item) => item.slug === lessonSlug) ??
    course.modules[0]!.lessons[0]!;
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [askSignIn, setAskSignIn] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [curriculumCollapsed, setCurriculumCollapsed] = useState(false);
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lessonIndex = allLessons.findIndex((item) => item.slug === lesson.slug);
  const prev = allLessons[lessonIndex - 1];
  const next = allLessons[lessonIndex + 1];
  const lessonComponents: MDXComponents = {
    ...mdxComponents,
    h1: () => null,
    h2: ({ children, ...props }) => {
      const id = String(children)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    },
  };
  return (
    <div className="min-h-svh bg-background text-foreground">
      <LearnHeader />
      <div className="border-b">
        <div className="mx-auto flex max-w-[1120px] items-center gap-2 overflow-hidden px-4 py-3 text-xs text-muted-foreground sm:px-7">
          <Link to="/learn" className="shrink-0 hover:text-foreground">
            Learn
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <a href={courseHref(course.slug)} className="truncate hover:text-foreground">
            {course.title}
          </a>
          <ChevronRight className="size-3 shrink-0" />
          <span className="truncate text-foreground">{lesson.title}</span>
        </div>
      </div>
      <main
        className={`mx-auto grid max-w-[1240px] gap-8 px-4 py-7 sm:px-7 ${curriculumCollapsed ? "lg:grid-cols-[44px_minmax(0,740px)_180px]" : "lg:grid-cols-[210px_minmax(0,740px)_180px]"} lg:gap-9 lg:py-10`}
      >
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between gap-2">
              {!curriculumCollapsed && (
                <a
                  href={courseHref(course.slug)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" /> Course overview
                </a>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={
                  curriculumCollapsed ? "Expand course curriculum" : "Collapse course curriculum"
                }
                onClick={() => setCurriculumCollapsed(!curriculumCollapsed)}
              >
                {curriculumCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              </Button>
            </div>
            {!curriculumCollapsed && (
              <>
                <h2 className="mt-5 text-sm font-semibold">Course curriculum</h2>
                <div className="mt-2">
                  <CourseCurriculum course={course} current={lesson.slug} />
                </div>
                <div className="mt-5 border-t pt-4">
                  <p className="text-xs text-muted-foreground">Reading progress</p>
                  <Progress
                    value={done ? 100 : 32}
                    className="mt-2 h-1.5"
                    aria-label="Reading progress"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {done ? "Lesson complete" : "In this lesson"}
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="rounded-sm">
              {course.subject}
            </Badge>
            <span>
              {
                course.modules.find((m) => m.lessons.some((item) => item.slug === lesson.slug))
                  ?.name
              }
            </span>
            <span>·</span>
            <span>{lesson.minutes} min read</span>
          </div>
          <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-4xl">
            {lesson.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b pb-5">
            <p className="text-sm text-muted-foreground">{course.title}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSaved(!saved);
                  setAskSignIn(true);
                }}
                aria-pressed={saved}
              >
                {saved ? <BookmarkCheck /> : <Bookmark />}
                {saved ? "Bookmarked" : "Bookmark"}
              </Button>
              <Sheet open={tocOpen} onOpenChange={setTocOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Menu /> Contents
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Course contents</SheetTitle>
                    <SheetDescription>{course.title}</SheetDescription>
                  </SheetHeader>
                  <div className="px-4">
                    <CourseCurriculum course={course} current={lesson.slug} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {getLessonContent(lesson.slug) ? (
            <div
              id="lesson-reading"
              className="learning-prose mt-7 min-w-0 scroll-mt-24 text-[1.025rem] leading-8 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-5 [&_a]:text-[#155eef] [&_a]:underline [&_a]:underline-offset-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground [&_hr]:my-8 [&_hr]:border-border"
            >
              {createElement(getLessonContent(lesson.slug)!, { components: lessonComponents })}
            </div>
          ) : (
            <div
              id="lesson-reading"
              className="learning-prose mt-7 min-w-0 scroll-mt-24 text-[1.025rem] leading-8"
            >
              <p>
                This lesson introduces {lesson.title.toLowerCase()} with examples and short practice
                activities.
              </p>
              <h2 id="start-with-a-small-example">Start with a small example</h2>
              <p>
                Work through each idea one at a time. Change one value, observe the result, and
                explain what changed in your own words.
              </p>
              <pre>
                <code>
                  {course.slug.startsWith("javascript")
                    ? 'const subject = "JavaScript";\nconsole.log(subject);'
                    : "f(x) = x²\nf′(x) = 2x"}
                </code>
              </pre>
              <p>Continue to the next lesson when you are ready.</p>
            </div>
          )}
          <section
            id="check-your-understanding"
            className="mt-10 scroll-mt-24 rounded-lg border bg-muted/25 p-4 sm:p-5"
          >
            <div className="flex items-center gap-2">
              <Target className="size-4 text-[#155eef]" />
              <h2 className="text-sm font-semibold">Check your understanding</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Which statement best describes the main idea in this lesson?
            </p>
            <Quiz programming={course.slug.startsWith("javascript")} />
          </section>
          <ReflectionExercise lessonTitle={lesson.title} />
          <section className="mt-6 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Ready to mark this lesson complete?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Completion is stored only in this page preview.
              </p>
            </div>
            <Button
              onClick={() => setDone(!done)}
              className={
                done
                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                  : "bg-[#155eef] text-white hover:bg-[#124fce]"
              }
            >
              {done ? <CheckCircle2 /> : <Check />}
              {done ? "Completed in preview" : "Mark as complete"}
            </Button>
          </section>
          <nav aria-label="Lesson navigation" className="mt-7 grid grid-cols-2 gap-3 border-t pt-5">
            <div>
              {prev && (
                <a
                  href={lessonHref(course, prev.slug)}
                  className="block rounded-md border p-3 hover:bg-muted"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ChevronLeft className="size-3" /> Previous lesson
                  </span>
                  <span className="mt-1 block text-sm font-medium">{prev.title}</span>
                </a>
              )}
            </div>
            <div>
              {next && (
                <a
                  href={lessonHref(course, next.slug)}
                  className="block rounded-md border p-3 text-right hover:bg-muted"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    Next lesson <ChevronRight className="size-3" />
                  </span>
                  <span className="mt-1 block text-sm font-medium">{next.title}</span>
                </a>
              )}
            </div>
          </nav>
          <div className="mt-5 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-950 dark:bg-blue-950/30 dark:text-blue-100">
            <p className="font-medium">Keep your place across devices</p>
            <p className="mt-1 text-xs leading-5 opacity-80">
              Authentication is not connected in this prototype. Public lessons remain open to read.
            </p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => setAskSignIn(true)}>
              Sign in options
            </Button>
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="text-xs font-semibold">On this page</h2>
            <nav
              aria-label="On this page"
              className="mt-3 grid gap-2 border-l pl-3 text-xs text-muted-foreground"
            >
              {(lesson.slug === "mathematical-models"
                ? [
                    ["Accumulated change", "accumulated-change"],
                    ["Limits and derivatives", "limits-and-derivatives"],
                    ["Matrices and vectors", "matrices-and-vectors"],
                    ["A piecewise model", "a-piecewise-model"],
                    ["Follow a process", "follow-a-process"],
                    ["Try the computation", "try-the-computation"],
                  ]
                : [
                    ["Lesson content", "lesson-reading"],
                    ["Check understanding", "check-your-understanding"],
                  ]
              ).map(([label, id]) => (
                <a key={id} href={`#${id}`} className="hover:text-foreground">
                  {label}
                </a>
              ))}
            </nav>
            <Separator className="my-5" />
            <p className="text-xs font-semibold">Learning tools</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              AI assistant placeholder. A learning assistant is not connected.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setAskSignIn(true)}
            >
              Save a note
            </Button>
          </div>
        </aside>
      </main>
      <Dialog open={askSignIn} onOpenChange={setAskSignIn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Learning tools need an account</DialogTitle>
            <DialogDescription>
              Sign-in and synced bookmarks are not connected yet. You can continue reading this
              public lesson without signing in.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setAskSignIn(false)}>Continue reading</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
