import { expect, test } from "@playwright/test";
import type { Page, Response } from "@playwright/test";

/**
 * Client-side navigation.
 *
 * These assert three things together, and all three matter. The URL changing is not enough: React
 * Router falls back to a full document load when a single-fetch request fails, so a broken data
 * route still ends up on the right page and a URL-only assertion passes. The marker proves the
 * page was never reloaded, and the response check proves no `.data` request 404'd on the way.
 */
async function expectClientNavigation(
  page: Page,
  open: () => Promise<void>,
  expectedUrl: RegExp,
  expectedHeading: RegExp,
) {
  const failed: string[] = [];
  const onResponse = (response: Response) => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
  };
  page.on("response", onResponse);

  await page.evaluate(() => {
    (window as unknown as { __notReloaded: boolean }).__notReloaded = true;
  });

  await open();
  await expect(page).toHaveURL(expectedUrl);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(expectedHeading);

  const survived = await page.evaluate(
    () => (window as unknown as { __notReloaded?: boolean }).__notReloaded === true,
  );

  page.off("response", onResponse);
  expect(failed, `failed requests during navigation: ${failed.join(", ")}`).toEqual([]);
  expect(survived, "the page did a full reload instead of navigating client-side").toBe(true);
}

test.describe("desktop chrome", () => {
  // The header nav and the sidebar are both hidden below the large breakpoint.
  test.skip(({ isMobile }) => Boolean(isMobile), "desktop-only chrome");

  test("the header links navigate client-side", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });

    await expectClientNavigation(
      page,
      () => nav.getByRole("link", { name: "Documentation", exact: true }).click(),
      /\/docs$/,
      /GovOps documentation/,
    );

    await expectClientNavigation(
      page,
      () => nav.getByRole("link", { name: "Architecture", exact: true }).click(),
      /\/docs\/architecture$/,
      /Architecture/,
    );
  });

  test("the sidebar navigates client-side between documents", async ({ page }) => {
    await page.goto("/docs/architecture");

    await expectClientNavigation(
      page,
      () =>
        page
          .getByRole("navigation", { name: "Documentation" })
          .getByRole("link", { name: "Denial Ratio Trend" })
          .click(),
      /\/docs\/metrics\/denial-ratio-trend$/,
      /Denial Ratio Trend/,
    );
  });
});

test("previous and next page through the documents client-side", async ({ page }) => {
  await page.goto("/docs/acc/authorization-capability-catalog-design");

  await expectClientNavigation(
    page,
    () => page.getByRole("navigation", { name: "Documents" }).getByText("Next").click(),
    /\/docs\/acc\/authorization-capability-catalog-use-cases$/,
    /Use Cases/,
  );
});

test("every document's data route resolves", async ({ request, baseURL }) => {
  // The failure this guards was invisible to page-level tests: documents rendered on a full load
  // and only single-fetch navigation broke.
  const sitemap = await (await request.get(`${baseURL}/sitemap.xml`)).text();
  const docPaths = [...sitemap.matchAll(/<loc>[^<]*?(\/docs[^<]*)<\/loc>/g)].map((m) => m[1]);

  expect(docPaths.length).toBeGreaterThan(8);

  for (const path of docPaths) {
    const response = await request.get(`${baseURL}${path}.data`);
    expect(response.status(), `${path}.data`).toBe(200);
  }
});
