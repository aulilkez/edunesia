import { z } from "zod";

const environmentSchema = z.object({
  APP_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  DATABASE_URL: z.string().url().default("postgres://postgres:postgres@localhost:5432/edunesia"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default("edunesia-local-development-secret-change-before-deploy"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  VITE_APP_URL: z.url().optional(),
  EMAIL_PROVIDER: z.enum(["smtp"]).default("smtp"),
  SMTP_HOST: z.string().min(1).default("127.0.0.1"),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(1025),
  SMTP_SECURE: z
    .preprocess((value) => {
      if (typeof value !== "string") return value;
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
      return value;
    }, z.boolean())
    .default(false),
  SMTP_USER: z.preprocess(
    (value) => (typeof value === "string" && !value.trim() ? undefined : value),
    z.string().min(1).optional(),
  ),
  SMTP_PASS: z.preprocess(
    (value) => (typeof value === "string" && !value.trim() ? undefined : value),
    z.string().min(1).optional(),
  ),
  SMTP_FROM_EMAIL: z.email().default("auth@localhost"),
  SMTP_FROM_NAME: z.string().trim().min(1).default("Edunesia"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

export function parseServerEnvironment(environment: Record<string, string | undefined>) {
  const parsedEnvironment = environmentSchema.parse(environment);
  if (Boolean(parsedEnvironment.SMTP_USER) !== Boolean(parsedEnvironment.SMTP_PASS)) {
    throw new Error("SMTP_USER and SMTP_PASS must either both be set or both be empty.");
  }
  if (
    Boolean(parsedEnvironment.GOOGLE_CLIENT_ID) !== Boolean(parsedEnvironment.GOOGLE_CLIENT_SECRET)
  ) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together.");
  }
  if (
    Boolean(parsedEnvironment.GITHUB_CLIENT_ID) !== Boolean(parsedEnvironment.GITHUB_CLIENT_SECRET)
  ) {
    throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be configured together.");
  }

  if (parsedEnvironment.APP_ENV === "production") {
    const missing = [
      "DATABASE_URL",
      "BETTER_AUTH_SECRET",
      "BETTER_AUTH_URL",
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "SMTP_SECURE",
      "SMTP_FROM_EMAIL",
      "SMTP_FROM_NAME",
    ].filter((key) => !environment[key]?.trim());
    if (missing.length > 0) {
      throw new Error(
        `Required production environment variables are missing: ${missing.join(", ")}`,
      );
    }
  }

  return parsedEnvironment;
}

export const serverEnv = Object.freeze(parseServerEnvironment(process.env));
export type ServerEnv = typeof serverEnv;
