import { createServerFn } from "@tanstack/react-start";

import { serverEnv } from "@edunesia/env/server";

export const getOAuthProviderStatus = createServerFn({ method: "GET" }).handler(() => ({
  google: Boolean(serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET),
  github: Boolean(serverEnv.GITHUB_CLIENT_ID && serverEnv.GITHUB_CLIENT_SECRET),
  development: serverEnv.APP_ENV === "development",
}));

export type OAuthProviderStatus = {
  google: boolean;
  github: boolean;
  development: boolean;
};
