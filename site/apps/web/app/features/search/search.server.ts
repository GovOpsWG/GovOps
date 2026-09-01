import { searchDocuments } from "@govops/content/generated";
import MiniSearch from "minisearch";

export type SearchHit = {
  readonly route: string;
  readonly title: string;
  readonly section: string;
  readonly excerpt: string;
};

const MAX_HITS = 8;
const EXCERPT_RADIUS = 90;

// Built once per process: a dozen documents, so a few milliseconds at boot and nothing after.
const index = new MiniSearch({
  idField: "id",
  fields: ["title", "headings", "body"],
  storeFields: ["route", "title", "section", "body"],
  searchOptions: {
    boost: { title: 4, headings: 2 },
    prefix: true,
    fuzzy: 0.15,
  },
});

index.addAll([...searchDocuments]);

export function search(query: string): SearchHit[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  return index
    .search(trimmed)
    .slice(0, MAX_HITS)
    .map((result) => ({
      route: result["route"] as string,
      title: result["title"] as string,
      section: result["section"] as string,
      excerpt: excerpt(result["body"] as string, trimmed),
    }));
}

/** A window around the first match, so a hit shows why it matched. */
function excerpt(body: string, query: string): string {
  const term = query.split(/\s+/)[0] ?? "";
  const at = body.toLowerCase().indexOf(term.toLowerCase());
  if (at === -1) return body.slice(0, EXCERPT_RADIUS * 2).trim();

  const start = Math.max(0, at - EXCERPT_RADIUS);
  const end = Math.min(body.length, at + EXCERPT_RADIUS);
  return `${start > 0 ? "…" : ""}${body.slice(start, end).trim()}${end < body.length ? "…" : ""}`;
}
