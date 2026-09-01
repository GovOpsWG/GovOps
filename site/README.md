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

First-time setup, once per project. Everything below is scoped to this service — no project-wide
Editor, and no use of the Compute Engine default service account.

Set the shell variables first, and check them. Setting the gcloud project does **not** set
`PROJECT_ID` in your shell; if it is empty, the account addresses below silently become
`govops-info-build@.iam.gserviceaccount.com` and every binding fails with a confusing error.

```bash
gcloud config set project YOUR_PROJECT_ID

export PROJECT_ID="$(gcloud config get-value project)"
export REGION=us-central1 SERVICE=govops-info
# Artifact Registry. cloud-run-source-deploy is the repository Cloud Run creates for source
# deploys; it is regional, and AR_LOCATION must match _AR_HOST in cloudbuild.yaml.
export REPO=cloud-run-source-deploy AR_LOCATION=us-central1
export BUILD_SA="govops-info-build@${PROJECT_ID}.iam.gserviceaccount.com"
export RUN_SA="govops-info-run@${PROJECT_ID}.iam.gserviceaccount.com"

printf 'project=%s\nbuild=%s\nrun=%s\n' "$PROJECT_ID" "$BUILD_SA" "$RUN_SA"
```

All three lines must be fully populated before continuing.

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# Reuse the repository if it is already there — Cloud Run creates cloud-run-source-deploy on the
# first source deploy in a project.
gcloud artifacts repositories describe "$REPO" --location="$AR_LOCATION" --format="value(name)" \
  || gcloud artifacts repositories create "$REPO" \
       --repository-format=docker --location="$AR_LOCATION" --description="Cloud Run images"
```

**Runtime identity — holds no roles at all.** The container reads the public GitHub API and touches
nothing else in the project, so it needs no permissions. Creating it is what stops Cloud Run from
falling back to the Compute Engine default account, which carries Editor.

```bash
gcloud iam service-accounts create govops-info-run \
  --display-name="govops.info Cloud Run runtime"
```

**Build identity — four narrow grants.** Set this account on the Cloud Build trigger; do not reuse
the default Cloud Build account.

```bash
gcloud iam service-accounts create govops-info-build \
  --display-name="govops.info Cloud Build"

# Both accounts must exist before anything is bound to them. Expect two lines.
gcloud iam service-accounts list --filter="email~govops-info" --format="value(email)"

# Write build logs. Required because cloudbuild.yaml sets logging: CLOUD_LOGGING_ONLY, which is
# itself required when a build runs as a user-specified service account.
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$BUILD_SA" --role=roles/logging.logWriter --condition=None

# Push images. Setting IAM on a repository needs artifactregistry.repositories.setIamPolicy,
# which Project IAM Admin does not include — grant yourself roles/artifactregistry.repoAdmin
# first if this is denied.
gcloud artifacts repositories add-iam-policy-binding "$REPO" --location="$AR_LOCATION" \
  --member="serviceAccount:$BUILD_SA" --role=roles/artifactregistry.writer

# Deploy a service that runs as the runtime account. Granted on that one account, so the build
# cannot impersonate anything else in the project.
gcloud iam service-accounts add-iam-policy-binding "$RUN_SA" \
  --member="serviceAccount:$BUILD_SA" --role=roles/iam.serviceAccountUser
```

`cloud-run-source-deploy` is shared with every other Cloud Run source deploy in the project, so
scoping the build account to it is weaker isolation than a dedicated repository would give: the
account can overwrite images belonging to other services in that repo. A repository of its own —
set `_REPO` in `cloudbuild.yaml` — restores that isolation if the project ever warrants it.

The fourth grant is Cloud Run deploy. It has to be project-wide for the very first build, because
the service does not exist yet and IAM cannot be attached to a resource that is absent:

```bash
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$BUILD_SA" --role=roles/run.developer --condition=None
```

**After the first successful deploy, narrow it to the single service and remove the project-wide
grant:**

```bash
gcloud run services add-iam-policy-binding "$SERVICE" --region="$REGION" \
  --member="serviceAccount:$BUILD_SA" --role=roles/run.developer

gcloud projects remove-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$BUILD_SA" --role=roles/run.developer --condition=None
```

Then create the triggers and map the domain:

1. A Cloud Build trigger on push to `main`, with **Service account** set to `govops-info-build`
   and the config file set to `cloudbuild.yaml`.
2. A second trigger on **release published**, so a new GitHub release appears on `/releases`
   immediately instead of waiting for the one-hour server-side cache.
3. Map `govops.info` to the Cloud Run service, and set `_SITE_URL` accordingly.

Public access is granted to the _service_, not to the build identity — `--allow-unauthenticated` in
`cloudbuild.yaml` is what makes the site readable, and it needs `roles/run.invoker` for `allUsers`
on the service. If your organisation policy blocks that binding, the deploy step will report it.

To verify the runtime account really is powerless:

```bash
gcloud projects get-iam-policy "$PROJECT_ID" \
  --flatten="bindings[].members" \
  --filter="bindings.members:govops-info-run@$PROJECT_ID.iam.gserviceaccount.com" \
  --format="value(bindings.role)"
```

That should print nothing.

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
