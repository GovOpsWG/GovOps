# Denial Ratio Trend

## Name

Denial Ratio Trend

## Status

Draft, for sub-group comment. Second entry in the set; published first because it is the cheapest complete entry and exercises every template field. Policy propagation time, the set's first entry, follows in a separate PR.

## Purpose

Is the rule governing this capability refusing more or less than it was, and did anything we changed move it?

## Governance activity

Observability, supporting risk management.

## Definition

The change in the share of authorization decisions on a capability that resulted in a deny, measured across consecutive windows. The share itself is reported as a qualifier, never as the headline.

A capability with meaningful decision volume and no denials at all is not necessarily a well protected capability. It may be one where the governing rule does not discriminate, and would allow any request that reached it.

The architecture defines a three-valued decision (allow, deny, challenge), but most engines in the field do not emit the third value. Deny-by-default engines never return a challenge: a step-up flow records as a deny, possibly carrying remediation diagnostics, followed by a fresh allow when the caller returns with evidence. v1 treatment: count outcomes as recorded, a deny is a deny. Challenge-aware counting is parked until challenge is commonly emitted. The engine difference is a stated limitation below.

## Calculation

```text
denial_ratio(capability, window) =
    count(decisions where outcome = deny) / count(all decisions)
```

Both counts are restricted to one capability, a fixed calendar window, and decisions carrying a capability identifier.

Reported alongside the ratio:

- **the absolute decision count**, because a ratio over a handful of decisions is not meaningful
- **the number of policy versions in force during the window**, because a ratio spanning a rule change averages the behaviour of two different rules
- **the challenge count, where the engine emits challenges**, so estates that do produce the third value can see how much traffic sat between allow and deny

Where the decision count falls below a stated floor, report the count and suppress the ratio. Suggested floor: 100 decisions in the window.

Where the denial count is zero in a window with meaningful volume, report the upper bound on the true denial rate using the rule of three: at 95% confidence the true rate is at most 3/n, where n is the total decision count. For a capability with 13,400 decisions and zero denials, the upper bound is 0.00022. This belongs in the reported output alongside the zero, so a reader can distinguish a genuinely clean record from insufficient data.

## Data required

| Field | Source |
|---|---|
| capability identifier | governance decision record |
| decision outcome | governance decision record |
| timestamp | runtime record |
| policy store version | governance decision record |
| `risk-tier` | capability catalogue |

The decision-record fields are within the required minimum of the Runtime Authorization Context. The timestamp is standard on any runtime record, and risk tier joins from the catalogue.

## Segmentation

`risk-tier` is expected in all reporting, because the interpretation changes sharply with it. A low ratio on a low risk capability is unremarkable. The same figure on a critical capability is the finding. Also useful: requester class, `org-unit`, third-party exposure, policy version.

## Worked example

