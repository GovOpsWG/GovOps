# Capability Catalog

The Authorization Capability Catalog ("ACC") is a machine-readable inventory of what applications, APIs, infrastructure, workloads, and AI agents can actually do — the authorization surface the enterprise wants to govern. The catalog model, Authorization Capability Profile, tooling conventions, and persona workflows are specified in the [ACC documents](../../acc/README.md).

A capability is an action on a resource. Examples might include:

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

## Capability Lifecycle

The ACC is not just an inventory. Each capability is a governed object with its own lifecycle (distinct from the enterprise GovOps loop above):

```text
Discover → Register → Classify → Govern → Deploy → Observe → Retire
```

When a capability is registered, it receives a stable `capability_id` and an accountable owner. Governors then classify its business impact and risk, including factors such as geography, data sensitivity, regulatory scope, and third-party exposure.

The capability is then associated with the authorization artifacts required to govern it. These may include Policy Stores, authorization schemas, trusted credential issuers, and Gemara control mappings. When the capability is deployed, its `capability_id` is exposed at the authorization enforcement point so decisions and runtime telemetry can be correlated back to the ACC.

Once operational, governors can measure the capability continuously. They can determine which policies govern it, who or what exercises it, whether runtime evidence is available, and whether its compliance obligations are being met.

Capabilities should also have a defined retirement process. Removing a capability should identify dependent policies, applications, schemas, telemetry, and compliance mappings so obsolete governance artifacts do not remain in production.
