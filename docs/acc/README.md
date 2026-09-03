# Authorization Capability Catalog (ACC)

**Status:** Draft for discussion

The ACC is a machine-readable inventory of what applications, APIs, infrastructure, workloads, and
AI agents can actually do — the authorization surface an enterprise wants to govern.

A capability is an **(action, resource)** pair: `transfer:funds`, `approve:loan`,
`deploy:production`, `invoke:model`, `github:merge_pr`. Each entry carries a stable
`capability_id` plus the business context governors need — risk tier, business impact, geography,
data sensitivity, third-party exposure, and an accountable owner.

A capability records that the system *exposes* an operation. **Who may perform it is runtime policy,
and lives outside the catalog.** The catalog is a property of the system, not a set of entitlements.

The `capability_id` is the common index across policy, telemetry, metrics, and compliance. Engines
change and applications differ; the identifier stays put.

## Which document to read

| Read this | If you want to |
|---|---|
| [Design](./authorization-capability-catalog-design.md) | Understand the catalog model — the Authorization Capability Profile over Gemara's `#Capability`, catalog organization, the lexicon, and the Gemara to OSCAL to Trestle export path |
| [Use cases](./authorization-capability-catalog-use-cases.md) | See the workflows end to end — authoring a catalog, mapping it to controls for an audit, linting it, and detecting drift against published policy |

Read the design first. The use cases assume its vocabulary.

## How it fits

The ACC sits in the Governance Plane described in the
[architecture](../architecture/README.md#capability-catalog). It builds on
[Gemara](https://gemara.openssf.org) for capability semantics and projects through
[OSCAL Compass compliance-trestle](https://github.com/oscal-compass/compliance-trestle) for
compliance interchange. It is engine-neutral: any AuthZEN-conformant, PARC-shaped PDP works.

The [metrics](../metrics/README.md) deliverable uses `capability_id` as its unit of analysis, and
several charter questions are answered by catalog queries rather than by runtime measurement.