Meridian Finance, a fictional mid-size lender. Window: March. Capability `approve:payment-over-threshold` (display form; the record carries the catalogue's SHA-256 id), risk tier critical.

| | |
|---|---|
| Decisions | 13,400 |
| Denials | 0 |
| Denial ratio | 0.000 |
| Rule-of-three upper bound (95%) | 0.00022 |
| Policy versions in force | 2 |
| Instrumentation coverage | 42% |

The governing rule allowed any request originating inside the corporate network. Every request in the window originated inside the corporate network.

**The version split is where this gets interesting.** On 14 March the rule was tightened to require a fresh identity check. The split is not clean, because propagation was staggered: both versions were deciding until 2 April, and one legacy payments service stayed on v4 throughout.

| Period | Rule version | Decisions | Denials | Ratio |
|---|---|---|---|---|
| 1 to 14 March | v4 only | 6,100 | 0 | 0.000 |
| 14 to 31 March, under v5 | v5 | 5,900 | 0 | 0.000 |
| 14 to 31 March, still under v4 | v4 | 1,400 | 0 | 0.000 |

The control was strengthened and the ratio did not move, because every requester already satisfied the new condition. On paper the control improved. In practice it still refuses nothing.

Without the version split, this would read as one flat number and the strengthening would be invisible. With it, the group can see that a deliberate control improvement produced no observable change in behaviour, which is itself the finding.

For contrast, in the same window, `deploy:production-service`:

| | |
|---|---|
| Decisions | 4,200 |
| Denials | 126 |
| Denial ratio | 0.030 |

A rule that is at least separating some requests from others.

**Interpretation a governor would draw.** The payment approval control is present, versioned, referenced by the capability, and in force for the whole period. Nothing is misconfigured in a way a conventional audit would catch. It has simply never distinguished one request from another, before or after being tightened. This is a finding about a rule, not about any person or team.

## Interpretation guidance

- **At or near zero**, on a critical capability with real volume: the signal this metric exists to surface. The rule is not discriminating.
- **Moderate**: the rule is separating requests. It says nothing about whether it is separating them correctly.
- **High**: not automatically good. May indicate a rule too restrictive for the work people are trying to do, which tends to produce workarounds.
- **A change in the ratio** is more informative than its level. A ratio dropping to zero after a rule change usually means the change was more permissive than intended.
- **A rising denial ratio on a deny-by-default estate with step-up flows** may be friction moving, not protection moving: step-ups record as denies there. Check whether the new denies are followed by allows from the same journeys before reading it as the rule biting harder.

## What it does not support

Not a conclusion that a capability is secure, that access to it is appropriate, or that no misuse has occurred. A correctly formed request using stolen credentials produces an allow and contributes to a low ratio exactly as a legitimate request would.

Not any statement about who holds a capability or how they came to hold it.

Not a conclusion that a rule is well written. It reports only that the rule produced different outcomes for different requests.

## Limitations

**The main one, stated plainly.** A low ratio has two possible causes this metric cannot separate: a permissive rule, or a well behaved population that never submits a request which should be refused. Distinguishing them requires reading the rule. The metric identifies where to look, not what is wrong.

The ratio is undefined for capabilities never exercised and unstable for those exercised rarely. It describes rules being tested by traffic, and says nothing about rules that are not.

**The denominator counts evaluations, not requests.** A single logical request can traverse multiple enforcement points and produce multiple decisions on the same capability. A capability behind a service mesh with five enforcement points in the request path has a 5x multiplied count relative to one behind a single gateway. Step-up flows add to this: whether recorded as challenge then allow or as deny then allow, one journey produces at least two evaluations. The ratio is not directly comparable across capabilities with different enforcement-point depths. Recommend reporting the evaluation-to-request multiplier as a qualifier where known.

**The ratio is not comparable across engine decision models.** A deny-by-default engine records a step-up as a deny followed by a later allow, so the same user journey that a challenge-emitting engine records as challenge then allow appears in the record as a denial. Estates on deny-by-default engines read a higher ratio for identical behaviour. Report the engine decision model as a qualifier where estates are mixed, and read denial movements on such estates with step-up flows in mind.

Requests refused upstream, before reaching the decision point, do not appear in the denominator. Where substantial filtering happens earlier, the population reaching the engine is already selected and the ratio reads lower than the underlying request population would suggest.

## Instrumentation level required

Computable from any decision log carrying a capability identifier and a decision outcome. The version split additionally requires the policy store version on each decision, which the Runtime Authorization Context specifies as a required field.

## Gaming

Easy to move without improving anything. Adding a clause that refuses obviously malformed requests lifts a capability off zero while leaving the permissive path untouched. The metric is diagnostic rather than a target. A capability moving off zero warrants looking at what is now being refused, not simply noting that something is.

## Qualifiers that travel with the result

Instrumentation coverage, observation window as fixed dates, catalogue version, total decision count, number of policy versions in force, challenge count where the engine emits it, and engine decision model where estates are mixed.

## Open questions

- **Challenge-aware counting is parked.** The architecture's three-valued decision would support a treatment that counts final outcomes only, with a separate challenge rate. It is unimplementable on today's deny-by-default estates, which never emit the third value, so v1 counts outcomes as recorded and the engine-model limitation carries the caveat. Revisit when challenge is commonly emitted.
- **Whether decisions produced at token issuance**, as opposed to at the point of capability exercise, belong in the denominator. A decision record can be created at either moment, and both may be observable. Counting both materially changes the figure where issuance and exercise are each instrumented, and changes nothing where only exercise is. Unresolved.
