import { z } from "zod";

const environmentSchema = z.object({
  APP_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  DATABASE_URL: z.string().url().default("postgres://postgres:postgres@localhost:5432/edunesia"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default("edunesia-local-development-secret-change-before-deploy"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

const parsedEnvironment = environmentSchema.parse(process.env);

if (parsedEnvironment.APP_ENV === "production") {
  const missing = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"].filter(
    (key) => !process.env[key]?.trim(),
  );
  if (missing.length > 0) {
    throw new Error(`Required production environment variables are missing: ${missing.join(", ")}`);
  }
}

export const serverEnv = Object.freeze(parsedEnvironment);
export type ServerEnv = typeof serverEnv;
