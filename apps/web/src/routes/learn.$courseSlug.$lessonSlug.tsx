import { createFileRoute } from "@tanstack/react-router";

import { isPublishedLesson, PublicLesson } from "../components/learn-experience";
import { NotFoundPage } from "../components/not-found-page";

export const Route = createFileRoute("/learn/$courseSlug/$lessonSlug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.lessonSlug.replaceAll("-", " ")} | Edunesia Learn` }],
  }),
  component: LessonRoute,
});

function LessonRoute() {
  const { courseSlug, lessonSlug } = Route.useParams();
  if (!isPublishedLesson(courseSlug, lessonSlug)) return <NotFoundPage />;
  return <PublicLesson courseSlug={courseSlug} lessonSlug={lessonSlug} />;
}
