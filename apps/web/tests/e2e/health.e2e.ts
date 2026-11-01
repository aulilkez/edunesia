import { expect, test } from "@playwright/test";

test("health page renders the service overview", async ({ page }) => {
  await page.goto("/health");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Edunesia" }).first()).toBeVisible();
});
