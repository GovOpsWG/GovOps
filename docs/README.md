# GovOps documentation

Everything the working group has published, in reading order.

Documents are picked up automatically — you do not register them anywhere. This file controls the
**order** they appear in on [govops.info](https://govops.info); see
[How the menu is built](../README.md#how-the-menu-is-built) at the end.


## Scope

| Document | What it covers |
|---|---|
| [Scope](./scope/README.md) | What GovOps defines and what it deliberately leaves to other systems. |

## Foundations

| Document | What it covers |
|---|---|
| [Foundations](./foundations/README.md) | Explanatory material, including the problem statement, the GovOps thesis, and its relation to other frameworks. |
| [Principles](./foundations/architectural-principles.md) | The four GovOps principles and the design rules that apply them. |

## Architecture

| Document | What it covers |
|---|---|
| [Architecture](./architecture/README.md) | The GovOps loop, the Governance and Runtime planes, the four layers, and the GovOps services. The canonical reference. |
| [Capability Catalog](./architecture/governance/capability-catalog.md) | The inventory of governed capabilities and their lifecycle |
| [Continuous Evidence](./architecture/governance/continuous-evidence.md) | Runtime evidence linked to `capability_id`. To be added soon. |
| [Continuous Compliance](./architecture/governance/continuous-compliance.md) | Capabilities to controls through Gemara, and the export path to OSCAL |
| [Governance Metrics](./architecture/governance/governance-metrics.md) | Measuring governance with `capability_id` as the unit |
| [Centralized Policy Management](./architecture/access-management/policy-management.md) | Central administration of policy, with distributed enforcement |
| [Schema Management](./architecture/access-management/schema-management.md) | The entities, attributes, and claims policies can reference |
| [Federation Management](./architecture/access-management/federation-management.md) | Which external issuers, credentials, and claims the enterprise trusts |
| [Runtime Authorization Context](./architecture/access-management/runtime-authorization-context.md) | The context that joins a decision to what executed |
| [Kernel Observability](./architecture/observability/kernel-observability.md) | Independent evidence of what actually ran |
| [Identity](./architecture/identity/identity.md) | Human, software, and organization identities. To be added soon. |
| [Event Handling and Response](./architecture/event-handling.md) | How the enterprise responds to what it detects |

Start with [Architecture at a glance](./architecture/README.md#architecture-at-a-glance) for the
plane diagram and the loop, then read the service pages in order.

## Authorization Capability Catalog

| Document | What it covers |
|---|---|
| [ACC overview](./acc/README.md) | What the catalog is and which document to read first |
| [ACC design](./acc/authorization-capability-catalog-design.md) | The catalog model, the Authorization Capability Profile, Gemara layering, and the OSCAL export path |
| [ACC use cases](./acc/authorization-capability-catalog-use-cases.md) | Persona workflows: authoring, compliance mapping, linting, drift detection |

## TRACE profile

| Document | What it covers |
|---|---|
| [TRACE profile](./trace/README.md) | The GovOps evidence profile of TRACE |
| [GovOps TRACE profile](./trace/govops-trace-profile.md) | Schema changes on top of the base TRACE v0.2 Trust Record |

## Metrics

| Document | What it covers |
|---|---|
| [Metrics](./metrics/README.md) | What counts as a GovOps metric, the design rules, charter coverage, and the metric set |
| [Metric definition template](./metrics/metric-definition-template.md) | The shape every entry follows |

## Working group

| Document | What it covers |
|---|---|
| [OWASP](./owasp/README.md) | Project status and the submitted proposal |
| [Outreach](./outreach/README.md) | Where the working group meets and how to join |

## Conventions

- Documents are plain GitHub-flavored Markdown with no front matter, so they read correctly both on  GitHub and on govops.info.
- Relative links between documents work in both places. The site rewrites them to routes at build time.
- Fenced `text` blocks hold hand-drawn diagrams. The site renders them unwrapped and unhighlighted — keep them under roughly 100 columns.
