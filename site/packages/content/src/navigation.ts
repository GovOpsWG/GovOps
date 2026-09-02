import { docPathToRoute } from "./paths.js";
import type { DocPage, NavSection } from "./types.js";

/**
 * Builds the sidebar from whatever is on disk.
 *
 * Discovery is automatic: every subdirectory of `docs/` is a section, and every Markdown file in
 * one is an entry. Nothing has to be registered. `docs/README.md` contributes *order* only — the
 * sequence in which it links documents is the sequence they appear in, and anything it does not
 * link sorts to the end alphabetically.
 *
 * A section without its own `README.md` has no landing page, so its heading links to its first
 * entry rather than to a route that would 404.
 */
export function buildNavigation(pages: readonly DocPage[], docsIndex: string): NavSection[] {
  const byRoute = new Map(pages.map((page) => [page.route, page]));
  const order = linkOrder(docsIndex);
  const rank = (route: string) => {
    const index = order.indexOf(route);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  const sections = [...new Set(pages.map((page) => page.section).filter(Boolean))].sort(
    (a, b) => rank(`/docs/${a}`) - rank(`/docs/${b}`) || a.localeCompare(b),
  );

  return sections.flatMap((section) => {
    const index = byRoute.get(`/docs/${section}`);
    const children = pages
      .filter((page) => page.section === section && page.route !== `/docs/${section}`)
      .sort((a, b) => rank(a.route) - rank(b.route) || a.title.localeCompare(b.title))
      .map((page) => ({ route: page.route, title: page.title }));

    const route = index?.route ?? children[0]?.route;
    if (!route) return [];

    return [{ route, title: index?.title ?? titleFromSlug(section), children }];
  });
}

/** Routes linked from `docs/README.md`, in the order they appear there. */
function linkOrder(docsIndex: string): string[] {
  const routes: string[] = [];
  for (const match of docsIndex.matchAll(/\]\((\.\/[^)#]+\.md)(?:#[^)]*)?\)/g)) {
    const route = docPathToRoute(`docs/${(match[1] as string).replace(/^\.\//, "")}`);
    if (!routes.includes(route)) routes.push(route);
  }
  return routes;
}

/** Fallback title for a section with no `README.md` of its own: `event-handling` -> `Event handling`. */
export function titleFromSlug(slug: string): string {
  const words = slug.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Pages that are reachable by URL but deliberately absent from the sidebar. */
export function pagesOutsideNavigation(
  pages: readonly DocPage[],
  navigation: readonly NavSection[],
): readonly DocPage[] {
  const listed = new Set(navigation.flatMap((s) => [s.route, ...s.children.map((c) => c.route)]));
  return pages.filter((page) => page.route !== "/docs" && !listed.has(page.route));
}
