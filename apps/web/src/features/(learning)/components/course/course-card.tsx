import {
  Bookmark,
  BookmarkCheck,
  Database,
  FileSpreadsheet,
  FileText,
  Presentation,
  Sigma,
} from "lucide-react";

import { Badge } from "@edunesia/ui/components/badge";
import { Button } from "@edunesia/ui/components/button";
import { Card } from "@edunesia/ui/components/card";

import type { Course } from "../../services/course-catalog";
import { courseHref } from "../../services/course-catalog";

export function CourseCard({
  course,
  saved,
  onBookmark,
  compact = false,
}: {
  course: Course;
  saved?: boolean;
  onBookmark?: () => void;
  compact?: boolean;
}) {
  const Icon = course.icon;
  if (compact) {
    return (
      <Card className="group gap-0 rounded-lg border bg-card p-4 shadow-none transition-colors hover:border-foreground/25 hover:bg-muted/20">
        <div className="flex items-start gap-3">
          <CourseBrandMark course={course} />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{course.subject}</p>
            <a
              href={courseHref(course.slug)}
              className="mt-1 block text-sm font-semibold leading-5 tracking-tight hover:text-[#155eef]"
            >
              {course.title}
            </a>
          </div>
          {onBookmark && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={saved ? "Remove course bookmark" : "Bookmark course"}
              aria-pressed={saved}
              onClick={onBookmark}
            >
              {saved ? <BookmarkCheck className="text-[#155eef]" /> : <Bookmark />}
            </Button>
          )}
        </div>
        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
          <span>
            {course.lessons} {course.lessons === 1 ? "lesson" : "lessons"}
          </span>
          <span>{course.minutes} min</span>
          <span className="ml-auto font-medium text-foreground">Free</span>
        </div>
      </Card>
    );
  }
  return (
    <Card className="group overflow-hidden rounded-lg border bg-card py-0 shadow-none transition-colors hover:border-foreground/25">
      <a
        href={courseHref(course.slug)}
        className={`relative flex h-36 items-end overflow-hidden bg-gradient-to-br ${course.tone === "blue" ? "from-blue-100 via-blue-50 to-slate-100 dark:from-blue-950 dark:via-slate-900 dark:to-zinc-900" : "from-amber-100 via-orange-50 to-stone-100 dark:from-amber-950 dark:via-stone-900 dark:to-zinc-900"}`}
        aria-label={`View ${course.title}`}
      >
        <div className="absolute inset-0 opacity-60" aria-hidden="true">
          <div className="absolute -right-7 -top-12 size-44 rounded-full border border-current/15" />
          <div className="absolute -right-1 -top-6 size-32 rounded-full border border-current/20" />
          <div className="absolute right-10 top-6 size-16 rounded-full border border-current/25" />
        </div>
        <div className="relative flex w-full items-end justify-between p-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
            {course.subject}
          </span>
          <span className="flex size-10 items-center justify-center rounded-md border border-black/10 bg-white/70 text-zinc-800 backdrop-blur-sm dark:border-white/10 dark:bg-black/30 dark:text-white">
            <Icon className="size-5" />
          </span>
        </div>
      </a>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{course.contributor}</p>
            <a
              href={courseHref(course.slug)}
              className="mt-1.5 block text-base font-semibold leading-6 tracking-tight hover:text-[#155eef]"
            >
              {course.title}
            </a>
          </div>
          {onBookmark && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={saved ? "Remove course bookmark" : "Bookmark course"}
              aria-pressed={saved}
              onClick={onBookmark}
            >
              {saved ? <BookmarkCheck className="text-[#155eef]" /> : <Bookmark />}
            </Button>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="rounded-sm font-medium">
            {course.level}
          </Badge>
          <span>{course.lessons} lessons</span>
          <span>{course.minutes} min</span>
          <span className="ml-auto font-medium text-foreground">Free</span>
        </div>
      </div>
    </Card>
  );
}

export function CourseBrandMark({ course, large = false }: { course: Course; large?: boolean }) {
  const marks: Record<string, { label?: string; className: string; icon?: typeof Database }> = {
    "javascript-foundations": {
      label: "JS",
      className: "border-[#e8d22b] bg-[#f7df1e] text-[#111111]",
    },
    "java-programming": {
      label: "Java",
      className: "border-[#e4a187] bg-[#fff1eb] text-[#b74726]",
    },
    "go-programming": { label: "Go", className: "border-[#a6d9e7] bg-[#e8f8fc] text-[#007d9c]" },
    "rust-programming": {
      label: "Rs",
      className: "border-zinc-300 bg-zinc-800 text-white dark:border-zinc-600 dark:bg-zinc-700",
    },
    "python-foundations": {
      label: "Py",
      className: "border-[#306998] bg-[#306998] text-[#ffe873]",
    },
    "html-css-foundations": {
      label: "5",
      className: "border-[#e46d3b] bg-[#fff0e9] text-[#e34f26]",
    },
    "sql-foundations": {
      className:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
      icon: Database,
    },
    "excel-essentials": {
      className: "border-[#9bc4aa] bg-[#eaf4ed] text-[#217346]",
      icon: FileSpreadsheet,
    },
    "word-essentials": {
      className: "border-[#a8c0e9] bg-[#edf3fc] text-[#185abd]",
      icon: FileText,
    },
    "powerpoint-essentials": {
      className: "border-[#edb39e] bg-[#fff1eb] text-[#d24726]",
      icon: Presentation,
    },
    "mathematics-foundations": {
      className: "border-[#c9c4e8] bg-[#f1effa] text-[#6255a5]",
      icon: Sigma,
    },
  };
  const mark = marks[course.slug] ?? {
    className: "border-border bg-muted text-foreground",
    icon: course.icon,
  };
  const MarkIcon = mark.icon;
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md border font-semibold tracking-tight ${large ? "size-16 text-lg" : "size-10 text-sm"} ${mark.className}`}
      aria-label={`${course.title} mark`}
    >
      {MarkIcon ? (
        <MarkIcon className={large ? "size-7" : "size-[18px]"} aria-hidden="true" />
      ) : (
        mark.label
      )}
    </span>
  );
}
