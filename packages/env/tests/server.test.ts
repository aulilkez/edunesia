import { expect, test } from "vite-plus/test";

import { parseServerEnvironment } from "../src/server";

function throws(operation: () => unknown) {
  try {
    operation();
    return false;
  } catch {
    return true;
  }
}

test("SMTP server settings are parsed with safe local defaults", () => {
  const environment = parseServerEnvironment({});
  expect(environment.EMAIL_PROVIDER).toBe("smtp");
  expect(environment.SMTP_HOST).toBe("127.0.0.1");
  expect(environment.SMTP_PORT).toBe(1025);
  expect(environment.SMTP_SECURE).toBe(false);
  expect(environment.SMTP_FROM_EMAIL).toBe("auth@localhost");
});

test("SMTP settings validate ports, booleans, sender address, and paired credentials", () => {
  const environment = parseServerEnvironment({
    SMTP_HOST: "mail.example.test",
    SMTP_PORT: "465",
    SMTP_SECURE: "true",
    SMTP_USER: "edunesia",
    SMTP_PASS: "private",
    SMTP_FROM_EMAIL: "auth@example.test",
    SMTP_FROM_NAME: "Edunesia",
  });
  expect(environment.SMTP_PORT).toBe(465);
  expect(environment.SMTP_SECURE).toBe(true);
  expect(throws(() => parseServerEnvironment({ SMTP_SECURE: "yes" }))).toBe(true);
  expect(throws(() => parseServerEnvironment({ SMTP_FROM_EMAIL: "invalid" }))).toBe(true);
  expect(() => parseServerEnvironment({ SMTP_USER: "edunesia" })).toThrow(
    "SMTP_USER and SMTP_PASS must either both be set or both be empty",
  );
});

test("production requires SMTP connection and sender configuration", () => {
  expect(() => parseServerEnvironment({ APP_ENV: "production" })).toThrow(
    "Required production environment variables are missing",
  );
  const environment = parseServerEnvironment({
    APP_ENV: "production",
    DATABASE_URL: "postgres://postgres:postgres@example.test:5432/edunesia",
    BETTER_AUTH_SECRET: "a-production-secret-that-is-at-least-32-characters",
    BETTER_AUTH_URL: "https://learn.example.test",
    SMTP_HOST: "smtp.example.test",
    SMTP_PORT: "587",
    SMTP_SECURE: "false",
    SMTP_USER: "edunesia",
    SMTP_PASS: "secret",
    SMTP_FROM_EMAIL: "auth@example.test",
    SMTP_FROM_NAME: "Edunesia",
  });
  expect(environment.APP_ENV).toBe("production");
});
