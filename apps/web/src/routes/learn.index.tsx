import { createFileRoute } from "@tanstack/react-router";

import { LearnExplore } from "../components/learn-experience";

export const Route = createFileRoute("/learn/")({
  head: () => ({ meta: [{ title: "Explore courses | Edunesia Learn" }] }),
  component: LearnExplore,
});
