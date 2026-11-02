import { createFileRoute } from "@tanstack/react-router";

import { NotFoundPage } from "../components/shared/not-found-page";
import { isPublishedLesson, PublicLesson } from "../features/(learning)";

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
