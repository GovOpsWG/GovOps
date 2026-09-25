# Principles

GovOps rests on four principles. They follow from the thesis in
[`govops-thesis/solution-overview.md`](./govops-thesis/solution-overview.md).

1. **Governance is a continuous operational discipline, not a periodic exercise.**
   It is not something you do once a quarter. It is always happening. "Git or it didn't happen."
2. **Capabilities, defined as action-resource pairs, are the unit of governance, not identity or
   role.** We manage their lifecycle, inventory them, and track metadata about them, like risk and
   business impact.
3. **Governance involves three core activities: risk management, accountability, and
   observability.**
4. **Governance assumes bad things will happen.** The goal is to reduce how often they happen,
   detect them quickly when they do, and hold people, software, and organizations accountable. The
   goal is not to prove in advance that every policy is correct.

## Design rules

These rules apply the principles to the GovOps architecture.

1. **Policy-mechanism neutrality.** GovOps does not standardize a policy engine, policy language, or
   enforcement protocol. Any engine capable of tagging its decisions with a `capability_id` can
   participate.
2. **Observability is a first-class design requirement, not an add-on.** The correlation identifiers
   needed to make a decision observable (`capability_id`, `decision_id`, `policy_store_id`,
   `policy_store_version`) are part of the core model, not an optional extension.
3. **Authorization proves permission, not execution.** A runtime decision record states that an
   action was *allowed*. It does not, by itself, prove the action was *carried out* as authorized.
   Proving execution is the job of kernel and application observability, correlated back via the
   same identifier.
4. **Compliance is a byproduct, not the primary purpose.** GovOps is designed so that compliance
   evidence falls out of normal operation (see
   [`point-in-time-compliance.md`](./why-existing-approaches-fall-short/point-in-time-compliance.md)).
   It is not itself a compliance certification process (see [`scope`](../scope/README.md)).
5. **Stability over completeness in the core identifier.** The `capability_id` hash deliberately
   includes only the action and resource, excluding mutable metadata like risk tier or ownership, so
   that the identifier remains stable even as governance metadata evolves.
6. **Explain before mandating.** Where the model is not yet stable enough to make MUST/SHOULD
   claims, this specification says so explicitly rather than prematurely normativizing an
   unsettled design.
