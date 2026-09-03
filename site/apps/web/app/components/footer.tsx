import { Link } from "react-router";

import { Logo } from "~/components/logo";
import { ECOSYSTEM, GITHUB_URL, LINKEDIN_GROUP_URL, SITE_TAGLINE } from "~/lib/site";

const COLUMNS = [
  {
    title: "Documentation",
    links: [
      { label: "Overview", to: "/docs" },
      { label: "Architecture", to: "/docs/architecture" },
      { label: "Capability catalog", to: "/docs/acc" },
      { label: "Metrics", to: "/docs/metrics" },
    ],
  },
  {
    title: "Working group",
    links: [
      { label: "OWASP proposal", to: "/docs/owasp" },
      { label: "Outreach", to: "/docs/outreach" },
      { label: "Releases", to: "/releases" },
      { label: "Contributing", to: `${GITHUB_URL}/blob/main/CONTRIBUTING.md` },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--edge)] bg-[var(--ground-deep)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-[var(--ink-muted)]">{SITE_TAGLINE}.</p>
            <a
              href={LINKEDIN_GROUP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-block text-sm text-[var(--accent-from)] hover:underline"
            >
              Join the GovOps group
            </a>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-[var(--ink)]">{column.title}</h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-sm font-semibold text-[var(--ink)]">Ecosystem</h2>
            <ul className="mt-3 space-y-3">
              {ECOSYSTEM.map((project) => (
                <li key={project.href}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group block"
                  >
                    <span className="text-sm text-[var(--ink-muted)] transition group-hover:text-[var(--ink)]">
                      {project.name}
                    </span>
                    <span className="block text-xs text-[var(--ink-faint)]">
                      {project.description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--edge)] pt-6 text-xs text-[var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            The GovOps Working Group. Documents are dedicated to the public domain under{" "}
            <a
              href={`${GITHUB_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-[var(--ink-muted)]"
            >
              CC0 1.0
            </a>
            .
          </p>
          <p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-[var(--ink-muted)]"
            >
              GovOpsWG/GovOps
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { readonly to: string; readonly children: string }) {
  const className = "text-sm text-[var(--ink-muted)] transition hover:text-[var(--ink)]";

  return /^https?:\/\//.test(to) ? (
    <a href={to} target="_blank" rel="noreferrer noopener" className={className}>
      {children}
    </a>
  ) : (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
