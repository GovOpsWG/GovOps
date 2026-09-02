import { describe, expect, it } from "vitest";

import { buildNavigation, pagesOutsideNavigation, titleFromSlug } from "../src/navigation.js";
import { docPathToRoute, docPathToSection } from "../src/paths.js";
import type { DocPage } from "../src/types.js";

// Routes and sections come from the real derivation, so this fixture cannot drift from it.
function page(sourcePath: string, title: string): DocPage {
  return {
    route: docPathToRoute(sourcePath),
    sourcePath,
    section: docPathToSection(sourcePath),
    title,
    summary: "",
    status: null,
    html: "",
    toc: [],
    wordCount: 0,
    readingMinutes: 1,
  };
}

const INDEX = `
- [Architecture](./architecture/README.md)
- [ACC](./acc/README.md)
- [ACC design](./acc/design.md)
- [Metrics](./metrics/README.md)
`;

describe("buildNavigation", () => {
  it("discovers a section from the directory alone, with no registration", () => {
    const nav = buildNavigation(
      [page("docs/architecture/README.md", "Architecture"), page("docs/acc/README.md", "ACC")],
      INDEX,
    );
    expect(nav.map((s) => s.route)).toEqual(["/docs/architecture", "/docs/acc"]);
  });

  it("includes a document nobody linked from docs/README.md", () => {
    const nav = buildNavigation(
      [page("docs/metrics/README.md", "Metrics"), page("docs/metrics/brand-new.md", "Brand new")],
      INDEX,
    );
    expect(nav[0]?.children.map((c) => c.route)).toEqual(["/docs/metrics/brand-new"]);
  });

  it("orders sections by their appearance in docs/README.md", () => {
    const nav = buildNavigation(
      [
        page("docs/metrics/README.md", "Metrics"),
        page("docs/acc/README.md", "ACC"),
        page("docs/architecture/README.md", "Architecture"),
      ],
      INDEX,
    );
    expect(nav.map((s) => s.title)).toEqual(["Architecture", "ACC", "Metrics"]);
  });

  it("sorts an unlisted section after every listed one", () => {
    const nav = buildNavigation(
      [page("docs/architecture/README.md", "Architecture"), page("docs/zebra/README.md", "Zebra")],
      INDEX,
    );
    expect(nav.map((s) => s.title)).toEqual(["Architecture", "Zebra"]);
  });

  it("orders entries within a section by the index, then alphabetically", () => {
    const nav = buildNavigation(
      [
        page("docs/acc/README.md", "ACC"),
        page("docs/acc/zulu.md", "Zulu"),
        page("docs/acc/alpha.md", "Alpha"),
        page("docs/acc/design.md", "ACC design"),
      ],
      INDEX,
    );
    expect(nav[0]?.children.map((c) => c.title)).toEqual(["ACC design", "Alpha", "Zulu"]);
  });

  it("titles a section from its README, and from the directory when there is none", () => {
    const nav = buildNavigation(
      [
        page("docs/acc/README.md", "Authorization Capability Catalog"),
        page("docs/event-handling/response.md", "Response"),
      ],
      INDEX,
    );
    expect(nav.map((s) => s.title)).toEqual(["Authorization Capability Catalog", "Event handling"]);
  });

  it("points a README-less section at its first entry rather than a route that would 404", () => {
    const nav = buildNavigation([page("docs/event-handling/response.md", "Response")], INDEX);
    expect(nav[0]?.route).toBe("/docs/event-handling/response");
  });

  it("never emits a section whose route has no page behind it", () => {
    const pages = [page("docs/acc/README.md", "ACC"), page("docs/solo/only.md", "Only")];
    const routes = new Set(pages.map((p) => p.route));
    for (const section of buildNavigation(pages, INDEX)) {
      expect(routes.has(section.route), section.route).toBe(true);
      for (const child of section.children) expect(routes.has(child.route), child.route).toBe(true);
    }
  });
});

describe("pagesOutsideNavigation", () => {
  it("reports a top-level document that is reachable but not in the sidebar", () => {
    const pages = [
      page("docs/architecture/README.md", "Architecture"),
      page("docs/MOVED.md", "Moved"),
    ];
    const outside = pagesOutsideNavigation(pages, buildNavigation(pages, INDEX));
    expect(outside.map((p) => p.route)).toEqual(["/docs/moved"]);
  });
});

describe("titleFromSlug", () => {
  it("turns a directory name into a label", () => {
    expect(titleFromSlug("event-handling")).toBe("Event handling");
    expect(titleFromSlug("owasp")).toBe("Owasp");
  });
});
