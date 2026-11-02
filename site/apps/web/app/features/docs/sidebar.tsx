import type { NavChild, NavSection } from "@govops/content";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useId, useState } from "react";
import { NavLink, useLocation } from "react-router";

const LINK_BASE = "block rounded-lg px-3 py-1.5 text-sm transition";

/** True when `pathname` is this entry's page or any page beneath it. */
function containsRoute(node: NavChild, pathname: string): boolean {
  return node.route === pathname || node.children.some((child) => containsRoute(child, pathname));
}

const LABEL_ACTIVE = "text-[var(--ink)]";

/**
 * One sidebar entry, rendered recursively. A folder is a link to its own page plus a chevron that
 * folds its children. Groups start collapsed, except the branch holding the current page, so the
 * reader always sees where they are.
 */
function NavEntry({
  node,
  top,
  pathname,
}: {
  readonly node: NavChild;
  readonly top: boolean;
  readonly pathname: string;
}) {
  const hasChildren = node.children.length > 0;
  const holdsCurrentPage = hasChildren && containsRoute(node, pathname);
  const [open, setOpen] = useState(holdsCurrentPage);
  const listId = useId();

  // Navigating (a link, search, previous/next) into a collapsed branch opens it. Navigating away
  // never closes it, so a reader's own choices stick.
  const [wasHoldingCurrentPage, setWasHoldingCurrentPage] = useState(holdsCurrentPage);
  if (holdsCurrentPage !== wasHoldingCurrentPage) {
    setWasHoldingCurrentPage(holdsCurrentPage);
    if (holdsCurrentPage) setOpen(true);
  }

  return (
    <li>
      <div className="flex items-center gap-1">
        <NavLink
          to={node.route}
          end
          className={({ isActive }) =>
            `min-w-0 flex-1 ${
              top
                ? `${LINK_BASE} font-semibold ${
                    isActive ? LABEL_ACTIVE : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`
                : `${LINK_BASE} ${
                    isActive
                      ? `bg-[var(--surface)] ${LABEL_ACTIVE}`
                      : "text-[var(--ink-faint)] hover:text-[var(--ink-muted)]"
                  }`
            }`
          }
        >
          {node.title}
        </NavLink>

        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={`${open ? "Collapse" : "Expand"} ${node.title}`}
            onClick={() => setOpen((current) => !current)}
            className="shrink-0 rounded-md p-1 text-[var(--ink-faint)] transition hover:text-[var(--ink)]"
          >
            <ChevronRight
              aria-hidden="true"
              className={`size-4 transition-transform ${open ? "rotate-90" : ""}`}
            />
          </button>
        ) : null}
      </div>

      {hasChildren && open ? (
        <ul id={listId} className="mt-1 space-y-0.5 border-l border-[var(--edge)] pl-3">
          {node.children.map((child) => (
            <NavEntry key={child.route} node={child} top={false} pathname={pathname} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function usePathname(): string {
  const { pathname } = useLocation();
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/** The whole documentation tree, shared by the desktop sidebar and the mobile menu. */
function DocsTree({ sections }: { readonly sections: readonly NavSection[] }) {
  const pathname = usePathname();

  return (
    <>
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

      <ul className="mt-6 space-y-3">
        {sections.map((section) => (
          <NavEntry key={section.route} node={section} top={true} pathname={pathname} />
        ))}
      </ul>
    </>
  );
}

export function DocsSidebar({ sections }: { readonly sections: readonly NavSection[] }) {
  return (
    <nav
      aria-label="Documentation"
      className="hidden py-10 lg:block lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto"
    >
      <DocsTree sections={sections} />
    </nav>
  );
}

/**
 * Replaces the sidebar below `lg`. A single "Browse documentation" row that opens the same
 * collapsible tree, so a phone reader gets the full hierarchy without a wall of links up front.
 */
export function DocsSectionNav({ sections }: { readonly sections: readonly NavSection[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Choosing a page closes the menu. The panel is hidden rather than unmounted, so which groups
  // the reader had folded open survive the next time the menu is opened.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <nav
      aria-label="Documentation sections"
      className="-mx-4 border-b border-[var(--edge)] lg:hidden"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--ink)]"
      >
        Browse documentation
        <ChevronDown
          aria-hidden="true"
          className={`size-4 text-[var(--ink-faint)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div id={panelId} hidden={!open} className="max-h-[70dvh] overflow-y-auto px-4 pb-4">
        <DocsTree sections={sections} />
      </div>
    </nav>
  );
}
