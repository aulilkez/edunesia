import { createFileRoute } from "@tanstack/react-router";

import { OtpPage } from "../../features/(auth)";

export const Route = createFileRoute("/(auth)/otp")({
  head: () => ({ meta: [{ title: "Sign in with a code | Edunesia" }] }),
  component: OtpPage,
});
