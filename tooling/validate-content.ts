import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

import { courseSchema, lessonSchema } from "../src/features/content/schemas";

const coursesDirectory = join(process.cwd(), "content", "courses");
const validationErrors: string[] = [];
const courses = new Map<
  string,
  { language: "en" | "id"; status: "draft" | "published"; path: string }
>();
const lessons = new Map<
  string,
  {
    course: string;
    language: "en" | "id";
    order: number;
    related: string[];
    status: "draft" | "published";
    path: string;
  }
>();

function parseFrontmatter<T>(
  filePath: string,
  schema: { parse: (value: unknown) => T },
): T | undefined {
  try {
    return schema.parse(matter(readFileSync(filePath, "utf8")).data);
  } catch (error) {
    validationErrors.push(
      `${filePath}: ${error instanceof Error ? error.message : "Invalid frontmatter"}`,
    );
    return undefined;
  }
}

for (const courseDirectory of readdirSync(coursesDirectory, { withFileTypes: true })) {
  if (!courseDirectory.isDirectory()) {
    continue;
  }

  const coursePath = join(coursesDirectory, courseDirectory.name, "course.mdx");
  const course = parseFrontmatter(coursePath, courseSchema);

  if (!course) {
    continue;
  }

  if (course.slug !== courseDirectory.name) {
    validationErrors.push(`${coursePath}: slug must match its parent directory`);
  }

  if (courses.has(course.slug)) {
    validationErrors.push(`${coursePath}: duplicate course slug "${course.slug}"`);
  }
  courses.set(course.slug, {
    language: course.language,
    status: course.status,
    path: coursePath,
  });

  const lessonsDirectory = join(coursesDirectory, courseDirectory.name, "lessons");
  if (!existsSync(lessonsDirectory)) {
    validationErrors.push(`${lessonsDirectory}: lesson directory is required`);
    continue;
  }

  for (const lessonFile of readdirSync(lessonsDirectory, { withFileTypes: true })) {
    if (!lessonFile.isFile() || !lessonFile.name.endsWith(".mdx")) {
      continue;
    }

    const lessonPath = join(lessonsDirectory, lessonFile.name);
    const lesson = parseFrontmatter(lessonPath, lessonSchema);

    if (!lesson) {
      continue;
    }

    if (lesson.course !== course.slug || `${lesson.slug}.mdx` !== lessonFile.name) {
      validationErrors.push(`${lessonPath}: course and slug must match the content path`);
    }

    const lessonKey = `${lesson.course}/${lesson.slug}`;
    if (lessons.has(lessonKey)) {
      validationErrors.push(`${lessonPath}: duplicate lesson slug "${lessonKey}"`);
    }
    lessons.set(lessonKey, {
      course: lesson.course,
      language: lesson.language,
      order: lesson.order,
      related: lesson.relatedLessons,
      status: lesson.status,
      path: lessonPath,
    });
  }
}

const lessonOrders = new Set<string>();
for (const lesson of lessons.values()) {
  const course = courses.get(lesson.course);
  if (!course) {
    validationErrors.push(`${lesson.path}: references missing course "${lesson.course}"`);
    continue;
  }

  if (lesson.language !== course.language) {
    validationErrors.push(`${lesson.path}: lesson language must match its course`);
  }

  const orderKey = `${lesson.course}/${lesson.language}/${lesson.order}`;
  if (lessonOrders.has(orderKey)) {
    validationErrors.push(`${lesson.path}: lesson order ${lesson.order} is duplicated`);
  }
  lessonOrders.add(orderKey);

  if (course.status === "draft" && lesson.status === "published") {
    validationErrors.push(`${lesson.path}: cannot publish a lesson in a draft course`);
  }

  for (const relatedSlug of lesson.related) {
    if (!lessons.has(`${lesson.course}/${relatedSlug}`)) {
      validationErrors.push(
        `${lesson.path}: related lesson "${relatedSlug}" does not exist in this course`,
      );
    }
  }
}

for (const [courseSlug, course] of courses) {
  const hasPublishedLesson = [...lessons.values()].some(
    (lesson) => lesson.course === courseSlug && lesson.status === "published",
  );
  if (course.status === "published" && !hasPublishedLesson) {
    validationErrors.push(`${course.path}: published courses require a published lesson`);
  }
}

if (validationErrors.length > 0) {
  throw new Error(
    `Content validation failed:\n${validationErrors.map((error) => `- ${error}`).join("\n")}`,
  );
}

console.info(`Validated ${courses.size} courses and ${lessons.size} lessons.`);
