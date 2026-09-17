# Architectural Principles

These seven principles follow directly from the thesis in
[`govops-thesis/solution-overview.md`](./govops-thesis/solution-overview.md) and constrain
every design decision made elsewhere in this specification.

1. **Capability, not identity, is the unit of governance.** Every governance question GovOps answers
   is framed in terms of a `capability_id`, not a user, role, or service account.
2. **Policy-mechanism neutrality.** GovOps does not standardize a policy engine, policy language, or
   enforcement protocol. Any engine capable of tagging its decisions with a `capability_id` can
   participate.
3. **Observability is a first-class design requirement, not an add-on.** The correlation identifiers
   needed to make a decision observable (`capability_id`, `decision_id`, `policy_store_id`,
   `policy_store_version`) are part of the core model, not an optional extension.
4. **Authorization proves permission, not execution.** A runtime decision record states that an
   action was *allowed*; it does not, by itself, prove the action was *carried out* as authorized.
   Proving execution is the job of kernel/application observability, correlated back via the same
   identifier.
5. **Compliance is a byproduct, not the primary purpose.** GovOps is designed so that compliance
   evidence falls out of normal operation (see
   `./why-existing-approaches-fall-short/point-in-time-compliance.md`); it is not itself a
   compliance certification process (see `../scope/README.md`).
6. **Stability over completeness in the core identifier.** The `capability_id` hash deliberately
   includes only the action and resource, excluding mutable metadata like risk tier or ownership, so
   that the identifier remains stable even as governance metadata evolves.
7. **Explain before mandating.** Where the model is not yet stable enough to make MUST/SHOULD
   claims, this specification says so explicitly rather than prematurely normativizing an
   unsettled design.
