# The Problem

Authorization has become the fastest-moving, least-governed layer of enterprise software. Three
converging pressures make the status quo unsustainable: the industry is solving the same problem
in fragmented, incompatible vocabularies; compliance teams cannot answer basic questions about
authorization risk; and the identity-centric model underneath most access control (RBAC) does not
scale to the number and churn of actors — human and non-human — that now request access.

## Industry fragmentation

Several efforts are independently converging on the same underlying model — treat an
action-resource pair as the fundamental unit to reason about — without using shared vocabulary or
acknowledging the overlap:

- **Google Beyond Zero** elevates the action/resource pair as the successor unit to Zero Trust's
  identity-centric model, without using the word "capability."
- **AuthZen** standardizes the *shape* of an authorization request (subject, action, resource,
  context — PARC) but is deliberately neutral on whether identity or capability is the primary
  governance unit.
- **Shared Signals Framework (SSF)** standardizes how security-relevant events (e.g., session
  revocation) propagate between systems, adjacent to but distinct from the authorization decision
  itself.
- **Meta's Muse** shipped an agent architecture (Sentinel, capability grants, `authd`, surrogate
  tokens, eBPF taint tracking) that independently arrived at nearly the same model GovOps proposes,
  under entirely different names.

The result resembles the parable of the blind men and the elephant: each effort has correctly
described a piece of the same animal, but no shared vocabulary lets them recognize it. GovOps's
purpose is not to replace these efforts but to name the shared unit — the capability — so that work
happening independently across the industry can be recognized as addressing the same problem. See
`../positioning/README.md` for how GovOps relates to each of these efforts specifically.

## The compliance gap

At a 2026 Cloud Security Alliance (CSA) webinar, panelists including Dick Hardt and Imran could not
answer a direct question: when an authorization policy denies or allows a request, how does that
event tie back to a specific compliance control? The honest answer, industry-wide, is that it
usually doesn't — authorization logs and compliance evidence live in separate systems maintained by
separate teams, reconciled by hand, episodically, if at all.

GovOps's answer is a specific, traceable path: a `capability_id` assigned at catalog time travels
with the runtime decision, and from there maps through Gemara (an abstract, vendor-neutral control
vocabulary) into OSCAL (NIST's machine-readable compliance format), which already has renderings for
frameworks like ISO 27001, SOC 2, and the EU Cyber Resilience Act.

## RBAC and role explosion

Role-based access control (RBAC) was designed for a world of a few hundred human employees with
slowly changing job functions. Two failure modes now dominate in practice:

- **Role explosion and drift.** Every new exception spawns a new role rather than a change to an
  existing one, because roles are rarely retired. Organizations routinely accumulate thousands of
  roles that no longer map cleanly to any actual job function, and nobody owns the cleanup.
- **Non-human actors don't fit the model.** RBAC assumes a relatively stable population of named
  identities. Service accounts, automation, and especially AI agents are created, scoped, and
  retired at a pace and volume that the role-per-identity model was never built to track — an agent
  may exist for the duration of a single task and need a capability grant that is meaningful for
  minutes, not years.

GovOps does not propose replacing RBAC or any other access-control mechanism. It proposes governing
the *capability* being granted — the action-resource pair — as a unit that is stable regardless of
which identity, role, or non-human actor is exercising it. See
`../govops-thesis/solution-overview.md#capability-as-the-unit-of-governance` for the full argument.
