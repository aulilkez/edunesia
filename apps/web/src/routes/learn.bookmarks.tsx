import { createFileRoute } from "@tanstack/react-router";

import { LearnerHome } from "../components/learn-experience";
import { requireVerifiedLearner } from "../lib/auth-guard";

export const Route = createFileRoute("/learn/bookmarks")({
  beforeLoad: ({ location }) => requireVerifiedLearner(location),
  head: () => ({ meta: [{ title: "Bookmarks | Edunesia" }] }),
  component: () => <LearnerHome page="bookmarks" />,
});
