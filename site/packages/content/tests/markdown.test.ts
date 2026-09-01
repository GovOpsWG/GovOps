import { describe, expect, it } from "vitest";

import { renderMarkdown, resolveRelative, rewriteHref } from "../src/markdown.js";

const OPTIONS = { sourcePath: "docs/architecture/README.md", assetBase: "/docs-assets" } as const;

describe("resolveRelative", () => {
  it("resolves a sibling directory", () => {
    expect(resolveRelative("docs/architecture/README.md", "../acc/design.md")).toBe(
      "docs/acc/design.md",
    );
  });

  it("resolves within the same directory", () => {
    expect(resolveRelative("docs/metrics/README.md", "./denial-ratio-trend.md")).toBe(
      "docs/metrics/denial-ratio-trend.md",
    );
  });
});

describe("rewriteHref", () => {
  it("maps a document link to its route", () => {
    expect(
      rewriteHref("../acc/authorization-capability-catalog-design.md", OPTIONS.sourcePath),
    ).toBe("/docs/acc/authorization-capability-catalog-design");
  });

  it("keeps the anchor", () => {
    expect(rewriteHref("../acc/use-cases.md#uc-02-compliance", OPTIONS.sourcePath)).toBe(
      "/docs/acc/use-cases#uc-02-compliance",
    );
  });

  it("maps a README link to the section route", () => {
    expect(rewriteHref("./README.md", "docs/metrics/metric-definition-template.md")).toBe(
      "/docs/metrics",
    );
  });

  it("points a document asset at the served copy", () => {
    expect(rewriteHref("./images/figure_1_1.jpg", OPTIONS.sourcePath)).toBe(
      "/docs-assets/architecture/images/figure_1_1.jpg",
    );
  });

  it("sends a link that escapes docs/ to the repository", () => {
    expect(rewriteHref("../../CONTRIBUTING.md", OPTIONS.sourcePath)).toBe(
      "https://github.com/GovOpsWG/GovOps/blob/main/CONTRIBUTING.md",
    );
  });

  it("leaves absolute links alone", () => {
    expect(rewriteHref("https://gemara.openssf.org", OPTIONS.sourcePath)).toBe(
      "https://gemara.openssf.org",
    );
  });
});

describe("renderMarkdown", () => {
  it("gives headings GitHub-compatible ids so hand-written anchors resolve", () => {
    const { html, toc } = renderMarkdown(
      "## Big Picture: Where does governance fit in the IT landscape\n",
      OPTIONS,
    );
    expect(html).toContain('id="big-picture-where-does-governance-fit-in-the-it-landscape"');
    expect(toc).toHaveLength(1);
  });

  it("de-duplicates repeated heading ids the way GitHub does", () => {
    const { toc } = renderMarkdown("## Context\n\n## Context\n", OPTIONS);
    expect(toc.map((entry) => entry.id)).toEqual(["context", "context-1"]);
  });

  it("marks a fenced text block as a diagram and preserves it verbatim", () => {
    const diagram = "Govern -> Authorize\n   |\n   v\nExecute";
    const { html } = renderMarkdown("```text\n" + diagram + "\n```\n", OPTIONS);
    expect(html).toContain("doc-diagram");
    expect(html).not.toContain("doc-code");
    // The exact spacing is the drawing; losing it loses the diagram.
    expect(html).toContain("Govern -&gt; Authorize\n   |\n   v\nExecute");
  });

  it("wraps tables so a narrow viewport scrolls the table, not the page", () => {
    const { html } = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |\n", OPTIONS);
    expect(html).toContain("doc-table-scroll");
    expect(html).toContain("<th>a</th>");
    expect(html).toContain("<td>2</td>");
  });

  it("opens external links in a new tab with a safe rel", () => {
    const { html } = renderMarkdown("[Gemara](https://gemara.openssf.org)\n", OPTIONS);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer noopener"');
  });

  it("does not add target to internal links", () => {
    const { html } = renderMarkdown("[ACC](../acc/README.md)\n", OPTIONS);
    expect(html).toContain('href="/docs/acc"');
    expect(html).not.toContain("target=");
  });

  it("collects only h2 and h3 into the table of contents", () => {
    const { toc } = renderMarkdown("# One\n\n## Two\n\n### Three\n\n#### Four\n", OPTIONS);
    expect(toc.map((entry) => entry.depth)).toEqual([2, 3]);
  });
});
