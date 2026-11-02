import { expect, test } from "@playwright/test";

test("authentication routes render their forms and policy state", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Remember me" })).toBeVisible();

  await page.goto("/sign-up");
  await expect(page.getByText(/Registration is paused until the Terms of Service/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeDisabled();
});

test("password recovery, verification, and verified routes are reachable", async ({ page }) => {
  await page.goto("/reset-password");
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();

  await page.goto("/verify");
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resend verification email" })).toBeDisabled();

  await page.goto("/email-verified");
  await expect(page.getByRole("heading", { name: "Email verified" })).toBeVisible();
});

test("learner pages redirect unauthenticated visitors to sign in", async ({ page }) => {
  await page.goto("/learn/my-learning");
  await expect(page).toHaveURL(/\/sign-in\?redirect=/);
});
