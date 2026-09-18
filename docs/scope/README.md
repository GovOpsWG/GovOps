# Scope

GovOps is a vendor-neutral framework for the continuous governance of authorization capabilities
across applications, APIs, services, infrastructure, workloads, endpoints, and AI agents. This
document states, at a foundational level, what GovOps defines and what it deliberately leaves to
other systems and standards.

## Key Objectives

- **Establish a vendor-neutral governance framework:** To promote interoperability and avoid vendor lock-in.
- **Prioritize risk-based governance:** To help organizations focus on technical risks with high business impact.
- **Enable runtime observability:** To provide real-time visibility into policy decisions and system behavior.
- **Support automation:** To manage the complexity of modern policy architectures through automation and machine learning.

## What GovOps defines

- **The capability-level data model.** A machine-readable way to inventory and classify
  authorization capabilities as action-resource pairs, and the stable `capability_id` that
  identifies each one. See [`acc-yaml-proposed-format.md`](../acc/acc-yaml-proposed-format.md).
- **The correlation mechanism.** How `capability_id` (and related identifiers such as
  `decision_id`, `policy_store_id`, and `policy_store_version`) travels from the governance
  catalog through a runtime decision and into observability and compliance evidence, without
  carrying tokens or policy text across that boundary.
- **The two-plane model and the GovOps loop.** The separation between the centralized Governance
  Plane (catalog, policy authoring, schema management, federation management, continuous
  compliance) and the distributed Runtime Plane (local authorization decisions), connected by the
  Govern → Authorize → Execute → Observe → Detect → Respond → Govern loop. See
  [`architecture`](../architecture/README.md).
- **Metrics for measuring change** in authorization risk, policy enforcement, accountability, and
  observability — reported as movement between observation windows, not as static levels. See
  [`metrics`](../metrics/README.md).
- **An extension point to compliance evidence**, via Gemara and OSCAL, that lets capability
  governance data be projected into existing framework profiles (for example ISO 27001, SOC 2, the
  EU Cyber Resilience Act) without GovOps inventing its own compliance taxonomy.

GovOps is applicable to organizations using centralized or distributed authorization
infrastructure, and is independent of the specific technology used to make or enforce
authorization decisions.

## What GovOps does not (yet) define

GovOps is explicitly **not**:

- **A policy engine or policy language.** GovOps does not standardize a new policy decision point,
  policy language, authorization graph, or enforcement protocol. Any engine capable of evaluating
  an action-resource request — OPA, Cedar, Cerbos, XACML, or a custom engine — can participate, as
  long as its decisions can be tagged with a `capability_id`. See
  [`pbac-without-governance-layer.md`](../foundations/why-existing-approaches-fall-short/pbac-without-governance-layer.md).
- **An identity provider or federation protocol.** GovOps governs which issuers an organization
  trusts (Federation Management), not how tokens are minted or validated at runtime.
- **A compliance certification process.** GovOps does not certify an organization, product, or
  implementation as compliant with any external framework, and does not replace a formal risk
  assessment, audit, or legal review. It provides evidence and traceability that a compliance
  program can consume.
- **A telemetry implementation, dashboard, or maturity model.** GovOps specifies which
  identifiers must travel with a decision for observability to be possible; it does not prescribe
  a specific SIEM, dashboard, or organizational maturity target.
- **A formal, ratified conformance specification — yet.** Most of this repository is explanatory
  and reference material describing an architecture that is still being actively decided by the
  GovOps Working Group. The Authorization Capability Catalog (ACC) is the one
  component planned to receive a normative specification first, once its schema stabilizes.
- **An operational process guide — yet.** Approval workflows, review cadence, and incident
  handling procedures are planned but not yet written.
- **A definition of how identities receive, retain, or certify entitlements.** That remains the
  concern of existing identity and access governance (IGA) tooling; GovOps treats identity as a
  decision-time input rather than the primary unit of governance (see
  [`identity-centric-governance.md`](../foundations/why-existing-approaches-fall-short/identity-centric-governance.md)).