# GovOps Dashboard

Governance requires measurement, and measurement requires a place to see it.

The GovOps Dashboard is the fourth governance-plane service, alongside the
[Capability Catalog](./capability-catalog.md), [Continuous Evidence](./continuous-evidence.md), and
[Continuous Compliance](./continuous-compliance.md). Where those three services build and maintain the
capability inventory and its evidence trail, the Dashboard calculates, visualizes, and reports on what
that evidence means: it is how Governors view and report GovOps metrics.

## What the Dashboard does

- **Calculates GovOps metrics** from capabilities in the ACC and evidence collected under the
  [GovOps TRACE Profile (GTP)](../../standards/gtp/govops-trace-profile.md), using `capability_id` as the
  common unit of analysis.
- **Visualizes and reports governance data** — for example, risk by volume, geographic region, business
  unit, or category — so that governance questions can be answered across otherwise unrelated
  applications and infrastructure.
- **Reports status** of the Capability Catalog, Continuous Evidence, and Continuous Compliance services,
  giving Governors a single place to see whether the governance plane itself is healthy.
- **Renders heat maps**, such as the [Governance Heat Map](../../metrics/README.md#governance-heat-map),
  that give a compact, colour-coded assessment of each GovOps layer.

## Relationship to GovOps metrics

The Dashboard does not define metrics; it presents them. Metric definitions — what is measured, why it
matters, and which evidence supports the result — are a separate GovOps deliverable, organized by layer
(Identity, Access, Observability, and Governance) in [GovOps Metrics](../../metrics/README.md). The
Dashboard is not a single prescribed report format: organizations can build their own views on top of the
same underlying metric definitions and evidence.
