import { docRoutes } from "@govops/content/generated";

import { absoluteUrl } from "~/lib/site";

export function loader() {
  const routes = ["/", "/releases", "/search", ...docRoutes];
  const entries = routes.map((route) => `  <url><loc>${absoluteUrl(route)}</loc></url>`).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
