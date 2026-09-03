import type { LinksFunction } from "react-router";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from "react-router";

import stylesheet from "~/app.css?url";
import { latestVersionNonBlocking } from "~/features/releases/releases.server";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "~/lib/site";
import { themeFromCookie, type Theme } from "~/lib/theme";
import type { Route } from "./+types/root";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", href: "/brand/govops-mark.png", type: "image/png" },
  { rel: "apple-touch-icon", href: "/brand/govops-mark.png" },
];

export function loader({ request }: Route.LoaderArgs) {
  return {
    theme: themeFromCookie(request.headers.get("cookie")),
    version: latestVersionNonBlocking(),
  };
}

export function Layout({ children }: { readonly children: React.ReactNode }) {
  const data = useRouteLoaderData<{ theme: Theme }>("root");
  // "system" renders no attribute, leaving the media query to decide.
  const theme = data?.theme ?? "system";

  return (
    <html lang="en" {...(theme === "system" ? {} : { "data-theme": theme })}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="color-scheme" content="dark light" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{`${SITE_NAME}: ${SITE_TAGLINE}`}</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--surface)] focus:px-4 focus:py-2 focus:text-[var(--ink)]"
        >
          Skip to content
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const heading = status === 404 ? "Page not found" : "Something went wrong";
  const detail =
    status === 404
      ? "That page is not part of the GovOps documentation."
      : "The page could not be rendered. The error has been logged.";

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-[var(--accent-to)]">{status}</p>
      <h1 className="mt-3 text-3xl font-bold">{heading}</h1>
      <p className="mt-3 text-[var(--ink-muted)]">{detail}</p>
      <a
        href="/"
        className="mt-8 rounded-lg border border-[var(--edge-strong)] px-5 py-2.5 text-sm font-semibold"
      >
        Back to the GovOps home page
      </a>
    </main>
  );
}
