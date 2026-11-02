import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  Compass,
  Database,
  GraduationCap,
  FileSpreadsheet,
  FileText,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Presentation,
  Search,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { useEffect, useMemo, useState } from "react";

import { authClient } from "@edunesia/auth/client";
import { mdxComponents } from "@edunesia/content/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@edunesia/ui/components/accordion";
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

import ExcelIntro from "../../../../content/courses/excel-essentials/modules/working-with-cells/lessons/01-first-formulas.mdx";
import GoIntro from "../../../../content/courses/go-programming/modules/getting-started/lessons/01-first-go-program.mdx";
import JavaIntro from "../../../../content/courses/java-programming/modules/getting-started/lessons/01-first-java-program.mdx";
import FirstProgram from "../../../../content/courses/javascript-foundations/modules/getting-started/lessons/01-first-program.mdx";
import Variables from "../../../../content/courses/javascript-foundations/modules/getting-started/lessons/02-variables.mdx";
import MathModels from "../../../../content/courses/mathematics-foundations/modules/calculus/lessons/01-mathematical-models.mdx";
import PowerPointIntro from "../../../../content/courses/powerpoint-essentials/modules/slide-design/lessons/01-plan-a-presentation.mdx";
import PythonIntro from "../../../../content/courses/python-foundations/modules/getting-started/lessons/01-first-python-program.mdx";
import RustIntro from "../../../../content/courses/rust-programming/modules/getting-started/lessons/01-first-rust-program.mdx";
import SqlIntro from "../../../../content/courses/sql-foundations/modules/querying-data/lessons/01-first-query.mdx";
import WebIntro from "../../../../content/courses/web-foundations/modules/page-structure/lessons/01-first-web-page.mdx";
import WordIntro from "../../../../content/courses/word-essentials/modules/structured-documents/lessons/01-document-structure.mdx";
import { ThemeSwitch } from "../components/theme-switch";

