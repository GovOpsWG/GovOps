import { Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { serializeThemeCookie, type Theme } from "~/lib/theme";

const ORDER: readonly Theme[] = ["system", "dark", "light"];

const LABELS: Record<Theme, string> = {
  system: "Match system theme",
  dark: "Dark theme",
  light: "Light theme",
};

/**
 * Writes a cookie so the next server render can stamp `<html data-theme>` directly; sets the
 * attribute here too, so the current page changes without waiting for one.
 */
export function ThemeToggle({ theme }: { readonly theme: Theme }) {
  const [current, setCurrent] = useState<Theme>(theme);

  function advance() {
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length] as Theme;
    setCurrent(next);
    document.cookie = serializeThemeCookie(next);
    const root = document.documentElement;
    if (next === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
  }

  const Icon = current === "dark" ? Moon : current === "light" ? Sun : Monitor;

  return (
    <button
      type="button"
      onClick={advance}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--edge)] text-[var(--ink-muted)] transition hover:border-[var(--edge-strong)] hover:text-[var(--ink)]"
      aria-label={LABELS[current]}
      title={LABELS[current]}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
