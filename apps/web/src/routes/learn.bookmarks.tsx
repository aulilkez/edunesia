import { createFileRoute } from "@tanstack/react-router";

import { requireVerifiedLearner } from "../features/(auth)";
import { LearnerHome } from "../features/(learning)";

export const Route = createFileRoute("/learn/bookmarks")({
  beforeLoad: ({ location }) => requireVerifiedLearner(location),
  head: () => ({ meta: [{ title: "Bookmarks | Edunesia" }] }),
  component: () => <LearnerHome page="bookmarks" />,
});
