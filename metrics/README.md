# GovOps Metrics

**Status:** Draft for sub-group comment

**Deliverable:** Metric definition document (Phase 2 of the GovOps project proposal)

This directory holds the GovOps metric definitions. Everything in this front matter is stated once and never repeated inside an individual metric entry.

---

## 1. What this document is

This document defines the measures GovOps uses to show governors where authorization risk sits and which way it is moving. Each metric has one entry, every entry follows the same shape, and the shape is defined in [the template](./metric-definition-template.md).

In the GovOps loop (Govern → Authorize → Execute → Observe → Detect → Respond), this document instruments the Observe → Detect segment. Two of its entries are the measurement side of events the architecture already names: loss of required telemetry is instrumentation coverage falling, and use of an expired or unapproved policy version is what propagation time surfaces.

It is not a dashboard specification, a tool, or a maturity model, and it does not tell an organisation what its numbers should be. It defines each number, the conclusions the number cannot support, and the context that must be published with it.

All worked examples use the same fictional company, Meridian Finance, a mid-size lender, over the same period. Entries can reference each other's findings, and the reader can see how the metrics combine.

## 2. The metric set at a glance

| Entry | Kind | Status |
|---|---|---|
| [Denial ratio trend](./denial-ratio-trend.md) | Operational metric | Draft, in this directory |

An entry appears in this table only once its complete definition, worked example included, is in this directory.

### Planned entries

The planned v1 set adds four more operational metrics: policy propagation time, rate shift, instrumentation coverage (as a change), and finding backlog age. It also adds capability exercise rate as a base count, exposure concentration as a qualifier on exercise rate, and behavioural periodicity as a segmentation. Policy propagation time arrives next, in a separate PR. It and denial ratio are designed as a pair, and the finished document leads with propagation time because it demonstrates something only this architecture enables. Denial ratio is published first because it is the cheapest complete entry and exercises every template field.

### Parking lot

Candidates held for v2, with the reason recorded:

- **Variance.** The set measures rates and direction; nothing yet measures volatility.
- **Forward-looking measures.** Nothing in the set looks ahead; every entry describes observed decisions.
- **Change-failure-rate analog.** DORA counts changes that cause incidents. The closest counterparts here are the share of policy tightenings producing no behaviour change, or the share of changes rolled back. Neither is specified yet.
- **Renewal depth.** Standing access disguised as re-minted short-lived grants. Passes the admissions test, but needs a correlation identifier on the decision record. The Runtime Authorization Context specifies token identifiers as optional fields, so it becomes computable wherever they are populated.
- **Detection time.** How long before a problem is noticed. Charter question 8 is only partly covered without it.

Any of these can be proposed as an issue, using the template.

## 3. Charter coverage: where each question is answered

The working group charter lists eight operational questions the metrics must answer. Not all of them belong in the operational metric set. This table maps each question to where it is answered and why.

| # | Charter question | Answered by | Why it sits there |
|---|---|---|---|
| 1 | Which capabilities create the most risk? | Business tier: risk-reward scoring (`risk-tier` × `business-impact`), as specified in the ACC design | Risk-reward is a level, not a change, so the admissions test excludes it from the operational set. The business tier produces the ranking; the operational metrics report movement on the ranked capabilities |
| 2 | Which capabilities are expanding fastest? | Operational metric: rate shift | A change across windows by construction |
| 3 | Which teams own the most critical capabilities? | Catalogue query: accountable owner in the ACC | Static metadata. Answerable from the catalogue alone, no runtime data needed |
| 4 | Which capabilities lack clear accountability? | Catalogue query: accountable owner, checked for completeness | Same field, checked for gaps rather than value |
| 5 | Which high-risk capabilities are exposed to third parties or autonomous actors? | Catalogue attribute plus segmentation by requester class | The catalogue answers the static question. Segmenting operational metrics by requester class adds the movement dimension |
| 6 | Which policies control each capability? | Catalogue query: capability-annotated policy store | Static relationship. No runtime measurement needed |
| 7 | Which controls are missing, stale, or unenforced? | Operational metrics: instrumentation coverage (missing), finding backlog age (stale), propagation time (unenforced) | Three metrics contribute, one per failure mode |
| 8 | How quickly does the organisation detect and respond to capability risk? | Operational metrics: finding backlog age (response), propagation time (detection of enforcement gaps) | Detection speed is partly covered. Pure detection time is not directly measured and sits in the parking lot |

