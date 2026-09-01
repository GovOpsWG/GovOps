import { absoluteUrl } from "~/lib/site";

export function loader() {
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${absoluteUrl("/sitemap.xml")}`].join(
    "\n",
  );

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