const courses = [
  {
    slug: "javascript-foundations",
    title: "JavaScript Foundations",
    subject: "Computer science",
    level: "Beginner",
    lessons: 2,
    minutes: 15,
    contributor: "Contributor not listed",
    description: "Learn core JavaScript concepts through short, structured lessons.",
    tone: "blue",
    icon: Code2,
    objectives: [
      "Explain what a JavaScript statement does",
      "Use console.log to display a value",
      "Choose between const and let",
      "Read a variable declaration",
    ],
    modules: [
      {
        name: "Getting started",
        lessons: [
          { slug: "first-program", title: "Your First JavaScript Program", minutes: 5 },
          { slug: "variables", title: "Variables in JavaScript", minutes: 10 },
        ],
      },
    ],
  },
  {
    slug: "java-programming",
    title: "Java Programming Foundations",
    subject: "Computer science",
    level: "Beginner",
    lessons: 1,
    minutes: 8,
    contributor: "Contributor not listed",
    description: "Run a Java program and identify its main method.",
    tone: "blue",
    icon: Code2,
    objectives: [
      "Identify the entry point of a small Java program",
      "Print a line of text with System.out.println",
    ],
    modules: [
      {
        name: "Getting started with Java",
        lessons: [{ slug: "first-java-program", title: "Your First Java Program", minutes: 8 }],
      },
    ],
  },
  {
    slug: "go-programming",
    title: "Go Programming Foundations",
    subject: "Computer science",
    level: "Beginner",
    lessons: 1,
    minutes: 8,
    contributor: "Contributor not listed",
    description: "Understand package main, imports, and the main function in Go.",
    tone: "blue",
    icon: Code2,
    objectives: [
      "Explain the role of package main and func main",
      "Print text with the fmt package",
    ],
    modules: [
      {
        name: "Getting started with Go",
        lessons: [{ slug: "first-go-program", title: "Your First Go Program", minutes: 8 }],
      },
    ],
  },
  {
    slug: "rust-programming",
    title: "Rust Programming Foundations",
    subject: "Computer science",
    level: "Beginner",
    lessons: 1,
    minutes: 8,
    contributor: "Contributor not listed",
    description: "Read a minimal Rust program and recognize its entry point and output macro.",
    tone: "blue",
    icon: Code2,
    objectives: [
      "Recognize the main function as a Rust program entry point",
      "Use println! to display text",
    ],
    modules: [
      {
        name: "Getting started with Rust",
        lessons: [{ slug: "first-rust-program", title: "Your First Rust Program", minutes: 8 }],
      },
    ],
  },
  {
    slug: "python-foundations",
    title: "Python Foundations",
    subject: "Computer science",
    level: "Beginner",
    lessons: 1,
    minutes: 7,
    contributor: "Contributor not listed",
    description: "Run a short Python script and display text and values.",
    tone: "blue",
    icon: Code2,
    objectives: ["Run a Python statement in a script", "Display text and a named value with print"],
    modules: [
      {
        name: "Getting started with Python",
        lessons: [{ slug: "first-python-program", title: "Your First Python Program", minutes: 7 }],
      },
    ],
  },
  {
    slug: "html-css-foundations",
    title: "HTML and CSS Foundations",
    subject: "Computer science",
    level: "Beginner",
    lessons: 1,
    minutes: 9,
    contributor: "Contributor not listed",
    description: "Structure a web page with HTML and style it with CSS.",
    tone: "blue",
    icon: Code2,
    objectives: [
      "Identify the main parts of a basic HTML document",
      "Connect a CSS stylesheet to an HTML file",
    ],
    modules: [
      {
        name: "Page structure",
        lessons: [{ slug: "first-web-page", title: "Build Your First Web Page", minutes: 9 }],
      },
    ],
  },
  {
    slug: "sql-foundations",
    title: "SQL Foundations",
    subject: "Data",
    level: "Beginner",
    lessons: 1,
    minutes: 8,
    contributor: "Contributor not listed",
    description: "Select columns from a relational table and filter result rows.",
    tone: "blue",
    icon: Code2,
    objectives: ["Select named columns from a table", "Filter rows with a WHERE condition"],
    modules: [
      {
        name: "Querying data",
        lessons: [{ slug: "first-sql-query", title: "Write Your First SQL Query", minutes: 8 }],
      },
    ],
  },
  {
    slug: "excel-essentials",
    title: "Excel Essentials",
    subject: "Productivity",
    level: "Beginner",
    lessons: 1,
    minutes: 8,
    contributor: "Contributor not listed",
    description: "Build spreadsheet formulas with cell references and common functions.",
    tone: "blue",
    icon: FileSpreadsheet,
    objectives: [
      "Write a formula that refers to worksheet cells",
      "Add a range with the SUM function",
    ],
    modules: [
      {
        name: "Working with cells",
        lessons: [
          { slug: "first-excel-formulas", title: "Write Your First Excel Formulas", minutes: 8 },
        ],
      },
    ],
  },
  {
    slug: "word-essentials",
    title: "Word Essentials",
    subject: "Productivity",
    level: "Beginner",
    lessons: 1,
    minutes: 7,
    contributor: "Contributor not listed",
    description: "Create clear documents with styles, headings, lists, and page structure.",
    tone: "blue",
    icon: FileText,
    objectives: [
      "Apply heading styles to organize document sections",
      "Explain why semantic structure helps navigation",
    ],
    modules: [
      {
        name: "Structured documents",
        lessons: [{ slug: "document-structure", title: "Structure a Word Document", minutes: 7 }],
      },
    ],
  },
  {
    slug: "powerpoint-essentials",
    title: "PowerPoint Essentials",
    subject: "Productivity",
    level: "Beginner",
    lessons: 1,
    minutes: 8,
    contributor: "Contributor not listed",
    description: "Plan an audience-focused presentation with readable slides.",
    tone: "blue",
    icon: Presentation,
    objectives: [
      "Define the audience and purpose before creating slides",
      "Arrange a presentation as a sequence of supporting ideas",
    ],
    modules: [
      {
        name: "Planning slides",
        lessons: [{ slug: "plan-a-presentation", title: "Plan a Clear Presentation", minutes: 8 }],
      },
    ],
  },
  {
    slug: "mathematics-foundations",
    title: "Mathematics Foundations",
    subject: "Mathematics",
    level: "Beginner",
    lessons: 1,
    minutes: 15,
    contributor: "Contributor not listed",
    description: "Explore calculus, linear algebra, and mathematical models.",
    tone: "amber",
    icon: Target,
    objectives: [
      "Interpret an integral as accumulated change",
      "Read a derivative as a local rate of change",
      "Represent a linear transformation with a matrix",
    ],
    modules: [
      {
        name: "Calculus and models",
        lessons: [
          {
            slug: "mathematical-models",
            title: "Mathematical Models: From Change to Structure",
            minutes: 15,
          },
        ],
      },
    ],
  },
];
type Course = (typeof courses)[number];
const lessonContent: Record<string, typeof FirstProgram> = {
  "first-program": FirstProgram,
  variables: Variables,
  "mathematical-models": MathModels,
  "first-java-program": JavaIntro,
  "first-go-program": GoIntro,
  "first-rust-program": RustIntro,
  "first-python-program": PythonIntro,
  "first-web-page": WebIntro,
  "first-sql-query": SqlIntro,
  "first-excel-formulas": ExcelIntro,
  "document-structure": WordIntro,
  "plan-a-presentation": PowerPointIntro,
};

