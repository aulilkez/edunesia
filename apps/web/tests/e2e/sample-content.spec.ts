import { expect, test } from "@playwright/test";

test("sample lesson renders math, highlighted code, and a Mermaid diagram", async ({ page }) => {
  await page.goto("/learn/sample");

  await expect(page.getByRole("heading", { level: 1, name: /Mathematical Models/ })).toBeVisible();
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.locator("[data-slot=code-block-line]").first()).toBeVisible();
  await expect(page.getByRole("img", { name: "Educational diagram" }).locator("svg")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy" }).first()).toBeVisible();
});

test("math and diagram output remain visible with theme token styling", async ({ page }) => {
  await page.goto("/learn/sample");
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.getByRole("img", { name: "Educational diagram" }).locator("svg")).toBeVisible();
});
