import { createFileRoute } from "@tanstack/react-router";

import { LearnerHome } from "../components/learn-experience";
import { requireVerifiedLearner } from "../lib/auth-guard";

export const Route = createFileRoute("/learn/progress")({
  beforeLoad: ({ location }) => requireVerifiedLearner(location),
  head: () => ({ meta: [{ title: "Learning progress | Edunesia" }] }),
  component: () => <LearnerHome page="progress" />,
});
