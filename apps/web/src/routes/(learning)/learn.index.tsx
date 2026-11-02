import { createFileRoute } from "@tanstack/react-router";

import { LearnExplore } from "../../features/(learning)";

export const Route = createFileRoute("/(learning)/learn/")({
  head: () => ({ meta: [{ title: "Explore courses | Edunesia Learn" }] }),
  component: LearnExplore,
});
