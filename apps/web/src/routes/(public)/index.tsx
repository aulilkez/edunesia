import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "../../features/(public)";

export const Route = createFileRoute("/(public)/")({
  head: () => ({
    meta: [
      { title: "Edunesia — Open Knowledge. Unlimited Possibilities." },
      {
        name: "description",
        content:
          "Discover, learn, and share knowledge across every discipline with a global learning ecosystem built by the community.",
      },
    ],
  }),
  component: HomePage,
});
