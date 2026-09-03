import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * No releases, a rate limit, an outage: all normal states here, and none may take the page down.
 */
describe("release feed", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function load() {
    return import("~/features/releases/releases.server");
  }

  function stubFetch(response: unknown) {
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  function ok(payload: unknown) {
    return { ok: true, status: 200, json: async () => payload };
  }

  it("returns an empty feed when the repository has no releases", async () => {
    stubFetch(ok([]));
    const { getReleases } = await load();

    const feed = await getReleases();
    expect(feed.releases).toEqual([]);
    expect(feed.unavailable).toBe(false);
  });

  it("maps a published release, rendering its notes", async () => {
    stubFetch(
      ok([
        {
          tag_name: "v0.1.0",
          name: "First draft",
          html_url: "https://github.com/GovOpsWG/GovOps/releases/tag/v0.1.0",
          published_at: "2026-09-01T10:00:00Z",
          prerelease: false,
          draft: false,
          body: "## Highlights\n\n- ACC design",
        },
      ]),
    );
    const { getReleases } = await load();

    const feed = await getReleases();
    expect(feed.releases).toHaveLength(1);
    expect(feed.releases[0]?.tag).toBe("v0.1.0");
    expect(feed.releases[0]?.name).toBe("First draft");
    expect(feed.releases[0]?.notesHtml).toContain("<li>ACC design</li>");
  });

  it("sanitises release notes on the way in", async () => {
    stubFetch(
      ok([
        {
          tag_name: "v0.1.0",
          name: null,
          html_url: "https://example.test/r",
          published_at: null,
          prerelease: true,
          draft: false,
          body: "<script>alert(1)</script>ok",
        },
      ]),
    );
    const { getReleases } = await load();

    const feed = await getReleases();
    expect(feed.releases[0]?.notesHtml).not.toContain("<script");
    expect(feed.releases[0]?.name).toBe("v0.1.0");
  });

  it("hides drafts", async () => {
    stubFetch(
      ok([
        {
          tag_name: "v0.2.0",
          html_url: "https://example.test/d",
          draft: true,
          prerelease: false,
          name: null,
          published_at: null,
          body: null,
        },
      ]),
    );
    const { getReleases } = await load();

    expect((await getReleases()).releases).toEqual([]);
  });

  it("reports unavailable rather than throwing when GitHub rate-limits", async () => {
    stubFetch({ ok: false, status: 403, json: async () => ({}) });
    const { getReleases } = await load();

    const feed = await getReleases();
    expect(feed.releases).toEqual([]);
    expect(feed.unavailable).toBe(true);
  });

  it("reports unavailable when GitHub errors", async () => {
    stubFetch({ ok: false, status: 500, json: async () => ({}) });
    const { getReleases } = await load();

    expect((await getReleases()).unavailable).toBe(true);
  });

  it("reports unavailable when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const { getReleases } = await load();

    expect((await getReleases()).unavailable).toBe(true);
  });

  it("survives a response that is not an array", async () => {
    stubFetch(ok({ message: "Not Found" }));
    const { getReleases } = await load();

    expect((await getReleases()).unavailable).toBe(true);
  });

  it("caches, so the header badge does not call GitHub on every request", async () => {
    const fetchMock = stubFetch(ok([]));
    const { getReleases } = await load();

    await getReleases();
    await getReleases();
    await getReleases();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("coalesces concurrent requests into one call", async () => {
    const fetchMock = stubFetch(ok([]));
    const { getReleases } = await load();

    await Promise.all([getReleases(), getReleases(), getReleases()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("never blocks the header badge on a cold cache", async () => {
    stubFetch(
      ok([
        {
          tag_name: "v9.9.9",
          html_url: "https://example.test/r",
          draft: false,
          prerelease: false,
          name: null,
          published_at: null,
          body: null,
        },
      ]),
    );
    const { latestVersionNonBlocking, getReleases } = await load();

    expect(latestVersionNonBlocking()).toBeNull();
    await getReleases();
    expect(latestVersionNonBlocking()).toBe("v9.9.9");
  });

  it("sends an authorization header only when a token is configured", async () => {
    vi.stubEnv("GITHUB_TOKEN", "secret-token");
    const fetchMock = stubFetch(ok([]));
    const { getReleases } = await load();

    await getReleases();
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(headers["authorization"]).toBe("Bearer secret-token");
  });
});
