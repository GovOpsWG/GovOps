import { search } from "~/features/search/search.server";
import type { Route } from "./+types/api.search";

export function loader({ request }: Route.LoaderArgs) {
  const query = new URL(request.url).searchParams.get("q") ?? "";

  return new Response(JSON.stringify({ hits: search(query) }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
