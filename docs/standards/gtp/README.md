# GovOps TRACE Profile (GTP)

GTP is the GovOps evidence profile of the TRACE Trust Record. It is a "flight recorder" for
authorization: a correlated record of what was authorized, what was invoked, and what effect was
observed, keyed to the capabilities defined in the [ACC](../acc/README.md).

GTP:

- Records authorization, invocation, and observed effect as separate, correlated events, rather than
  a single entry that only shows the outcome of the decision.
- Links policy, tokens, workloads, sessions, and enforcement points, so a record can be traced across
  the systems that participated in a single action.
- Resolves the `(action, resource_type)` pair on each record to the ACC `capability_id`, connecting
  runtime evidence back to the catalog.
- Preserves independently signed producer evidence, instead of requiring a single trusted writer to
  assert what happened.
- Enriches records with organizational, regional, and risk context drawn from the ACC, so evidence can
  be segmented the way Governors need to see it.
- Supports accountability, observability, threat detection, and metrics from the same underlying
  evidence, rather than requiring separate collection for each.

| Document | What it covers |
|---|---|
| [GovOps TRACE profile](./govops-trace-profile.md) | Schema changes GovOps requires on top of the base TRACE v0.2 Trust Record |
