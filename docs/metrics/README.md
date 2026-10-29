# GovOps Metrics

**Status:** Draft for sub-group comment

GovOps metrics help decision-makers understand the current state of the four GovOps Layers: Identity, Access, Governance and Observability. 
Grounded in evidence, they help identify where controls, operational improvements or investment are needed. They also make the value of GovOps visible, including improvements in business operations and savings from compliance automation.

Metrics are derived from runtime Evidence structured according to the [GovOps TRACE Profile (GTP)](../standards/gtp/govops-trace-profile.md). Because
Evidence joins runtime data with Capabilities defined in the [Authorization Capability Catalog (ACC)](../standards/acc/README.md), metrics can inform Governors about risk, business impact, and other business categories.

This section describes for each metric what is measured, why it matters and which evidence supports the result. The definition also identifies where additional information are needed, such as spending data or cost estimates.

This page brings together metrics at different stages of development and links their definitions, discussions and development guidance.

## Governance Heat Map

The Governance Heat Map gives Governors a compact, colour-coded assessment of which GovOps layers: **Identity, Access, Observability and Governance** are meeting expectations, and where further attention, evaluation or investment is needed. Each layer’s colour is supported by underlying metrics and evidence. These explain the assessment and help identify appropriate action. Metric-specific thresholds and their applicable context are documented in each metric definition, following the [definition template](metric_development/definition_template.md).

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

Pre-proposed metrics are grouped below by the GovOps layer they measure: Identity, Access, Observability, and Governance.

### Identity Metrics

#### Percentage Asymmetric Credentials (PAC)

The share of invocations authenticated asymmetrically among invocations with a known authentication method. It helps assess adoption of authentication methods that support accountability. Unknown methods are reported separately. The result does not establish whether private keys are protected by hardware.

[PAC discussion #34](https://github.com/GovOpsWG/GovOps/discussions/34)

### Access Metrics

#### Mean Time to Update Policy (MTUP)

The time between a governance decision and its enforcement at the point of action. It can reveal how quickly an organization can put revised operating rules into practice. The start and end events need definition, with results separated by relevant application types.

[MTUP discussion #35](https://github.com/GovOpsWG/GovOps/discussions/35)

### Observability Metrics

#### Governed Spend Coverage (GSC)

The share of total AI token spend attributable to managed capability use through runtime TRACE evidence. It can show how much spending can be connected to governed operations. Calculation requires an external total-spend source and an agreed definition of qualifying evidence.

[GSC discussion #36](https://github.com/GovOpsWG/GovOps/discussions/36)

#### TRACE Chain Completeness (TCC)

The share of observed operations with correlated TRACE evidence for every required stage — authorization, invocation, and observed effect. It can show how much of the runtime is actually covered by verifiable evidence, rather than assumed from policy alone. Which stages are "required" for a given capability, and how partial chains should be counted, still need definition.

No GitHub discussion yet. [Propose one](https://github.com/GovOpsWG/GovOps/discussions).

### Governance Metrics

#### Autonomy Dividend (AD)

Estimated money saved by automating compliance work, including internal and audit resources. It can inform investment decisions about compliance automation. The baseline, estimation method and treatment of remaining operating costs still need definition.

[AD discussion #37](https://github.com/GovOpsWG/GovOps/discussions/37)

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
- [GovOps Dashboard](../architecture/governance/govops-dashboard.md): the service that calculates, visualizes, and reports these metrics.
- [Governance policy](../../GOVERNANCE.md): working-group roles and approval process.
