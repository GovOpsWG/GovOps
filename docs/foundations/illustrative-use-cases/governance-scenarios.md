# Additional Governance Scenarios

The three sector use cases in this directory (`agentic-workloads.md`, `financial-sector.md`,
`healthcare-sector.md`) illustrate GovOps end-to-end in a specific industry context. The scenarios
below are shorter and cut across sectors — each highlights a single governance capability in
Situation / Need / How / Outcome form, and several point directly at named open gaps.

## AI agent capability drift

**Situation.** An AI agent is granted a capability (e.g., read access to a resource) for a specific
task. Over a long-running session, the agent spins up subagents and calls tools that were not part
of the original grant's intent.

**Need.** A way to tell, after the fact, whether the agent's actual behavior stayed within the scope
of what was granted, without relying solely on the agent's own self-reported logs.

**How GovOps addresses it.** The capability grant is tied to a `capability_id` with an explicit
scope — compare to Meta Muse's capability grants, bound to connector/destination/use-case with
lifecycle scope (see `../positioning/README.md`). Kernel observability provides independent proof
of what the agent's process actually touched, joined on the same identifier.

**Outcome.** Drift between granted scope and actual behavior becomes detectable (the Detect step of
the GovOps loop) instead of invisible.

## Credential revocation during execution

**Situation.** A credential backing an in-flight action is revoked mid-execution.

**Need.** To know whether the revocation actually stopped anything, and what happened to the
execution that was already underway.

**How GovOps addresses it.** By separating authorization evidence (why an action was allowed, at
decision time) from execution evidence (what actually happened, potentially after revocation).
This is a named, currently unresolved gap, not a solved problem.

**Outcome.** A defined contract for what "revoked" means for work already in flight, instead of an
undefined edge case.

## Compliance audit preparation

**Situation.** An audit cycle is approaching (SOC 2, ISO 27001, or the EU Cyber Resilience Act), and
evidence has to be assembled manually from disparate systems.

**Need.** Continuous, ready evidence rather than a scramble at audit time.

**How GovOps addresses it.** Capability-level governance and execution evidence maps through Gemara
to OSCAL, which already has profiles for these frameworks.

**Outcome.** Audit prep becomes an export, not a reconstruction project.

## Cross-functional incident review

**Situation.** Something goes wrong involving a governed action. Security, audit, legal, and finance
each need to understand what happened, but each function currently works from its own siloed system
of record.

**Need.** One shared account of "what was authorized, what actually happened" that every function
can query without reconciling separate logs.

**How GovOps addresses it.** The `capability_id`-anchored trail is function-agnostic: the same record
security uses for a security investigation is the record legal uses to check a contractual
obligation. See `../govops-thesis/solution-overview.md#a-cross-functional-governance-deal-not-just-a-compliance-tool`.

**Outcome.** Incident review time shrinks because the cross-department reconciliation step is largely
eliminated.

## Third-party and federated trust review

**Situation.** An organization needs to periodically review which external issuers or token sources
it trusts, and why — third-party risk management is one of the largest aggregate enterprise threats.

**Need.** A clear boundary between "which issuers do we trust" (a governance decision) and "is this
specific token valid right now" (a runtime check), so the review does not get tangled up with
runtime validation logic.

**How GovOps addresses it.** Federation Management owns the trust/onboarding decision; runtime
validation is a separate concern.

**Outcome.** Third-party trust reviews become a bounded, auditable exercise instead of an ad hoc one.

## Continuous governance metrics

**Situation.** Governance health is usually assessed periodically (a review meeting, an annual risk
assessment) rather than continuously.

**Need.** A live signal of whether governance is working, not just a point-in-time snapshot.

**How GovOps addresses it.** Metrics like the Denial Ratio Trend are computed continuously from the
same capability-anchored decision stream used for authorization itself.

**Outcome.** Governance drift becomes visible as a trend line, not something discovered only at the
next scheduled review.
