# GovOps documentation

Everything the working group has published, in reading order.

Documents are picked up automatically — you do not register them anywhere. This file controls the
**order** they appear in on [govops.info](https://govops.info); see
[How the menu is built](#how-the-menu-is-built) at the end.

## Purpose of GovOps

Governance Operations (GovOps) is a capability-centric governance framework designed to address the challenges of modern, highly dynamic, and automated environments, particularly those involving non-human agents and agentic software.

At its core, GovOps proposes a shift from traditional identity-centric governance models to a **capability-centric** approach. In this model, the fundamental unit of governance is a **capability**, defined as an **action-resource pair**.

This approach enables a more granular and effective way to manage risk and enforce policy in complex systems.

## Scope

| Document | What it covers |
|---|---|
| [Scope](./scope/README.md) | What GovOps defines and what it deliberately leaves to other systems. |

## Foundations

| Document | What it covers |
|---|---|
| [Foundations](./foundations/README.md) | Explanatory material, including the problem statement, the GovOps thesis, and its relation to other frameworks. |

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

## How the menu is built

The sidebar is generated from the files on disk at build time. Nothing is registered by hand.

| What you do | What appears |
|---|---|
| Add `docs/<section>/<name>.md` | An entry in that section's menu, titled from its first `#` heading |
| Add a new `docs/<section>/` directory | A new section, titled from its `README.md`, or from the directory name if it has none |
| Link a document from this file | It sorts to that position instead of alphabetically |
| Add `docs/<name>.md` at the top level | A reachable page, but **not** a menu entry — this is how `MOVED.md` stays out of the way |

The rules in full:

1. **Sections are directories.** Every subdirectory of `docs/` becomes one.
2. **Section titles come from `README.md`.** A section without one is titled from its directory
   name (`event-handling` becomes "Event handling") and its heading links to its first document
   rather than to a page that does not exist.
3. **Order comes from this file.** Sections and documents appear in the order they are linked
   above. Anything not linked sorts to the end of its section, alphabetically by title.
4. **Nothing is hidden by omission.** A document you forget to link here still appears in the menu
   and is still searchable — it just sorts last.

So the only reason to edit this file is to change *reading order* or to describe a document. To add
one, just add the file.

See [CONTRIBUTING.md](../Community_Specification/contributing.md) to propose a change.
