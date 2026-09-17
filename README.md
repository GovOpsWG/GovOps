# GovOps

**Measure risk, transparency, and accountability.**

The GovOps Working Group advances continuous, policy-driven governance for authorization, risk, and
trust across open source, cloud, and agentic systems.

Documentation: **[govops.info](https://govops.info)**

## What GovOps is

GovOps is an open, vendor-neutral architecture for **authorization governance** at enterprise scale.
It elevates the *capability* — a concrete action on a resource, such as `transfer:funds` or
`deploy:production` — as the primary unit of governance.

Governance artifacts are managed centrally. Authorization decisions stay local, next to the resource
being protected. A stable `capability_id` joins the two, travelling from the catalog to the kernel.

The continuous GovOps loop:

```text
Govern → Authorize → Execute → Observe → Detect → Respond → Govern
```

GovOps is PDP-neutral. It does not standardize a new policy decision point, policy language,
enforcement protocol, or identity system, and it does not require you to replace the authorization
infrastructure you already run.

## Deliverables

| Deliverable | Status | Documents |
|---|---|---|
| **Authorization Capability Catalog (ACC)** | Draft | [Design](./docs/acc/authorization-capability-catalog-design.md) · [Use cases](./docs/acc/authorization-capability-catalog-use-cases.md) |
| **Governance metrics** | Draft for sub-group comment | [Metric set](./docs/metrics/README.md) · [Template](./docs/metrics/metric-definition-template.md) |
| **Architecture** | Draft | [Architecture](./docs/architecture/README.md) |

## Start here

- New to GovOps — [Architecture at a glance](./docs/architecture/README.md#architecture-at-a-glance)
- Building a catalog — [ACC design](./docs/acc/authorization-capability-catalog-design.md)
- Measuring governance — [GovOps metrics](./docs/metrics/README.md)
- Working group scope — [OWASP project proposal](./docs/owasp/project_proposal.md)

The full documentation map is in [`docs/README.md`](./docs/README.md).

## Get involved

- Join the [GovOps LinkedIn Group](https://gluu.co/govops-group)
- Open an issue or pull request — see [CONTRIBUTING.md](./Community_Specification/contributing.md)
- Read the [outreach notes](./docs/outreach/README.md)

## Repository layout

```text
docs/          working group documents (the source of truth for govops.info)
site/          the govops.info web application
```

Documentation moved from the repository root into `docs/` — see
[`docs/MOVED.md`](./docs/MOVED.md) for the old-to-new path map.

## License

[CC0 1.0 Universal](./LICENSE). Contributions are dedicated to the public domain.
