# Why Existing Approaches Fall Short

This section details the specific gaps and limitations of current authorization and governance
models — not because the underlying technologies are flawed, but because none of them were designed
to answer governance questions on their own.

- [`identity-centric-governance.md`](./identity-centric-governance.md) — why RBAC and other
  identity-first models are too coarse-grained and focus on *who* rather than *what*.
- [`agentic-ai-challenges.md`](./agentic-ai-challenges.md) — why AI agents amplify these gaps rather
  than merely adding to them.
- [`pbac-without-governance-layer.md`](./pbac-without-governance-layer.md) — why adopting a more
  expressive policy engine (PBAC/ABAC) does not, by itself, produce governance.
- [`point-in-time-compliance.md`](./point-in-time-compliance.md) — why episodic, audit-driven
  compliance cannot keep pace with continuously changing authorization configurations.

Together, these gaps motivate the shift to a capability-centric model described in
[`../govops-thesis/README.md`](../govops-thesis/README.md).
