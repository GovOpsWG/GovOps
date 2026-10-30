# Why Existing Approaches Fall Short

This section details the specific gaps and limitations of current authorization and governance
models — not because the underlying technologies are flawed, but because none of them were designed
to answer governance questions on their own.

## The Limitations of Identity-Centric Governance

- **Static and Coarse-Grained:** Traditional Role-Based Access Control (RBAC) and other identity-centric models are often too static and coarse-grained to handle the dynamic nature of modern applications.
- **Poor Fit for Non-Human Agents:** The lifecycle of agentic software (e.g., CI/CD pipelines, bots, IoT devices) is fundamentally different from that of human users, a problem that is being amplified by the rise of agentic AI.
- **Focus on "Who" not "What":** These models primarily focus on *who* is accessing a resource, rather than *what* is being done with it. This makes it difficult to reason about the actual risk of an operation.

## The Amplifying Effect of Agentic AI

- **Amplified Scale and Speed:** AI and agentic AI systems operate at a scale and speed that is beyond human comprehension. This makes manual governance and oversight impossible.
- **Dynamic and Unpredictable Behavior:** The behavior of AI agents can be dynamic and unpredictable, making it difficult to define static policies that can effectively govern their actions.
- **Mismatched Lifecycles:** The lifecycle of an AI agent can be extremely short and dynamic, making traditional identity management approaches completely ineffective.

## PBAC Without a Governance Layer

Policy-Based Access Control (PBAC) — the general family of approaches that includes ABAC, ReBAC,
and engines like OPA, Cedar, Cerbos, and XACML — is a **decision mechanism**, not a governance
process. A PBAC engine answers "is this action allowed, given this policy?" It does not answer "do
we know every action this policy could allow, is that set of actions an acceptable risk, and can we
prove afterward that only the allowed actions occurred?"

Those governance questions do not go away just because a more sophisticated decision engine is in
place. Adopting PBAC without an accompanying governance layer typically just moves the ungoverned
complexity from role definitions (RBAC's failure mode) into policy logic (PBAC's failure mode):
policies accumulate the same way roles do, become just as hard to audit as roles were, and — because
policy languages are more expressive than role assignments — can be *harder* to reason about
exhaustively.

GovOps does not compete with PBAC engines and does not standardize a new one (see
`./scope.md`). It prescribes a governance process organized around `capability_id` that
sits above whichever engine makes the decision: the capability catalog inventories what an engine
*could* allow, independent of how the engine's policy is written, and the runtime correlation
mechanism records what it *actually* allowed, independent of the engine's internal decision
mechanics. This makes GovOps engine-neutral by design — any PBAC engine capable of tagging its
decisions with a `capability_id` can participate.

## Point-in-Time Compliance

Most compliance programs today are episodic: an annual audit, a quarterly access review, a
point-in-time control assessment. Between those checkpoints, authorization configurations,
capability grants, and policy versions can drift substantially, and nothing forces that drift to
surface before the next scheduled review. Two things follow from this:

- **The evidence gathered is a snapshot, not a trend.** An auditor sees the state of the system on
  the day of the review, not whether risk has been improving or worsening in the intervening months.
- **Assembling the snapshot is manual.** Because authorization logs, catalog data, and control
  mappings live in separate systems, preparing for an audit is typically a reconstruction project —
  someone has to manually correlate what was allowed against what should have been allowed.

GovOps's premise is that compliance evidence should be a **continuous byproduct** of normal
operation rather than a periodic reconstruction effort. Because every runtime decision already
carries a `capability_id`, and every capability already maps through Gemara to OSCAL control
representations, the same data used to
operate the system day-to-day is the data an audit needs — there is no separate evidence-gathering
exercise to perform. This also enables **metrics that are measured as change over time**
rather than single-point assessments, so
that drift between reviews becomes visible as a trend line instead of being discovered only at the
next audit.

Together, these gaps motivate the shift to a capability-centric model described in
[`./govops-thesis.md`](./govops-thesis.md).
