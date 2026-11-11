import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const serverSchema = {
  APP_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  DATABASE_URL: z.url().default("postgresql://postgres:postgres@localhost:5432/edunesia"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default("edunesia-local-development-secret-change-before-deploy"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  EMAIL_PROVIDER: z.enum(["smtp"]).default("smtp"),
  SMTP_HOST: z.string().trim().min(1).default("127.0.0.1"),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(1025),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default(false),
  SMTP_USER: z.string().trim().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  SMTP_FROM_EMAIL: z.email().default("auth@localhost"),
  SMTP_FROM_NAME: z.string().trim().min(1).default("Edunesia"),
  GOOGLE_CLIENT_ID: z.string().trim().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GITHUB_CLIENT_ID: z.string().trim().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
};

const runtimeEnv = { ...process.env };

export const serverEnv = createEnv({
  server: serverSchema,
  runtimeEnv,
  emptyStringAsUndefined: true,
  createFinalSchema: (shape) =>
    z.object(shape).superRefine((environment, context) => {
      for (const [idKey, secretKey] of [
        ["SMTP_USER", "SMTP_PASS"],
        ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
        ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
      ] as const) {
        if (Boolean(environment[idKey]) !== Boolean(environment[secretKey])) {
          context.addIssue({
            code: "custom",
            path: [idKey],
            message: `${idKey} and ${secretKey} must either both be set or both be empty.`,
          });
        }
      }

      if (environment.APP_ENV === "production") {
        const requiredInProduction = [
          "DATABASE_URL",
          "BETTER_AUTH_SECRET",
          "BETTER_AUTH_URL",
          "SMTP_HOST",
          "SMTP_PORT",
          "SMTP_SECURE",
          "SMTP_FROM_EMAIL",
          "SMTP_FROM_NAME",
          "SMTP_USER",
          "SMTP_PASS",
        ] as const;

        for (const key of requiredInProduction) {
          if (!runtimeEnv[key]?.trim()) {
            context.addIssue({
              code: "custom",
              path: [key],
              message: `${key} is required in production.`,
            });
          }
        }
      }
    }),
});

export type ServerEnv = typeof serverEnv;
