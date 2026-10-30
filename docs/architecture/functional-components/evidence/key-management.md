# Key Management

GovOps's supporting principle that **shared secrets are bad** applies directly to evidence: a collector cannot trust a record's signature unless it can independently verify who was authorized to sign it, and when. GovOps does not trust an in-record key to establish its own authority — the signing key the record claims is resolved out-of-band against an administratively-provisioned registry, never read from the record body itself.

## Producer Key Registry

The registry is keyed by `(evidence_domain_id, producer_id, kid)` and resolves to:

* `public_key_jwk` and `key_type` — the verification material itself.
* `authorized_event_kinds` and `authorized_measurement_points` — what this key is actually allowed to sign, scoping a compromised or misconfigured key's blast radius to the event kinds it was provisioned for.
* `valid_from` / `valid_until` — the key's validity window.
* `revoked_at` / `revocation_reason` — explicit revocation, independent of expiry.
* `key_class` — the category of key (for example, hardware-backed vs. software).

## Producer-Key Authorization Statement

Alongside the registry, GovOps defines an administratively-signed **Producer-Key Authorization Statement** — a portable artifact binding a `statement_id`/`statement_version`, the administrative issuer, the evidence domain, the producer id, the key's thumbprint and `kid`, its authorized event kinds and measurement points, issuance and validity dates, revocation status, and a `supersedes` reference to any prior statement it replaces. This statement travels in Evidence Packets so an **offline** verifier — one without live access to the registry — can still confirm a key's authority at the time a record was signed.

## Why this is collector-derived, not producer-asserted

Whether a key was resolved, temporally valid, not revoked, and authorized for the producer and the claim it signed are all judgments the [collector](./collectors.md) makes against the registry — never something a producer can assert about its own key. This is what keeps key compromise or misconfiguration from being self-certifying: a producer cannot sign its way into authority it was never granted.

## Relationship to the PAC metric

Asymmetric, hardware-anchored keys managed this way are what the **Percentage Asymmetric Credentials (PAC)** metric measures: the share of invocations authenticated with an asymmetric credential, as opposed to a shared secret. Rigorous key management is the prerequisite for that metric to mean anything — a registry with loose validity windows or no revocation tracking makes "asymmetric" a weaker guarantee than it should be.
