# Acceptance Process and Criteria — Draft

> Draft proposal for developing, evaluating and accepting metrics. The existing [contribution guidance](../../../CONTRIBUTING.md) and [governance policy](../../../GOVERNANCE.md) still apply.

## 1. Development process

The proposed lifecycle is **Pre-proposed → Proposed → Approved**.

The proposer develops the metric. The Metrics Editor coordinates discussion and evaluation. These responsibilities may be reassigned or delegated, with the responsible people identified in the discussion or review.

### Pre-proposed: explore value and feasibility

An idea starts in [GitHub Discussions](https://github.com/GovOpsWG/GovOps/discussions). Participants explore the governance question, intended benefit, available evidence and a possible calculation, identifying missing inputs and assumptions.

Progression to Proposed requires a named proposer and a plausible calculation with identified inputs. Practical feasibility still needs validation.

### Proposed: define and evaluate

The proposer uses the [definition template](definition_template.md) and submits a document under [Proposed Metrics](../proposed_metrics/README.md) through a pull request. The overview and definition link to the originating discussion.

The Metrics Editor coordinates evaluation and revisions. Essential unresolved questions about value, calculation or applicability keep the metric in Proposed.

### Approved: record and publish the decision

The working group considers the evaluation against the acceptance criteria. Under the governance policy, the Maintainer determines and records consensus; the Editor documents the decision.

Approval records the version, owner, evaluation reference and applicable scope or conditions. The definition moves to [Approved Metrics](../approved_metrics/README.md); the overview and links are updated.

Merging a document does not by itself approve a metric. Approval applies to its stated version and scope.

## 2. Evaluation process

The feasibility exploration in Pre-proposed is followed by these steps in Proposed:

1. **Plan.** Agree the definition version, test scope, sources, periods and expected behaviour. Identify the evaluator and a reviewer other than the proposer.
2. **Check evidence.** Confirm field availability, meaning and record linkage. Distinguish producer records, derived values, external inputs and estimates. Record gaps and instrumentation needs.
3. **Test.** Calculate results from real logs or other appropriate source data, including missing values, duplicates and relevant boundary cases. Synthetic examples alone do not establish practical feasibility.
4. **Repeat and assess reuse.** Re-run the same inputs and settings, then another sample or period. Check whether another contributor can apply the method using the documented mappings, parameters and assumptions.
5. **Record and review.** Link an evaluation record stating the data or dataset version, method, settings, results, limitations, reviewers and open questions. Recommend approval, revision and retesting, or further investigation.

Evaluation informs the working-group decision; it does not grant approval.

## 3. Acceptance criteria

The evaluation addresses each criterion within the metric's declared scope.

| Criterion | Basis for acceptance |
| --- | --- |
| **Purpose and benefit** | A clear governance question, organizational benefit and supported decision or action. Benefits may concern enablement, risk, accountability or compliance. Directly measured benefits are distinguished from indicators. |
| **Computable** | Required inputs and derivations are identified, and the calculation works on actual source data. External inputs, estimates and evidence gaps are explicit. |
| **Repeatable** | The same input, definition version and settings produce the same result within any documented tolerance. The method can be run again over another sample or reporting period. |
| **Reusable** | The method can be applied within its stated scope using documented inputs, mappings and parameters. It is not dependent on unexplained choices in a single test dataset; untested contexts remain identified. |
| **Interpretable** | Results have a clear meaning, limitations and possible response. Thresholds have a stated context and rationale where applicable. Missing evidence cannot be treated as a positive result. |

Approval requires at least one documented practical validation and a review by someone other than the proposer. These findings support the working-group decision; they do not establish that GovOps caused the expected business benefit.

After approval, the owner reviews continued usefulness and evidence quality at an agreed interval or when assumptions or sources change. Findings are recorded; substantive revisions undergo evaluation before approval of a new version.

Before adoption, this proposal needs alignment with the current contribution guidance, including its issue-first workflow and observation-window requirements.

Return to the [draft metrics overview](../README_draft.md).
