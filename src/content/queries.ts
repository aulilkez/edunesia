import { allCourses, allLessons } from "content-collections";

export const publishedCourses = allCourses
  .filter((course) => course.status === "published")
  .sort((left, right) => left.title.localeCompare(right.title))
  .map((course) => ({
    ...course,
    firstLesson: allLessons
      .filter((lesson) => lesson.course === course.slug && lesson.status === "published")
      .sort((left, right) => left.order - right.order)[0],
  }))
  .filter((course) => course.firstLesson !== undefined);

export function getPublishedLesson(courseSlug: string, lessonSlug: string) {
  const course = allCourses.find(
    (candidate) => candidate.slug === courseSlug && candidate.status === "published",
  );
  const lessons = allLessons
    .filter((lesson) => lesson.course === courseSlug && lesson.status === "published")
    .sort((left, right) => left.order - right.order);
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const lesson = lessons[lessonIndex];

  if (!course || !lesson) {
    return undefined;
  }

  const relatedLessons = lesson.relatedLessons
    .map((slug) => lessons.find((candidate) => candidate.slug === slug))
    .filter((candidate) => candidate !== undefined);

  return {
    course,
    lesson,
    previousLesson: lessons[lessonIndex - 1],
    nextLesson: lessons[lessonIndex + 1],
    relatedLessons,
  };
}

export function getTableOfContents(source: string) {
  const seen = new Map<string, number>();
  const headings: { depth: number; id: string; title: string }[] = [];
  let fence: { marker: "`" | "~"; length: number } | undefined;

  for (const line of source.split("\n")) {
    const fenceMarker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
    if (fenceMarker) {
      if (!fence) {
        fence = {
          marker: fenceMarker.startsWith("`") ? "`" : "~",
          length: fenceMarker.length,
        };
      } else if (fenceMarker[0] === fence.marker && fenceMarker.length >= fence.length) {
        fence = undefined;
      }
      continue;
    }

    if (fence) {
      continue;
    }

    const match = /^(#{2,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const title = match[2].replace(/[`*_~]/g, "").trim();
    const baseId = title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
    if (!baseId) {
      continue;
    }

    const occurrence = seen.get(baseId) ?? 0;
    seen.set(baseId, occurrence + 1);
    headings.push({
      depth: match[1].length,
      id: occurrence === 0 ? baseId : `${baseId}-${occurrence}`,
      title,
    });
  }

  return headings;
}
