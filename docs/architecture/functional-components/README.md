# Functional Components

GovOps defines a set of shared services that enable governors to manage authorization across many applications, APIs, workloads, infrastructure components, and AI agents. These services provide the connection between business governance and distributed enforcement.

The key architectural principle is that the enterprise should be able to trace a governed capability from its definition in the catalog, through authorization policy, into the application and ultimately down to runtime execution. In other words, the `capability_id` should be able to travel from the catalog to the kernel.

This does not mean authorization decisions need to be centralized. In fact, GovOps supports local authorization decisions close to the application, resource, or action being protected. What should be centralized are the governance artifacts necessary to understand and manage those decisions across the enterprise.

GovOps owns four services:

* [Capability Inventory](./capability-inventory/README.md) — the catalog of governed capabilities and their lifecycle.
* [Evidence](./evidence/README.md) — how runtime evidence is produced, collected, correlated, enriched, and keyed, including the policy and key management it depends on.
* [Compliance](./compliance.md) — mapping capabilities and their evidence to control objectives and regulatory requirements.
* [GovOps Dashboard](./govops-dashboard.md) — the service that calculates, visualizes, and reports GovOps metrics.
