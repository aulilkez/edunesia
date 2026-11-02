import { createFileRoute } from "@tanstack/react-router";

import { LearnerHome } from "../components/learn-experience";
import { requireVerifiedLearner } from "../lib/auth-guard";

export const Route = createFileRoute("/learn/my-learning")({
  beforeLoad: ({ location }) => requireVerifiedLearner(location),
  head: () => ({ meta: [{ title: "My learning | Edunesia" }] }),
  component: () => <LearnerHome page="my-learning" />,
});
