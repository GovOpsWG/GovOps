# Identity Layer

The identity layer establishes identifiers and trusted evidence about the entities participating in authorization. GovOps groups these entities as human, software, and organization identities. Software identities include applications, workloads, devices, and AI agents. Identity systems typically associate identifiers with cryptographic keys, credentials, attributes, or other evidence that can be verified by the authorization system. Human workforce identity is relatively mature, while software, workload, organizational, and agent identity standards continue to evolve. The identity layer therefore provides evidence about actors; governance policy determines what that evidence permits them to do. Identity data also enriches evidence, so each record can be traced to the actor behind it.

GovOps does not run identity systems. It asks the identity layer to be governable:

* Provide verifiable identifiers for human, software, and organization actors.
* Provide the attributes and status, such as revocation, needed to enrich evidence about who or what acted.

See [Identity](./identity.md) for the page describing these identities in more detail.
