import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("layouts/shell.tsx", [
    index("routes/home.tsx"),
    route("docs", "routes/docs-layout.tsx", [
      index("routes/doc-page.tsx", { id: "docs-index" }),
      route("*", "routes/doc-page.tsx", { id: "docs-page" }),
    ]),
    route("releases", "routes/releases.tsx"),
    route("search", "routes/search.tsx"),
    route("*", "routes/not-found.tsx", { id: "catch-all" }),
  ]),
  route("api/search", "routes/api.search.ts"),
  route("health", "routes/health.ts"),
  route("robots.txt", "routes/robots.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
] satisfies RouteConfig;
