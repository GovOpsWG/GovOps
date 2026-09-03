import type { NavSection } from "@govops/content";
import { NavLink } from "react-router";

const LINK_BASE = "block rounded-lg px-3 py-1.5 text-sm transition";

export function DocsSidebar({ sections }: { readonly sections: readonly NavSection[] }) {
  return (
    <nav
      aria-label="Documentation"
      className="hidden py-10 lg:block lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto"
    >
      <NavLink
        to="/docs"
        end
        className={({ isActive }) =>
          `${LINK_BASE} font-semibold ${
            isActive ? "text-[var(--ink)]" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`
        }
      >
        Overview
      </NavLink>

      <ul className="mt-6 space-y-6">
        {sections.map((section) => (
          <li key={section.route}>
            <NavLink
              to={section.route}
              end
              className={({ isActive }) =>
                `${LINK_BASE} font-semibold ${
                  isActive ? "text-[var(--ink)]" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`
              }
            >
              {section.title}
            </NavLink>

            {section.children.length ? (
              <ul className="mt-1 space-y-0.5 border-l border-[var(--edge)] pl-3">
                {section.children.map((child) => (
                  <li key={child.route}>
                    <NavLink
                      to={child.route}
                      className={({ isActive }) =>
                        `${LINK_BASE} ${
                          isActive
                            ? "bg-[var(--surface)] text-[var(--ink)]"
                            : "text-[var(--ink-faint)] hover:text-[var(--ink-muted)]"
                        }`
                      }
                    >
                      {child.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Replaces the sidebar below `lg`, so a phone reader can still move between documents. */
export function DocsSectionNav({ sections }: { readonly sections: readonly NavSection[] }) {
  const links = [
    {
      route: "/docs",
      title: "Overview",
      children: [] as readonly { route: string; title: string }[],
    },
    ...sections,
  ];

  return (
    <nav
      aria-label="Documentation sections"
      className="-mx-4 overflow-x-auto border-b border-[var(--edge)] px-4 lg:hidden"
    >
      <ul className="flex w-max gap-1 py-3">
        {links.flatMap((section) => [
          <li key={section.route}>
            <NavLink
              to={section.route}
              end
              className={({ isActive }) =>
                `block rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition ${
                  isActive
                    ? "border-transparent bg-[var(--brand)] text-[var(--brand-ink)]"
                    : "border-[var(--edge)] text-[var(--ink-muted)]"
                }`
              }
            >
              {section.title}
            </NavLink>
          </li>,
          ...section.children.map((child) => (
            <li key={child.route}>
              <NavLink
                to={child.route}
                className={({ isActive }) =>
                  `block rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition ${
                    isActive
                      ? "border-transparent bg-[var(--brand)] text-[var(--brand-ink)]"
                      : "border-[var(--edge)] text-[var(--ink-faint)]"
                  }`
                }
              >
                {child.title}
              </NavLink>
            </li>
          )),
        ])}
      </ul>
    </nav>
  );
}
