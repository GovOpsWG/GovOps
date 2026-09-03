import { Search as SearchIcon } from "lucide-react";
import { Form, Link } from "react-router";

import { search } from "~/features/search/search.server";
import { SITE_NAME } from "~/lib/site";
import type { Route } from "./+types/search";

export function loader({ request }: Route.LoaderArgs) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  return { query, hits: search(query) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.query
        ? `${loaderData.query} | Search | ${SITE_NAME}`
        : `Search | ${SITE_NAME}`,
    },
    { name: "robots", content: "noindex" },
  ];
}

/** The counterpart to the Ctrl+K dialog, and the one that works without JavaScript. */
export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const { query, hits } = loaderData;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Search</h1>

      <Form method="get" role="search" className="mt-6 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--edge)] px-3">
          <SearchIcon className="size-4 shrink-0 text-[var(--ink-faint)]" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search the GovOps documentation"
            aria-label="Search the GovOps documentation"
            className="h-11 w-full bg-transparent outline-none placeholder:text-[var(--ink-faint)]"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--brand)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
        >
          Search
        </button>
      </Form>

      {query ? (
        <p className="mt-8 text-sm text-[var(--ink-faint)]">
          {hits.length} {hits.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {hits.map((hit) => (
          <li key={hit.route}>
            <Link
              to={hit.route}
              className="surface-card block p-5 transition hover:border-[var(--edge-strong)]"
            >
              <span className="block text-xs text-[var(--accent-to)]">{hit.section}</span>
              <span className="mt-1 block font-semibold text-[var(--ink)]">{hit.title}</span>
              <span className="mt-2 block text-sm text-[var(--ink-muted)]">{hit.excerpt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
