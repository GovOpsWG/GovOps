# Collectors

The collector is the component that ingests the records signed by [producers](./producers.md) and turns raw, independently-signed facts into governable evidence. Its central job is **capability resolution**, and it is also the only component trusted to compute a specific set of assessments that producers must never self-assert.

## Capability resolution

`capability_id` is never a signed field. Producers sign `(action, resource_type)`; the collector resolves `capability_id` from `(policy_store_id, policy_store_version, action, resource_type)` against a versioned capability mapping that lives in the policy store, and stores the result — `capability_resolution` — outside the signed assertion.

This is a minimum viable requirement, not a deferred nice-to-have: without it, GovOps has no way to answer *what business capability* was authorized or invoked — a raw `(action, resource_type)` pair is a policy-engine implementation detail, not a governable unit. Every authorization-decision and invocation record the collector ingests must have resolution attempted. When the mapping has no entry for the signed facts, the collector records an empty `capability_ids: []` with a `resolution_status` of `unmapped`, feeding the deprecated/unmapped-capability metrics, rather than silently dropping the record.

Resolution happens **per decision, never per record**: a batched evaluation covering several `(action, resource_type)` pairs is resolved entry by entry and keyed back to each entry's own id, so the decision-to-capability association is never collapsed into one value for the whole batch.

## What is collector-derived, never producer-signed

A specific set of fields and assessments must stay out of the producer-signed schema and live only in the collector's own assessment store:

* Ingestion metadata — `content_digest`, `receipt_sequence`, `received_at`, chain-integrity flags (`coverage_gap_flag`, `chain_link_failure_flag`, `equivocation_flag`, `late_flag`, `unattributed_flag`).
* Key-admission results — `key_resolved`, `key_temporally_valid`, `key_not_revoked`, `key_authorized_for_producer`, `producer_authorized_for_claim`, resolved against the [Producer Key Registry](./key-management.md).
* Trust scoring — `trust_tier` and its per-dimension verification vector.
* `capability_resolution` itself, plus completeness, lineage, and delegation-validation assessments.
* `evidence_domain_id` — derived from the authenticated client connection, never taken from a producer-supplied value.

If a producer places any of these fields in its signed body, the collector ignores the value and flags the attempt — this boundary is what keeps a producer's self-interest from ever influencing how trustworthy its own evidence is judged to be.
