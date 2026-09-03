import { renderReleaseNotes } from "@govops/content";

import { GITHUB_OWNER, GITHUB_REPO } from "~/lib/site";

export type Release = {
  readonly tag: string;
  readonly name: string;
  readonly url: string;
  readonly publishedAt: string | null;
  readonly prerelease: boolean;
  readonly notesHtml: string;
};

export type ReleaseFeed = {
  readonly releases: readonly Release[];
  /** True when GitHub could not be reached. The page renders the same empty state either way. */
  readonly unavailable: boolean;
};

const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases?per_page=20`;
const CACHE_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 4000;

type CacheEntry = { feed: ReleaseFeed; fetchedAt: number };

let cache: CacheEntry | null = null;
let inFlight: Promise<ReleaseFeed> | null = null;

function isFresh(entry: CacheEntry | null): entry is CacheEntry {
  return entry !== null && Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

/**
 * Empty is a valid answer, not an error: the repository has no releases yet. A failed or
 * rate-limited request returns the same empty feed with `unavailable` set — the site must render
 * even when GitHub does not respond.
 */
export async function getReleases(): Promise<ReleaseFeed> {
  const cached = cache;
  if (isFresh(cached)) return cached.feed;
  if (inFlight) return inFlight;

  inFlight = fetchReleases()
    .then((fetched) => {
      // A failed fetch must not evict a good cached answer: a stale list beats an empty one.
      const previous = cache;
      if (fetched.unavailable && previous !== null) return previous.feed;
      cache = { feed: fetched, fetchedAt: Date.now() };
      return fetched;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/**
 * Never blocks: every page header shows this, so it must stay off the critical path of a cold
 * start. On a cold cache it kicks off a refresh and returns null, and the badge reads
 * "pre-release" until the next request.
 */
export function latestVersionNonBlocking(): string | null {
  const cached = cache;
  if (isFresh(cached)) return cached.feed.releases[0]?.tag ?? null;
  void getReleases().catch(() => undefined);
  return null;
}

async function fetchReleases(): Promise<ReleaseFeed> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "govops.info",
  };
  // Unauthenticated is 60/hour per IP: ample at one instance with an hour of caching.
  if (token) headers["authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(API_URL, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(`[releases] GitHub responded ${response.status}`);
      return { releases: [], unavailable: true };
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return { releases: [], unavailable: true };

    return { releases: payload.filter(isReleasePayload).map(toRelease), unavailable: false };
  } catch (error) {
    console.warn("[releases] GitHub request failed", error);
    return { releases: [], unavailable: true };
  }
}

type ReleasePayload = {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
  body: string | null;
};

function isReleasePayload(value: unknown): value is ReleasePayload {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate["tag_name"] === "string" &&
    typeof candidate["html_url"] === "string" &&
    candidate["draft"] !== true
  );
}

function toRelease(payload: ReleasePayload): Release {
  return {
    tag: payload.tag_name,
    name: payload.name?.trim() || payload.tag_name,
    url: payload.html_url,
    publishedAt: payload.published_at,
    prerelease: Boolean(payload.prerelease),
    notesHtml: payload.body ? renderReleaseNotes(payload.body) : "",
  };
}
