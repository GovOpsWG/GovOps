# GovOps documentation

Everything the working group has published, in reading order. This file drives the navigation on
[govops.info](https://govops.info) — adding a document here adds it to the site.

## Architecture

| Document | What it covers |
|---|---|
| [Architecture](./architecture/README.md) | The GovOps loop, the Governance and Runtime planes, and the nine GovOps services. The canonical reference. |

Start with [Architecture at a glance](./architecture/README.md#architecture-at-a-glance) for the
plane diagram and the loop, then read the service sections in order.

## Authorization Capability Catalog

| Document | What it covers |
|---|---|
| [ACC overview](./acc/README.md) | What the catalog is and which document to read first |
| [ACC design](./acc/authorization-capability-catalog-design.md) | The catalog model, the Authorization Capability Profile, Gemara layering, and the OSCAL export path |
| [ACC use cases](./acc/authorization-capability-catalog-use-cases.md) | Persona workflows: authoring, compliance mapping, linting, drift detection |

## Metrics

| Document | What it covers |
|---|---|
| [Metrics](./metrics/README.md) | What counts as a GovOps metric, the design rules, charter coverage, and the metric set |
| [Denial ratio trend](./metrics/denial-ratio-trend.md) | The first published metric entry |
| [Metric definition template](./metrics/metric-definition-template.md) | The shape every entry follows |

## Working group

| Document | What it covers |
|---|---|
| [OWASP](./owasp/README.md) | Project status and the submitted proposal |
| [Outreach](./outreach/README.md) | Where the working group meets and how to join |

## Conventions

- Documents are plain GitHub-flavored Markdown with no front matter, so they read correctly both on
  GitHub and on govops.info.
- Relative links between documents work in both places. The site rewrites them to routes at build
  time.
- Fenced `text` blocks hold hand-drawn diagrams. The site renders them unwrapped and
  unhighlighted — keep them under roughly 100 columns.

See [CONTRIBUTING.md](../CONTRIBUTING.md) to propose a change.
