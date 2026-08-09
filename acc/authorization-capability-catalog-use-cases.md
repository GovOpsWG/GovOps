# Authorization Capability Catalog: Use Cases

**Status:** Draft for discussion

**Companion design:** [Authorization Capability Catalog: Design](./authorization-capability-catalog-design.md)

---

## Table of Contents

1. [Persona Summary](#persona-summary)
2. [UC-01: Capability Catalog Authoring](#uc-01-capability-catalog-authoring)
3. [UC-02: Compliance Mapping and Audit](#uc-02-compliance-mapping-and-audit)
4. [UC-03: Policy Drift Detection](#uc-03-policy-drift-detection)
5. [UC-04: Continuous Governance in CI/CD](#uc-04-continuous-governance-in-cicd)
6. [UC-05: Automated Fraud Flagging (Fraud System)](#uc-05-automated-fraud-flagging-fraud-system)
7. [Summary Table](#summary-table)

---

## Persona Summary

| Persona | Role | Use Cases (primary) | Use Cases (secondary) |
|---|---|---|---|
| Platform Security Engineer | Deploys PDPs and maintains the GovOps repository | UC-01, UC-03, UC-04 | — |
| Compliance Auditor | OSCAL-aligned controls; NIST / ISO / SOC 2 via Trestle | UC-02 | — |
| Lending Officer | Loan approval policy and lending capability stewardship | — | UC-02, UC-04 |
| Fraud System | Non-human fraud detection service (software agent) | UC-05 | — |
| Policy Engine Operator | PDP policy lifecycle | — | UC-03, UC-04, UC-05 |

**Catalog state by use case** (avoid mixing excerpts from different points in time):

| Use case | `GovOps-ACC` state |
|---|---|
| UC-01, UC-02, UC-05 | Four base capabilities only |
| UC-03 | Evolved catalog: adds `d3800d62f8114ea70388e41c0f87780fa8215c8b4955f4d7d19b7e5c8fe6a3a2`, `6d38075d1a6662c34a0b53ccca6b1aa19f1fd460c44e1777d1fb9469e7416dcb`; deprecates `18420fcf746d2f060e1f24f96bcb820ceca600cad09e1d8a7c5a405db190d1a7`; adds `71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835` during resolution |
| UC-04 | Assumes post-UC-03 catalog including `71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835` |

---

## UC-01: Capability Catalog Authoring

### Context

The enterprise must have a well-formed capability catalog before mappings or drift checks can run. This use case shows how a Platform Security
Engineer builds `GovOps-ACC.yaml` from scratch: defining canonical vocabulary in the
`#Lexicon`, authoring `#AuthorizationCapability` entries (design §6.2),
and validating the result with `govops lint`. Getting the catalog
right at this stage is the foundation for every downstream workflow.

### Actors

- **Primary:** Platform Security Engineer (Acme Bank — payments, lending, and fraud surfaces)
- **Secondary:** None

### Preconditions

- The `govops/` repository directory exists and is version-controlled.
- The GovOps toolchain (`govops lint`) is installed and on the `PATH`.
- The engineer has identified the set of (action, resource) pairs Acme exposes across
  payments, lending, and fraud services.
- No `GovOps-ACC.yaml` or `lexicon.yaml` exists yet in the repository.

### Step-by-Step Workflow

**Step 1 — Define canonical vocabulary in the `#Lexicon`.**

The engineer creates `govops/lexicon.yaml`. Every action verb and resource type name
that will appear in capability ids MUST be defined here before being referenced in
`GovOps-ACC.yaml`. This is the single source of truth for canonical terms; `govops lint`
will reject any capability whose `action` or `resource` does not resolve to a lexicon
term id.

```yaml
# govops/lexicon.yaml
title: GovOps Action and Resource Lexicon
metadata:
  id: lex.govops.actions-resources
  type: Lexicon
  gemara-version: "0.x"
  description: Canonical verbs and resource type names for Acme authorization capabilities.
  author: { id: acme-platform-security, name: Acme Platform Security, type: Software Assisted }
terms:
  - id: action.read
    title: read
    definition: Retrieve a resource by identifier without modifying it.
    synonyms: [get, fetch, view]
  - id: action.transfer
    title: transfer
    definition: Move value or ownership from a source resource to a target resource.
    synonyms: [send, move, remit]
  - id: action.approve
    title: approve
    definition: Grant final authorization for a lending decision on a loan application.
    synonyms: [authorize, sign-off]
  - id: action.flag
    title: flag
    definition: Mark a transaction for fraud review or investigation.
    synonyms: [mark-suspicious, alert]
  - id: resource.invoice
    title: Invoice
    definition: A demand for payment issued by the payments service.
  - id: resource.bank-account
    title: BankAccount
    definition: A demand-deposit account at a financial institution.
  - id: resource.loan
    title: Loan
    definition: A loan application or facility in the lending domain.
  - id: resource.transaction
    title: Transaction
    definition: A payment or money-movement event subject to fraud monitoring.
  # Terms below are added when catalog evolves in UC-03 (not used in initial lint pass)
  - id: action.batch-transfer
    title: batch-transfer
    definition: Transfer funds via the batch payments rail (distinct from interactive transfer).
  - id: action.escalate
    title: escalate
    definition: Escalate a flagged transaction to a senior fraud queue.
  - id: resource.invoice-summary
    title: InvoiceSummary
    definition: Invoice header fields only (reduced PII vs. full Invoice).
  - id: resource.payment-order
    title: PaymentOrder
    definition: A payment order awaiting settlement in the payments rail.
```

**Step 2 — Author the capability catalog using the Authorization Capability Profile.**

The engineer creates `govops/GovOps-ACC.yaml` using the Authorization Capability Profile
(design §6.2): typed `action` and `resource` fields, optional `risk-tier`,
`data-sensitivity`, `business-impact`, `geography`, and `org-unit`. The catalog validates as both `#AuthorizationCapabilityCatalog` and
base `#CapabilityCatalog` — no Gemara core schema change. Each entry describes what the
system exposes, not who is entitled to use it. Capability `id` is the SHA-256 digest of
`<group-slug>|<action-slug>|<resource-slug>`.

```yaml
# govops/GovOps-ACC.yaml
title: Acme Authorization Capability Catalog
metadata:
  id: cat.acme.ec
  type: CapabilityCatalog
  gemara-version: "0.x"
  version: "2026.1"
  date: "2026-05-01T00:00:00Z"
  description: Authorization surface capabilities for Acme Bank's core banking platform.
  author:
    id: acme-platform-security
    name: Acme Platform Security
    type: Software Assisted
  lexicon:
    reference-id: lex.govops.actions-resources
groups:
  - id: g.payments
    title: Payments
    description: Capabilities related to funds movement and payment processing.
  - id: g.lending
    title: Lending
    description: Capabilities related to loan origination and management.
  - id: g.fraud
    title: Fraud
    description: Capabilities related to fraud detection.
capabilities:
  - id: 18420fcf746d2f060e1f24f96bcb820ceca600cad09e1d8a7c5a405db190d1a7
    title: Read invoice
    group: g.payments
    action: read
    resource: invoice
    data-sensitivity: restricted
    risk-tier: medium
    description: The system exposes the ability to retrieve an existing invoice by id.

  - id: 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
    title: Transfer funds
    group: g.payments
    action: transfer
    resource: bank-account
    data-sensitivity: confidential
    risk-tier: critical
    business-impact: revenue-critical
    geography: global
    org-unit: payments-platform
    description: >
      The system exposes the ability to initiate funds transfers between bank accounts.
      Mapped controls require strong authentication evidence in PARC Context.

  - id: 3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd
    title: Approve loan
    group: g.lending
    action: approve
    resource: loan
    data-sensitivity: restricted
    risk-tier: critical
    description: >
      The system exposes the ability to approve a loan application for disbursement.
      Mapped controls require separation of duties (two distinct approvers).

  - id: ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2
    title: Flag transaction
    group: g.fraud
    action: flag
    resource: transaction
    data-sensitivity: internal
    risk-tier: high
    description: >
      The system exposes the ability to flag a payment transaction for fraud review.
      Typically invoked by the Acme Fraud System (software agent) and by analysts.
```

**Step 3 — Validate with `cue vet` and `govops lint` (passing case).**

```
$ cue vet govops/GovOps-ACC.yaml -d '#AuthorizationCapabilityCatalog'
$ cue vet govops/GovOps-ACC.yaml -d '#CapabilityCatalog'

$ govops lint govops/GovOps-ACC.yaml --lexicon govops/lexicon.yaml

govops lint v0.9.0
Checking: govops/GovOps-ACC.yaml

  ✓ Profile: #AuthorizationCapabilityCatalog
  ✓ Lexicon resolved: action.read       → 18420fcf746d2f060e1f24f96bcb820ceca600cad09e1d8a7c5a405db190d1a7
  ✓ Lexicon resolved: action.transfer   → 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
  ✓ Lexicon resolved: action.approve    → 3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd
  ✓ Lexicon resolved: action.flag       → ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2
  ✓ Lexicon resolved: resource.invoice  → 18420fcf746d2f060e1f24f96bcb820ceca600cad09e1d8a7c5a405db190d1a7
  ✓ Lexicon resolved: resource.bank-account → 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
  ✓ Lexicon resolved: resource.loan     → 3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd
  ✓ Lexicon resolved: resource.transaction → ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2
  ✓ Group membership: all capabilities reference defined groups
  ✓ risk-tier / data-sensitivity: all values within profile enums

4 capabilities validated. 0 errors. 0 warnings.
```

**Step 4 — Introduce a lexicon resolution failure and observe the lint error.**

The engineer temporarily adds a capability that references an action term not in the
lexicon (`settle` on `payment-order`) — id `00c467f0c7ba1fb43ec62a7b4c7d49ad0cca67fb93eba91114acc2fd1217647e`.

```yaml
  # Intentionally broken entry (not in final catalog)
  - id: 00c467f0c7ba1fb43ec62a7b4c7d49ad0cca67fb93eba91114acc2fd1217647e
    title: Settle payment order
    group: g.payments
    action: settle
    resource: payment-order
    risk-tier: high
```

Running `govops lint` surfaces the violation:

```
$ govops lint govops/GovOps-ACC.yaml --lexicon govops/lexicon.yaml

govops lint v0.9.0
Checking: govops/GovOps-ACC.yaml

  ✓ Lexicon resolved: action.read       → 18420fcf746d2f060e1f24f96bcb820ceca600cad09e1d8a7c5a405db190d1a7
  ✓ Lexicon resolved: action.transfer   → 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
  ✓ Lexicon resolved: action.approve    → 3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd
  ✓ Lexicon resolved: action.flag       → ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2
  ✗ Lexicon resolution FAILED: action 'settle' not found in lex.govops.actions-resources
      capability: 00c467f0c7ba1fb43ec62a7b4c7d49ad0cca67fb93eba91114acc2fd1217647e
      suggestion: Did you mean 'transfer'? Or add action.settle to lexicon.yaml.
  ✗ Lexicon resolution FAILED: resource 'payment-order' not found in lex.govops.actions-resources
      capability: 00c467f0c7ba1fb43ec62a7b4c7d49ad0cca67fb93eba91114acc2fd1217647e
      suggestion: Add resource.payment-order to lexicon.yaml.

5 capabilities checked. 2 errors. 0 warnings.
EXIT 1
```

**Resolution:** The engineer adds `action.settle` and `resource.payment-order` to
`lexicon.yaml`, then re-runs `govops lint` to confirm the error is resolved. The
broken entry is removed from this use case's final catalog (it was only a lint exercise).

**Step 5 — Verify profile classifications drive downstream use.**

The engineer confirms that `risk-tier`, `data-sensitivity`, `business-impact`, `geography`, and `org-unit` will scope compliance mapping queries (UC-02) and drift-related governance workflows (UC-03). `govops lint` checks that enum fields are within the Authorization Capability Profile and that optional string classifiers are well-formed.

### Artifacts Produced or Modified

| Artifact | Gemara type | Path | Notes |
|---|---|---|---|
| Lexicon | `#Lexicon` | `govops/lexicon.yaml` | Created; defines canonical action verbs and resource type names |
| Capability catalog | `#AuthorizationCapabilityCatalog` | `govops/GovOps-ACC.yaml` | Created; 4 capabilities across 3 groups |

### Correctness Properties Demonstrated

- **P1 (Capability ID Format):** All four capability ids (`18420fcf746d2f060e1f24f96bcb820ceca600cad09e1d8a7c5a405db190d1a7`,
  `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3`, `3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd`,
  `ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2`) match `^[0-9a-f]{64}$` and equal SHA-256 of their `<group-slug>|<action-slug>|<resource-slug>` preimage.
- **P3 (Lint Output Consistency):** The `govops lint` passing output references only
  the four capability ids present in the catalog excerpt above; the failing output
  references only `00c467f0c7ba1fb43ec62a7b4c7d49ad0cca67fb93eba91114acc2fd1217647e`, which appears in the broken entry
  shown in the same step.
- **P4 (Section Structure):** This section contains all seven required subsections.

### Cross-References

| Item | Reference |
|---|---|
| Authorization Capability Profile | Design §6.2 |
| `#AuthorizationCapability` / `#AuthorizationCapabilityCatalog` | Design §6.2 |
| `#Lexicon` artifact | Design §6.4 |
| `#Group` | Design §6.3 |
| `govops lint` tool | Design §10 |
| Gemara artifact: `#CapabilityCatalog` | ADR-0019 |
| Gemara artifact: `#Lexicon` | ADR-0021 |


## UC-02: Compliance Mapping and Audit

### Context

Auditors need to trace from framework controls (NIST 800-53, ISO 27001, SOC 2) to **capability ids** in `GovOps-ACC`, without embedding framework semantics in the capability catalog. GovOps maps **first** to OSCAL-aligned abstract control objectives (`GovOps-ACO`); **Trestle** projects those controls to NIST, ISO, and SOC 2 via OSCAL catalogs, profiles, and mapping collections.

### Actors

- **Primary:** Compliance Auditor (Acme Bank)
- **Secondary:** Lending Officer

### Preconditions

- UC-01 complete: `GovOps-ACC.yaml` passes `govops lint`.
- `govops/GovOps-ACO.yaml` defines abstract control objectives (OSCAL-aligned `#ControlCatalog`).
- `govops/mappings/acme-capabilities-to-controls.yaml` exists (capability → abstract controls).
- A Trestle workspace under `govops/exports/oscal/` imports NIST SP 800-53 Rev. 5 and maintains a mapping collection from `GovOps-ACO` to the NIST catalog.

### Step-by-Step Workflow

**Step 1 — Review primary `#MappingDocument` (capabilities → abstract controls).**

```yaml
# govops/mappings/acme-capabilities-to-controls.yaml (excerpt)
metadata:
  id: map.acme.acc.aco
  type: MappingDocument
source-reference:
  reference-id: acc
  entry-type: Capability
target-reference:
  reference-id: aco
  entry-type: Control
mappings:
  - id: m.transfer.access-enforcement
    source: 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
    relationship: implements
    targets:
      - entry-id: govops.ac-03.access-enforcement
        rationale: Critical transfer capability; access enforcement required at the PDP.
      - entry-id: govops.ia-02.strong-authentication
        rationale: Strong authentication evidence required in PARC Context for transfers.
  - id: m.lending.separation-of-duties
    source: 3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd
    relationship: implements
    targets:
      - entry-id: govops.ac-05.separation-of-duties
        rationale: Separation of duties via two distinct approvers in PARC Context.
```

**Step 2 — Query at the GovOps layer (abstract controls).**

Manual review or catalog query: `ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2` (`risk-tier: high`) has no mapping to `govops.ac-03.access-enforcement` while `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3` and `3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd` do. The **Lending Officer** adds a mapping for the fraud capability (e.g., to `govops.au-06.audit-monitoring`) or documents risk acceptance before audit close. Framework-specific NIST `AC-3` labels are **not** edited on capability rows.

**Step 3 — Framework projection with Trestle.**

The auditor resolves `govops.ac-03.access-enforcement` to NIST SP 800-53 controls through the Trestle workspace (OSCAL mapping collection), not through a direct Gemara capability → NIST mapping:

```bash
# Illustrative: NIST catalog already imported via trestle import
cd govops/exports/oscal/
trestle validate -a catalogs
# Mapping collection links GovOps-ACO control ids to NIST SP 800-53 rev5 catalog entries
```

**Step 4 — Evidence trace for a capability (two-hop).**

For access enforcement on `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3`:

```text
Capability 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
  → MappingDocument m.transfer.access-enforcement
  → govops.ac-03.access-enforcement (GovOps-ACO)
  → (Trestle) OSCAL mapping collection → NIST SP 800-53 AC-3, IA-2(1)
  → risk-tier: critical; mapped control govops.ia-02 (context.acr == urn:mfa)
  → (optional) published Cedar policy verified by govops drift (UC-03)
```

The auditor relies on **profile fields**, the primary Gemara mapping, and Trestle-resolved framework views—not ad hoc spreadsheets or parallel pillar scorecards.

### Artifacts Produced or Modified

| Artifact | Gemara type | Path |
|---|---|---|
| Abstract control catalog | `#ControlCatalog` | `govops/GovOps-ACO.yaml` |
| Primary compliance mapping | `#MappingDocument` | `govops/mappings/acme-capabilities-to-controls.yaml` |
| Framework projection | OSCAL (Trestle workspace) | `govops/exports/oscal/` (NIST catalog, mapping collection) |

### Correctness Properties Demonstrated

- **P1:** All capability ids in mappings are valid SHA-256 capability ids per design §6.2.
- **P2:** Primary mappings target abstract `govops.*` control ids, not NIST literals in the ACC core.
- **P4:** All required subsections present.

### Cross-References

| Item | Reference |
|---|---|
| Compliance architecture | Design §9 |
| `#MappingDocument` (primary hop) | Design §9.3 |
| Worked example | Design §8.2–8.3 |
| Trestle/OSCAL interoperability | Design §9.1, §14 |

---

## UC-03: Policy Drift Detection

### Context

The capability catalog expresses governance intent; deployed policy expresses
enforcement reality. Drift between the two is inevitable in a fast-moving engineering
organization. This use case shows how `govops drift` detects three categories of
divergence across two policy engines (Cedar and OPA/Rego), how the engineer decides
how to resolve each finding, and how drift detection integrates into CI/CD to prevent
ungoverned policy changes from reaching production.

### Actors

- **Primary:** Platform Security Engineer (Acme Bank, payments, lending, and fraud domains)
- **Secondary:** Policy Engine Operator (owns Cedar and OPA deployments)

### Preconditions

- Catalog has evolved beyond UC-01: includes `6d38075d1a6662c34a0b53ccca6b1aa19f1fd460c44e1777d1fb9469e7416dcb`, `d3800d62f8114ea70388e41c0f87780fa8215c8b4955f4d7d19b7e5c8fe6a3a2`, and deprecated `18420fcf746d2f060e1f24f96bcb820ceca600cad09e1d8a7c5a405db190d1a7`.
- `govops/GovOps-ACC.yaml` passes `govops lint`.
- Deployed policy artifacts exist:
  - `govops/policies/payments-cedar.cedar` (Cedar, payments service)
  - `govops/policies/fraud-detection-opa.rego` (OPA/Rego, fraud detection service)
- The `govops drift` Cedar and OPA analyzer plug-ins are installed.

### Step-by-Step Workflow

**Step 1 — Run `govops drift` against both policy engines.**

```
$ govops drift \
    --catalog govops/GovOps-ACC.yaml \
    --policy govops/policies/payments-cedar.cedar --engine cedar \
    --policy govops/policies/fraud-detection-opa.rego --engine opa

govops drift v0.9.0

Drift Report — Acme Bank (2026-05-28)
──────────────────────────────────────

Cedar engine (govops/policies/payments-cedar.cedar):
  [Type A] Catalog entry with no policy rule:
    ⚠ 6d38075d1a6662c34a0b53ccca6b1aa19f1fd460c44e1777d1fb9469e7416dcb
        Capability in GovOps-ACC.yaml (state: Active)
        No Cedar policy rule found for action="read", resource.type="InvoiceSummary"
        Recommendation: Add policy rule or mark capability as design-time only.

  [Type C] Mapped control expectation diverges from deployed policy:
    ⚠ 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
        Mapped control govops.ia-02.strong-authentication: context.acr == 'urn:mfa'
        Cedar policy rule: permits transfer for service accounts with context.service-account == true
          WITHOUT requiring context.acr == 'urn:mfa'
        Recommendation: Update Cedar policy to enforce MFA for service accounts,
          or document a control exception.

OPA engine (govops/policies/fraud-detection-opa.rego):
  [Type B] Policy rule with no catalog entry:
    ⚠ action: "escalate", resource: "Transaction"
        Found in OPA rule: allow { input.action == "escalate"; input.resource.type == "Transaction" }
        No corresponding capability in GovOps-ACC.yaml
        Suggested id: 71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835
        Recommendation: Add to catalog or remove from policy.

  No Type A or Type C findings for OPA engine.

Unified Drift Summary:
  Type A (catalog entry, no policy rule):  1 finding  [Cedar]
  Type B (policy rule, no catalog entry):  1 finding  [OPA]
  Type C (mapped control expectation diverges): 1 finding  [Cedar]
  Total: 3 findings across 2 engines.
```

**Step 2 — Resolve the three drift scenarios.**

**Scenario (a) — Type A: `6d38075d1a6662c34a0b53ccca6b1aa19f1fd460c44e1777d1fb9469e7416dcb` in catalog, no Cedar rule.**

The capability was added to the catalog but the Cedar policy has not
yet been updated to enforce it. The engineer has three options:

| Option | Action | When to use |
|---|---|---|
| Update policy | Add Cedar rule for `read` on `InvoiceSummary` | Capability is live and should be enforced |
| Update catalog | Remove or defer the capability until policy ships | Capability is planned but not yet deployed |
| Accept exception | Document in `govops/exceptions/drift-exceptions.yaml` | Intentional gap with documented rationale |

Decision: the payments team confirms `6d38075d1a6662c34a0b53ccca6b1aa19f1fd460c44e1777d1fb9469e7416dcb` is live. The
Policy Engine Operator adds the Cedar rule. After the policy update, re-running
`govops drift` shows no Type A finding for this capability.

**Scenario (b) — Type B: `71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835` in OPA policy, not in catalog.**

The fraud team added an escalation capability to the OPA policy without going through
the catalog authoring process. The engineer adds `71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835` to `GovOps-ACC.yaml`:

```yaml
  - id: 71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835
    title: Escalate transaction
    group: g.fraud
    action: escalate
    resource: transaction
    data-sensitivity: internal
    risk-tier: high
    description: >
      The system exposes the ability to escalate a flagged transaction to a senior
      fraud analyst queue (follow-on to flag).
```

After adding the entry, the engineer runs `govops lint` to confirm `action.escalate` and `resource.transaction` resolve from the lexicon.

After adding the entry and running `govops lint` to validate, re-running `govops drift`
shows no Type B finding for this capability.

**Scenario (c) — Type C: `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3` mapped control expectation diverges.**

The Cedar policy has a service-account bypass that permits transfers without MFA. The drift report confirms the divergence: mapped control `govops.ia-02.strong-authentication` requires MFA, but deployed policy does not enforce it for service accounts.

Decision: the engineer removes the service-account bypass from the Cedar policy. After the policy update, re-running `govops drift` shows no Type C finding.

**Step 3 — CI/CD integration: drift flagged before production.**

The drift check is integrated into the CI/CD pipeline as a gate (UC-04). When the
Policy Engine Operator submits a pull request that introduces the service-account
bypass, the pipeline runs `govops drift` and fails the build:

```
CI/CD Pipeline — policy-change-pr-447
Step 3: govops drift
  ✗ DRIFT DETECTED — build failed

  [Type C] Mapped control expectation diverges:
    0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
    Mapped control govops.ia-02.strong-authentication: context.acr == 'urn:mfa'
    Proposed Cedar policy: permits transfer for service accounts without context.acr == 'urn:mfa'

  Policy change introduces drift. Resolve before merging.
  EXIT 1
```

The pull request is blocked from merging until the drift is resolved.

**Step 4 — Multi-engine drift report composition.**

The unified drift summary at the end of the `govops drift` output composes per-engine
sub-reports into a single view. Each finding is tagged with its engine so the
responsible Policy Engine Operator can be notified:

```
Unified Drift Summary (after resolutions):
  Cedar engine:  0 findings
  OPA engine:    0 findings
  Total: 0 findings. Catalog and deployed policy are aligned.
```

The per-engine sub-reports are also available individually for engine-specific
remediation workflows.

### Artifacts Produced or Modified

| Artifact | Gemara type | Path | Notes |
|---|---|---|---|
| Updated capability catalog | `#AuthorizationCapabilityCatalog` | `govops/GovOps-ACC.yaml` | Modified: added `71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835` |
| Drift exception log | Convention | `govops/exceptions/drift-exceptions.yaml` | Created if exceptions are accepted |

### Correctness Properties Demonstrated

- **P1 (Capability ID Format):** All capability ids in the drift report (`6d38075d1a6662c34a0b53ccca6b1aa19f1fd460c44e1777d1fb9469e7416dcb`,
  `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3`, `71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835`) match `^[0-9a-f]{64}$`.
  The suggested id `71a199b73006b3fb9574be4374722a3df00bf691aec5faff7152ffb8327ea835` also matches.
- **P4 (Mapped control consistency):** The Type C drift finding for
  `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3` correctly identifies the divergence between
  mapped control `govops.ia-02.strong-authentication` (`context.acr == 'urn:mfa'`) and the
  deployed Cedar policy (which permits without MFA for service accounts).
- **P3 (Lint and Drift Output Consistency):** The `govops drift` output references only
  capability ids that appear in the catalog or are suggested as new entries — no
  phantom ids.

### Cross-References

| Item | Reference |
|---|---|
| `govops drift` tool | Design §10 |
| Authorization Capability Profile | Design §6.2 |
| Type C drift and policy expectations | Design §7.1 |
| CI/CD integration | Design §11 (Phase 4) |
| Transfer capability | UC-01 `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3` |


## UC-04: Continuous Governance in CI/CD

### Context

Point-in-time catalog reviews are insufficient. This use case wires **`govops lint`** and **`govops drift`** into CI/CD so catalog and policy stay aligned on every change.

### Actors

- **Primary:** Platform Security Engineer
- **Secondary:** Policy Engine Operator, Lending Officer

### Preconditions

- UC-01 through UC-03 complete.
- CI system can run GovOps CLI tools.

### Step-by-Step Workflow

**Step 1 — Pipeline configuration.**

```yaml
# govops/.govops-ci.yaml
pipeline:
  steps:
    - name: lint
      command: govops lint
      args: [--catalog, govops/GovOps-ACC.yaml, --lexicon, govops/lexicon.yaml]
    - name: drift
      command: govops drift
      args: [--catalog, govops/GovOps-ACC.yaml,
             --policy, govops/policies/payments-cedar.cedar, --engine, cedar,
             --policy, govops/policies/fraud-detection-opa.rego, --engine, opa]
gates:
  lint:
    fail-on-errors: true
  drift:
    fail-on-any-drift: true
```

**Step 2 — Policy pull request fails on drift.**

A Cedar change introduces a service-account bypass on `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3` that violates mapped control `govops.ia-02.strong-authentication`:

```
Step: govops drift
  ✗ Type C: 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3 — context.acr == urn:mfa not enforced for service accounts
  EXIT 1 — merge blocked
```

**Step 3 — Passing pipeline after fix.**

Engineer removes bypass, re-runs pipeline: lint PASS, drift PASS. `GovOps-ACC.yaml` and `policies/` are versioned together so governance state is reproducible at any commit.

### Artifacts Produced or Modified

| Artifact | Path | Notes |
|---|---|---|
| CI config | `govops/.govops-ci.yaml` | Lint + drift gates |

### Correctness Properties Demonstrated

- **P1:** Pipeline output references only canonical capability ids.
- **P4:** Required subsections present.

### Cross-References

| Item | Reference |
|---|---|
| Toolchain | Design §10 |
| Adoption Phase 4 | Design §11 |

---

## UC-05: Automated Fraud Flagging (Fraud System)

### Context

Not every **PARC Principal** is a human. Acme's **Fraud System** is an automated fraud-detection service that evaluates payment transactions and requests **`ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2`** when model scores exceed a threshold. The catalog records the **(action, resource)** surface the system exposes — not entitlements. Policy, drift checks, and audits refer to the same capability id whether a human analyst or the Fraud System invokes the PDP.

### Actors

- **Primary:** Fraud System (Acme Bank fraud detection platform — non-human **software-agent** principal)
- **Secondary:** Platform Security Engineer (owns catalog and `fraud-detection-opa.rego`)
- **Secondary:** Policy Engine Operator (maintains OPA policy for automated flags)

### Preconditions

- UC-01 complete: `ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2` is defined in `GovOps-ACC.yaml`.
- `govops/policies/fraud-detection-opa.rego` is deployed (published policy release for the fraud PDP).
- The Fraud System holds a workload identity (e.g., SPIFFE ID or service account) recognized by the PDP.

### Step-by-Step Workflow

**Step 1 — Catalog entry describes the exposed surface.**

From `GovOps-ACC.yaml` (see UC-01):

```yaml
  - id: ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2
    title: Flag transaction
    group: g.fraud
    action: flag
    resource: transaction
    data-sensitivity: internal
    risk-tier: high
    description: >
      The system exposes the ability to flag a payment transaction for fraud review.
      Typically invoked by the Acme Fraud System (software agent) and by analysts.
```

Human fraud analysts may also flag transactions interactively; the **same capability id** applies. The catalog models the **operation** the system exposes (`flag` on `transaction`), not who is entitled — entitlement decisions remain in published policy.

**Step 2 — Fraud System sends a PARC-shaped authorization request.**

When the payments pipeline emits a high-risk transaction event, the Fraud System calls the PDP:

```json
{
  "principal": {
    "type": "software-agent",
    "id": "svc-acme-fraud-detection",
    "name": "Acme Fraud System"
  },
  "action": "flag",
  "resource": {
    "type": "Transaction",
    "id": "txn-9f2a8c1d"
  },
  "context": {
    "fraud": {
      "risk-score": 0.91,
      "model-version": "fraud-v3.2",
      "source": "batch-scoring"
    }
  }
}
```

The **Action** and **Resource** type align with `ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2` in `GovOps-ACC`. The **Principal** is explicitly non-human. **Context** carries the model score the policy expects.

**Step 3 — PDP decision and alignment with catalog.**

The OPA policy permits the request when `context.fraud.risk-score >= 0.85` and the principal is the registered Fraud System service account. A denied request (score below threshold) does not exercise the capability — no flag is recorded.

**Step 4 — `govops drift` confirms policy covers the catalog entry.**

```
$ govops drift \
    --catalog govops/GovOps-ACC.yaml \
    --policy govops/policies/fraud-detection-opa.rego --engine opa

govops drift v0.9.0

OPA engine (fraud-detection-opa.rego):
  No Type A/B drift for ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2 —
  policy includes flag on Transaction (enforcement rules for software-agent principals
  and risk-score thresholds live in the policy release, not in the capability profile).
```

If Type A or Type B drift appears for this capability, the Platform Security Engineer updates catalog or policy before the Fraud System runs in production.

**Step 5 — Contrast with human-initiated flag on the same capability.**

A human analyst flagging the same transaction uses the identical capability id and PARC shape, but **Principal** is `interactive-subject` and **Context** may include analyst id and case reference instead of batch model metadata. Governance and compliance trace both flows to **`ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2`**, not to separate permission strings.

### Artifacts Produced or Modified

| Artifact | Gemara type | Path | Notes |
|---|---|---|---|
| Capability catalog | `#AuthorizationCapabilityCatalog` | `govops/GovOps-ACC.yaml` | `ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2` — flag on transaction |
| Deployed policy | OPA/Rego | `govops/policies/fraud-detection-opa.rego` | Evaluates Fraud System PARC requests (entitlements) |

### Correctness Properties Demonstrated

- **P1:** `ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2` is a valid SHA-256 capability id per design §6.2.
- **P2:** PARC **Action** / **Resource** align with the capability's `action` / `resource`; principal and context rules are enforced in published policy, not in the profile.
- **P4:** All required subsections present.

### Cross-References

| Item | Reference |
|---|---|
| Authorization Capability Profile | Design §6.2 |
| PARC request shape | Design §2.2, §3 |
| `ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2` | Design §8.1 |
| `govops drift` | Design §10 |
| Capability vs. entitlement | Design §3 |

---

## Summary Table

| Use Case | Primary Persona | Toolchain | Design §§ |
|---|---|---|---|
| UC-01: Capability Catalog Authoring | Platform Security Engineer | `govops lint` | §6, §10 |
| UC-02: Compliance Mapping and Audit | Compliance Auditor | Trestle (OSCAL projection) | §8–9 |
| UC-03: Policy Drift Detection | Platform Security Engineer | `govops drift` | §7.1, §10 |
| UC-04: Continuous Governance in CI/CD | Platform Security Engineer | `govops lint`, `govops drift` | §10–11 |
| UC-05: Automated Fraud Flagging | Fraud System (non-human) | `govops drift` | §6.2, §7.1, §10 |

---

*Companion to [Authorization Capability Catalog: Design](./authorization-capability-catalog-design.md). Tool outputs in each section are consistent with the catalog excerpt and **catalog state** row for that use case (design §8).*
