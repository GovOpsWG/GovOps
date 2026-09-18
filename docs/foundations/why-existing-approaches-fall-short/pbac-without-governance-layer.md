# PBAC Without a Governance Layer

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
`../scope/README.md`). It prescribes a governance process organized around `capability_id` that
sits above whichever engine makes the decision: the capability catalog inventories what an engine
*could* allow, independent of how the engine's policy is written, and the runtime correlation
mechanism records what it *actually* allowed, independent of the engine's internal decision
mechanics. This makes GovOps engine-neutral by design — any PBAC engine capable of tagging its
decisions with a `capability_id` can participate.
