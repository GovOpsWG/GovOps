import { describe, expect, it } from "vitest";

import {
  buildNavigation,
  flattenNavigation,
  pagesOutsideNavigation,
  titleFromSlug,
} from "../src/navigation.js";
import { docPathToRoute, docPathToSection } from "../src/paths.js";
import type { DocPage, NavChild } from "../src/types.js";

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

/** Builds the `readmesByDirectory` map `buildNavigation` expects, keyed by directory. */
function readmes(entries: Record<string, string>): ReadonlyMap<string, string> {
  return new Map(Object.entries(entries));
}

describe("buildNavigation", () => {
  it("discovers a section from the directory alone, with no registration", () => {
    const nav = buildNavigation(
      [page("docs/architecture/README.md", "Architecture"), page("docs/acc/README.md", "ACC")],
      readmes({ "": INDEX }),
    );
    expect(nav.map((s) => s.route)).toEqual(["/docs/architecture", "/docs/acc"]);
  });

  it("includes a document nobody linked from docs/README.md", () => {
    const nav = buildNavigation(
      [page("docs/metrics/README.md", "Metrics"), page("docs/metrics/brand-new.md", "Brand new")],
      readmes({ "": INDEX }),
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
      readmes({ "": INDEX }),
    );
    expect(nav.map((s) => s.title)).toEqual(["Architecture", "ACC", "Metrics"]);
  });

  it("sorts an unlisted section after every listed one", () => {
    const nav = buildNavigation(
      [page("docs/architecture/README.md", "Architecture"), page("docs/zebra/README.md", "Zebra")],
      readmes({ "": INDEX }),
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
      readmes({ "": INDEX }),
    );
    expect(nav[0]?.children.map((c) => c.title)).toEqual(["ACC design", "Alpha", "Zulu"]);
  });

  it("titles a section from its README, and from the directory when there is none", () => {
    const nav = buildNavigation(
      [
        page("docs/acc/README.md", "Authorization Capability Catalog"),
        page("docs/event-handling/response.md", "Response"),
      ],
      readmes({ "": INDEX }),
    );
    expect(nav.map((s) => s.title)).toEqual(["Authorization Capability Catalog", "Event handling"]);
  });

  it("points a README-less section at its first entry rather than a route that would 404", () => {
    const nav = buildNavigation(
      [page("docs/event-handling/response.md", "Response")],
      readmes({ "": INDEX }),
    );
    expect(nav[0]?.route).toBe("/docs/event-handling/response");
  });

  it("never emits a section whose route has no page behind it", () => {
    const pages = [page("docs/acc/README.md", "ACC"), page("docs/solo/only.md", "Only")];
    const routes = new Set(pages.map((p) => p.route));
    const check = (nodes: readonly NavChild[]) => {
      for (const node of nodes) {
        expect(routes.has(node.route), node.route).toBe(true);
        check(node.children);
      }
    };
    check(buildNavigation(pages, readmes({ "": INDEX })));
  });

  it("nests a sub-directory as a group under its parent, instead of flattening it", () => {
    const pages = [
      page("docs/architecture/README.md", "Architecture"),
      page("docs/architecture/layers/README.md", "Layers"),
      page("docs/architecture/layers/identity/README.md", "Identity"),
      page("docs/architecture/layers/access/README.md", "Access"),
    ];
    const nav = buildNavigation(
      pages,
      readmes({
        "": "- [Architecture](./architecture/README.md)",
        architecture: "- [Layers](./layers/README.md)",
        "architecture/layers": "- [Identity](./identity/README.md)\n- [Access](./access/README.md)",
      }),
    );

    const architecture = nav[0];
    expect(architecture?.title).toBe("Architecture");
    expect(architecture?.children.map((c) => c.route)).toEqual(["/docs/architecture/layers"]);

    const layers = architecture?.children[0];
    expect(layers?.children.map((c) => c.route)).toEqual([
      "/docs/architecture/layers/identity",
      "/docs/architecture/layers/access",
    ]);
  });

  it("orders a directory's own files and sub-directories together, per its README", () => {
    const pages = [
      page("docs/components/README.md", "Functional Components"),
      page("docs/components/compliance.md", "Compliance"),
      page("docs/components/evidence/README.md", "Evidence"),
    ];
    const nav = buildNavigation(
      pages,
      readmes({
        "": "- [Functional Components](./components/README.md)",
        components: "- [Evidence](./evidence/README.md)\n- [Compliance](./compliance.md)",
      }),
    );

    expect(nav[0]?.children.map((c) => c.route)).toEqual([
      "/docs/components/evidence",
      "/docs/components/compliance",
    ]);
  });

  it("builds an intermediate group with no README of its own from its children", () => {
    const pages = [page("docs/architecture/layers/identity/identity.md", "Identity details")];
    const nav = buildNavigation(pages, readmes({}));

    expect(nav[0]?.title).toBe("Architecture");
    const layers = nav[0]?.children[0];
    expect(layers?.title).toBe("Layers");
    const identity = layers?.children[0];
    expect(identity?.title).toBe("Identity");
    expect(identity?.route).toBe("/docs/architecture/layers/identity/identity");
  });
});

describe("flattenNavigation", () => {
  it("visits every route depth-first, including nested groups", () => {
    const pages = [
      page("docs/architecture/README.md", "Architecture"),
      page("docs/architecture/layers/README.md", "Layers"),
      page("docs/architecture/layers/identity/README.md", "Identity"),
    ];
    const nav = buildNavigation(
      pages,
      readmes({
        "": "- [Architecture](./architecture/README.md)",
        architecture: "- [Layers](./layers/README.md)",
        "architecture/layers": "- [Identity](./identity/README.md)",
      }),
    );
    expect(flattenNavigation(nav)).toEqual([
      "/docs/architecture",
      "/docs/architecture/layers",
      "/docs/architecture/layers/identity",
    ]);
  });
});

describe("pagesOutsideNavigation", () => {
  it("reports a top-level document that is reachable but not in the sidebar", () => {
    const pages = [
      page("docs/architecture/README.md", "Architecture"),
      page("docs/MOVED.md", "Moved"),
    ];
    const outside = pagesOutsideNavigation(pages, buildNavigation(pages, readmes({ "": INDEX })));
    expect(outside.map((p) => p.route)).toEqual(["/docs/moved"]);
  });
});

describe("titleFromSlug", () => {
  it("turns a directory name into a label", () => {
    expect(titleFromSlug("event-handling")).toBe("Event handling");
    expect(titleFromSlug("owasp")).toBe("Owasp");
  });
});
