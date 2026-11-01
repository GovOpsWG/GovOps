# Evidence

TRACE record collectors capture evidence at the points where capabilities are authorized, invoked, and their effects observed. Enriched TRACE records can simultaneously feed compliance, threat detection, and metrics data pipelines.

Evidence is produced independently by many parties — PDPs, enforcement points, workloads — then collected, correlated, and enriched into the governance answers that compliance, dashboards, and threat detection actually consume. GovOps treats each of these as a distinct responsibility, detailed in the full [GovOps TRACE Profile (GTP)](../../../standards/gtp/govops-trace-profile.md):

* [Producers](./producers.md) — the parties that sign evidence at the moment a decision, invocation, or effect occurs.
* [Collectors](./collectors.md) — the component that ingests producer records, resolves `capability_id`, and derives everything that must not be self-asserted.
* [Correlation and enrichment](./correlation-and-enrichment.md) — how raw signed facts become organizational, regional, and actor-level analytics.
* [Policy Management](./policy-management.md) — the centrally administered Policy Stores that both authorize requests and anchor capability resolution.
* [Key Management](./key-management.md) — the Producer Key Registry that lets a collector trust who signed a record in the first place.
