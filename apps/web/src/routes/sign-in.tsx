import { createFileRoute } from "@tanstack/react-router";

import { SignInPage } from "../components/auth-pages";
import { redirectSignedInLearner } from "../lib/auth-guard";

export const Route = createFileRoute("/sign-in")({
  beforeLoad: redirectSignedInLearner,
  component: SignInPage,
});
