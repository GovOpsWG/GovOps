# Layers

Our society is in the midst of a multi-generational digital transformation. Enterprises are expanding their digital footprints, especially to capture productivity gains from autonomous software agents that use large language models ("LLMs") to plan actions and achieve goals. Effective authorization governance depends on four layers: **governance, access, observability, and identity**. Each layer answers a different question. How does the enterprise manage risk? Who may do what? What is actually happening? Who or what is acting?

GovOps owns the governance layer. It does not replace the other three. Instead, it asks them to be governable. Each must expose the artifacts and evidence that governance needs, keyed on `capability_id`.

[Figure 1.1](../images/figure_1_1.jpg) shows an earlier version of this model, with Event as a separate layer. It will be updated. The GovOps loop and plane diagram are in [Architecture at a Glance](../README.md#architecture-at-a-glance).

* [Identity](./identity/README.md) — establishes identifiers and trusted evidence about the entities participating in authorization.
* [Observability](./observability/README.md) — provides evidence about what is actually happening.
* [Access](./access/README.md) — defines and enforces who may do what.
* [Governance](./governance/README.md) — the layer GovOps owns: risk, accountability, and compliance.
