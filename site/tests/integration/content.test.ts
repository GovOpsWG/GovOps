import { docRoutes, navigation, pages } from "@govops/content/generated";
import { describe, expect, it } from "vitest";

/**
 * The guard on moving the documents into `docs/`. A broken cross-reference is invisible until
 * someone clicks it, so the build asserts every internal link and anchor resolves instead.
 */
describe("documentation corpus", () => {
  const routes = new Set(docRoutes);

  it("renders every document in the repository", () => {
    expect(pages.length).toBeGreaterThanOrEqual(12);
    expect(routes.has("/docs")).toBe(true);
    expect(routes.has("/docs/architecture")).toBe(true);
    expect(routes.has("/docs/acc/authorization-capability-catalog-design")).toBe(true);
  });

  it("gives every page a title and a route", () => {
    for (const page of pages) {
      expect(page.title, page.sourcePath).not.toBe("");
      expect(page.route.startsWith("/docs"), page.sourcePath).toBe(true);
      expect(page.html.length, page.sourcePath).toBeGreaterThan(0);
    }
  });

  it("points every navigation entry at a real page", () => {
    for (const section of navigation) {
      expect(routes.has(section.route), section.route).toBe(true);
      for (const child of section.children) {
        expect(routes.has(child.route), child.route).toBe(true);
      }
    }
  });

  it("resolves every internal link to a real route", () => {
    const broken: string[] = [];

    for (const page of pages) {
      for (const match of page.html.matchAll(/href="(\/docs(?:\/[^"#]*)?)(#[^"]*)?"/g)) {
        const target = match[1] as string;
        if (!routes.has(target)) broken.push(`${page.sourcePath} -> ${target}`);
      }
    }

    expect(broken).toEqual([]);
  });

  it("resolves every same-page anchor to a heading on that page", () => {
    const broken: string[] = [];

    for (const page of pages) {
      const ids = new Set([...page.html.matchAll(/<h[1-6] id="([^"]+)"/g)].map((m) => m[1]));
      for (const match of page.html.matchAll(/href="#([^"]+)"/g)) {
        const anchor = match[1] as string;
        if (!ids.has(anchor)) broken.push(`${page.sourcePath} -> #${anchor}`);
      }
    }

    expect(broken).toEqual([]);
  });

  it("resolves every cross-page anchor to a heading on the target page", () => {
    const idsByRoute = new Map(
      pages.map((page) => [
        page.route,
        new Set([...page.html.matchAll(/<h[1-6] id="([^"]+)"/g)].map((m) => m[1])),
      ]),
    );
    const broken: string[] = [];

    for (const page of pages) {
      for (const match of page.html.matchAll(/href="(\/docs(?:\/[^"#]*)?)#([^"]+)"/g)) {
        const ids = idsByRoute.get(match[1] as string);
        if (!ids?.has(match[2] as string)) broken.push(`${page.sourcePath} -> ${match[0]}`);
      }
    }

    expect(broken).toEqual([]);
  });

  it("points every document asset link at a file that was copied", async () => {
    const { access } = await import("node:fs/promises");
    const { fileURLToPath } = await import("node:url");
    const publicRoot = fileURLToPath(new URL("../../apps/web/public", import.meta.url));

    const assets = new Set<string>();
    for (const page of pages) {
      for (const match of page.html.matchAll(/(?:href|src)="(\/docs-assets\/[^"]+)"/g)) {
        assets.add(match[1] as string);
      }
    }

    expect(assets.size).toBeGreaterThan(0);
    for (const asset of assets) {
      await expect(access(`${publicRoot}${asset}`), asset).resolves.toBeUndefined();
    }
  });

  it("keeps the architecture ASCII diagrams unwrapped", () => {
    const architecture = pages.find((page) => page.route === "/docs/architecture");
    expect(architecture?.html).toContain("doc-diagram");
    expect(architecture?.html).toContain("GOVERNANCE PLANE");
  });

  it("does not repeat the title or status inside the body", () => {
    const metrics = pages.find((page) => page.route === "/docs/metrics");
    expect(metrics?.status).toBe("Draft for sub-group comment");
    expect(metrics?.html).not.toContain("Draft for sub-group comment");
    expect(metrics?.html).not.toContain("<h1");
  });
});
