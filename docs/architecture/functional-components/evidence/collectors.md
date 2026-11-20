# Collectors

The collector is the component that ingests the records signed by [producers](./producers.md) and turns raw, independently-signed facts into governable evidence. Its central job is **capability resolution**, and it is also the only component trusted to compute a specific set of assessments that producers must never self-assert.

## Capability resolution

`capability_id` is never a signed field. Producers sign `(action, resource_type)`; the collector resolves `capability_id` from `(policy_store_id, policy_store_version, action, resource_type)` against a versioned capability mapping that lives in the policy store, and stores the result — `capability_resolution` — outside the signed assertion.

This is a minimum viable requirement, not a deferred nice-to-have: without it, GovOps has no way to answer *what business capability* was authorized or invoked — a raw `(action, resource_type)` pair is a policy-engine implementation detail, not a governable unit. Every authorization-decision and invocation record the collector ingests must have resolution attempted. When the mapping has no entry for the signed facts, the collector records an empty `capability_ids: []` with a `resolution_status` of `unmapped`, feeding the deprecated/unmapped-capability metrics, rather than silently dropping the record.

Resolution happens **per decision, never per record**: a batched evaluation covering several `(action, resource_type)` pairs is resolved entry by entry and keyed back to each entry's own id, so the decision-to-capability association is never collapsed into one value for the whole batch.

## Resolving against the capability in force at the time

A capability can be reclassified, change owner, or be retired between the moment it is exercised and the moment the collector resolves the record. GTP already requires analytics to use the classification that was **effective at event time** ([GTP §13.7](../../../standards/gtp/govops-trace-profile.md#137-effective-versioned-vs-current-classification)). This section states how the collector applies that rule to the capability itself.

TRACE records already carry what this needs: every record signs `signed_at` (producer time), and the `policy` object signs `policy_store_version`. No new record field is required.

1. **The mapping is pinned by `policy_store_version`.** The record names the policy release it was evaluated under, so the collector uses the capability mapping that shipped with that release.
2. **The catalog version is selected by time.** Each version of a capability carries `effective_at` and `expires_at` ([#56](https://github.com/GovOpsWG/GovOps/issues/56)). The collector uses the version whose window contains `signed_at`.
3. **The collector records what it used:** the `mapping_version`, the catalog version, and the time it resolved against.

When `signed_at` falls outside every version window, the result is recorded as unresolved, not matched to the latest version. When the record also carries `late_flag`, the time itself is suspect and the result says so. When the mapping resolves to a capability whose `lifecycle_status` was `retired` at `signed_at`, that is a finding in its own right: published policy still reached a retired capability.

The ACC draft keeps `capability_id` unchanged once assigned, so a new version is a new entry state under the same id. [#56](https://github.com/GovOpsWG/GovOps/issues/56) is discussing the alternative of a new id per version. Either way, the catalog keeps every prior version, and `capability_hash` stays an optional lookup shortcut beside the mapping.

## What is collector-derived, never producer-signed

A specific set of fields and assessments must stay out of the producer-signed schema and live only in the collector's own assessment store:

* Ingestion metadata — `content_digest`, `receipt_sequence`, `received_at`, chain-integrity flags (`coverage_gap_flag`, `chain_link_failure_flag`, `equivocation_flag`, `late_flag`, `unattributed_flag`).
* Key-admission results — `key_resolved`, `key_temporally_valid`, `key_not_revoked`, `key_authorized_for_producer`, `producer_authorized_for_claim`, resolved against the [Producer Key Registry](./key-management.md).
* Trust scoring — `trust_tier` and its per-dimension verification vector.
* `capability_resolution` itself, plus completeness, lineage, and delegation-validation assessments.
* `evidence_domain_id` — derived from the authenticated client connection, never taken from a producer-supplied value.

If a producer places any of these fields in its signed body, the collector ignores the value and flags the attempt — this boundary is what keeps a producer's self-interest from ever influencing how trustworthy its own evidence is judged to be.
