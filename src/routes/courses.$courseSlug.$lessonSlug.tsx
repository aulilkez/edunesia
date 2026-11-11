import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPublishedLesson, getTableOfContents } from "@/features/content";
import { LessonPage as LessonContentPage } from "@/features/learning";
import { clientEnv } from "@/lib/env/client";

export const Route = createFileRoute("/courses/$courseSlug/$lessonSlug")({
  loader: ({ params }) => {
    const content = getPublishedLesson(params.courseSlug, params.lessonSlug);
    if (!content) {
      throw notFound();
    }
    return content;
  },
  head: ({ params }) => {
    const content = getPublishedLesson(params.courseSlug, params.lessonSlug);
    if (!content) {
      return {};
    }

    const { course, lesson } = content;
    const canonicalUrl = new URL(
      `/courses/${course.slug}/${lesson.slug}`,
      clientEnv.APP_URL,
    ).toString();

    return {
      meta: [
        { title: `${lesson.title} | ${course.title} | Edunesia` },
        { name: "description", content: lesson.description },
        { property: "og:title", content: lesson.title },
        { property: "og:description", content: lesson.description },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const content = Route.useLoaderData();
  return (
    <LessonContentPage content={content} headings={getTableOfContents(content.lesson.content)} />
  );
}