Three questions (3, 4, 6) are catalogue queries. One (1) is answered by the business tier. One (5) straddles catalogue and segmentation. Three (2, 7, 8) are answered by operational metrics, with a partial gap on detection time in question 8. The catalogue and business-tier answers rely on ACC fields the ACC design already specifies; no reporting artifact for them exists yet, in this directory or elsewhere in the repository. Of the operational metrics named, only denial ratio trend is published; the rest are planned entries (section 2).

This mapping is the acceptance test for the metric set. A metric that does not contribute to at least one of the remaining operational questions should justify its presence on other grounds.

## 4. What counts as a GovOps metric

> **A GovOps metric requires at least two observation windows and reports the change between them. Levels are admitted as denominators, qualifiers and segmentation, never as headline metrics.**

The rule exists because levels are already well served. Coverage percentages, pass rates, threshold scores, and the share of capabilities with an owner are worth publishing, and most tools already produce them. They do not show whether the position is improving or deteriorating, or whether a given change made any difference. That is the gap this deliverable exists to fill.

Three consequences:

- A candidate that cannot be stated as a change does not enter the set. It may still belong in the document as a base count or a segmentation, labelled as such.
- Every entry reports at least two windows. A figure from a single window is a point-in-time reading and does not qualify under the rule.
- Where a level is the genuinely useful number, it is published as a qualifier attached to a metric rather than as a metric of its own.

The set deliberately contains no standalone risk metric. The ACC's risk-reward scoring (`risk-tier` × `business-impact`) ranks capabilities, and a ranking is a level, produced by the business tier. The operational metrics report which way the ranked capabilities are moving, and every figure is segmented by risk tier as a requirement. Risk tier determines which capabilities a governor reads first; the metrics report what is changing on those capabilities.

## 5. Design rules

**Method stays in the calculation field.** A metric is named for what it measures, not for how it is computed, and any statistical technique appears in the calculation field only. A governor should be able to read every metric name and every interpretation section without knowing the technique behind them.

**Limitations and what-it-does-not-support are separate fields.** A limitation is a weakness in the number itself. What it does not support lists conclusions the number cannot justify but that readers tend to draw anyway. The two fail differently, and merging them tends to lose the second, which is the one that causes damage in practice.

**No composite scores.** Every measure in this document is decomposable. A weighted average of several measures hides its weighting, and when it moves the reader cannot tell why. Organisations are free to build composites on top of these definitions; the definitions will not supply them.

**Read propagation time and denial ratio together.** The two metrics are designed as a pair: propagation time shows whether a control arrived, and denial ratio shows whether it changed any outcomes once it did. A control that propagated in 41 minutes and refused nothing is a different finding from one that propagated in 19 days and refused 3% of requests, and neither metric produces that finding alone.

**Small scope, stated limits.** A small set of well-specified measures with stated limits is more useful than a larger set that implies more than it can deliver.

## 6. What this framework cannot see

These follow from GovOps being capability-oriented and observation-based. They apply to every metric in this document and are not repeated in individual entries.

