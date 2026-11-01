import { expect, test } from "vite-plus/test";

import { LEGAL_DOCUMENTS_AVAILABLE, signInSchema, signUpSchema } from "../src/schemas";

test("sign-in schema validates email and nonempty password", () => {
  const valid = signInSchema.safeParse({
    email: " person@example.com ",
    password: "secret",
    rememberMe: true,
  });
  expect(valid.success).toBe(true);
  if (valid.success) expect(valid.data.email).toBe("person@example.com");
  expect(
    signInSchema.safeParse({ email: "person@example.com", password: "secret", rememberMe: false })
      .success,
  ).toBe(true);
  expect(
    signInSchema.safeParse({ email: "not-an-email", password: "secret", rememberMe: true }).success,
  ).toBe(false);
  expect(
    signInSchema.safeParse({ email: "person@example.com", password: "", rememberMe: true }).success,
  ).toBe(false);
});

test("sign-up schema normalizes identity values and validates workspace/password/consent", () => {
  const valid = {
    name: " Ari Data ",
    email: " Ari@Example.com ",
    workspaceName: " Acme workspace ",
    password: "StrongPassword12",
    acceptTerms: true,
  };
  const parsed = signUpSchema.safeParse(valid);
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.name).toBe("Ari Data");
    expect(parsed.data.email).toBe("ari@example.com");
    expect(parsed.data.workspaceName).toBe("Acme workspace");
  }
  expect(signUpSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, password: "alllowercase123" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, password: "NoNumberPassword" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, acceptTerms: false }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, workspaceName: " " }).success).toBe(false);
});

test("account creation remains blocked until policy documents are published", () => {
  expect(LEGAL_DOCUMENTS_AVAILABLE).toBe(false);
});
