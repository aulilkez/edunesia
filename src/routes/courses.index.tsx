import { createFileRoute } from "@tanstack/react-router";

import { publishedCourses } from "@/features/content";
import { CoursesPage } from "@/features/learning";
import { clientEnv } from "@/lib/env/client";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses | Edunesia" },
      {
        name: "description",
        content: "Browse curated, version-controlled learning courses from Edunesia.",
      },
    ],
    links: [{ rel: "canonical", href: new URL("/courses", clientEnv.APP_URL).toString() }],
  }),
  component: CoursesRoutePage,
});

function CoursesRoutePage() {
  return <CoursesPage courses={publishedCourses} />;
}
