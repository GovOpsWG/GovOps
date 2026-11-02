import { docPathToDirectory, docPathToRoute, isDirectoryIndex } from "./paths.js";
import type { DocPage, NavChild, NavSection } from "./types.js";

/**
 * Builds the sidebar from whatever is on disk.
 *
 * Discovery is automatic and recursive: every subdirectory of `docs/` is a section, nested
 * subdirectories become nested sections, and every Markdown file is an entry at whatever depth it
 * lives. Nothing has to be registered. Each directory's own `README.md` contributes the *order*
 * of that directory's direct children only — the sequence in which it links documents and
 * subdirectories is the sequence they appear in, and anything it does not link sorts to the end
 * alphabetically.
 *
 * A directory without its own `README.md` has no landing page, so its heading links to its first
 * entry (after ordering) rather than to a route that would 404.
 */
export function buildNavigation(
  pages: readonly DocPage[],
  readmesByDirectory: ReadonlyMap<string, string>,
): NavSection[] {
  const tree = groupByDirectory(pages);

  // Only directories become top-level sections; a loose file directly under docs/ (besides
  // docs/README.md itself) stays out of the menu, same as before.
  return childDirectoriesOf("", tree, readmesByDirectory)
    .map((directory) => buildNode(directory, tree, readmesByDirectory))
    .filter((node): node is NavSection => node !== null);
}

type DirectoryEntry = {
  indexPage?: DocPage;
  pages: DocPage[];
  subdirectories: Set<string>;
};

/** Groups every page by the directory it lives in, and records the directory tree alongside it. */
function groupByDirectory(pages: readonly DocPage[]): Map<string, DirectoryEntry> {
  const tree = new Map<string, DirectoryEntry>();
  const entryFor = (directory: string): DirectoryEntry => {
    let entry = tree.get(directory);
    if (!entry) {
      entry = { pages: [], subdirectories: new Set() };
      tree.set(directory, entry);
    }
    return entry;
  };

  for (const page of pages) {
    const directory = docPathToDirectory(page.sourcePath);
    if (isDirectoryIndex(page.sourcePath)) {
      entryFor(directory).indexPage = page;
    } else {
      entryFor(directory).pages.push(page);
    }

    // Link this directory to its parent, and so on to the root, so an intermediate directory
    // with no Markdown of its own still appears in the tree.
    for (let current = directory; current !== "";) {
      const parent = current.includes("/") ? current.slice(0, current.lastIndexOf("/")) : "";
      entryFor(parent).subdirectories.add(current);
      current = parent;
    }
  }

  return tree;
}

type ChildRef =
  | { readonly kind: "page"; readonly page: DocPage }
  | { readonly kind: "dir"; readonly path: string };

function buildNode(
  directory: string,
  tree: ReadonlyMap<string, DirectoryEntry>,
  readmesByDirectory: ReadonlyMap<string, string>,
): NavSection | null {
  const children = orderedChildren(directory, tree, readmesByDirectory)
    .map((ref): NavChild | null =>
      ref.kind === "page"
        ? { route: ref.page.route, title: ref.page.title, children: [] }
        : buildNode(ref.path, tree, readmesByDirectory),
    )
    .filter((node): node is NavChild => node !== null);

  const indexPage = tree.get(directory)?.indexPage;
  const route = indexPage?.route ?? children[0]?.route;
  if (!route) return null;

  const title = indexPage?.title ?? titleFromSlug(lastSegment(directory));
  return { route, title, children };
}

function childDirectoriesOf(
  directory: string,
  tree: ReadonlyMap<string, DirectoryEntry>,
  readmesByDirectory: ReadonlyMap<string, string>,
): string[] {
  return orderedChildren(directory, tree, readmesByDirectory)
    .filter((ref): ref is { kind: "dir"; path: string } => ref.kind === "dir")
    .map((ref) => ref.path);
}

/** This directory's pages and subdirectories, in the order its own `README.md` links them. */
function orderedChildren(
  directory: string,
  tree: ReadonlyMap<string, DirectoryEntry>,
  readmesByDirectory: ReadonlyMap<string, string>,
): ChildRef[] {
  const entry = tree.get(directory);
  if (!entry) return [];

  const refs: ChildRef[] = [
    ...entry.pages.map((page): ChildRef => ({ kind: "page", page })),
    ...[...entry.subdirectories].map((path): ChildRef => ({ kind: "dir", path })),
  ];

  const routeOf = (ref: ChildRef): string =>
    ref.kind === "page" ? ref.page.route : (tree.get(ref.path)?.indexPage?.route ?? "");
  const titleOf = (ref: ChildRef): string =>
    ref.kind === "page"
      ? ref.page.title
      : (tree.get(ref.path)?.indexPage?.title ?? titleFromSlug(lastSegment(ref.path)));

  const order = linkOrder(directory, readmesByDirectory.get(directory) ?? "");
  const rank = (route: string) => {
    const index = order.indexOf(route);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  return refs.sort(
    (a, b) => rank(routeOf(a)) - rank(routeOf(b)) || titleOf(a).localeCompare(titleOf(b)),
  );
}

/** Routes a directory's own `README.md` links directly (`./...`), in the order they appear. */
function linkOrder(directory: string, readme: string): string[] {
  const routes: string[] = [];
  for (const match of readme.matchAll(/\]\((\.\/[^)#]+\.md)(?:#[^)]*)?\)/g)) {
    const relative = (match[1] as string).replace(/^\.\//, "");
    const sourcePath = directory ? `docs/${directory}/${relative}` : `docs/${relative}`;
    const route = docPathToRoute(sourcePath);
    if (!routes.includes(route)) routes.push(route);
  }
  return routes;
}

function lastSegment(path: string): string {
  return path.includes("/") ? path.slice(path.lastIndexOf("/") + 1) : path;
}

/** Fallback title for a directory with no `README.md` of its own: `event-handling` -> `Event handling`. */
export function titleFromSlug(slug: string): string {
  const words = slug.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Every route reachable from the navigation tree, in its displayed (depth-first) order. */
export function flattenNavigation(nodes: readonly NavChild[]): string[] {
  return nodes.flatMap((node) => [node.route, ...flattenNavigation(node.children)]);
}

/** Pages that are reachable by URL but deliberately absent from the sidebar. */
export function pagesOutsideNavigation(
  pages: readonly DocPage[],
  navigation: readonly NavSection[],
): readonly DocPage[] {
  const listed = new Set(flattenNavigation(navigation));
  return pages.filter((page) => page.route !== "/docs" && !listed.has(page.route));
}
