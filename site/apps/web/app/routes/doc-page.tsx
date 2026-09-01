import { docRoutes, findPage, navigation } from "@govops/content/generated";
import { ChevronLeft, ChevronRight, Clock, Pencil } from "lucide-react";
import { Link } from "react-router";

import { TableOfContents } from "~/features/docs/table-of-contents";
import { GITHUB_URL, SITE_NAME, absoluteUrl } from "~/lib/site";
import type { Route } from "./+types/doc-page";

export function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname.replace(/\/$/, "") || "/docs";
  const page = findPage(pathname);

  if (!page) {
    throw new Response("Not found", { status: 404 });
  }

  const order = readingOrder();
  const position = order.indexOf(page.route);

  return {
    page,
    previous: position > 0 ? pageSummary(order[position - 1]) : null,
    next: position >= 0 && position < order.length - 1 ? pageSummary(order[position + 1]) : null,
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: `Not found | ${SITE_NAME}` }];

  const { page } = loaderData;
  const title = `${page.title} | ${SITE_NAME}`;
  return [
    { title },
    { name: "description", content: page.summary },
    { property: "og:title", content: title },
    { property: "og:description", content: page.summary },
    { property: "og:url", content: absoluteUrl(page.route) },
    { tagName: "link", rel: "canonical", href: absoluteUrl(page.route) },
  ];
}

export default function DocPage({ loaderData }: Route.ComponentProps) {
  const { page, previous, next } = loaderData;

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-10">
      <article className="min-w-0 py-10">
        <header>
          <p className="text-xs font-semibold tracking-wide text-[var(--accent-to)] uppercase">
            {sectionTitle(page.section)}
          </p>
          <h1 className="mt-3 text-2xl font-bold text-[var(--ink)] sm:text-3xl md:text-4xl">
            {page.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--ink-faint)]">
            {page.status ? (
              <span className="rounded-full border border-[var(--edge)] px-2.5 py-1">
                {page.status}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {page.readingMinutes} min read
            </span>
            <a
              href={`${GITHUB_URL}/blob/main/${page.sourcePath}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 hover:text-[var(--ink-muted)]"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit on GitHub
            </a>
          </div>
        </header>

        {/* Built at build time by @govops/content from Markdown in this repository. */}
        <div className="doc-body mt-10" dangerouslySetInnerHTML={{ __html: page.html }} />

        {previous || next ? (
          <nav
            aria-label="Documents"
            className="mt-16 grid gap-3 border-t border-[var(--edge)] pt-8 sm:grid-cols-2"
          >
            {previous ? <AdjacentLink direction="previous" {...previous} /> : <span />}
            {next ? <AdjacentLink direction="next" {...next} /> : null}
          </nav>
        ) : null}
      </article>

      <TableOfContents entries={page.toc} />
    </div>
  );
}

type Adjacent = { readonly route: string; readonly title: string };

function AdjacentLink({
  direction,
  route,
  title,
}: Adjacent & { readonly direction: "previous" | "next" }) {
  const isNext = direction === "next";

  return (
    <Link
      to={route}
      className={`surface-card group flex flex-col gap-1 p-4 transition hover:border-[var(--edge-strong)] ${
        isNext ? "sm:text-right" : ""
      }`}
    >
      <span
        className={`inline-flex items-center gap-1 text-xs text-[var(--ink-faint)] ${
          isNext ? "sm:justify-end" : ""
        }`}
      >
        {isNext ? null : <ChevronLeft className="size-3.5" aria-hidden="true" />}
        {isNext ? "Next" : "Previous"}
        {isNext ? <ChevronRight className="size-3.5" aria-hidden="true" /> : null}
      </span>
      <span className="text-sm font-semibold text-[var(--ink)]">{title}</span>
    </Link>
  );
}

/** Previous/next follow the sidebar order, so paging through the docs reads them in sequence. */
function readingOrder(): string[] {
  const ordered = ["/docs"];
  for (const section of navigation) {
    ordered.push(section.route, ...section.children.map((child) => child.route));
  }
  return ordered.filter((route) => docRoutes.includes(route));
}

function pageSummary(route: string | undefined): Adjacent | null {
  if (!route) return null;
  const page = findPage(route);
  return page ? { route: page.route, title: page.title } : null;
}

function sectionTitle(section: string): string {
  if (!section) return "Documentation";
  return navigation.find((entry) => entry.route === `/docs/${section}`)?.title ?? "Documentation";
}
