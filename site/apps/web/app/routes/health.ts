/** Container health check. Deliberately does no I/O, so it reports the process, not GitHub. */
export function loader() {
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
