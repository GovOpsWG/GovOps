# AuthZen

**Status:** Placeholder — not yet drafted.

GovOps does not define its own runtime request/response protocol. It expects the policy decision
point evaluating a capability to be AuthZEN-conformant and PARC-shaped (subject, action, resource,
context), and it expects the `capability_id` from the
[Authorization Capability Catalog](../acc/README.md) to be addressable within that request shape.

The existing discussion of how GovOps's capability model lines up with AuthZen's request shape lives
in [Foundations: Relationship to AuthZen](../../foundations/positioning/README.md#relationship-to-authzen).
This page will become a dedicated standards-track document — specifying exactly how `capability_id`
and catalog metadata map onto an AuthZen request — once that work is proposed and drafted.