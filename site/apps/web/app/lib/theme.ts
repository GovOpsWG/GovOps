export type Theme = "dark" | "light" | "system";

export const THEME_COOKIE = "govops-theme";

export function isTheme(value: string | undefined): value is Theme {
  return value === "dark" || value === "light" || value === "system";
}

/**
 * Resolved server-side and rendered onto `<html data-theme>`, so a chosen theme never flashes the
 * other one first — and the site needs no inline bootstrap script for the CSP to carve out.
 */
export function themeFromCookie(cookieHeader: string | null): Theme {
  if (!cookieHeader) return "system";

  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name !== THEME_COOKIE) continue;
    const value = decodeURIComponent(rest.join("="));
    if (isTheme(value)) return value;
  }
  return "system";
}

export function serializeThemeCookie(theme: Theme): string {
  const oneYear = 60 * 60 * 24 * 365;
  return `${THEME_COOKIE}=${theme}; Path=/; Max-Age=${oneYear}; SameSite=Lax`;
}
