# Capability Inventory

The Authorization Capability Catalog ("ACC") is a machine-readable inventory of what applications, APIs, infrastructure, workloads, and AI agents can actually do — the authorization surface the enterprise wants to govern. The catalog model, Authorization Capability Profile, tooling conventions, and persona workflows are specified in the [ACC documents](../../../standards/acc/README.md).

A capability is an action on a resource type. Examples might include:

* `transfer:funds`
* `approve:loan`
* `deploy:production`
* `read:customer-record`
* `invoke:model`
* `github:merge_pr`
* `open:room-101`

Each capability has a stable identifier, description, group, and business context useful to governors — such as risk tier, business impact, geography, business function, data sensitivity, third-party exposure, regulatory scope, and accountable owner. Risk tier and business impact together support risk–reward prioritization: the most likely failures with the biggest consequence.

This makes it possible to ask governance questions across otherwise unrelated systems. Which capabilities expose customer data? Which capabilities operate in a particular geography? Which capabilities are exercised by third-party software or AI agents?

The `capability_id` in the ACC becomes the common index across policy, telemetry, metrics, and compliance. Authorization engines may change and applications may use different technologies, but the capability identifier provides a stable enterprise-level unit of governance.

Two pages cover the rest of the Capability Inventory:

* [Manage lifecycle](./manage-lifecycle.md) — how a capability moves from discovery through retirement.
* [Gemara mapping](./gemara-mapping.md) — how a capability's catalog entry references the compliance control mapping that governs it.