function courseHref(slug: string) {
  return `/learn/courses/${slug}`;
}
function lessonHref(course: Course, slug: string) {
  return `/learn/${course.slug}/${slug}`;
}
function getCourse(slug: string) {
  return courses.find((item) => item.slug === slug) ?? courses[0]!;
}
export function isPublishedCourse(slug: string) {
  return courses.some((course) => course.slug === slug);
}
export function isPublishedLesson(courseSlug: string, lessonSlug: string) {
  const course = courses.find((item) => item.slug === courseSlug);
  return Boolean(
    course?.modules.some((module) => module.lessons.some((lesson) => lesson.slug === lessonSlug)),
  );
}

export function LearnHeader({ app = false }: { app?: boolean }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-7 px-4 sm:px-7 lg:px-10">
          <Link
            to="/learn"
            aria-label="Edunesia Learn home"
            className="flex shrink-0 items-center gap-2.5 rounded-md font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-[#155eef] text-white">
              <BookOpen className="size-4" />
            </span>
            <span>
              edunesia<span className="ml-1 font-normal text-muted-foreground">learn</span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm lg:flex">
            <Link to="/learn" className="font-medium text-foreground">
              Explore
            </Link>
            <a href="/learn#subjects" className="text-muted-foreground hover:text-foreground">
              Subjects
            </a>
            <a
              href="https://github.com/aulilkez/edunesia"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Community
            </a>
          </nav>
          <label className="ml-auto hidden h-9 w-full max-w-[360px] items-center gap-2 rounded-md border bg-muted/40 px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/50 sm:flex">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search courses</span>
            <input
              aria-label="Search courses"
              placeholder="Search courses, topics..."
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  window.location.href = `/learn?query=${encodeURIComponent(e.currentTarget.value)}`;
              }}
            />
            <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
          </label>
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <ThemeSwitch />
            {!app && (
              <Button
                variant="ghost"
                className="hidden sm:inline-flex"
                onClick={() => setAuthOpen(true)}
              >
                Sign in
              </Button>
            )}
            <Link
              to="/learn/my-learning"
              className="hidden rounded-md bg-[#155eef] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#124fce] sm:inline-flex"
            >
              {app ? "Learner preview" : "Get started"}
            </Link>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Edunesia Learn</SheetTitle>
                  <SheetDescription>Find a place to begin.</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-1 px-4">
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/learn"
                    className="rounded-md px-3 py-3 hover:bg-muted"
                  >
                    Explore courses
                  </Link>
                  <a
                    href="/learn#subjects"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-3 hover:bg-muted"
                  >
                    Subjects
                  </a>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/learn/my-learning"
                    className="rounded-md px-3 py-3 hover:bg-muted"
                  >
                    Learner preview
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to Edunesia</DialogTitle>
            <DialogDescription>
              Authentication is not connected in this prototype. You can still read all published
              lessons, or open the clearly labeled learner preview.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="bg-[#155eef] hover:bg-[#124fce]"
              onClick={() => {
                setAuthOpen(false);
                window.location.href = "/learn/my-learning";
              }}
            >
              Open learner preview
            </Button>
            <Button variant="outline" onClick={() => setAuthOpen(false)}>
              Keep exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function LearnAppFrame({ children, active }: { children: React.ReactNode; active: string }) {
  const navigate = useNavigate();
  const learnerLinks = [
    { label: "My learning", href: "/learn/my-learning" },
    { label: "Bookmarks", href: "/learn/bookmarks" },
    { label: "Progress", href: "/learn/progress" },
    { label: "Explore courses", href: "/learn" },
  ] as const;
  return (
    <div className="min-h-svh bg-background text-foreground">
      <LearnHeader app />
      <div className="mx-auto flex max-w-[1440px] justify-end border-b px-4 py-2 sm:px-7 lg:px-9">
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await authClient.signOut();
            await navigate({ to: "/" });
          }}
        >
          Sign out
        </Button>
      </div>
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100svh-4rem)] border-r px-4 py-6 lg:block">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Learning
          </p>
          <nav className="mt-3 grid gap-1" aria-label="Learner navigation">
            {learnerLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                aria-current={active === href ? "page" : undefined}
                className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm ${active === href ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-md border bg-muted/35 p-3">
            <p className="text-xs font-semibold">Prototype workspace</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Progress below is local sample data and is not tied to an account.
            </p>
          </div>
        </aside>
        <main className="min-w-0 px-4 py-7 sm:px-7 lg:px-9 lg:py-9">{children}</main>
      </div>
    </div>
  );
}

