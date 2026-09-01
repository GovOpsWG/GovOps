import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import type { SearchHit } from "~/features/search/search.server";

/**
 * Queries run server-side through `/api/search`: a full-text index over documents this long would
 * dwarf the rest of the page's JavaScript.
 */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<readonly SearchHit[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const trimmed = query.trim();
  // Hidden rather than cleared, so no effect has to set state during render.
  const visible = trimmed.length < 2 ? [] : hits;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHits([]);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (trimmed.length < 2) return undefined;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : { hits: [] }))
        .then((data: { hits: SearchHit[] }) => {
          setHits(data.hits ?? []);
          setActiveIndex(0);
        })
        .catch(() => undefined);
    }, 140);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [trimmed]);

  const go = useCallback(
    (route: string) => {
      close();
      void navigate(route);
    },
    [close, navigate],
  );

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visible.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter") {
      const hit = visible[activeIndex];
      if (hit) {
        event.preventDefault();
        go(hit.route);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // Below `sm` the label is hidden and only the icon remains.
        aria-label="Search the documentation"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--edge)] px-3 text-sm text-[var(--ink-faint)] transition hover:border-[var(--edge-strong)] hover:text-[var(--ink-muted)]"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-[var(--edge)] px-1.5 py-0.5 font-mono text-[0.65rem] lg:inline">
          &#8984;K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--edge-strong)] bg-[var(--ground)] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[var(--edge)] px-4">
              <Search className="size-4 shrink-0 text-[var(--ink-faint)]" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search the GovOps documentation"
                aria-label="Search the GovOps documentation"
                className="h-12 w-full bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="text-[var(--ink-faint)] hover:text-[var(--ink)]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <ul className="max-h-[52vh] overflow-y-auto p-2">
              {visible.map((hit, index) => (
                <li key={hit.route}>
                  <button
                    type="button"
                    onClick={() => go(hit.route)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                      index === activeIndex ? "bg-[var(--surface)]" : ""
                    }`}
                  >
                    <span className="block text-sm font-semibold text-[var(--ink)]">
                      {hit.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--ink-faint)]">
                      {hit.section}
                    </span>
                    {hit.excerpt ? (
                      <span className="mt-1 block line-clamp-2 text-xs text-[var(--ink-muted)]">
                        {hit.excerpt}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}

              {trimmed.length >= 2 && visible.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-[var(--ink-faint)]">
                  Nothing matched &ldquo;{trimmed}&rdquo;.
                </li>
              ) : null}

              {trimmed.length < 2 ? (
                <li className="px-3 py-6 text-center text-sm text-[var(--ink-faint)]">
                  Type at least two characters.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
