# Capability Lifecycle

The ACC is not just an inventory. Each capability is a governed object with its own lifecycle (distinct from the enterprise GovOps loop):

```text
Discover → Register → Classify → Govern → Deploy → Observe → Retire
```

When a capability is registered, it receives a stable `capability_id` and an accountable owner. Governors then classify its business impact and risk, including factors such as geography, data sensitivity, regulatory scope, and third-party exposure.

The capability is then associated with the authorization artifacts required to govern it. These may include Policy Stores, authorization schemas, trusted credential issuers, and Gemara control mappings (see [Gemara mapping](./gemara-mapping.md)). When the capability is deployed, its `capability_id` is exposed at the authorization enforcement point so decisions and runtime telemetry can be correlated back to the ACC.

Once operational, governors can measure the capability continuously. They can determine which policies govern it, who or what exercises it, whether runtime evidence is available, and whether its compliance obligations are being met.

Capabilities should also have a defined retirement process. Removing a capability should identify dependent policies, applications, schemas, telemetry, and compliance mappings so obsolete governance artifacts do not remain in production.
