import { createFileRoute } from "@tanstack/react-router";

import { EmailVerifiedPage } from "../../features/(auth)";
import { getAuthStatus } from "../../features/(auth)/api/auth-guard";

export const Route = createFileRoute("/(auth)/email-verified")({
  loader: () => getAuthStatus(),
  component: EmailVerifiedRoute,
});

function EmailVerifiedRoute() {
  return <EmailVerifiedPage status={Route.useLoaderData()} />;
}
