import { createFileRoute } from "@tanstack/react-router";

import { LearnerHome } from "../components/learn-experience";

export const Route = createFileRoute("/learn/my-learning")({
  head: () => ({ meta: [{ title: "My learning | Edunesia" }] }),
  component: () => <LearnerHome page="my-learning" />,
});
