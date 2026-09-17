# Point-in-Time Compliance

Most compliance programs today are episodic: an annual audit, a quarterly access review, a
point-in-time control assessment. Between those checkpoints, authorization configurations,
capability grants, and policy versions can drift substantially, and nothing forces that drift to
surface before the next scheduled review. Two things follow from this:

- **The evidence gathered is a snapshot, not a trend.** An auditor sees the state of the system on
  the day of the review, not whether risk has been improving or worsening in the intervening months.
- **Assembling the snapshot is manual.** Because authorization logs, catalog data, and control
  mappings live in separate systems, preparing for an audit is typically a reconstruction project —
  someone has to manually correlate what was allowed against what should have been allowed.

GovOps's premise is that compliance evidence should be a **continuous byproduct** of normal
operation rather than a periodic reconstruction effort. Because every runtime decision already
carries a `capability_id`, and every capability already maps through Gemara to OSCAL control
representations, the same data used to
operate the system day-to-day is the data an audit needs — there is no separate evidence-gathering
exercise to perform. This also enables **metrics that are measured as change over time**
rather than single-point assessments, so
that drift between reviews becomes visible as a trend line instead of being discovered only at the
next audit.
