import { createFileRoute } from "@tanstack/react-router";

import { NotFoundPage } from "../components/shared/not-found-page";
import { CourseDetail, isPublishedCourse } from "../features/(learning)";

export const Route = createFileRoute("/learn/courses/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replaceAll("-", " ")} | Edunesia Learn` }],
  }),
  component: CourseRoute,
});

function CourseRoute() {
  const { slug } = Route.useParams();
  if (!isPublishedCourse(slug)) return <NotFoundPage />;
  return <CourseDetail slug={slug} />;
}
