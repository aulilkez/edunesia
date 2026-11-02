import { createFileRoute } from "@tanstack/react-router";

import { redirectSignedInLearner, SignUpPage } from "../../features/(auth)";
import { getOAuthProviderStatus } from "../../features/(auth)/api/oauth-provider-status";

export const Route = createFileRoute("/(auth)/sign-up")({
  beforeLoad: redirectSignedInLearner,
  loader: () => getOAuthProviderStatus(),
  component: SignUpRoute,
});

function SignUpRoute() {
  return <SignUpPage providers={Route.useLoaderData()} />;
}
