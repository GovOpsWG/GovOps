# Producers

A producer is any party that signs evidence at the moment something happens in the authorization lifecycle — a Policy Decision Point signing an authorization decision, an enforcement point signing a mediated invocation, or a workload signing the result of an action. GovOps preserves this evidence as **independently signed producer evidence**: each producer signs only what it directly observed, and the collector never asserts facts on a producer's behalf.

## The producer-signed envelope

Each record a producer emits carries, alongside the TRACE claim itself:

* `producer` — a stable logical producer id (for example `pdp-fleet-1`), not a name/version string.
* `record_id` — a producer-generated unique id. Together with `producer` and the evidence domain, this forms the record's storage primary key.
* `kid` — a key selector resolved out-of-band against the [Producer Key Registry](./key-management.md), not trusted from the record body itself.

A producer never signs `capability_id` directly. It signs the raw facts — `(action, resource_type)` and an outcome — and leaves capability resolution to the [collector](./collectors.md), so the governable business meaning of a capability can evolve without re-signing evidence.

## Chaining and causal linkage

Each producer maintains its own append-only `producer_chain`: a per-producer, per-chain hash chain (`producer_chain_id`, a monotonic `sequence_number`, and `prev_record_hash` pointing at the prior record), so a verifier can detect gaps or reordering within one producer's stream without relying on the collector.

Separately, `parent_record_ids` captures typed causal edges between records from *different* producers — for example, a `CAPABILITY_INVOKED` record pointing back to the `AUTHORIZATION_DECISION` record that allowed it, with a relationship type such as `authorized` or `triggered`. This is how GovOps reconstructs one governed execution across independently signed evidence from multiple producers, without requiring a single party to witness and sign the whole chain.

## What producers sign vs. what they don't

Producers sign observed facts: the authorization decision, the mediated invocation, the runtime effect, and declared context such as how the evidence was obtained (`evidence_origin`/`measurement_point`). They do not sign interpretations — classification, organizational attribution, trust scoring, or `capability_id` resolution are derived later by the [collector](./collectors.md) from reference data the producer has no visibility into. Keeping that boundary strict is what lets evidence stay independently verifiable even as the collector's interpretations improve or change over time.
