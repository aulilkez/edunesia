import { createFileRoute } from "@tanstack/react-router";

import { SignUpPage } from "../components/auth-pages";
import { redirectSignedInLearner } from "../lib/auth-guard";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: redirectSignedInLearner,
  component: SignUpPage,
});
