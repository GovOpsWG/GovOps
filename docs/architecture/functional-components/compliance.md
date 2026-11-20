# Continuous Compliance

Compliance frameworks describe **controls**. Operational systems expose **capabilities**. The Authorization Capability Catalog connects those two worlds. Abstract-control mappings, Trestle/OSCAL projection, and the Gemara export path are detailed in the ACC design (§8–9) and walked through in the compliance mapping use case (UC-02). Both are listed in the [ACC documents](../../standards/acc/README.md).

Traditional compliance programs frequently operate separately from runtime authorization. Controls are documented in one system, policies are implemented somewhere else, and evidence is collected manually during an audit. GovOps closes this gap by treating the ACC as the common reference point between what the enterprise can do and what it is obligated to govern.

## From capabilities to controls (Gemara)

[Gemara](https://gemara.openssf.org) supplies the common data model. A `#CapabilityCatalog` defines the capabilities. A separate `#MappingDocument` records how a capability relates to one or more **abstract control objectives** (a canonical control layer), not directly to every framework's control numbers.

A mapping can assert that a capability such as *Approve Loan* supports an access-control objective, while preserving rationale, applicability, confidence, and mapping strength. That mapping is an explicit **governance assertion** — not proof that the control is already satisfied. Proof comes later from policy versions, authorization decisions, and runtime evidence.

Gemara also links controls to capabilities through threats. A Gemara **policy** imports control catalogs. A control references the threats it mitigates, and a threat references the capabilities it applies to. The [GovOps Compliance Plumbing](https://github.com/GovOpsWG/GovOps/wiki/DRAFT-Article:-GovOps-Compliance-Plumbing) draft walks through this path with an example.

```text
Policy ──imports──> Control catalog ──control.threats──> Threat
                                                           │
                                                  threat.capabilities
                                                           v
                                                      Capability
```

Both paths end at the same ACC capability, so runtime evidence joins either one through `capability_id`.

Gemara's published tooling includes CUE schemas for validating YAML or JSON and the [`go-gemara`](https://github.com/gemaraproj/go-gemara) Go SDK for integrating Gemara structures into automated tools.

## Export path (Gemara → OSCAL → Trestle)

The export path is concrete:

1. **Load and validate.** An exporter loads the ACC as a Gemara `#CapabilityCatalog` and its accompanying `#MappingDocument`, and verifies that every source capability and target control exists.
2. **Translate to OSCAL.** Each Gemara relationship becomes an entry in an OSCAL **Mapping Collection**. Confidence and strength become OSCAL confidence, coverage, or properties; the mapping rationale is retained as remarks.
3. **Manage with Trestle.** [OSCAL Compass compliance-trestle](https://github.com/oscal-compass/compliance-trestle) reads the transformed data and constructs versioned OSCAL classes. Trestle's recommended transformer pattern separates file handling from data processing: read the native input, transform it into the OSCAL object hierarchy, validate it against the OSCAL schema, and write the resulting JSON.

Gemara defines the semantics. OSCAL defines the interchange format. Trestle manages the resulting compliance artifacts. Outputs can include a Mapping Collection, Component Definition, profile, or System Security Plan. Implementation statements and evidence can then be attached to the mapped controls and reused across NIST, SOC 2, ISO 27001, PCI DSS, or internal frameworks.

**Define the capability once. Map it once to a canonical control layer. Collect evidence once. Then use OSCAL and Trestle to reuse that governance work across many compliance programs.**

## Continuous evidence chain

Compliance joins the same stack shown in [Architecture at a Glance](../README.md#architecture-at-a-glance): frameworks project through Trestle/OSCAL onto abstract controls, `#MappingDocument` links those controls to ACC capabilities, and policy → decision → runtime evidence flows down the Runtime Plane and back up via `capability_id`.

An auditor should eventually identify the capabilities associated with a control, which policies govern them, which policy versions were active, and evidence of how those capabilities were exercised — without treating the mapping itself as certification. That turns compliance from a periodic documentation exercise into another pass through the GovOps loop.

## From evidence to control results

The mapping says which controls apply to a capability. It does not say whether those controls held at runtime. That needs a second check.

| Check | When | Question |
|---|---|---|
| **Design time** | When the catalog or a policy release changes | Does the published policy meet the mapped control expectations? This is `govops drift` Type C in the ACC design. |
| **Run time** | Continuously, for each execution | Did the execution produce the evidence each mapped control needs, and did that evidence pass? |

Both are needed. A policy can look right and still be bypassed. Evidence can be complete for a policy that was wrong.

### Control evidence requirements

For each abstract control, a **control evidence requirement** states what proves the control for one execution of a mapped capability: which records must exist, which checks they must pass, which enrichment must run, and the minimum attribution quality.

```yaml
control_id: govops.ac-03.access-enforcement
evidence_requirement:
  version: 1
  required_records:
    - event_kind: AUTHORIZATION_DECISION
      producer_role: pdp
    - event_kind: CAPABILITY_INVOKED
      producer_role: enforcement-point
      parent: { relationship_type: authorized, to: AUTHORIZATION_DECISION }
  required_checks:
    - signature_valid          # verification result on each record
    - no_chain_flags           # no coverage_gap, chain_link_failure, or equivocation flag
    - request_digest_match     # the invocation ran the request that was decided
  pass_when: [decision.outcome == ALLOW]
  min_attribution_quality: correlated
```

Requirements are written once per control, not per capability. They name producer roles, not products, so any producer in that role can satisfy them. They are versioned, and every result records the version it was checked against.

### How an assessment runs

GovOps does not need its own assessment engine. A Gemara policy already holds **assessment plans** in its `adherence` section. Each plan names the requirement it tests and the evaluator that runs it. The control evidence requirement above is the GovOps-specific content such a plan points to.

```yaml
# Illustrative excerpt of a Gemara policy, not a complete document.
adherence:
  assessment-plans:
    - id: assess-access-enforcement
      requirement-id: govops.ac-03.access-enforcement
      frequency: on-demand
      evaluation-methods:
        - type: Behavioral
          executor:
            id: govops-trace-provider
            type: Software
```

[complyctl](https://github.com/complytime/complyctl) runs the assessment. It reads the Gemara policy and calls evaluators through provider plugins. A GovOps TRACE provider, not yet built, would read verified records from the collectors and apply the requirement. The executable checks can be written for an evaluator such as [Ampel](https://github.com/policylabs/ampel), which tests signed attestations against policy checks.

```text
Gemara policy (assessment plan)
  -> complyctl
  -> GovOps TRACE provider (verified records from the collectors)
  -> evaluator checks (for example Ampel)
  -> one result per execution and control
  -> complyctl report (OSCAL assessment results)
```

This keeps each piece in its own layer. Gemara says what must be assessed. The checks say how evidence is tested. TRACE records are the evidence.

### Evidence profile per capability

A capability's **evidence profile** is the union of the requirements of every control mapped to it. It is derived from the mapping, never written by hand. It builds on the catalog's `expected_producer_roles` ([GTP §13.6](../../standards/gtp/govops-trace-profile.md#136-target-resource-classification-and-the-capability-catalog)) by adding which event kinds, checks, and enrichment each role's records need. The [collectors](./evidence/collectors.md) read it to decide three things:

1. **Completeness.** Did every required producer role send its record for this execution? Executions are grouped by `(execution_authority, trace_execution_id)`. A producer chain shows that a producer did not hide records it signed. Only the profile says which records should exist.
2. **Enrichment.** Which enrichment to run. Data the identity provider will purge (token claims, session, authentication method) is captured at ingest for every record. A small baseline (`capability_id`, `actor_context`, org unit) is always derived, since every metric needs it. Everything else is derived when the profile requires it, which is safe because reference data is versioned.
3. **Integrity level.** Chaining and minimum attribution quality can scale with the capability's `risk-tier`.

Records with no resolved `capability_id` still get capture and baseline enrichment. Unknown capabilities need the most context, not the least.

### Results

Each execution of a capability gets one result per mapped control:

| Result | Meaning |
|---|---|
| `satisfied` | All required records present, all checks passed, the pass condition holds. |
| `not_satisfied` | The evidence is complete and the pass condition does not hold. |
| `insufficient_evidence` | A required record is missing, a check failed, or attribution is below the minimum. |
| `not_applicable` | The control does not apply to this execution. |

`insufficient_evidence` is never counted as `satisfied`. Missing evidence is never green.

Results are published as OSCAL **assessment results**. Each observation points to the evidence records it used (`producer_id`, `record_id`), so an assessor can verify them independently. Findings roll up per control and period. Failed or insufficient results open POA&M items owned by the capability's `accountable-owner`. The same results can be written as Gemara evaluation logs.

A metric can show where to look. Only the signed records prove a finding.

### Open questions

1. How control evidence requirements are split between the Gemara assessment plan and the evaluator's checks.
2. The expression language for `pass_when`, or whether the evaluator's own check language replaces it.
3. Whether low-risk tiers may be sampled rather than evaluated per execution.
4. How long to wait for late records before `insufficient_evidence` is final.
5. How the execution id and parent record id travel between producers. Completeness is checked per execution, so it depends on this.
6. How the four results map to Gemara evaluation-log results and OSCAL finding status.
