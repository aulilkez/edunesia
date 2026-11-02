import { createFileRoute } from "@tanstack/react-router";

import { requireVerifiedLearner } from "../features/(auth)";
import { LearnerHome } from "../features/(learning)";

export const Route = createFileRoute("/learn/progress")({
  beforeLoad: ({ location }) => requireVerifiedLearner(location),
  head: () => ({ meta: [{ title: "Learning progress | Edunesia" }] }),
  component: () => <LearnerHome page="progress" />,
});
