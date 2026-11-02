import { createFileRoute } from "@tanstack/react-router";

import { LearnerHome } from "../components/learn-experience";

export const Route = createFileRoute("/learn/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks | Edunesia" }] }),
  component: () => <LearnerHome page="bookmarks" />,
});
