# The GovOps Solution

GovOps addresses the gaps described in
[`../why-existing-approaches-fall-short/README.md`](../why-existing-approaches-fall-short/README.md)
by proposing a new framework built on the following principles.

## Capability as the unit of governance

A **capability** is an action-resource pair — for example, `approve:payment-over-threshold` or
`read:customer-pii-record`. Every capability is assigned a `capability_id`, a stable identifier
computed only from the action and resource. This choice is deliberate:

- **Stability.** Unlike a role or policy, the identifier does not change when metadata (risk tier,
  business impact, ownership) is revised — only when the action or resource itself changes.
- **Granularity.** Capabilities describe *what is being done*, not *who is doing it*, which lets
  governance reason about risk independent of the size or churn of the population of actors
  exercising that capability.
- **Fit for non-human actors.** A capability grant does not require a long-lived named identity —
  it is equally meaningful for a human employee, a service account, or an AI agent that exists for
  the duration of a single task.
- **Identity demoted, not eliminated.** Identity remains essential as a decision-time input (who is
  making this request right now) and for accountability, but it is no longer the primary unit that
  governance organizes itself around. See
  `../why-existing-approaches-fall-short/identity-centric-governance.md`.

## Runtime observability

GovOps makes authorization decisions observable by design: the `capability_id`, `decision`,
`decision_id`, `policy_store_id`, and `policy_store_version` travel with every runtime decision, 
and — where kernel observability
tooling is deployed — the same identifier can be joined against independent, process-level proof of
what actually happened, not just what a policy engine decided.

## Closing the loop

Observability in GovOps is not passive monitoring. It feeds the Detect and Respond steps of the
GovOps loop (Govern → Authorize → Execute → Observe → Detect → Respond → Govern), 
enabling automated remediation, alerting, and policy
refinement instead of a log that is only read after an incident.

## Separating governance from enforcement

GovOps is policy-mechanism-neutral: it does not standardize a policy engine, policy language, or
enforcement protocol (see `scope/README.md`). Any engine — OPA, Cedar, Cerbos, XACML, or a
custom decision point — can participate as long as its decisions can be tagged with a
`capability_id`.

## A cross-functional governance deal, not just a compliance tool

Because the same `capability_id`-anchored record is the ground truth for every function that touches
authorization, GovOps is not primarily a compliance feature — it is a data model that six functions
can share instead of each maintaining an incompatible, siloed view of the same underlying reality:

| Function | What it gets from the shared capability record |
|---|---|
| Security | A single identifier joining application-level authorization decisions to kernel-level proof of execution. |
| Audit | A traceability path from control to observed behavior, instead of manually reconstructed evidence. |
| Compliance | A continuous export through Gemara/OSCAL instead of a periodic audit reconstruction. |
| Engineering | A stable, `capability_id`-keyed interface that does not churn every time a role or policy is revised. |
| Finance | (Directional, not yet built) capability-level risk and cost metadata, rather than system- or vendor-level tracking. |
| Legal | An authorized-vs-actual trail anchored to the same capability, usable to confirm that contractual or regulatory obligations were actually enforced. |

See `../stakeholder-goals/README.md` for the full today-vs-with-GovOps comparison for each
function.

## Alignment with modern security paradigms

GovOps is designed to be complementary to, not competitive with, adjacent efforts — Zero Trust and
Google's "Beyond Zero," AuthZen, the Shared Signals Framework, and independently convergent
implementations like Meta's Muse. See `../positioning/README.md` for the detailed relationship to
each.
