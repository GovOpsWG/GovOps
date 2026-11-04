import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the landing page presents the working group and its deliverables", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Measure risk, transparency,",
  );
  await expect(page.getByRole("link", { name: "Read the architecture" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Everything is public, in the open, and editable" }),
  ).toBeVisible();
});

test("the layer tabs switch the described layer", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Governance layer" })).toBeVisible();
  await page.getByRole("tab", { name: "Access Management" }).click();
  await expect(page.getByRole("heading", { name: "Access Management layer" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Governance layer" })).toBeHidden();
});

test("a document renders with its diagrams, tables and contents intact", async ({ page }) => {
  await page.goto("/docs/architecture");

  await expect(page.getByRole("heading", { level: 1, name: "Architecture" })).toBeVisible();
  await expect(page.locator(".doc-diagram").first()).toContainText(
    "Govern → Authorize → Execute → Observe → Detect → Respond",
  );
  await expect(page.locator(".doc-diagram", { hasText: "GOVERNANCE PLANE" })).toHaveCount(1);
  await expect(page.locator(".doc-table-scroll").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/GovOpsWG/GovOps/blob/main/docs/architecture/README.md",
  );
});

test("a cross-document link written for GitHub lands on the right page", async ({ page }) => {
  await page.goto("/docs/architecture/functional-components/compliance");

  // Written as `../../standards/acc/README.md`, which only resolves on GitHub until rewritten.
  await page.getByRole("main").getByRole("link", { name: "ACC documents" }).click();
  await expect(page).toHaveURL(/\/docs\/standards\/acc$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Authorization Capability Catalog",
  );
});

test("the releases page states plainly that there is no release yet", async ({ page }) => {
  await page.goto("/releases");

  await expect(page.getByRole("heading", { level: 1, name: "Releases" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /No releases yet|unavailable right now/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Watch the repository" })).toBeVisible();
});

test("unprefixed Markdown links connect the metrics overview, process and template", async ({
  page,
}) => {
  await page.goto("/docs/metrics");

  await page
    .locator("article")
    .getByRole("link", { name: "Acceptance process and criteria", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/docs\/metrics\/metric_development\/acceptance_process_and_criteria$/,
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Acceptance Process and Criteria",
  );

  await page
    .locator("article")
    .getByRole("link", { name: "definition template", exact: true })
    .click();
  await expect(page).toHaveURL(/\/docs\/metrics\/metric_development\/definition_template$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Metric Definition Template");

  await page
    .locator("article")
    .getByRole("link", { name: "draft acceptance process and criteria", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/docs\/metrics\/metric_development\/acceptance_process_and_criteria$/,
  );
});

test("search finds a document by a term from its body", async ({ page }) => {
  await page.goto("/search?q=federation");

  const results = page.getByRole("link", { name: /Architecture/ });
  await expect(results.first()).toBeVisible();
});

test("no page has an accessibility violation, in either theme", async ({ page }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const path of ["/", "/docs", "/docs/architecture", "/releases", "/search"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        results.violations,
        `${colorScheme} ${path}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    }
  }
});
