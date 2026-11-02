import { createFileRoute } from "@tanstack/react-router";

import { requireVerifiedLearner } from "../../features/(auth)";
import { LearnerHome } from "../../features/(learning)";

export const Route = createFileRoute("/(learning)/learn/my-learning")({
  beforeLoad: ({ location }) => requireVerifiedLearner(location),
  head: () => ({ meta: [{ title: "My learning | Edunesia" }] }),
  component: () => <LearnerHome page="my-learning" />,
});
