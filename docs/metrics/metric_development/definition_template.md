# Metric Definition Template 

**Name:** [Metric name and abbreviation]

**Owner and version:** [Name / version]

**Status:** [Development stage under the agreed process]

**References:** [Discussion, supporting sources and any recorded approval]

## 1. Purpose and benefit

- **Question:** The question the metric answers for a governance decision-maker.
- **Expected benefit:** The organizational benefit the metric helps assess, and the expected contribution of governance. Examples include growth, responsible autonomy, continuity of legitimate work, accountability, risk reduction or compliance.
- **Decision supported:** The decision or action the result can inform, and who is responsible for it.

## 2. Definition and calculation

- **Definition:** A short description of what is measured.
- **Calculation:** The formula, unit and counting unit, such as decisions, invocations, completed operations or spending. For ratios, the numerator and denominator are explicit.
- **Time basis:** Reporting period, timestamp used and, when reporting change, the comparison period or baseline.
- **Counting rules:** Treatment of exclusions, duplicates, retries and unknown or missing values. A zero denominator is reported as not calculable, rather than as zero percent.

## 3. Evidence

Each input is traceable to a record or another identified source. Producer-record fields, collector-derived values and external inputs or estimates are distinguished, consistent with the [GovOps TRACE Profile](../../trace/govops-trace-profile.md).

| Input or field | Source and derivation | Use in the calculation |
| --- | --- | --- |
| [Exact field or input] | [Record type or source, relevant version and any derivation] | [Role in the result] |

The definition identifies how inputs are linked, what evidence checks are needed and which required inputs are unavailable. Assumptions used for estimates are explicit.

## 4. Capability and business context

- **Scope:** The capabilities, systems, population or business operations covered.
- **Capability mapping:** Where applicable, how evidence is linked to the [ACC](../../acc/README.md), including the mapping version. A broader metric explains its level of analysis.
- **Breakdowns:** The comparisons needed for interpretation, such as capability, business unit, risk tier or actor type. Unknown or unmapped cases remain visible.

## 5. Interpretation and thresholds

- **Meaning and action:** What different results indicate and what response they may justify. Whether the metric measures the stated benefit directly or is an indicator of it.
- **Thresholds:** Any target or colour boundary, its applicable context, rationale and who agrees it. Where thresholds are not established or not applicable, that is stated.
- **Evidence sufficiency:** When a result can be assessed and when it remains unassessed. Missing evidence does not imply a positive result.

An observed change alone does not establish that GovOps caused a business benefit. Any heat-map use identifies the relevant layer; aggregation across metrics follows the [proposed heat-map assessment method](../README.md#proposed-assessment-method).

See the [draft acceptance process and criteria](acceptance_process_and_criteria.md) or return to the [metrics overview](../README.md).
