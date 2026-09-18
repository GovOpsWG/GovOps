export const SITE_NAME = "GovOps";
export const SITE_TAGLINE = "Measure risk, transparency, and accountability";
export const SITE_DESCRIPTION =
  "GovOps is an open, vendor-neutral architecture for authorization governance: govern capabilities centrally, authorize locally, and join the two with a stable capability_id.";

export const GITHUB_OWNER = "GovOpsWG";
export const GITHUB_REPO = "GovOps";
export const GITHUB_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
export const LINKEDIN_GROUP_URL = "https://gluu.co/govops-group";

/** Canonical origin. Set SITE_URL in the deployment so metadata and the sitemap agree with DNS. */
export function siteUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  return (configured && configured.replace(/\/$/, "")) || "https://govops.info";
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export const PRIMARY_NAV = [
  { label: "Overview", to: "/docs" },
  { label: "Scope", to: "/docs/scope" },
  { label: "Foundations", to: "/docs/foundations" },
  { label: "Architecture", to: "/docs/architecture" },
  { label: "ACC", to: "/docs/acc" },
  { label: "Metrics", to: "/docs/metrics" },
] as const;

/** Projects whose maintainers contribute to the working group. */
export const ECOSYSTEM = [
  {
    name: "Gluu",
    href: "https://gluu.org",
    description: "Identity and access management",
  },
  {
    name: "Janssen Project",
    href: "https://jans.io",
    description: "Open source digital identity platform",
  },
  {
    name: "Cedarling",
    href: "https://cedarling.dev",
    description: "Local authorization for applications and AI agents",
  },
] as const;
