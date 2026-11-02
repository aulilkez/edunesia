import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock3,
  Compass,
  GraduationCap,
  Search,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@edunesia/ui/components/badge";
import { Card } from "@edunesia/ui/components/card";
import { Progress } from "@edunesia/ui/components/progress";

import { courses, lessonHref } from "../../services/course-catalog";
import { CourseCard } from "../course/course-card";
import { LearnAppFrame } from "../shared/learn-header";

export function LearnerHome({ page }: { page: "my-learning" | "bookmarks" | "progress" }) {
  const [filter, setFilter] = useState("In progress");
  const [saved, setSaved] = useState<string[]>(["mathematics-foundations"]);
  const title =
    page === "my-learning" ? "My learning" : page === "bookmarks" ? "Bookmarks" : "Your progress";
  const progressMetrics = [
    { label: "Learning time", value: "2h 15m", Icon: Clock3 },
    { label: "Courses completed", value: "0", Icon: GraduationCap },
    { label: "Lessons completed", value: "3", Icon: CheckCircle2 },
  ];
  return (
    <LearnAppFrame active={`/learn/${page}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">LEARNER PREVIEW · SAMPLE DATA</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A local prototype view. No account data is connected.
          </p>
        </div>
        {page === "my-learning" && (
          <Link
            to="/learn"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[#155eef] px-3 text-sm font-medium text-white hover:bg-[#124fce]"
          >
            <Compass className="size-4" /> Browse courses
          </Link>
        )}
      </div>
      {page === "my-learning" && (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b">
            <div className="flex gap-5">
              {["In progress", "Completed"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`border-b-2 px-1 pb-3 text-sm ${filter === item ? "border-[#155eef] font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="pb-3 text-xs text-muted-foreground">Sample enrollment state</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(filter === "In progress" ? courses.slice(0, 1) : []).map((course) => (
              <Card key={course.slug} className="gap-0 rounded-lg border p-4 shadow-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="secondary" className="rounded-sm">
                      {course.subject}
                    </Badge>
                    <h2 className="mt-3 text-lg font-semibold">{course.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Resume at: {course.modules[0]!.lessons[0]!.title}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
                <Progress value={25} aria-label="Sample course progress" className="mt-5 h-1.5" />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Sample progress</span>
                  <span>1 of 4 lessons</span>
                </div>
                <a
                  href={lessonHref(course, course.modules[0]!.lessons[0]!.slug)}
                  className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#155eef] px-3 text-sm font-medium text-white hover:bg-[#124fce]"
                >
                  Continue learning <ArrowRight className="size-4" />
                </a>
              </Card>
            ))}
            {filter === "Completed" && (
              <div className="col-span-full rounded-lg border border-dashed p-9 text-center">
                <p className="font-medium">No completed courses in this preview.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete lessons in the sample workspace to see how this view is organized.
                </p>
              </div>
            )}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
            <section>
              <h2 className="text-lg font-semibold">Recently accessed</h2>
              <div className="mt-3 divide-y rounded-lg border px-4">
                {courses.slice(0, 2).map((course) => (
                  <a
                    key={course.slug}
                    href={lessonHref(course, course.modules[0]!.lessons[0]!.slug)}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {course.modules[0]!.lessons[0]!.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {course.title}
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </section>
            <section className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#155eef]" />
                <h2 className="font-semibold">Learning rhythm</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Streak and activity summaries appear here when real account activity is available.
              </p>
              <Link
                to="/learn/progress"
                className="mt-3 inline-block text-sm font-medium text-[#155eef] hover:underline"
              >
                Open progress view
              </Link>
            </section>
          </div>
        </>
      )}
      {page === "bookmarks" && (
        <>
          <div className="mt-7 flex flex-wrap gap-3">
            <label className="flex h-10 min-w-[230px] flex-1 items-center gap-2 rounded-md border px-3">
              <Search className="size-4 text-muted-foreground" />
              <span className="sr-only">Search bookmarks</span>
              <input
                placeholder="Search saved items"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
            <select
              aria-label="Filter bookmarks by category"
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option>All subjects</option>
              <option>Computer science</option>
              <option>Mathematics</option>
            </select>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {courses
              .filter((course) => saved.includes(course.slug))
              .map((course) => (
                <CourseCard
                  key={course.slug}
                  course={course}
                  saved
                  onBookmark={() => setSaved(saved.filter((slug) => slug !== course.slug))}
                />
              ))}
          </div>
          {saved.length === 0 && (
            <div className="mt-5 rounded-lg border border-dashed p-10 text-center">
              <Bookmark className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-3 font-medium">No saved courses</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save a course to keep it close. Sample bookmarks are stored only while this page is
                open.
              </p>
              <Link to="/learn" className="mt-4 inline-flex text-sm font-medium text-[#155eef]">
                Browse courses
              </Link>
            </div>
          )}
        </>
      )}
      {page === "progress" && (
        <>
          <div className="mt-7 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
            Every figure below is labeled sample data to demonstrate the progress view. It does not
            represent a real learner.
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {progressMetrics.map(({ label, value, Icon }) => (
              <Card key={label} className="gap-3 rounded-lg border p-4 shadow-none">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="size-4" />
                  {label}
                </p>
                <p className="text-2xl font-semibold tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground">Sample preview value</p>
              </Card>
            ))}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
            <Card className="rounded-lg border p-5 shadow-none">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">Weekly activity</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Sample minutes by day</p>
                </div>
                <Badge variant="secondary" className="rounded-sm">
                  Preview
                </Badge>
              </div>
              <div className="mt-8 grid grid-cols-7 items-end gap-3">
                {[
                  ["M", 25],
                  ["T", 48],
                  ["W", 32],
                  ["T", 70],
                  ["F", 18],
                  ["S", 45],
                  ["S", 12],
                ].map(([day, height], index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="flex h-28 w-full items-end rounded-sm bg-muted">
                      <div
                        className="w-full rounded-sm bg-[#155eef]"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="rounded-lg border p-5 shadow-none">
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-[#155eef]" />
                <h2 className="font-semibold">Achievements</h2>
              </div>
              <div className="mt-4 flex items-start gap-3 border-t pt-4">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <BookOpen className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">First steps</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sample achievement for the prototype.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3 border-t pt-4">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <Target className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Building a habit</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Streaks will use account activity when available.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </LearnAppFrame>
  );
}
