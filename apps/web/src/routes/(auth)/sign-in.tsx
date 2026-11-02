import { createFileRoute } from "@tanstack/react-router";

import { redirectSignedInLearner, SignInPage } from "../../features/(auth)";
import { getOAuthProviderStatus } from "../../features/(auth)/api/oauth-provider-status";

export const Route = createFileRoute("/(auth)/sign-in")({
  beforeLoad: redirectSignedInLearner,
  loader: () => getOAuthProviderStatus(),
  component: SignInRoute,
});

function SignInRoute() {
  return <SignInPage providers={Route.useLoaderData()} />;
}
