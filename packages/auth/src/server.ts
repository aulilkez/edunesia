import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";

import type { Database } from "@edunesia/database";
import { accounts, sessions, users, verifications } from "@edunesia/database/schema";
import type { ServerEnv } from "@edunesia/env/server";
import { serverEnv } from "@edunesia/env/server";

import { LEGAL_DOCUMENTS_AVAILABLE, signUpAuthSchema } from "./schemas";

export function createAuth(database: Database, env: ServerEnv = serverEnv) {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(database, {
      provider: "pg",
      schema: { user: users, session: sessions, account: accounts, verification: verifications },
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    socialProviders: {
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } }
        : {}),
      ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
        ? { github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET } }
        : {}),
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    user: {
      additionalFields: {
        acceptTerms: { type: "boolean", defaultValue: false, input: true },
        acceptTermsAt: { type: "date", required: false, input: false },
        role: { type: "string", defaultValue: "member", input: false },
        banned: { type: "boolean", defaultValue: false, input: false },
        banReason: { type: "string", required: false, input: false },
        banExpires: { type: "date", required: false, input: false },
        deletedAt: { type: "date", required: false, input: false },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (context) => {
        if (context.path !== "/sign-up/email") return;
        if (!LEGAL_DOCUMENTS_AVAILABLE) {
          throw APIError.fromStatus("FORBIDDEN", {
            message:
              "Sign-up is unavailable until the Terms of Service and Privacy Policy are published.",
          });
        }
        const parsed = signUpAuthSchema.safeParse(context.body);
        if (!parsed.success) {
          throw APIError.fromStatus("BAD_REQUEST", {
            message: "Please check your sign-up details and accept the required policies.",
          });
        }
      }),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user, context) => {
            if (!LEGAL_DOCUMENTS_AVAILABLE) return false;
            if (context?.path !== "/sign-up/email") return;
            if (user.acceptTerms !== true) return false;
            return { data: { ...user, acceptTermsAt: new Date() } };
          },
        },
      },
    },
    trustedOrigins: [env.BETTER_AUTH_URL],
  });
}

export type Auth = ReturnType<typeof createAuth>;
