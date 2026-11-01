import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { clientEnv } from "@edunesia/env/client";
import type { Auth } from "./server";

export const authClient = createAuthClient({
  ...(clientEnv.APP_URL ? { baseURL: clientEnv.APP_URL } : {}),
  plugins: [inferAdditionalFields<Auth>()],
});
