import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

// The shortcut listener attaches on hydration, so a press right after load can be lost.
async function openSearch(page: Page) {
  const dialog = page.getByRole("dialog", { name: "Search documentation" });
  await expect(async () => {
    if (!(await dialog.isVisible())) await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass();
  return dialog;
}

test.describe("keyboard and theme", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "keyboard shortcuts are a desktop affordance");

  test("Ctrl+K opens search and Enter follows the first result", async ({ page }) => {
    await page.goto("/");

    const dialog = await openSearch(page);

    await page.keyboard.type("capability catalog");
    await expect(
      dialog.getByRole("button").filter({ hasText: "Authorization Capability Catalog" }).first(),
    ).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/docs\/acc/);
  });

  test("Escape closes search", async ({ page }) => {
    await page.goto("/");
    await openSearch(page);
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
