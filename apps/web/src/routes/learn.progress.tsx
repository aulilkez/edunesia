import { createFileRoute } from "@tanstack/react-router";

import { LearnerHome } from "../components/learn-experience";

export const Route = createFileRoute("/learn/progress")({
  head: () => ({ meta: [{ title: "Learning progress | Edunesia" }] }),
  component: () => <LearnerHome page="progress" />,
});
