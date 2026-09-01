import { CircleDot, ExternalLink, Tag } from "lucide-react";

import { ButtonLink } from "~/components/button";
import { GithubIcon } from "~/components/icons";
import { getReleases } from "~/features/releases/releases.server";
import { GITHUB_URL, SITE_NAME, absoluteUrl } from "~/lib/site";
import type { Route } from "./+types/releases";

export async function loader() {
  return getReleases();
}

export function headers() {
  // A release-triggered redeploy, not this, is what makes a new release appear immediately.
  return { "cache-control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600" };
}

export function meta() {
  const title = `Releases | ${SITE_NAME}`;
  return [
    { title },
    { name: "description", content: "GovOps working group releases, published from GitHub." },
    { property: "og:title", content: title },
    { tagName: "link", rel: "canonical", href: absoluteUrl("/releases") },
  ];
}

export default function Releases({ loaderData }: Route.ComponentProps) {
  const { releases, unavailable } = loaderData;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-[var(--accent-to)] uppercase">
          Working group
        </p>
        <h1 className="mt-3 text-4xl font-bold">Releases</h1>
        <p className="mt-4 text-[var(--ink-muted)]">
          Every GovOps deliverable is published as a GitHub release on{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[var(--accent-from)] underline underline-offset-2"
          >
            GovOpsWG/GovOps
          </a>
          . This page reflects that repository directly.
        </p>
      </header>

      {releases.length === 0 ? (
        <EmptyState unavailable={unavailable} />
      ) : (
        <ol className="mt-12 space-y-10">
          {releases.map((release, index) => (
            <li key={release.tag} className="surface-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--brand)_18%,transparent)] px-3 py-1 font-mono text-xs text-[var(--accent-to)]">
                  <Tag className="size-3.5" aria-hidden="true" />
                  {release.tag}
                </span>
                {index === 0 && !release.prerelease ? (
                  <span className="rounded-full border border-[var(--edge)] px-2.5 py-1 text-xs text-[var(--ink-faint)]">
                    Latest
                  </span>
                ) : null}
                {release.prerelease ? (
                  <span className="rounded-full border border-[var(--edge)] px-2.5 py-1 text-xs text-[var(--ink-faint)]">
                    Pre-release
                  </span>
                ) : null}
                {release.publishedAt ? (
                  <time dateTime={release.publishedAt} className="text-xs text-[var(--ink-faint)]">
                    {formatDate(release.publishedAt)}
                  </time>
                ) : null}
              </div>

              <h2 className="mt-4 text-xl font-bold text-[var(--ink)]">{release.name}</h2>

              {release.notesHtml ? (
                /* Authored on GitHub, so sanitised in @govops/content first. */
                <div
                  className="doc-body mt-5"
                  dangerouslySetInnerHTML={{ __html: release.notesHtml }}
                />
              ) : (
                <p className="mt-5 text-sm text-[var(--ink-faint)]">This release has no notes.</p>
              )}

              <a
                href={release.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-[var(--accent-from)] hover:underline"
              >
                View on GitHub
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** The state the site ships in, so it names the situation rather than rendering an empty list. */
function EmptyState({ unavailable }: { readonly unavailable: boolean }) {
  return (
    <div className="surface-card mt-12 p-8 text-center sm:p-12">
      <CircleDot className="mx-auto size-8 text-[var(--ink-faint)]" aria-hidden="true" />
      <h2 className="mt-5 text-xl font-bold">
        {unavailable ? "Releases are unavailable right now" : "No releases yet"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-[var(--ink-muted)]">
        {unavailable
          ? "GitHub could not be reached. The documentation below is unaffected, and this page will show releases again once GitHub responds."
          : "The working group deliverables are still in draft. Watch the repository to be notified when the first release is published."}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink to={`${GITHUB_URL}/subscription`}>
          <GithubIcon className="size-4" />
          Watch the repository
        </ButtonLink>
        <ButtonLink to="/docs" variant="secondary">
          Read the drafts
        </ButtonLink>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
