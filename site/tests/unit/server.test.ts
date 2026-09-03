import { describe, expect, it } from "vitest";

import {
  cacheControlFor,
  contentTypeFor,
  parseServerEnvironment,
  resolveStaticFile,
} from "../../apps/web/server.js";
import {
  contentSecurityPolicy,
  documentHeaders,
  staticAssetHeaders,
} from "../../apps/web/security-headers.js";

const CLIENT_DIRECTORY = "/srv/build/client";

describe("resolveStaticFile", () => {
  it("resolves a file inside the client build", () => {
    expect(resolveStaticFile("/brand/govops-mark.png", CLIENT_DIRECTORY)).toBe(
      "/srv/build/client/brand/govops-mark.png",
    );
  });

  it("refuses to escape the client build", () => {
    expect(resolveStaticFile("/../../etc/passwd", CLIENT_DIRECTORY)).toBeNull();
    expect(resolveStaticFile("/assets/../../../etc/passwd", CLIENT_DIRECTORY)).toBeNull();
  });

  it("refuses percent-encoded traversal", () => {
    expect(resolveStaticFile("/%2e%2e/%2e%2e/etc/passwd", CLIENT_DIRECTORY)).toBeNull();
  });

  it("refuses a null byte and malformed encoding", () => {
    expect(resolveStaticFile("/a%00b", CLIENT_DIRECTORY)).toBeNull();
    expect(resolveStaticFile("/%zz", CLIENT_DIRECTORY)).toBeNull();
  });
});

describe("cacheControlFor", () => {
  it("treats fingerprinted assets as immutable", () => {
    expect(cacheControlFor("/assets/app-abc123.css")).toContain("immutable");
  });

  it("revalidates everything else", () => {
    expect(cacheControlFor("/brand/govops-mark.png")).toContain("must-revalidate");
  });
});

describe("contentTypeFor", () => {
  it("serves fonts and images with their real type", () => {
    expect(contentTypeFor("/x/inter.woff2")).toBe("font/woff2");
    expect(contentTypeFor("/x/mark.png")).toBe("image/png");
  });

  it("falls back rather than guessing", () => {
    expect(contentTypeFor("/x/thing.bin")).toBe("application/octet-stream");
  });
});

describe("parseServerEnvironment", () => {
  it("defaults to localhost:3000", () => {
    expect(parseServerEnvironment({})).toEqual({ host: "127.0.0.1", port: 3000 });
  });

  it("reads PORT and HOST, as Cloud Run supplies them", () => {
    expect(parseServerEnvironment({ PORT: "8080", HOST: "0.0.0.0" })).toEqual({
      host: "0.0.0.0",
      port: 8080,
    });
  });

  it("rejects a port that is not a port", () => {
    expect(() => parseServerEnvironment({ PORT: "nope" })).toThrow(/PORT/);
    expect(() => parseServerEnvironment({ PORT: "70000" })).toThrow(/PORT/);
  });
});

describe("content security policy", () => {
  it("admits only scripts carrying this response's nonce", () => {
    const policy = contentSecurityPolicy("abc123");
    expect(policy).toContain("script-src 'self' 'nonce-abc123'");
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });

  it("admits no script at all for a static file", () => {
    expect(staticAssetHeaders()["content-security-policy"]).toContain("script-src 'none'");
  });

  it("allows the GitHub API, which the releases page calls, and nothing else", () => {
    const policy = contentSecurityPolicy("abc123");
    expect(policy).toContain("connect-src 'self' https://api.github.com");
    expect(policy).toContain("font-src 'self'");
  });

  it("sets the rest of the hardening headers on a document", () => {
    const headers = documentHeaders("abc123");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
