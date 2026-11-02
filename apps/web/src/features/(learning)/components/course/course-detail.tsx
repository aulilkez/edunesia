import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Clock3,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@edunesia/ui/components/badge";
import { Button } from "@edunesia/ui/components/button";
import { Card } from "@edunesia/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@edunesia/ui/components/dialog";

import { getCourse, lessonHref } from "../../services/course-catalog";
import { CourseCurriculum } from "../curriculum/course-curriculum";
import { LearnHeader } from "../shared/learn-header";

export function CourseDetail({ slug }: { slug: string }) {
  const course = getCourse(slug);
  const [enrolled, setEnrolled] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const first = course.modules[0]!.lessons[0]!;
  return (
    <div className="min-h-svh bg-background text-foreground">
      <LearnHeader />
      <main className="mx-auto max-w-[1160px] px-4 pb-20 sm:px-7 lg:px-10">
        <nav aria-label="Breadcrumb" className="py-5 text-sm text-muted-foreground">
          <Link to="/learn" className="hover:text-foreground">
            Learn
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page" className="text-foreground">
            {course.title}
          </span>
        </nav>
        <section className="grid gap-8 border-b pb-9 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <Badge variant="secondary" className="rounded-sm">
              {course.subject}
            </Badge>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              {course.description}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              Contributed by{" "}
              <span className="font-medium text-foreground">{course.contributor}</span>
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="sr-only">Difficulty</dt>
                <dd className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  {course.level}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Lessons</dt>
                <dd className="flex items-center gap-2">
                  <BookOpen className="size-4 text-muted-foreground" />
                  {course.lessons} lessons
                </dd>
              </div>
              <div>
                <dt className="sr-only">Duration</dt>
                <dd className="flex items-center gap-2">
                  <Clock3 className="size-4 text-muted-foreground" />
                  About {course.minutes} minutes
                </dd>
              </div>
              <div>
                <dd className="font-semibold">Free</dd>
              </div>
            </dl>
          </div>
          <div
            className={`relative flex aspect-[1.5] items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br ${course.tone === "blue" ? "from-blue-100 via-slate-100 to-zinc-200 dark:from-blue-950 dark:to-zinc-900" : "from-amber-100 via-orange-50 to-stone-200 dark:from-amber-950 dark:to-zinc-900"}`}
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-16 size-64 rounded-full border border-current/15"
            />
            <div
              aria-hidden="true"
              className="absolute -right-1 -top-6 size-44 rounded-full border border-current/20"
            />
            <course.icon className="relative size-16 stroke-[1.1] text-foreground/75" />
          </div>
        </section>
        <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <section>
              <h2 className="text-xl font-semibold">What you’ll learn</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.objectives.map((objective) => (
                  <li key={objective} className="flex gap-3 text-sm leading-6">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#155eef]" />
                    {objective}
                  </li>
                ))}
              </ul>
            </section>
            <section className="mt-9">
              <h2 className="text-xl font-semibold">Course curriculum</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {course.modules.length} modules · {course.lessons} lessons · {course.minutes}{" "}
                minutes
              </p>
              <div className="mt-4 rounded-lg border px-4">
                <CourseCurriculum course={course} />
              </div>
            </section>
            <section className="mt-9 grid gap-7 border-t pt-7 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">Prerequisites</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  No course-level prerequisites are listed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Public course content</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Lessons in this published course are open to read. Sign in is only needed to save
                  and track your learning.
                </p>
              </div>
            </section>
          </div>
          <aside>
            <Card className="gap-0 rounded-lg border p-4 shadow-none">
              <p className="text-sm font-semibold">Begin this course</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Start with the first lesson. You can read every public lesson without an account.
              </p>
              <a
                href={lessonHref(course, first.slug)}
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-medium text-white hover:bg-[#124fce]"
              >
                Start reading <ArrowRight className="size-4" />
              </a>
              <Button variant="outline" className="mt-2" onClick={() => setSignInOpen(true)}>
                Sign in to track progress
              </Button>
              <Button
                variant="ghost"
                className="mt-1"
                aria-pressed={saved}
                onClick={() => {
                  setSaved(!saved);
                  if (!saved) setSignInOpen(true);
                }}
              >
                {saved ? <BookmarkCheck /> : <Bookmark />}
                {saved ? "Saved in preview" : "Save course"}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Course tracking requires an account.
              </p>
            </Card>
            {enrolled && (
              <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
                Added to the local learner preview. This is not saved to an account.
              </div>
            )}
            <Button variant="outline" className="mt-4 w-full" onClick={() => setEnrolled(true)}>
              {enrolled ? <Check /> : <GraduationCap />}
              {enrolled ? "Added to preview" : "Add to learner preview"}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Prototype state only. No enrollment is recorded.
            </p>
          </aside>
        </div>
      </main>
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your learning</DialogTitle>
            <DialogDescription>
              Sign-in is not connected yet. This prototype keeps bookmarks in page state only and
              does not record account progress.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setSignInOpen(false)}>Continue reading</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
