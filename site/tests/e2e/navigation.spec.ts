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
      () => nav.getByRole("link", { name: "Overview", exact: true }).click(),
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

  test("sidebar groups start collapsed, except the branch holding the current page", async ({
    page,
  }) => {
    await page.goto("/docs/architecture/layers/identity/identity");
    const sidebar = page.getByRole("navigation", { name: "Documentation" });

    // The current page's ancestors are open, so the reader can see where they are.
    await expect(sidebar.getByRole("button", { name: "Collapse Architecture" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(sidebar.getByRole("link", { name: "Identity", exact: true })).toBeVisible();

    // Everything else is folded away.
    await expect(sidebar.getByRole("button", { name: "Expand GovOps Metrics" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(sidebar.getByRole("link", { name: "Approved Metrics" })).toHaveCount(0);
  });

  test("the chevron folds and unfolds a group without navigating", async ({ page }) => {
    await page.goto("/docs/architecture");
    const sidebar = page.getByRole("navigation", { name: "Documentation" });

    await sidebar.getByRole("button", { name: "Expand GovOps Metrics" }).click();
    await expect(sidebar.getByRole("link", { name: "Approved Metrics" })).toBeVisible();
    await expect(page).toHaveURL(/\/docs\/architecture$/);

    await sidebar.getByRole("button", { name: "Collapse GovOps Metrics" }).click();
    await expect(sidebar.getByRole("link", { name: "Approved Metrics" })).toHaveCount(0);
  });

  test("the sidebar navigates client-side between documents", async ({ page }) => {
    await page.goto("/docs/architecture");
    const sidebar = page.getByRole("navigation", { name: "Documentation" });

    await sidebar.getByRole("button", { name: "Expand GovOps Metrics" }).click();
    await sidebar.getByRole("button", { name: "Expand Metric development" }).click();

    await expectClientNavigation(
      page,
      () => sidebar.getByRole("link", { name: "Metric Definition Template" }).click(),
      /\/docs\/metrics\/metric_development\/definition_template$/,
      /Metric Definition Template/,
    );
  });
});

test("previous and next page through the documents client-side", async ({ page }) => {
  await page.goto("/docs/standards/acc/authorization-capability-catalog-design");

  await expectClientNavigation(
    page,
    () => page.getByRole("navigation", { name: "Documents" }).getByText("Next").click(),
    /\/docs\/standards\/acc\/authorization-capability-catalog-use-cases$/,
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

test("the mobile menu opens a collapsible tree and navigates client-side", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "the mobile menu replaces the sidebar below the large breakpoint");

  await page.goto("/docs");
  const nav = page.getByRole("navigation", { name: "Documentation sections" });

  // Closed by default: no wall of links up front.
  await expect(nav.getByRole("button", { name: "Browse documentation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(nav.getByRole("link", { name: "GovOps Metrics" })).toBeHidden();

  await nav.getByRole("button", { name: "Browse documentation" }).click();
  await expect(nav.getByRole("link", { name: "GovOps Metrics" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Approved Metrics" })).toHaveCount(0);

  await nav.getByRole("button", { name: "Expand GovOps Metrics" }).click();
  await expectClientNavigation(
    page,
    () => nav.getByRole("link", { name: "Approved Metrics" }).click(),
    /\/docs\/metrics\/approved_metrics$/,
    /Approved Metrics/,
  );

  // Choosing a page closes the menu.
  await expect(nav.getByRole("button", { name: "Browse documentation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
