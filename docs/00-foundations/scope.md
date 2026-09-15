---
title: "Scope of GovOps"
status: draft
document_type: reference
source_of_truth: true
normativity: normative
owner: TBD
last_reviewed: "2026-09-15"
tags: [govops, foundations, scope]
related: [../02-reference/README.md, ../02-reference/conformance/README.md, ../06-decisions/ADR-006-conformance-postponed.md]
---

# Scope

GovOps is a vendor-neutral framework for the continuous governance of authorization capabilities
across applications, APIs, services, infrastructure, workloads, endpoints, and AI agents. This
document states, at a foundational level, what GovOps defines and what it deliberately leaves to
other systems and standards. The fuller, service-by-service treatment lives in
`02-reference/`; this page is the quick-reference version.

## What GovOps defines

- **The capability-level data model.** A machine-readable way to inventory and classify
  authorization capabilities as action-resource pairs, and the stable `capability_id` that
  identifies each one. See `02-reference/information-model/README.md` and
  `02-reference/components/capability-catalog.md`.
- **The correlation mechanism.** How `capability_id` (and related identifiers such as
  `decision_id`, `policy_store_id`, and `policy_store_version`) travels from the governance
  catalog through a runtime decision and into observability and compliance evidence, without
  carrying tokens or policy text across that boundary.
- **The two-plane model and the GovOps loop.** The separation between the centralized Governance
  Plane (catalog, policy authoring, schema management, federation management, continuous
  compliance) and the distributed Runtime Plane (local authorization decisions), connected by the
  Govern → Authorize → Execute → Observe → Detect → Respond → Govern loop. See
  `02-reference/architecture/README.md`.
- **Metrics for measuring change** in authorization risk, policy enforcement, accountability, and
  observability — reported as movement between observation windows, not as static levels. See
  `03-metrics-and-compliance/governance-metrics/README.md`.
- **An extension point to compliance evidence**, via Gemara and OSCAL, that lets capability
  governance data be projected into existing framework profiles (for example ISO 27001, SOC 2, the
  EU Cyber Resilience Act) without GovOps inventing its own compliance taxonomy. See
  `03-metrics-and-compliance/compliance-path/README.md`.

GovOps is applicable to organizations using centralized or distributed authorization
infrastructure, and is independent of the specific technology used to make or enforce
authorization decisions.

## What GovOps does not (yet) define

GovOps is explicitly **not**:

- **A policy engine or policy language.** GovOps does not standardize a new policy decision point,
  policy language, authorization graph, or enforcement protocol. Any engine capable of evaluating
  an action-resource request — OPA, Cedar, Cerbos, XACML, or a custom engine — can participate, as
  long as its decisions can be tagged with a `capability_id`. See
  `01-explanation/why-existing-approaches-fall-short/pbac-without-governance-layer.md`.
- **An identity provider or federation protocol.** GovOps governs which issuers an organization
  trusts (Federation Management), not how tokens are minted or validated at runtime.
- **A compliance certification process.** GovOps does not certify an organization, product, or
  implementation as compliant with any external framework, and does not replace a formal risk
  assessment, audit, or legal review. It provides evidence and traceability that a compliance
  program can consume. See `03-metrics-and-compliance/compliance-path/README.md`.
- **A telemetry implementation, dashboard, or maturity model.** GovOps specifies which
  identifiers must travel with a decision for observability to be possible; it does not prescribe
  a specific SIEM, dashboard, or organizational maturity target.
- **A formal, ratified conformance specification — yet.** Most of this repository is explanatory
  and reference material describing an architecture that is still being actively decided by the
  GovOps Working Group (see the open items tracked in `06-decisions/` and
  `07-project-and-roadmap/README.md`). The Authorization Capability Catalog (ACC) is the one
  component planned to receive a normative specification first, once its schema stabilizes. See
  `06-decisions/ADR-006-conformance-postponed.md`.
- **An operational process guide — yet.** Approval workflows, review cadence, and incident
  handling procedures are planned but not yet written. See `04-how-to-and-process/README.md`.
- **A definition of how identities receive, retain, or certify entitlements.** That remains the
  concern of existing identity and access governance (IGA) tooling; GovOps treats identity as a
  decision-time input rather than the primary unit of governance (see
  `01-explanation/why-existing-approaches-fall-short/identity-centric-governance.md`).

## Where to go for the full boundary statement

- `02-reference/README.md` — the normative reference tier, organized as a lookup surface.
- `02-reference/conformance/README.md` — why GovOps does not yet make MUST/SHOULD claims outside
  the ACC.
- `03-metrics-and-compliance/compliance-path/README.md` — the specific boundary between what
  GovOps's compliance path can and cannot claim.
