# Standards overview

Three specifications make up the Standards deliverable. Each covers a different part of the
GovOps loop (Govern → Authorize → Execute → Observe → Detect → Respond).

| Standard | Covers | Status |
|---|---|---|
| [Authorization Capability Catalog (ACC)](../acc/README.md) | What a system can do — a machine-readable inventory of capabilities, each carrying a stable `capability_id` and the business context governors need | Draft for discussion |
| [GovOps TRACE Profile (GTP)](../gtp/README.md) | What actually happened — the GovOps evidence profile of the TRACE Trust Record, the schema changes required on top of base TRACE v0.2 | Drafted |
| [AuthZen](../authzen/README.md) | How a runtime decision is requested — alignment between GovOps's capability model and AuthZen's PARC request shape | Placeholder — not yet drafted |

## How they relate

The ACC defines the catalog of capabilities an enterprise governs. At runtime, an AuthZEN-conformant,
PARC-shaped policy decision point evaluates a request against policy referencing a `capability_id`
from that catalog. The GovOps TRACE Profile then carries that same `capability_id` into the evidence
record, so a decision, its runtime context, and the catalog entry that defined it all join on one
identifier.

GovOps does not define its own request/response protocol — it relies on AuthZen for that shape and
focuses its own standards work on the catalog (ACC) and the evidence trail (GTP). The relationship
between GovOps's capability model and AuthZen's request shape is discussed in
[Foundations: Relationship to AuthZen](../../foundations/positioning.md#relationship-to-authzen);
the [AuthZen placeholder](../authzen/README.md) is where a dedicated standards-track document will
live once one exists.
