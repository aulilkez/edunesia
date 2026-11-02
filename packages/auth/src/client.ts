import { inferAdditionalFields } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { clientEnv } from "@edunesia/env/client";

import type { Auth } from "./server";

export const authClient = createAuthClient({
  ...(clientEnv.APP_URL ? { baseURL: clientEnv.APP_URL } : {}),
  plugins: [inferAdditionalFields<Auth>(), emailOTPClient()],
});
