import { expect, test } from "@playwright/test";

test.describe("keyboard and theme", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "keyboard shortcuts are a desktop affordance");

  test("Ctrl+K opens search and Enter follows the first result", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    await expect(dialog).toBeVisible();

    await page.keyboard.type("capability catalog");
    await expect(
      dialog.getByRole("button").filter({ hasText: "Authorization Capability Catalog" }).first(),
    ).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/docs\/acc/);
  });

  test("Escape closes search", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("the theme choice survives a reload", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /theme/i }).click();
    await page.getByRole("button", { name: /theme/i }).click();
    const chosen = await page.evaluate(() => document.documentElement.dataset["theme"]);
    expect(chosen).toBeTruthy();

    await page.reload();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset["theme"]))
      .toBe(chosen);
  });

  test("the skip link reaches the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });
});
