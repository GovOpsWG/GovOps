import { describe, expect, it } from "vitest";

import { stripDocumentHeader, stripTableOfContents } from "../src/document.js";

describe("stripTableOfContents", () => {
  it("removes a hand-written contents section but keeps what follows", () => {
    const markdown = [
      "## Table of Contents",
      "",
      "1. [One](#one)",
      "2. [Two](#two)",
      "",
      "## One",
      "",
      "Body.",
      "",
    ].join("\n");

    const result = stripTableOfContents(markdown);
    expect(result).not.toContain("Table of Contents");
    expect(result).toContain("## One");
    expect(result).toContain("Body.");
  });

  it("leaves a document without one untouched", () => {
    const markdown = "## One\n\nBody.\n";
    expect(stripTableOfContents(markdown)).toBe(markdown);
  });
});

describe("stripDocumentHeader", () => {
  it("removes the title and status that the page chrome already shows", () => {
    const markdown = [
      "# Authorization Capability Catalog: Design",
      "",
      "**Status:** Draft for discussion",
      "",
      "**Companion use cases:** [Use Cases](./use-cases.md)",
      "",
      "---",
      "",
      "## 1. Abstract",
      "",
      "Body.",
      "",
    ].join("\n");

    const result = stripDocumentHeader(markdown);
    expect(result).not.toContain("# Authorization Capability Catalog: Design");
    expect(result).not.toContain("**Status:**");
    expect(result).toContain("**Companion use cases:**");
    expect(result.trimStart().startsWith("**Companion")).toBe(true);
    expect(result).toContain("## 1. Abstract");
  });

  it("does not touch anything after the first section heading", () => {
    const markdown = "# Title\n\n## Skeleton\n\n```text\n# <Metric name>\n\n**Status:** x\n```\n";
    const result = stripDocumentHeader(markdown);
    expect(result).toContain("# <Metric name>");
    expect(result).toContain("**Status:** x");
  });

  it("handles a document that is only front matter", () => {
    expect(stripDocumentHeader("# Outreach\n\nBody.\n").trim()).toBe("Body.");
  });
});
