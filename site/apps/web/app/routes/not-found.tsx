import { Link } from "react-router";

import { SITE_NAME } from "~/lib/site";

export function loader() {
  throw new Response("Not found", { status: 404 });
}

export function meta() {
  return [{ title: `Page not found | ${SITE_NAME}` }];
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link to="/docs" className="mt-6 inline-block text-[var(--accent-from)] hover:underline">
        Browse the documentation
      </Link>
    </div>
  );
}
