import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Notes come from the GitHub API, not this repository, so they are sanitised against an allowlist.
 * CSP already blocks injected scripts; this also removes the inline handlers and styles it would
 * not.
 */
export function renderReleaseNotes(markdown: string): string {
  const marked = new Marked({ gfm: true, breaks: true });
  const html = marked.parse(markdown, { async: false });

  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "del",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
      "details",
      "summary",
    ],
    // transformTags runs before this filter, so what it adds must be allowed here too.
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "loading", "decoding"],
    },
    allowedSchemes: ["https", "mailto"],
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs: { ...attributes, target: "_blank", rel: "noreferrer noopener" },
      }),
      img: (tagName, attributes) => ({
        tagName,
        attribs: { ...attributes, loading: "lazy", decoding: "async" },
      }),
    },
  });
}
