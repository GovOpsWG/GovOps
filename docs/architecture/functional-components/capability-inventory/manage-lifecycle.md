# Capability Lifecycle

The ACC is not just an inventory. Each capability is a governed object with its own lifecycle (distinct from the enterprise GovOps loop):

```text
Discover → Register → Classify → Govern → Deploy → Observe → Retire
```

When a capability is registered, it receives a stable `capability_id` and an accountable owner. Governors then classify its business impact and risk, including factors such as geography, data sensitivity, regulatory scope, and third-party exposure.

The capability is then associated with the authorization artifacts required to govern it. These may include Policy Stores, authorization schemas, trusted credential issuers, and Gemara control mappings (see [Gemara mapping](./gemara-mapping.md)). When the capability is deployed, its `(action, resource_type)` is published in the policy store's capability mapping, so the [collector](../evidence/collectors.md) can resolve decisions and runtime telemetry back to the ACC. A decision point may also carry `capability_id` in its authorization context when it knows it, but the collector's resolved value is authoritative (see [#45](https://github.com/GovOpsWG/GovOps/issues/45)).

Classification changes over time. Each change to an entry's metadata produces a new **version** with `effective_at` and `expires_at`, and the catalog keeps every prior version. A change to the capability's group, action, or resource type is a different capability, not a new version. Evidence is always resolved against the version in force when the event happened (see [Collectors](../evidence/collectors.md#resolving-against-the-capability-in-force-at-the-time)). Whether versions share one `capability_id` or each get their own is being discussed in [#56](https://github.com/GovOpsWG/GovOps/issues/56).

Once operational, governors can measure the capability continuously. They can determine which policies govern it, who or what exercises it, whether runtime evidence is available, and whether its compliance obligations are being met.

Capabilities should also have a defined retirement process. Removing a capability should identify dependent policies, applications, schemas, telemetry, and compliance mappings so obsolete governance artifacts do not remain in production.