- **Access that is never used.** The record contains decisions that happened. A dormant capability held by a departed contractor reads clean on every measure here.
- **Anything not in the catalogue.** The metrics only see capabilities the catalogue contains, so coverage of an incomplete catalogue can still read 100%.
- **Who holds a capability.** GovOps does not maintain principal-to-capability holdings. How access is granted, approved, reviewed and certified stays in identity governance.
- **What was at stake.** Every decision counts once, whatever the value of the transaction behind it. The record captures that a decision happened, not the value of what moved.
- **A correctly formed attack.** Stolen credentials used properly produce a clean allow and an unremarkable record.
- **Separation of duties.** Whether one person performed two conflicting roles is a question about principals, and GovOps does not maintain principal holdings.
- **Which capabilities carry the most risk, as a ranking.** Answered by the business tier's risk-reward scoring, not the operational set. See section 3.
- **Compliance pipeline health.** Evidence freshness, OSCAL coverage and control-mapping completeness are out of scope for this deliverable. The compliance pipeline (Gemara, Trestle, OSCAL) draws on a different data source, and the exclusion is deliberate.
- **Whether accountability is being exercised.** The catalogue tracks who owns each capability. The metrics track governance findings. Whether findings have an assigned owner and receive a response is a segmentation of finding backlog age, not a separate metric.
- **The systems that cannot report.** Instrumentation coverage is not a random sample. The estate able to emit capability-tagged decisions skews modern and well-run, and the older estate is usually where the problems are. Every result carries the coverage figure for this reason.

## 7. Required segmentation

**Risk tier is required on every metric** (`risk-tier` in the Authorization Capability Profile). Interpretation changes sharply with it, and a figure published without it invites the wrong conclusion.

Segmentation names follow the profile exactly: `risk-tier` and `data-sensitivity` are enums, `business-impact`, `geography` and `org-unit` are organisation-defined strings.

**Requester class and third-party exposure are required where the data supports them.** Both are named in the charter. Neither is a typed field in the published profile: the architecture's prose lists third-party exposure as a catalogue attribute, but the profile schema does not yet carry it, and requester class does not appear at all. Until the profile carries them, requester class derives from the decision record and third-party exposure stands as a field request to the catalogue editor.

Optional and commonly useful: `business-impact`, `geography`, `org-unit`, enforcement point class, policy version, capability owner.

## 8. Qualifiers that travel with every result

A metric published without these is not readable and should not be published.

- Observation window, as fixed dates
- Catalogue version
- Instrumentation coverage for the capability, and its direction
- Total decision count for the window

Coverage movement also limits what a change can mean. When coverage moved materially between the windows being compared, part of any reported change reflects the population that entered or left observation rather than a change in behaviour. In that case, read the change within segments whose coverage held steady, or publish it flagged as not comparable across the windows.

## 9. Status labels

| Label | Meaning |
|---|---|
| Draft | Written up, open for sub-group comment |
| Proposed | Editor is recommending it for v1 |
| Accepted | Ratified by leadership, in v1 |
| Parked | Held for v2, with the reason recorded |
| Base count | Not a metric. A denominator the metrics rely on |
| Segmentation | Not a metric. A way of cutting the others |

## 10. How to propose a metric

- One GitHub issue per candidate. Discussion stays on the issue.
- Fill [the template](./metric-definition-template.md). A candidate without a worked example and a limitations section is not ready for discussion.
- The admissions test in section 4 is the first question asked of any candidate.
- Editor decides after discussion. Leadership ratifies. Disagreement is written into the issue so it is not rehashed monthly.

## 11. Open questions on this front matter

- **Challenge outcomes: v1 counts as recorded.** The architecture defines a three-valued decision (allow, deny, challenge), but deny-by-default engines never emit the third value; a step-up records as deny then allow. v1 counts outcomes as recorded, and the denial ratio entry states the engine-model comparability limit. Challenge-aware counting is parked until challenge is commonly emitted.
- **Whether decisions produced at token issuance**, as opposed to at the point of capability exercise, belong in the denominator of decision-count metrics. Both moments may be instrumented and observable, and counting both materially changes results where they are. Proposed v1 default, raised as a decision issue: the denominator counts exercise-time decisions only, and issuance-time decisions are reported as a separate count where instrumented.
- **What makes a policy version current**: commit, release, or the point the distribution system reports it published. Affects every propagation measure.

---

*Sections 4, 5 and 6 are proposals from the editor, not agreed positions. They are the first thing the sub-group should argue about, because everything written afterwards inherits them.*
