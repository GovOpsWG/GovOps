import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import { GithubIcon } from "~/components/icons";
import { LogoLink } from "~/components/logo";
import { SearchDialog } from "~/components/search-dialog";
import { ThemeToggle } from "~/components/theme-toggle";
import { GITHUB_URL, PRIMARY_NAV } from "~/lib/site";
import type { Theme } from "~/lib/theme";

type HeaderProps = {
  readonly theme: Theme;
  readonly version: string | null;
};

export function Header({ theme, version }: HeaderProps) {
  const location = useLocation();
  // The menu remembers which page it was opened on, so navigating closes it without an effect
  // that would set state during render and cascade.
  const [menu, setMenu] = useState({ open: false, path: location.pathname });
  const menuOpen = menu.open && menu.path === location.pathname;
  const toggleMenu = () => setMenu({ open: !menuOpen, path: location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--edge)] bg-[color-mix(in_srgb,var(--ground)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <LogoLink />

        <VersionBadge version={version} />

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "text-[var(--ink)]" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <SearchDialog />
          <ThemeToggle theme={theme} />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GovOps on GitHub"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--edge)] text-[var(--ink-muted)] transition hover:border-[var(--edge-strong)] hover:text-[var(--ink)]"
          >
            <GithubIcon className="size-4" />
          </a>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--edge)] text-[var(--ink-muted)] lg:hidden"
          >
            {menuOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-[var(--edge)] lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block rounded-lg px-2 py-2.5 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function VersionBadge({ version }: { readonly version: string | null }) {
  return (
    <Link
      to="/releases"
      className="hidden shrink-0 rounded-full border border-[var(--edge)] px-2.5 py-1 font-mono text-[0.7rem] text-[var(--ink-faint)] transition hover:border-[var(--accent-to)] hover:text-[var(--ink-muted)] sm:inline-block"
    >
      {version ?? "pre-release"}
    </Link>
  );
}
