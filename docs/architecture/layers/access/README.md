# Access

The access layer defines and enforces who may do what. It includes Policy Authoring, authorization, Schema Management, Federation Management, Shared Signals, identity governance and administration (IGA), and privileged access management (PAM). Policy Authoring defines the rules that control capabilities. Schema Management defines the entities, attributes, and context those policies can reference. Federation Management defines which external issuers, credentials, and claims the enterprise is willing to trust. These artifacts are managed centrally, but decisions are made locally, close to the resource.

GovOps does not run access management systems. It asks the access layer to be governable:

* Record every authorization decision with the `capability_id`, the decision (Allow, Deny, or Challenge), and the versions of the policy and evidence used.
* Keep policy, schema, and federation artifacts centrally versioned, so a decision can be traced to the artifact versions behind it.
* Make decisions available as evidence, not only as local logs.

Pages in this layer:

* [Schema Management](./schema-management.md) — the entities, attributes, and claims policies can reference.
* [Federation Management](./federation-management.md) — which external issuers, credentials, and claims the enterprise trusts.
* [Runtime Authorization Context](./runtime-authorization-context.md) — the context that joins a decision to what executed.

Centralized policy administration itself is covered under [Functional components](../../functional-components/README.md), since GovOps depends on it directly.
