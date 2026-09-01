# OWASP

GovOps has been proposed as an OWASP working group.

**Tagline:** Operational governance for capability-driven security

| Document | Status |
|---|---|
| [Project proposal](./project_proposal.md) | Submitted |

## What the proposal commits to

The working group will develop an open, **vendor-neutral** framework for making authorization
governance operational, measurable, and capability-oriented, with three initial deliverables:

1. **`ACC.yaml`** — a machine-readable capability catalog format. See [ACC](../acc/README.md).
2. **A metric definition document** — GovOps metrics, their purpose, data requirements, calculation
   guidance, segmentation, and limitations. See [metrics](../metrics/README.md).
3. **Architecture documents** — how a capability catalog connects to real enterprise systems,
   PDP-neutral throughout. See [architecture](../architecture/README.md).

The proposal also sets explicit boundaries. GovOps does **not** standardize a new policy decision
point, policy language, enforcement protocol, identity system, or formal verification method. Those
are complementary, not prerequisites.

## Why OWASP

Authorization failures remain one of the most persistent and damaging classes of application and API
security risk. Cloud-native systems, non-human identities, autonomous workloads, and AI agents let
powerful capabilities be exercised at machine speed across complex supply chains. Making that risk
measurable, governable, and accountable is squarely within OWASP's mission.

Read the [full proposal](./project_proposal.md) for the phased plan and the detailed scope.
