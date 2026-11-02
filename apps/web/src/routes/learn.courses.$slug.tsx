import { createFileRoute } from "@tanstack/react-router";

import { CourseDetail, isPublishedCourse } from "../components/learn-experience";
import { NotFoundPage } from "../components/not-found-page";

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
