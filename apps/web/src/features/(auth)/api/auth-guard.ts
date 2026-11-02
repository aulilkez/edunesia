import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { auth } from "../../../server/api";

export const getAuthStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers });
  if (!session) return "anonymous" as const;
  return session.user.emailVerified ? ("verified" as const) : ("unverified" as const);
});

export async function requireVerifiedLearner(location: { href: string }) {
  if ((await getAuthStatus()) !== "verified") {
    throw redirect({ href: `/sign-in?redirect=${encodeURIComponent(location.href)}` });
  }
}

export async function redirectSignedInLearner() {
  const status = await getAuthStatus();
  if (status === "verified") throw redirect({ href: "/learn/my-learning" });
  if (status === "unverified") throw redirect({ href: "/verify" });
}
