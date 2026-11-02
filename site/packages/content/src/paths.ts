/**
 * `docs/README.md` -> `/docs`, `docs/architecture/README.md` -> `/docs/architecture`,
 * `docs/metrics/denial-ratio-trend.md` -> `/docs/metrics/denial-ratio-trend`.
 */
export function docPathToRoute(sourcePath: string): string {
  const relative = sourcePath.replace(/^docs\//, "").replace(/\.md$/i, "");
  if (relative === "README") return "/docs";

  const segments = relative.split("/");
  const last = segments[segments.length - 1];
  if (last === "README") segments.pop();

  return `/docs${segments.length ? `/${segments.map(toRouteSegment).join("/")}` : ""}`;
}

function toRouteSegment(segment: string): string {
  return segment.toLowerCase();
}

/** Empty for the docs index itself. */
export function docPathToSection(sourcePath: string): string {
  const relative = sourcePath.replace(/^docs\//, "");
  const segments = relative.split("/");
  return segments.length > 1 ? (segments[0] as string).toLowerCase() : "";
}

/**
 * The directory containing a document, relative to `docs/`, e.g. `architecture/layers/identity`.
 * Empty for a file directly in `docs/`.
 */
export function docPathToDirectory(sourcePath: string): string {
  const relative = sourcePath.replace(/^docs\//, "");
  const segments = relative.split("/");
  segments.pop();
  return segments.join("/");
}

/** True when this file is the landing page for its directory, i.e. its `README.md`. */
export function isDirectoryIndex(sourcePath: string): boolean {
  const relative = sourcePath.replace(/^docs\//, "").replace(/\.md$/i, "");
  const segments = relative.split("/");
  return segments[segments.length - 1] === "README";
}
