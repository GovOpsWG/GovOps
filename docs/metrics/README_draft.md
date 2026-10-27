# GovOps Metrics 

> Work in progress. This draft explores a revised metrics overview and document structure. It does not replace the [current Metrics README](README.md) or establish an approved metric lifecycle. Supporting documents are starter drafts for further discussion.

GovOps metrics help decision-makers understand risk and business impact, support accountability and compliance, and evaluate the benefits of governance. Grounded in evidence, they help identify where controls, operational improvements or investment are needed. They also make the value of governance more visible, including improvements in business operations and savings from compliance automation.

Building on the standards introduced in the overview, metrics connect runtime evidence structured according to the [GovOps TRACE Profile (GTP)](../standards/gtp/govops-trace-profile.md) with capability and business context from the [Authorization Capability Catalog (ACC)](../standards/acc/README.md). This allows measurements to be interpreted by capability, ownership, business area and risk.

Each metric explains what is measured, why it matters and which evidence supports the result. Where additional information is needed, such as spending data or cost estimates, the metric definition identifies those inputs.

This page brings together metrics at different stages of development and links to their definitions, discussions and development guidance.

## Governance Heat Map

The Governance Heat Map gives decision-makers a compact overview of where governance is meeting expectations and where attention, further evaluation or investment is needed. It presents a colour-coded assessment across the four GovOps layers: **Identity, Access, Observability and Governance**.

Each layer’s colour is supported by underlying metrics and evidence. These explain the assessment and help identify appropriate action. Metric-specific thresholds and their applicable context should be documented in each metric definition, following the [definition template](metric_development/definition_template.md).

### Proposed assessment method

The following approach is proposed for discussion:

1. Identify the required metrics for each layer and define the assessment scope and reporting period.
2. Assess each metric against its documented thresholds. Record missing or insufficient evidence explicitly.
3. Determine the layer’s colour using the rules below.

| Layer status | Proposed rule |
|---|---|
| **Red — review controls** | At least one required metric is red. Any evidence gaps remain visible alongside the assessment. |
| **Unassessed — insufficient evidence** | No required metric is red, but evidence is insufficient to assess one or more required metrics. |
| **Amber — evaluate** | All required metrics can be assessed, none is red, and at least one is amber. |
| **Green — within agreed criteria** | All required metrics can be assessed and are green. |

This approach keeps a concerning result visible and prevents missing evidence from producing a green assessment.

### Illustrative example

| Observability | Governance |
| :---: | :---: |
| 🟩🟩🟩<br>🟩🟩🟩<br>🟩🟩🟩<br>🟩🟩🟩 | &nbsp;<br>🟧🟧🟧<br>🟧🟧🟧<br>🟧🟧🟧 |
| **Access** | **Identity** |
| &nbsp;<br>&nbsp;<br>🟥🟥🟥<br>🟥🟥🟥 | 🟩🟩🟩<br>🟩🟩🟩<br>🟩🟩🟩<br>🟩🟩🟩 |

*Illustrative only. Colours and bar counts do not represent measured results or agreed thresholds. Unassessed layers would be shown in grey.*

## Approved Metrics

No approved definitions are listed in this draft. Approved metrics have a recorded working-group approval decision and a definition in [approved_metrics](approved_metrics/README.md).

## Proposed Metrics

No definitions have been placed in this stage in this draft. Proposed metrics have a documented definition under review in [proposed_metrics](proposed_metrics/README.md).

## Pre-proposed Metrics

Ideas begin in [GitHub Discussions](https://github.com/GovOpsWG/GovOps/discussions), where participants explore the benefit, definition, available evidence and open questions. Under this proposed workflow, a discussion title containing “Proposed Metric” does not by itself establish promotion to the Proposed stage.

### Percentage Asymmetric Credentials (PAC)

The share of invocations authenticated asymmetrically among invocations with a known authentication method. It helps assess adoption of authentication methods that support accountability. Unknown methods are reported separately. The result does not establish whether private keys are protected by hardware.

[PAC discussion #34](https://github.com/GovOpsWG/GovOps/discussions/34)

### Autonomy Dividend (AD)

Estimated money saved by automating compliance work, including internal and audit resources. It can inform investment decisions about compliance automation. The baseline, estimation method and treatment of remaining operating costs still need definition.

[AD discussion #37](https://github.com/GovOpsWG/GovOps/discussions/37)

### Governed Spend Coverage (GSC)

The share of total AI token spend attributable to managed capability use through runtime TRACE evidence. It can show how much spending can be connected to governed operations. Calculation requires an external total-spend source and an agreed definition of qualifying evidence.

[GSC discussion #36](https://github.com/GovOpsWG/GovOps/discussions/36)

### Mean Time to Update Policy (MTUP)

The time between a governance decision and its enforcement at the point of action. It can reveal how quickly an organization can put revised operating rules into practice. The start and end events need definition, with results separated by relevant application types.

[MTUP discussion #35](https://github.com/GovOpsWG/GovOps/discussions/35)

## Metric Development

The proposed workflow uses three stages:

- **Pre-proposed:** An idea is explored in [GitHub Discussions](https://github.com/GovOpsWG/GovOps/discussions). Participants discuss its purpose, potential benefit, possible calculation and available evidence.
- **Proposed:** The idea has been developed into a metric definition and added to the Proposed Metrics list for review.
- **Approved:** The working group has approved the definition. The metric moves to the Approved Metrics list, with a reference to the approval decision.

Two documents guide this process:

- [Definition template](metric_development/definition_template.md): what a metric proposal should describe, including its purpose, benefit, calculation, evidence and limitations.
- [Acceptance process and criteria](metric_development/acceptance_process_and_criteria.md): how proposals are reviewed, which criteria apply and how progression between stages is decided.

## Related Documentation

- [Authorization Capability Catalog (ACC)](../standards/acc/README.md): capability definitions and context.
- [GovOps TRACE Profile (GTP)](../standards/gtp/govops-trace-profile.md): runtime evidence and its interpretation.
- [Architecture](../architecture/README.md): the services and information flows supporting governance.
- [Governance policy](../../GOVERNANCE.md): working-group roles and approval process.
