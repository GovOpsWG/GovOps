# GovOps documentation

Everything the working group has published, in reading order.

Documents are picked up automatically — you do not register them anywhere. This file controls the
**order** they appear in on [govops.info](https://govops.info); see
[How the menu is built](../README.md#how-the-menu-is-built) at the end.


## Foundations

| Document | What it covers |
|---|---|
| [Foundations](./foundations/README.md) | Explanatory material, including the problem statement, the GovOps thesis, and its relation to other frameworks. |
| [Scope](./foundations/scope.md) | What GovOps defines and what it deliberately leaves to other systems. |
| [Principles](./foundations/architectural-principles.md) | The four GovOps principles and the design rules that apply them. |

## Architecture

| Document | What it covers |
|---|---|
| [Architecture](./architecture/README.md) | The GovOps loop, the Governance and Runtime planes, and where to go next. The canonical reference. |
| [Actors and Responsibilities](./architecture/actors-and-responsibilities.md) | Who governs, the four layers' questions, and how Response closes the loop |
| [Layers](./architecture/layers/README.md) | Introduction to the four layers: Identity, Observability, Access, and Governance |
| [Identity Layer](./architecture/layers/identity/README.md) | What the identity layer must provide to be governable |
| [Identity](./architecture/layers/identity/identity.md) | Human, software, and organization identities. To be added soon. |
| [Observability Layer](./architecture/layers/observability/README.md) | What the observability layer must provide to be governable |
| [Kernel Observability](./architecture/layers/observability/kernel-observability.md) | Independent evidence of what actually ran |
| [Access Layer](./architecture/layers/access/README.md) | What the access layer must provide to be governable |
| [Schema Management](./architecture/layers/access/schema-management.md) | The entities, attributes, and claims policies can reference |
| [Federation Management](./architecture/layers/access/federation-management.md) | Which external issuers, credentials, and claims the enterprise trusts |
| [Runtime Authorization Context](./architecture/layers/access/runtime-authorization-context.md) | The context that joins a decision to what executed |
| [Governance Layer](./architecture/layers/governance/README.md) | What the governance layer owns, and how Response closes the loop |
| [Event Handling and Response](./architecture/layers/governance/event-handling.md) | How the enterprise responds to what it detects |
| [Functional Components](./architecture/functional-components/README.md) | The four governance-plane services GovOps owns, and the one it depends on |
| [Capability Inventory](./architecture/functional-components/capability-inventory/README.md) | The inventory of governed capabilities |
| [Capability Lifecycle](./architecture/functional-components/capability-inventory/manage-lifecycle.md) | How a capability moves from draft to retirement |
| [Gemara Mapping](./architecture/functional-components/capability-inventory/gemara-mapping.md) | How a capability references the control mapping that governs it |
| [Evidence](./architecture/functional-components/evidence/README.md) | Runtime evidence linked to `capability_id`, from producer signature to collector-derived enrichment |
| [Producers](./architecture/functional-components/evidence/producers.md) | The producer-signed envelope and chain of custody |
| [Collectors](./architecture/functional-components/evidence/collectors.md) | Capability resolution and collector-derived assessments |
| [Correlation and Enrichment](./architecture/functional-components/evidence/correlation-and-enrichment.md) | Token, session, and actor-context enrichment, with attribution quality |
| [Centralized Policy Management](./architecture/functional-components/evidence/policy-management.md) | Central administration of policy, with distributed enforcement |
| [Key Management](./architecture/functional-components/evidence/key-management.md) | The Producer Key Registry and Producer-Key Authorization Statement |
| [Compliance](./architecture/functional-components/compliance.md) | Capabilities to controls through Gemara, and the export path to OSCAL |
| [GovOps Dashboard](./architecture/functional-components/govops-dashboard.md) | The service that calculates, visualizes, and reports GovOps metrics, keyed on `capability_id` |

Start with [Architecture at a glance](./architecture/README.md#architecture-at-a-glance) for the
plane diagram and the loop, then read the pages in order.

## Standards

| Document | What it covers |
|---|---|
| [Standards overview](./standards/README.md) | What the Standards umbrella covers and how the sub-areas relate |
| [Overview](./standards/overview/README.md) | How ACC, GTP, and AuthZen fit together |
| [ACC overview](./standards/acc/README.md) | What the catalog is and which document to read first |
| [ACC design](./standards/acc/authorization-capability-catalog-design.md) | The catalog model, the Authorization Capability Profile, Gemara layering, and the OSCAL export path |
| [ACC use cases](./standards/acc/authorization-capability-catalog-use-cases.md) | Persona workflows: authoring, compliance mapping, linting, drift detection |
| [ACC YAML format](./standards/acc/acc-yaml-proposed-format.md) | Proposed machine-readable `ACC.yaml` format |
| [TRACE profile](./standards/gtp/README.md) | The GovOps evidence profile of TRACE |
| [GovOps TRACE profile](./standards/gtp/govops-trace-profile.md) | Schema changes on top of the base TRACE v0.2 Trust Record |
| [AuthZen](./standards/authzen/README.md) | Placeholder — relationship to AuthZen's request shape |

## Metrics

| Document | What it covers |
|---|---|
| [Metrics](./metrics/README.md) | Metrics overview, governance heat map, candidate discussions, and development guidance |
| [Approved metrics](./metrics/approved_metrics/README.md) | Definitions with a recorded working-group approval decision |
| [Proposed metrics](./metrics/proposed_metrics/README.md) | Documented definitions under review |
| [Metric definition template](./metrics/metric_development/definition_template.md) | Purpose, benefit, calculation, evidence, context, and interpretation |
| [Acceptance process and criteria](./metrics/metric_development/acceptance_process_and_criteria.md) | Proposed development stages, evaluation, and acceptance criteria |

## Working group

| Document | What it covers |
|---|---|
| [OWASP](./owasp/README.md) | Project status and the submitted proposal |
| [Outreach](./outreach/README.md) | Where the working group meets and how to join |

## Conventions

- Documents are plain GitHub-flavored Markdown with no front matter, so they read correctly both on  GitHub and on govops.info.
- Relative links between documents work in both places. The site rewrites them to routes at build time.
- Fenced `text` blocks hold hand-drawn diagrams. The site renders them unwrapped and unhighlighted — keep them under roughly 100 columns.
