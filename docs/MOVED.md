# Moved paths

Working group documents moved from the repository root into `docs/` so the repository root could
hold the site and the contributor front matter. Content is unchanged; only the paths moved.

| Old path | New path |
|---|---|
| `acc/` | [`docs/acc/`](./acc/) |
| `architecture/` | [`docs/architecture/`](./architecture/) |
| `metrics/` | [`docs/metrics/`](./metrics/) |
| `outreach/` | [`docs/outreach/`](./outreach/) |
| `owasp/` | [`docs/owasp/`](./owasp/) |

Relative links *between* documents were unaffected — the five directories moved together, so
`../acc/authorization-capability-catalog-design.md` still resolves from `docs/architecture/`.

External links to the old paths (for example
`github.com/GovOpsWG/GovOps/blob/main/architecture/README.md`) will 404. GitHub does not redirect
moved paths. If you maintain a link to one of the old locations, update it using the table above.
