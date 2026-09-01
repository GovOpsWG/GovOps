import { describe, expect, it } from "vitest";

import { renderReleaseNotes } from "@govops/content";

/**
 * CSP already stops an injected script from running; this is the layer that stops it reaching the
 * page at all.
 */
describe("renderReleaseNotes", () => {
  it("renders ordinary Markdown", () => {
    const html = renderReleaseNotes("## What changed\n\n- One\n- Two\n");
    expect(html).toContain("<h2>What changed</h2>");
    expect(html).toContain("<li>One</li>");
  });

  it("strips script tags", () => {
    const html = renderReleaseNotes("Hello <script>alert(1)</script> world");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(1)");
  });

  it("strips inline event handlers", () => {
    const html = renderReleaseNotes('<img src="x" onerror="alert(1)">');
    expect(html).not.toContain("onerror");
  });

  it("drops javascript: and data: link schemes", () => {
    const html = renderReleaseNotes(
      "[click](javascript:alert(1)) [also](data:text/html;base64,PHM+)",
    );
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("data:text/html");
  });

  it("keeps https links but forces a safe rel", () => {
    const html = renderReleaseNotes("[repo](https://github.com/GovOpsWG/GovOps)");
    expect(html).toContain('href="https://github.com/GovOpsWG/GovOps"');
    expect(html).toContain('rel="noreferrer noopener"');
  });

  it("strips style attributes", () => {
    const html = renderReleaseNotes('<p style="position:fixed;inset:0">covered</p>');
    expect(html).not.toContain("style=");
    expect(html).toContain("covered");
  });

  it("returns an empty string for empty notes", () => {
    expect(renderReleaseNotes("")).toBe("");
  });
});
