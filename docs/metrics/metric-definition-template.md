# Metric definition template

Sixteen fields. The first seven carry the names used in the working group charter, in charter order, so the deliverable can be checked against what was promised at a glance. The rest are additions the metrics sub-group is proposing.

Copy this file to draft a new entry. Every field is required. If a field is genuinely empty, say why rather than deleting it. The front matter ([README](./README.md)) is stated once and never repeated here: framework-level scope limits, standing qualifiers, and required segmentation are inherited by every entry.

| # | Field | What goes in it |
|---|---|---|
| 1 | Name | Plain, names what is measured. No method in the name |
| 2 | Purpose | Written as the question a governor is asking, in their words |
| 3 | Definition | One or two sentences of prose. No formula here |
| 4 | Calculation | The formula, plus any statistical technique. Technique lives here and only here |
| 5 | Data required | Field and source, as a table |
| 6 | Segmentation | Required, then optional |
| 7 | Example | Worked end to end, with the reading a governor would draw |
| 8 | Limitations | Weaknesses in the number itself |
| 9 | Interpretation | What different readings mean, and which is the finding |
| 10 | Status | From the front matter's status table |
| 11 | Governance activity | Risk management, accountability, or observability, per the architecture's definition of governance |
| 12 | Instrumentation level required | Computable from any decision log / needs capability ID / needs policy store version on every decision |
| 13 | What it does not support | Conclusions people will draw past the number, and should not |
| 14 | Gaming | How it moves without anything improving, and the check that catches it |
| 15 | Qualifiers | Anything beyond the standing four in the front matter |
| 16 | Open questions | Unresolved, named rather than smoothed over |

**On field 5.** Capability IDs on decision records are opaque SHA-256 digests (ACC design §6.2). Reports join the ID back to the catalogue for title, action, resource and classifiers. Raw IDs never appear in published output; readable forms such as `transfer:funds` are display values, not record values.

**On field 12.** Instrumentation level is the field that decides whether a reader can compute the metric at all, and it grades the set. It is also how the document stays honest about the charter's PDP-neutrality commitment. Capability identifier and policy store version are not standard fields in general-purpose authorization APIs today. The architecture specifies them as the required minimum of the Runtime Authorization Context (`capability_id`, `decision`, `decision_id`, `policy_store_id`, `policy_store_version`), so inside a conformant GovOps deployment the data exists by definition. Outside one, a metric that needs these fields is asking for a profile of the decision record, and should say so rather than implying the data is already there.

---

## Blank entry skeleton

```markdown
# <Metric name>

## Name

## Status

## Purpose

## Governance activity

## Definition

## Calculation

## Data required

| Field | Source |
|---|---|
|  |  |

## Segmentation

## Worked example

## Interpretation guidance

## What it does not support

## Limitations

## Instrumentation level required

## Gaming

## Qualifiers that travel with the result

## Open questions
```

The worked entry that sets the bar is [denial-ratio-trend.md](./denial-ratio-trend.md).
