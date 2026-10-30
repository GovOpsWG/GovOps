# Correlation and Enrichment

Evidence preservation alone does not answer governance questions like "what share of high-risk capability use was autonomous, by business unit, last quarter?" The signed records say what producers observed; the collector derives the rest. A governing principle runs through everything on this page: **producers sign facts; the collector derives interpretations.** Token contents, organizational attributes, actor classification, region, and resource sensitivity are interpretations the collector assembles from reference data and correlation — never things a producer asserts about itself. Every derived value carries its own provenance and, where correlation is involved, an attribution quality.

## Token enrichment

A `jti` in a signed record is only a lookup key. The collector correlates `(issuer, jti)` against what the identity provider retained at token issuance — subject, session id, client id, scope, confirmation key, and expiration. Two independent paths feed this: `claims_at_decision` (producer-signed, the claims the PDP actually acted on) and `current_token_state` (collector-resolved later from the identity provider, when the token is still resolvable). Both are retained with their own provenance; when they disagree — for example, scope narrowed after issuance — that divergence is itself a governance signal, not something the collector silently reconciles.

## Session correlation

The session id resolved through token enrichment is the join key from a machine action back to a human authentication. The collector walks from the token to the session record and, where available, to the authentication ceremony, producing a `session_correlation` result that records authentication strength (for example `phishing_resistant_mfa` vs. `single_factor`) — derived from the ceremony, never asserted by the invoking workload.

## Actor context

GovOps does not let a workload assert whether a human is behind it. Instead the collector derives `actor_context` from the correlation evidence above: `human_direct`, `human_delegated_to_workload`, `software_autonomous`, `service_to_service`, or `unknown`. "Unknown" is a first-class, reportable value — correlation evidence that is insufficient is never silently coerced into a human or software bucket.

## Organizational and regional reference data

Organizational attributes (business unit, team, owner) are never copied blindly from token claims. The collector resolves stable identifiers — subject, client id, workload id, resource id — against versioned organizational reference data, keeping the mapping version used so historical records retain the classification that was *effective at the time*, not today's org chart.

"Region" is similarly split into four distinct, separately sourced dimensions rather than one ambiguous field: where the human's session originated, where the acting workload executed, where the enforcement point ran, and where the target resource lives. Cross-region governance questions are always defined over a specific pair of these.

## Attribution quality

Every derived correlation — token, session, actor context, organization, region — carries an attribution quality so aggregates can be filtered or confidence-weighted: `verified` (cryptographic/attested evidence), `correlated` (joined through a reliable key with no contradiction), `asserted` (taken from a producer-signed claim with no independent corroboration), `ambiguous` (multiple candidate resolutions), or `unknown` (no usable evidence).

## Per-invocation analytics projection

For each invocation, the collector materializes a flat analytics record combining the signed facts with all of the above — `capability_id`, `actor_context`, business unit, region, data classification, authentication strength, and the weakest attribution quality among the correlations that fed it — so governance queries do not need to re-walk the full evidence graph for every question.
