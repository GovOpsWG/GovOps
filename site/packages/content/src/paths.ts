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
