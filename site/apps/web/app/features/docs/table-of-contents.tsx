import type { TocEntry } from "@govops/content";
import { useEffect, useState } from "react";

export function TableOfContents({ entries }: { readonly entries: readonly TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Only the band just below the sticky header counts as "current", so the highlight tracks
      // reading position rather than jumping to whatever is largest on screen.
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const entry of entries) {
      const element = document.getElementById(entry.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="hidden py-10 xl:block xl:sticky xl:top-16 xl:h-[calc(100dvh-4rem)] xl:overflow-y-auto"
    >
      <p className="px-3 text-xs font-semibold tracking-wide text-[var(--ink-faint)] uppercase">
        On this page
      </p>
      <ul className="mt-3 space-y-0.5">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? "location" : undefined}
              className={`block rounded-lg py-1.5 pr-2 text-sm transition ${
                entry.depth === 3 ? "pl-6" : "pl-3"
              } ${
                activeId === entry.id
                  ? "text-[var(--accent-from)]"
                  : "text-[var(--ink-faint)] hover:text-[var(--ink-muted)]"
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
