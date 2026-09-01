import GithubSlugger from "github-slugger";
import { Marked } from "marked";
import type { Tokens } from "marked";

import { docPathToRoute } from "./paths.js";
import type { TocEntry } from "./types.js";

export type RenderOptions = {
  /** Relative to the repository root. */
  readonly sourcePath: string;
  readonly assetBase: string;
};

export type RenderResult = {
  readonly html: string;
  readonly toc: readonly TocEntry[];
  /** Plain-text body, for the search index. */
  readonly text: string;
};

const DOC_ASSET_BASE = "/docs-assets";

const ASCII_DIAGRAM_LANGUAGES = new Set(["text", "txt", ""]);

/**
 * Two behaviours here are load-bearing and must not be "simplified" away: heading ids follow
 * GitHub's slug algorithm, because documents hand-maintain `#anchor` tables of contents written
 * for GitHub; and fenced `text` blocks are marked as diagrams so the stylesheet scrolls rather
 * than wraps them, since wrapping destroys the drawing.
 */
export function renderMarkdown(markdown: string, options: RenderOptions): RenderResult {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];
  const textParts: string[] = [];

  const marked = new Marked({
    gfm: true,
    breaks: false,
    renderer: {
      heading(
        this: { parser: { parseInline: (tokens: Tokens.Generic[]) => string } },
        token: Tokens.Heading,
      ) {
        const inline = this.parser.parseInline(token.tokens);
        const plain = stripTags(inline);
        const id = slugger.slug(plain);
        if (token.depth === 2 || token.depth === 3) {
          toc.push({ id, depth: token.depth, text: plain });
        }
        textParts.push(plain);
        return (
          `<h${token.depth} id="${id}" class="doc-heading">` +
          `<a class="doc-anchor" href="#${id}" aria-label="Link to this section">#</a>` +
          `${inline}</h${token.depth}>\n`
        );
      },

      code(token: Tokens.Code) {
        const language = (token.lang ?? "").trim().split(/\s+/)[0] ?? "";
        const isDiagram = ASCII_DIAGRAM_LANGUAGES.has(language);
        const className = isDiagram ? "doc-diagram" : "doc-code";
        const label = isDiagram ? "Diagram" : language || "Code";
        return (
          `<figure class="${className}" role="group" aria-label="${escapeHtml(label)}" tabindex="0">` +
          `<pre><code>${escapeHtml(token.text)}</code></pre></figure>\n`
        );
      },

      link(
        this: { parser: { parseInline: (tokens: Tokens.Generic[]) => string } },
        token: Tokens.Link,
      ) {
        const href = rewriteHref(token.href, options.sourcePath);
        const inner = this.parser.parseInline(token.tokens);
        const external = /^https?:\/\//i.test(href);
        const attributes = external ? ' target="_blank" rel="noreferrer noopener"' : "";
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        return `<a href="${escapeHtml(href)}"${title}${attributes}>${inner}</a>`;
      },

      image(token: Tokens.Image) {
        const source = rewriteImageSource(token.href, options);
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        return (
          `<img src="${escapeHtml(source)}" alt="${escapeHtml(token.text)}"${title}` +
          ' loading="lazy" decoding="async" class="doc-image" />'
        );
      },

      table(
        this: { parser: { parseInline: (tokens: Tokens.Generic[]) => string } },
        token: Tokens.Table,
      ) {
        const head = token.header
          .map((cell, index) => {
            const align = token.align[index];
            const style = align ? ` style="text-align:${align}"` : "";
            return `<th${style}>${this.parser.parseInline(cell.tokens)}</th>`;
          })
          .join("");
        const body = token.rows
          .map((row) => {
            const cells = row
              .map((cell, index) => {
                const align = token.align[index];
                const style = align ? ` style="text-align:${align}"` : "";
                return `<td${style}>${this.parser.parseInline(cell.tokens)}</td>`;
              })
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");
        // The wrapper is what stops a wide table scrolling the whole page sideways.
        return (
          '<div class="doc-table-scroll" tabindex="0" role="region" aria-label="Table">' +
          `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>\n`
        );
      },

      paragraph(
        this: { parser: { parseInline: (tokens: Tokens.Generic[]) => string } },
        token: Tokens.Paragraph,
      ) {
        const inline = this.parser.parseInline(token.tokens);
        textParts.push(stripTags(inline));
        return `<p>${inline}</p>\n`;
      },
    },
  });

  const html = marked.parse(markdown, { async: false });
  return { html, toc, text: textParts.join(" ") };
}

/** Anchors are preserved; a link that escapes `docs/` falls back to the repository on GitHub. */
export function rewriteHref(href: string, sourcePath: string): string {
  if (!href.startsWith(".") && !href.startsWith("/")) return href;

  const [target = "", anchor] = splitAnchor(href);

  // A file that travelled with the docs is served from /docs-assets, not from a route.
  if (/\.(jpe?g|png|svg|webp|gif|pdf|ya?ml|json)$/i.test(target)) {
    const asset = resolveRelative(sourcePath, target);
    return `${DOC_ASSET_BASE}/${asset.replace(/^docs\//, "")}`;
  }

  if (!/\.md$/i.test(target)) return href;

  const resolved = resolveRelative(sourcePath, target);
  if (!resolved.startsWith("docs/")) {
    // A link that escapes `docs/` points at a repository file such as CONTRIBUTING.md.
    return `https://github.com/GovOpsWG/GovOps/blob/main/${resolved}${anchor ? `#${anchor}` : ""}`;
  }

  return `${docPathToRoute(resolved)}${anchor ? `#${anchor}` : ""}`;
}

function rewriteImageSource(href: string, options: RenderOptions): string {
  if (!href.startsWith(".") && !href.startsWith("/")) return href;
  const resolved = resolveRelative(options.sourcePath, href);
  return `${options.assetBase}/${resolved.replace(/^docs\//, "")}`;
}

function splitAnchor(href: string): [string, string | undefined] {
  const index = href.indexOf("#");
  return index === -1 ? [href, undefined] : [href.slice(0, index), href.slice(index + 1)];
}

export function resolveRelative(sourcePath: string, target: string): string {
  const base = sourcePath.split("/").slice(0, -1);
  const segments = target.split("/");

  for (const segment of segments) {
    if (segment === "." || segment === "") continue;
    if (segment === "..") base.pop();
    else base.push(segment);
  }

  return base.join("/");
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}