function CourseCard({
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

function CourseBrandMark({ course, large = false }: { course: Course; large?: boolean }) {
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

export function LearnExplore() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [sort, setSort] = useState("recommended");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("query");
    if (initial) setQuery(initial);
  }, []);
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

function CourseCurriculum({ course, current }: { course: Course; current?: string }) {
  return (
    <Accordion
      type="multiple"
      defaultValue={course.modules.map((_, i) => `module-${i}`)}
      className="divide-y"
    >
      {course.modules.map((module, i) => (
        <AccordionItem key={module.name} value={`module-${i}`} className="border-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <span className="text-left">
              <span className="block font-medium">{module.name}</span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                {module.lessons.length} lessons
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-1">
              {module.lessons.map((lesson) => (
                <a
                  key={lesson.slug}
                  href={lessonHref(course, lesson.slug)}
                  aria-current={lesson.slug === current ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm ${lesson.slug === current ? "bg-blue-50 font-medium text-blue-800 dark:bg-blue-950/50 dark:text-blue-200" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <span className="flex size-5 items-center justify-center">
                    {lesson.slug === current ? (
                      <Play className="size-3.5 fill-current" />
                    ) : (
                      <Circle className="size-3.5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 leading-5">{lesson.title}</span>
                  <span className="shrink-0 text-xs">{lesson.minutes}m</span>
                </a>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

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
  const Content = lessonContent[lesson.slug];
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
          {Content ? (
            <div
              id="lesson-reading"
              className="learning-prose mt-7 min-w-0 scroll-mt-24 text-[1.025rem] leading-8 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-5 [&_a]:text-[#155eef] [&_a]:underline [&_a]:underline-offset-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground [&_hr]:my-8 [&_hr]:border-border"
            >
              <Content components={lessonComponents} />
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

function Quiz({ programming }: { programming: boolean }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const options = programming
    ? [
        "console.log displays a value in the console.",
        "console.log declares a variable.",
        "console.log repeats a statement forever.",
      ]
    : [
        "A model describes a relationship between quantities.",
        "A model is always a computer simulation.",
        "A model removes the need to state assumptions.",
      ];
  const explanation = programming
    ? "console.log sends a value to the runtime console, which is useful for checking output."
    : "A model gives a compact way to describe relationships. Its assumptions still matter.";
  return (
    <div className="mt-4">
      <fieldset>
        <legend className="sr-only">Choose the best answer</legend>
        <div className="grid gap-2">
          {options.map((option, index) => (
            <label
              key={option}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 text-sm ${answer === index ? "border-[#155eef] bg-blue-50 dark:bg-blue-950/30" : "bg-background hover:bg-muted/50"}`}
            >
              <input
                type="radio"
                name="lesson-quiz"
                checked={answer === index}
                onChange={() => {
                  setAnswer(index);
                  setSubmitted(false);
                }}
                className="accent-[#155eef]"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      {submitted && (
        <div role="status" className="mt-3 rounded-md border bg-background p-3 text-sm">
          <p
            className={
              answer === 0
                ? "font-semibold text-emerald-700 dark:text-emerald-400"
                : "font-semibold text-destructive"
            }
          >
            {answer === 0 ? "Correct" : "Incorrect"} · Score: {answer === 0 ? "1 / 1" : "0 / 1"}
          </p>
          <p className="mt-1 leading-6 text-muted-foreground">{explanation}</p>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          disabled={answer === null || submitted}
          onClick={() => setSubmitted(true)}
        >
          {submitted ? "Answer submitted" : "Check answer"}
        </Button>
        {submitted && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAnswer(null);
              setSubmitted(false);
            }}
          >
            Retry quiz
          </Button>
        )}
      </div>
    </div>
  );
}

function ReflectionExercise({ lessonTitle }: { lessonTitle: string }) {
  const [response, setResponse] = useState("");
  const [completed, setCompleted] = useState(false);
  return (
    <form
      className="mt-6 rounded-lg border p-4 sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (response.trim()) setCompleted(true);
      }}
    >
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Practice the idea</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Write one thing you would explain to a friend about “{lessonTitle}”. Your response stays in
        this page preview.
      </p>
      <label htmlFor="lesson-reflection" className="mt-4 block text-sm font-medium">
        Your reflection
      </label>
      <textarea
        id="lesson-reflection"
        value={response}
        onChange={(event) => {
          setResponse(event.target.value);
          setCompleted(false);
        }}
        rows={3}
        className="mt-2 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        placeholder="Write a few words in your own terms..."
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" disabled={!response.trim() || completed}>
          {completed ? <CheckCircle2 /> : <Check />}
          {completed ? "Exercise complete in preview" : "Mark exercise complete"}
        </Button>
        {completed && (
          <p role="status" className="text-sm text-muted-foreground">
            Response recorded for this page only.
          </p>
        )}
      </div>
    </form>
  );
}

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
