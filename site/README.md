# govops.info

The GovOps Working Group landing page and documentation site.

The documentation is **not** in this directory. It is the Markdown in [`../docs`](../docs), read at
build time by `@govops/content`. Nothing is copied or duplicated: editing a document on GitHub and
redeploying is the whole publishing workflow, and a documentation-only contributor never installs
any of this.

## Stack

React Router 8 (framework mode, server-rendered) · Tailwind CSS 4 · pnpm workspace · Node 24 ·
Docker · Cloud Run. The same shape as [cedarling.dev](https://cedarling.dev), so the two sites are
operationally interchangeable.

```text
apps/web/           the application (routes, components, SSR server)
packages/content/   Markdown pipeline: docs/**/*.md -> typed pages, nav, search index
scripts/            brand asset generation, container smoke test
tests/              unit, integration, and end-to-end tests
```

## Develop

```bash
pnpm install
pnpm dev
```

The dev server runs on <http://localhost:3000>. `pnpm dev` regenerates the content module first;
after editing a file in `../docs`, restart it (or run `pnpm content:generate`) to pick the change
up.

## Verify

```bash
pnpm check
```

That runs, in order: `typecheck`, `lint`, `format:check`, `build`, `test` (Vitest), and `test:e2e`
(Playwright, desktop and mobile, both themes, with an axe accessibility pass on every page).

Individually:

| Command         | What it covers                                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`     | The Markdown pipeline, the release feed against every GitHub failure mode, release-note sanitisation, static-file path handling, and the security headers |
| `pnpm test:e2e` | The rendered site in a real browser, including accessibility                                                                                              |
| `pnpm build`    | Production build                                                                                                                                          |

The integration tests are the guard on the documentation: they assert that every internal link and
every heading anchor in the corpus resolves. A cross-reference broken by moving or renaming a
document fails the build rather than reaching the site.

## Container

The build context is the **repository root**, not this directory, because the content pipeline
reads `docs/`.

```bash
docker compose up --build --wait
node site/scripts/docker-smoke.mjs
```

Both commands run from the repository root. The smoke test checks every route, the security
headers, and that the Content-Security-Policy nonce matches the rendered script tags — the failure
that would silently break every page in production.

## Deploy

[`../cloudbuild.yaml`](../cloudbuild.yaml) builds the image, pushes it to Artifact Registry, and
deploys to Cloud Run with `--min-instances=0`, so the service costs nothing while idle.

First-time setup:

1. Create an Artifact Registry Docker repository, and set `_AR_HOST`, `_REPO`, `_REGION`, and
   `_SERVICE` in `cloudbuild.yaml` (or as trigger substitutions).
2. Create a Cloud Build trigger on push to `main`.
3. Create a second trigger on **release published**, so a new GitHub release appears on `/releases`
   immediately instead of waiting for the one-hour server-side cache.
4. Map `govops.info` to the Cloud Run service, and set `SITE_URL=https://govops.info` on the
   service so canonical URLs, Open Graph tags, and the sitemap agree with DNS.

### Environment

| Variable       | Required    | Purpose                                                                               |
| -------------- | ----------- | ------------------------------------------------------------------------------------- |
| `PORT`         | no          | Defaults to 3000; Cloud Run sets 8080                                                 |
| `HOST`         | no          | Defaults to 127.0.0.1; the container sets 0.0.0.0                                     |
| `SITE_URL`     | recommended | Canonical origin for metadata and the sitemap                                         |
| `GITHUB_TOKEN` | no          | Raises the GitHub API rate limit. Unnecessary at one instance with an hour of caching |

## Security posture

- `default-src 'self'` with a per-response nonce for scripts. Everything the page loads — fonts,
  images, styles — is served from this origin. The single external allowance is `api.github.com`,
  which the releases page calls.
- GitHub release notes are authored outside this repository, so they are sanitised against an
  allowlist before rendering, in addition to the policy above.
- The container runs as a non-root user with no build toolchain in the final image.

## Known gap: the logo is a raster

The lockup in `apps/web/public/brand` is PNG because no vector source exists yet. One is coming.
When it arrives, replace the two theme-swapped images in `app/components/logo.tsx` with a single
inline SVG — that removes the CSS variant swap in `app.css` as well.
