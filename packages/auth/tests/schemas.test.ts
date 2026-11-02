import { expect, test } from "vite-plus/test";

import {
  LEGAL_DOCUMENTS_AVAILABLE,
  forgotPasswordSchema,
  emailOtpSchema,
  resetPasswordSchema,
  signInSchema,
  signUpFormSchema,
  signUpSchema,
} from "../src/schemas";

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

test("sign-up schema normalizes identity values and validates password and consent", () => {
  const valid = {
    name: " Ari Data ",
    email: " Ari@Example.com ",
    password: "StrongPassword12",
    acceptTerms: true,
  };
  const parsed = signUpSchema.safeParse(valid);
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.name).toBe("Ari Data");
    expect(parsed.data.email).toBe("ari@example.com");
  }
  expect(signUpSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, password: "alllowercase123" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, password: "NoNumberPassword" }).success).toBe(false);
  expect(signUpSchema.safeParse({ ...valid, acceptTerms: false }).success).toBe(false);
});

test("account creation remains blocked until policy documents are published", () => {
  expect(LEGAL_DOCUMENTS_AVAILABLE).toBe(false);
});

test("sign-up confirmation and recovery forms reject mismatched passwords", () => {
  const signup = {
    name: "Ari Data",
    email: "ari@example.com",
    password: "StrongPassword12",
    confirmPassword: "StrongPassword12",
    acceptTerms: true,
  };
  expect(signUpFormSchema.safeParse(signup).success).toBe(true);
  expect(
    signUpFormSchema.safeParse({ ...signup, confirmPassword: "DifferentPassword12" }).success,
  ).toBe(false);
  expect(
    resetPasswordSchema.safeParse({
      password: "StrongPassword12",
      confirmPassword: "StrongPassword12",
    }).success,
  ).toBe(true);
  expect(
    resetPasswordSchema.safeParse({ password: "StrongPassword12", confirmPassword: "different" })
      .success,
  ).toBe(false);
  expect(forgotPasswordSchema.safeParse({ email: " Person@Example.com " }).data?.email).toBe(
    "person@example.com",
  );
  expect(emailOtpSchema.safeParse({ email: "person@example.com", otp: "123456" }).success).toBe(
    true,
  );
  expect(emailOtpSchema.safeParse({ email: "person@example.com", otp: "12a456" }).success).toBe(
    false,
  );
  expect(emailOtpSchema.safeParse({ email: "person@example.com", otp: "12345" }).success).toBe(
    false,
  );
});
