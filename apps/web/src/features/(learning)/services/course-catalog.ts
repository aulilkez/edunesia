import { Code2, FileSpreadsheet, FileText, Presentation, Target } from "lucide-react";

import ExcelIntro from "../../../../../../content/courses/excel-essentials/modules/working-with-cells/lessons/01-first-formulas.mdx";
import GoIntro from "../../../../../../content/courses/go-programming/modules/getting-started/lessons/01-first-go-program.mdx";
import JavaIntro from "../../../../../../content/courses/java-programming/modules/getting-started/lessons/01-first-java-program.mdx";
import FirstProgram from "../../../../../../content/courses/javascript-foundations/modules/getting-started/lessons/01-first-program.mdx";
import Variables from "../../../../../../content/courses/javascript-foundations/modules/getting-started/lessons/02-variables.mdx";
import MathModels from "../../../../../../content/courses/mathematics-foundations/modules/calculus/lessons/01-mathematical-models.mdx";
import PowerPointIntro from "../../../../../../content/courses/powerpoint-essentials/modules/slide-design/lessons/01-plan-a-presentation.mdx";
import PythonIntro from "../../../../../../content/courses/python-foundations/modules/getting-started/lessons/01-first-python-program.mdx";
import RustIntro from "../../../../../../content/courses/rust-programming/modules/getting-started/lessons/01-first-rust-program.mdx";
import SqlIntro from "../../../../../../content/courses/sql-foundations/modules/querying-data/lessons/01-first-query.mdx";
import WebIntro from "../../../../../../content/courses/web-foundations/modules/page-structure/lessons/01-first-web-page.mdx";
import WordIntro from "../../../../../../content/courses/word-essentials/modules/structured-documents/lessons/01-document-structure.mdx";

export const courses = [
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
export type Course = (typeof courses)[number];
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

export function courseHref(slug: string) {
  return `/learn/courses/${slug}`;
}
export function lessonHref(course: Course, slug: string) {
  return `/learn/${course.slug}/${slug}`;
}
export function getCourse(slug: string) {
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

export function getLessonContent(slug: string) {
  return lessonContent[slug];
}
