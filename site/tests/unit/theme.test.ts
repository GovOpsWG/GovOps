import { describe, expect, it } from "vitest";

import { serializeThemeCookie, themeFromCookie } from "~/lib/theme";

describe("themeFromCookie", () => {
  it("falls back to system when no cookie is present", () => {
    expect(themeFromCookie(null)).toBe("system");
    expect(themeFromCookie("")).toBe("system");
    expect(themeFromCookie("other=1")).toBe("system");
  });

  it("reads the preference from among other cookies", () => {
    expect(themeFromCookie("a=1; govops-theme=dark; b=2")).toBe("dark");
    expect(themeFromCookie("govops-theme=light")).toBe("light");
  });

  it("ignores a value that is not a theme", () => {
    expect(themeFromCookie("govops-theme=neon")).toBe("system");
  });
});

describe("serializeThemeCookie", () => {
  it("scopes the cookie to the site and keeps it same-site", () => {
    const cookie = serializeThemeCookie("dark");
    expect(cookie).toContain("govops-theme=dark");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("SameSite=Lax");
  });
});
