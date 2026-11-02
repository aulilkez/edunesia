import { createFileRoute } from "@tanstack/react-router";

import { redirectSignedInLearner, SignInPage } from "../features/(auth)";

export const Route = createFileRoute("/sign-in")({
  beforeLoad: redirectSignedInLearner,
  component: SignInPage,
});
