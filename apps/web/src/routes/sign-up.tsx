import { createFileRoute } from "@tanstack/react-router";

import { redirectSignedInLearner, SignUpPage } from "../features/(auth)";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: redirectSignedInLearner,
  component: SignUpPage,
});
