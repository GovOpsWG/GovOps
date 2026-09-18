# Stakeholder Goals

GovOps is not a single-purpose compliance tool — it is a shared, capability-anchored data model that
different business functions can each draw on for their own purposes (see
[`../govops-thesis/solution-overview.md`](../govops-thesis/solution-overview.md#a-cross-functional-governance-deal-not-just-a-compliance-tool)).
This section describes, for each function, the unmet need today and what GovOps changes.

## Security

**Unmet need today.** Security logs are keyed to identity (who did it), which is coarse-grained and
does not answer *what* was actually done or *whether* it was authorized to happen. Application-level
logs and kernel-level observability tools (e.g., Falco, Cilium, Sysdig) capture overlapping but
disconnected views of the same event, with no shared key to join them.

**What GovOps provides.** A single `capability_id` that joins the authorization decision (why an
action was allowed) with kernel-level observability (independent proof of what actually happened),
so an investigation does not have to manually correlate two unrelated log formats.

## Audit

**Unmet need today.** Controls are typically described in prose and mapped to system behavior by
hand; evidence that a control was actually enforced is gathered manually, episodically, and
inconsistently across teams.

**What GovOps provides.** A traceability path from a governance decision (a capability was
classified, a policy was authored) through to observed runtime behavior, so evidence can be pulled
from a matrix rather than reconstructed for each audit.

## Compliance

**Unmet need today.** Compliance is a bolt-on exercise, disconnected from day-to-day authorization
operation.

**What GovOps provides.** A defined path from capability-level governance data through Gemara to
OSCAL, which already has renderings for frameworks like ISO 27001, SOC 2, and the EU Cyber
Resilience Act.

## Engineering

**Unmet need today.** Constant churn: every time a role is redefined or a policy is rewritten,
downstream integrations that depend on that role or policy have to be updated too.

**What GovOps provides.** A stable `capability_id`-keyed interface. Because the identifier depends
only on the action and resource (not on mutable metadata, role assignment, or policy text),
integrations built against a `capability_id` do not need to change when governance metadata is
revised.

## Finance

**Unmet need today.** Cost and risk are tracked at the system or vendor level (e.g., "how much does
this SaaS product cost"), not at the level of the specific capabilities it exposes, which makes it
hard to prioritize risk-reduction spend against the actions that actually matter.

**What GovOps provides.** *(Directional goal, not yet built.)* The capability catalog's optional
`risk-tier` and `business-impact` fields are a foundation for capability-level cost and
risk metadata, but this mapping does not yet exist as a defined GovOps deliverable.

## Legal

**Unmet need today.** There is typically no system-level way to confirm that a contractual or
regulatory obligation ("this data must never leave region X," "only licensed staff may approve this
transaction type") was actually enforced, as opposed to merely documented in a policy.

**What GovOps provides.** A capability-anchored authorized-vs-actual trail: because both the
authorization decision and any downstream observability are keyed to the same `capability_id`, legal
can query whether a specific obligation was enforced in practice, not just described in a policy
document.
