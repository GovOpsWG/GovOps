# Actors and Responsibilities

Who governs? Humans. AI can assist; it cannot abdicate board and management responsibility. Governors are the humans accountable for the business — they are the ones who must be able to answer for a capability when something goes wrong, not the system that executed it.

Enterprises govern to achieve **security** — literally *securus*, "without care" — so accountable leaders can sleep at night. GovOps names three steering responsibilities that fall to governors: **risk management** (prioritize the most likely risks with the biggest business impact), **accountability** (know who to call when things go wrong), and **observability** (see enterprise risk, or fly blind). See [Stakeholder goals](../foundations/stakeholder-goals.md) for what Security, Audit, Compliance, Engineering, Finance, and Legal each get from this.

## Responsibility by layer

Effective authorization governance depends on four layers, each answering a different question and each with a different accountable function:

* **Governance** — How does the enterprise manage risk? Owned by GovOps itself: the Capability Catalog, Continuous Evidence, Continuous Compliance, and the GovOps Dashboard. See [Governance layer](./layers/governance/README.md).
* **Access** — Who may do what? Owned by policy, schema, and federation administrators, and the access-management systems that enforce their decisions. See [Access layer](./layers/access/README.md).
* **Observability** — What is actually happening? Owned by security and platform teams operating SIEM, kernel observability, and analytics tooling. See [Observability layer](./layers/observability/README.md).
* **Identity** — Who or what is acting? Owned by identity and credential-issuing teams. See [Identity layer](./layers/identity/README.md).

GovOps does not run access management, observability, or identity systems. It asks each layer to be governable: each must expose the artifacts and evidence governance needs, keyed on `capability_id`.

## Response

Response closes the loop. It determines what happens when the enterprise detects a condition that requires action. Events may come from any of the four layers. A response may invoke a workflow, require additional authorization, revoke a credential, quarantine a workload, notify an accountable owner, trigger an AI agent, or require a human decision. Response converts governance evidence into operational action — see [Event handling](./layers/governance/event-handling.md).
