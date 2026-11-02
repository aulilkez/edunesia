import { createFileRoute } from "@tanstack/react-router";

import { SampleLessonPage } from "../../features/(learning)/components/lesson/sample-lesson";

export const Route = createFileRoute("/(learning)/learn/sample")({
  head: () => ({
    meta: [
      { title: "Mathematical Models | Edunesia" },
      {
        name: "description",
        content: "A sample Edunesia lesson with calculus, matrices, code, and diagrams.",
      },
    ],
  }),
  component: SampleLessonPage,
});
