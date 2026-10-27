# Authorization Capability Catalog: Design

**Status:** Draft for discussion

**Companion use cases:** [Authorization Capability Catalog: Use Cases](./authorization-capability-catalog-use-cases.md)

---

## 1. Abstract

This document proposes a design for representing **authorization capabilities** — discrete **(action, resource)** pairs describing *what a system exposes* — as catalog entries in the [Gemara](https://gemara.openssf.org) GRC engineering model, and for organizing a **GovOps repository** of Gemara artifacts around them.

Four ideas combine to form the design:

1. **Capabilities are properties of the system, not entitlements.** A capability records that the system exposes an operation (e.g., `transfer` on `bank-account`). Who may perform that operation is runtime policy, outside the catalog.
2. **An Authorization Capability Profile** adds domain structure to Gemara's stable `#Capability` via a CUE module that imports Gemara and unifies additional fields (`action`, `resource`, and optional governance classifiers). No Gemara core schema change is required; catalogs validate as both `#AuthorizationCapabilityCatalog` and `#CapabilityCatalog`.
3. **A GovOps repository centered on** `GovOps-ACC`**.** One profiled `#CapabilityCatalog` inventories the authorization surface; a `#Lexicon` defines canonical terms; `#MappingDocument` files link capabilities to an OSCAL-aligned control layer first (not directly to NIST, ISO, or SOC 2 numbers). Policy binaries are authored and published separately.
4. **Catalog quality, then catalog–policy alignment.** `govops lint` is the primary catalog validator (profile, ids, lexicon); `govops drift` then compares catalog **(action, resource)** entries to **published PARC-shaped policy releases** so the surface stays enumerable and aligned with enforcement.

Gemara already provides the substrate: `#CapabilityCatalog` (ADR-0019), `#ControlCatalog`, mapping primitives with `Capability` as an `EntryType`, `#Lexicon`, and evaluation/enforcement/audit logs. GovOps contributes the **Authorization Capability Profile** module and repository conventions.

---



## 2. Background and motivation



### 2.1 What enterprises need to govern

GovOps requires a shared, declarative inventory of **(action, resource) capabilities** — that is:

1. **Finitely enumerable** so it can be reviewed, measured, and analyzed.
2. **Prioritizable by risk–reward.** Governors must focus on the most *likely* failures that have the biggest *business impact*. The catalog therefore carries both a likelihood-oriented classifier (`risk-tier`) and an impact-oriented classifier (`business-impact`); without the latter, risk–reward cannot be computed and remediation queues devolve into undifferentiated checklists.
3. **Engine neutral** compatible with any AuthZEN-conformant / PARC-shaped PDP (e.g. Cedar, Cedarling, OpenFGA).
4. **Composable** with threats, controls, risks, and policies so a capability becomes a traceable unit of governance linking exposed operations, associated risks, and measurable enforcement outcomes.
5. **GRC-interoperable** via a Trestle/OSCAL compliance layer: Gemara owns capability semantics; [OSCAL Compass compliance-trestle](https://github.com/oscal-compass/compliance-trestle) owns normalization, validation, and projection to specific frameworks (NIST SP 800-53, ISO 27001, SOC 2, FedRAMP, PCI, and internal accreditations).



### 2.2 Why Gemara

Gemara already supplies:

- A layered model (Vectors → Threats → Controls → Policies → Evaluation/Enforcement/Audit logs) that maps cleanly onto authorization governance.
- A first-class `#CapabilityCatalog` artifact (ADR-0019) intended specifically so that capabilities can be referenced uniformly by `id` from threats, controls, and other catalogs, instead of duplicated inline.
- Mapping primitives (`#ArtifactMapping`, `#EntryMapping`, `#MultiEntryMapping`, `#MappingDocument`) that already include `Capability` in `#EntryType`, so capabilities can be the source or target of mappings to/from controls and external frameworks.
- A `#Lexicon` artifact for controlled vocabulary, useful for action verbs and resource type names.
- A `#Catalog` base that supports `extends` and `imports` for vendor-specific or industry overlays.

In short, Gemara already has the right *shape*. What is missing is a **Capability Profile** that adds well-typed **(action, resource)** fields for the authorization domain — without changing Gemara's core schema and without conflating the catalog with the PARC request envelope or with entitlement grants.

---



## 3. Definitions


| Term                         | Meaning                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Capability**               | *What a system can do* — a feature, component, or exposed operation. In Gemara, capabilities are neutral properties of the system: they flow into threats, controls, and assessments. They are **not** users, grants, or runtime policy decisions.                                                                    |
| **Authorization capability** | A capability that describes an authorization surface entry as an **(action, resource)** pair: the system exposes that operation. Example: "the system exposes `transfer` on `bank-account`." Contrast with an **entitlement** ("Alice may transfer funds"), which is runtime policy and out of scope for the catalog. |
| **Capability Profile**       | A CUE module that imports Gemara and refines `#Capability` (and `#CapabilityCatalog`) via unification. Profiles add domain-specific fields; catalogs remain valid against base `#CapabilityCatalog`.                                                                                                                  |
| **Principal**                | The actor supplied in a **PARC authorization request** when the PDP is asked whether an operation is permitted. Policy may use principal attributes; the principal does not define the capability.                                                                                                                    |
| **Action**                   | The verb half of an authorization capability (e.g., `read`, `create`, `delete`, `transfer`, `assume`).                                                                                                                                                                                                                |
| **Resource**                 | The noun half of an authorization capability: the resource **type** the action applies to (e.g., `invoice`, `bank-account`, `loan`). The catalog records the *type*; runtime requests identify specific instances.                                                                                                    |
| **Context**                  | Other facts provided to a **PARC request**.                                                                                                                                                                                                                                                                           |
| **PARC**                     | Principal, Action, Resource, Context — the **authorization request** shape at the PDP boundary; **not** synonymous with "capability."                                                                                                                                                                                 |
| **Capability id**            | Opaque lowercase hexadecimal SHA-256 digest of `` <group-slug>\|<action-slug>\|<resource-slug> `` (see §6.2). Does not embed group, action, or resource strings in the catalog id field.                                                                                                                              |
| **OSCAL-aligned control**    | An abstract control objective in a `#ControlCatalog` (`GovOps-ACO`) suitable for import into a Trestle workspace. Primary mapping target for capabilities; framework-specific control numbers are derived downstream.                                                                                                 |


---



## 4. Design goals and non-goals



### Goals

1. **Reuse, do not replace.** Build on Gemara's existing `#CapabilityCatalog`, `#ControlCatalog`, and mapping primitives. No fork of Gemara.
2. **Profile via unification.** Domain fields live in an external CUE profile module that imports Gemara; YAML validates as both the profile catalog type and base `#CapabilityCatalog`.
3. **Engine-neutral capabilities and PARC-shaped requests.** Capability rows are **(action, resource)** surface entries. Interoperability with PDPs uses **PARC** as the **request** envelope at evaluation time. The design MUST NOT privilege any specific policy engine, policy store strategy, or authorization API.
4. **Compliance-interoperable.** Each capability maps to OSCAL-aligned control objectives in Gemara first; framework-specific controls are **downstream renderings** produced by Trestle/OSCAL — not hard-coded into the capability model.
5. **Reviewable and prioritizable.** The catalog is the canonical input to access reviews, compliance queries, and drift detection. Entries SHOULD carry `risk-tier` (likelihood) and `business-impact` (consequence) so governors can order work by risk–reward.



### Some Non-goals

- Defining a new policy language, evaluation API, or policy store specification.
- Publishing policy artifacts in the GovOps repository.
- Modeling individual permission grants (entitlements) to specific principals.
- Capturing resource instance hierarchies or organizational topology.
- Changing Gemara's core `#Capability` schema (profiles are additive modules).

---



## 5. Repository layout

A GovOps repository is a directory of **Gemara artifacts** that describe the enterprise authorization surface and its compliance mappings. Policy enforcement rules live **outside** this tree as versioned binaries (see below). A representative tree:

```text
govops/
  lexicon.yaml                      # Lexicon
  metadata.yaml                     # Shared metadata fragments (optional)
  GovOps-ACC.yaml                   # #AuthorizationCapabilityCatalog (profile + base #CapabilityCatalog)
  GovOps-ACO.yaml                    # optional: #ControlCatalog (OSCAL-aligned abstract controls)
  mappings/                         # primary: Capability → abstract controls (#MappingDocument)
  exports/oscal/                    # optional: Trestle workspace input / govops OSCAL emit
```

Mapping each top-level item to a Gemara artifact type:


| Path              | Gemara artifact                                               | Purpose                                                                                                    |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `lexicon.yaml`    | `#Lexicon`                                                    | Canonical action verbs and resource type names.                                                            |
| `metadata.yaml`   | shared `#Metadata` includes                                   | Author, version, lexicon reference, applicability groups.                                                  |
| `GovOps-ACC.yaml` | `#AuthorizationCapabilityCatalog` (also `#CapabilityCatalog`) | Enterprise authorization surface.                                                                          |
| `GovOps-ACO.yaml` | `#ControlCatalog` (optional)                                  | OSCAL-aligned abstract control objectives (enterprise or GovOps reference).                                |
| `mappings/`       | `#MappingDocument`                                            | **Primary:** capability → abstract control mappings. Framework projections are downstream (Trestle/OSCAL). |
| `exports/oscal/`  | convention                                                    | Artifacts for Trestle import/transform (catalog fragments, mapping-collection inputs).                     |


Notes:

- Nothing in the layout is normative. Organizations MAY add other Gemara catalogs (`#ControlCatalog`, `#ThreatCatalog`, `#EvaluationLog`) using the standard Gemara model; those are **not** part of the ACC core layout.

---



## 6. The Authorization Capability Catalog (`GovOps-ACC`)



### 6.1 Where it sits in Gemara

A `#CapabilityCatalog` is **not** layered. It is **domain content** that crosses Gemara's seven layers:

```text
Layer 1   Vectors, Guidance
Layer 2   Threats, Controls
Layer 3   Risks, Policies
Layer 4   Sensitive activities (e.g., grant access, deploy policy)
Layer 5   Evaluation logs
Layer 6   Enforcement logs
Layer 7   Audit logs

  ^   Capability Catalog (cross-cutting domain content)
      - referenced by Threats via #Threat.capabilities
      - referenced by Controls via #MappingDocument
      - referenced by Policies via imports
      - measured by Evaluation/Enforcement logs (coverage, drift, proof)
```



### 6.2 The Authorization Capability Profile

GovOps adopts a **Capability Profiles** pattern: a profile is a CUE module that imports Gemara and refines `#Capability` via unification. No changes to the Gemara schema are required. Sibling profiles (Kubernetes, Linux, Cloud, …) follow the same pattern for other domains; this document defines only the **authorization** profile.

#### Profile module

Published as a GovOps (or community) CUE module, independently versioned from Gemara:

```cue
package authorization

import "github.com/gemaraproj/gemara@v1:gemara"

// AuthorizationCapability describes an authorization surface entry:
// what the system exposes as (action, resource) — not who is entitled to use it.
#AuthorizationCapability: {
	gemara.#Capability
	action:              string
	resource:            string
	"risk-tier"?:        "critical" | "high" | "medium" | "low"
	"data-sensitivity"?: "public" | "internal" | "confidential" | "restricted"
	"business-impact"?:  string
	geography?:          string
	"org-unit"?:         string
}

#AuthorizationCapabilityCatalog: {
	gemara.#CapabilityCatalog
	capabilities: [#AuthorizationCapability, ...#AuthorizationCapability]
}
```


| Field | Required | Role |
|---|---|---|
| `action`, `resource` | yes (profile) | **Capability identity** for the authorization surface — the (verb, resource-type) pair the system exposes. |
| `risk-tier` | no (SHOULD) | Likelihood-oriented classifier (`critical` \| `high` \| `medium` \| `low`). Answers: how probable is misuse or failure of this surface? |
| `business-impact` | no (SHOULD) | Impact-oriented classifier (organization-defined string, e.g. `revenue-critical`, `customer-trust`, `regulatory-exposure`). Answers: how bad is it if this surface fails? **Required to compute risk–reward** with `risk-tier`. |
| `data-sensitivity` | no | Data classification exposed by the action (`public` \| `internal` \| `confidential` \| `restricted`). |
| `geography`, `org-unit` | no | Optional enterprise scoping: geographic applicability and owning organization unit. |
| `id`, `title`, `description`, `group` | per `#Capability` | Base Gemara fields. GovOps additionally constrains `id` (below). |


Validation:

```sh
# Profile-aware
cue vet GovOps-ACC.yaml -d '#AuthorizationCapabilityCatalog'

# Still a valid base catalog
cue vet GovOps-ACC.yaml -d '#CapabilityCatalog'
```



#### GovOps capability id convention

In addition to the profile fields, GovOps tooling requires:

- `id` MUST be the lowercase hexadecimal SHA-256 digest of the UTF-8 string `<group-slug>|<action-slug>|<resource-slug>` (e.g., `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3`). Slugs are lowercase identifiers.
- **Group slug** is derived from the entry's `#Group` `id` by removing an optional `g.` prefix (`g.payments` → `payments`).
- `action` and `resource` on the entry MUST match the slugs used in the id preimage.

The **normative** fields that define what is being governed are `action` **and** `resource` only. Classifiers (`risk-tier`, `business-impact`, `data-sensitivity`, `geography`, `org-unit`) scope the entry for governance; they do not redefine the capability. Entitlements, PARC Context rules, and engine-specific symbols belong in published policy (and optionally in mapped controls), not in the profile schema.

#### Risk–reward prioritization (`risk-tier` × `business-impact`)

GovOps risk management prioritizes the **most likely** events with the **biggest business impact**. On each authorization capability:

| Axis | Profile field | Role in prioritization |
|---|---|---|
| Likelihood | `risk-tier` | How likely is unauthorized or failed use of this surface? |
| Impact | `business-impact` | How severe is the consequence for the enterprise (revenue, trust, safety, regulatory exposure)? |

**Risk–reward** for a capability is the joint signal of those two axes. A high-likelihood, low-impact surface and a low-likelihood, catastrophic-impact surface are not interchangeable; neither axis alone is enough. Catalogs that omit `business-impact` can sort by `risk-tier` but **cannot** compute risk–reward or justify why one critical capability is remediated before another.

Organizations SHOULD set both fields on every runtime capability, and MUST treat pairs such as (`risk-tier: critical`, `business-impact: revenue-critical`) as first-class inputs to review campaigns, drift triage, and control-mapping backlogs. `geography` and `org-unit` further scope *whose* backlog; they do not replace impact.

### 6.3 Catalog organization with `#Group`

`#Group` (post ADR-0020) is the single grouping primitive — a way to **group** related (action, resource) pairs in the catalog:

- `groups`: one entry per logical group (e.g., `payments`, `iam`, `governance`, `release-engineering`).
- Capability `id` values are opaque SHA-256 digests; the entry's `group` field references the Gemara group `id` (e.g., `g.payments`), and **group slug** for hashing is derived from that reference.
- Each `#AuthorizationCapability.group` references a group `id`.

Profile fields `risk-tier`, `business-impact`, `data-sensitivity`, `geography`, and `org-unit` are the primary classification and scoping dimensions. Organizations MAY also declare matching `metadata.applicability-groups` for tooling queries (`risk-tier` and `data-sensitivity` values MUST align with the profile enums; `business-impact`, `geography`, and `org-unit` use organization-defined strings). These dimensions drive GovOps reviews: *"Which high-likelihood, high-impact capabilities in a given geography or org unit lack control mappings or show drift?"*.

### 6.4 Anchoring vocabulary with `#Lexicon`

Each `action` and `resource` SHOULD resolve to a term in the repository's `#Lexicon` so that synonyms collapse to a single canonical id:

```yaml
title: GovOps Action and Resource Lexicon
metadata:
  id: lex.govops.actions-resources
  type: Lexicon
  gemara-version: "0.x"
  description: Canonical verbs and resource type names for authorization capabilities.
  author: { id: govops-wg, name: GovOps WG, type: Software Assisted }
terms:
  - id: action.transfer
    title: transfer
    definition: Move value or ownership from a source resource to a target resource.
    synonyms: [send, move, remit]
  - id: resource.bank-account
    title: BankAccount
    definition: A demand-deposit account at a financial institution.
```

The `metadata.lexicon` field on the `#CapabilityCatalog` already points at this lexicon document. Tooling can lint the catalog by checking that all action/resource strings resolve to lexicon term ids.

### 6.5 Relationship to Gemara's existing `#Resource`

Gemara already defines `#Resource` (in `entities.cue`) as a runtime entity that is the *target of an evaluation* — the thing an `#EvaluationLog`, `#EnforcementLog`, or `#AuditLog` is *about*. That is **not** the same as the **resource type** half of an **(action, resource)** capability row in the catalog.

The two stay separate:

- `#AuthorizationCapability.resource` is the **resource slug** half of the capability (e.g., `bank-account`), aligned with the lexicon term used in the capability id preimage.
- `#Resource` (entities) is a **runtime instance** being evaluated (e.g., the production payments service running v1.4.2).

A measurement record carries both: the `target` of an evaluation log is a `#Resource`; what was *evaluated about it* is the conformance of its policies to a set of `#AuthorizationCapability` entries (each keyed by **action + resource**).

### 6.6 Threats and risks over capabilities

Gemara's existing `#Threat.capabilities` field already accepts `#MultiEntryMapping`, so threats can target an authorization capability without any additional schema work:

```yaml
threats:
  - id: t.transfer.fraud
    title: Unauthorized funds transfer
    description: An attacker with stale credentials initiates fraudulent transfers.
    group: g.financial
    capabilities:
      - reference-id: ec
        entries:
          - reference-id: 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
```

Layer-3 `#Risk` entries and `#Policy` documents reference threats and controls in turn, so a single line of an authorization capability flows through the entire seven-layer model.

---



## 7. Optional Gemara layering and policy expectations

The **Authorization Capability Catalog** (`GovOps-ACC`) is the Phase 1 core. Organizations MAY also maintain standard Gemara `#ControlCatalog`, `#ThreatCatalog`, `#Risk`, and `#Policy` artifacts that reference capability ids. That full layered model is valuable but **not required** for ACC conformance.

### 7.1 Policy and context expectations

Enforcement rules (MFA evidence in PARC Context, approver counts, engine-specific symbols) live in **published policy releases**, not in `#AuthorizationCapability` fields. Organizations SHOULD capture governance intent by mapping high-risk capabilities to abstract controls (e.g., strong authentication, separation of duties) via `#MappingDocument`. `govops drift` Type-C checks compare those mapped control expectations (and optional free-text notes in `description`) against a supplied policy release — without extending the Authorization Capability Profile.

---



## 8. Worked example

A minimal **Acme Bank** scenario aligned with the companion use cases (§12): **author** the catalog (UC-01), **lint** it (UC-03), **map** capabilities to abstract controls (UC-02), then **drift**-check published Cedar policy releases (UC-04).

### 8.1 `GovOps-ACC.yaml` (excerpt)

Validates as `#AuthorizationCapabilityCatalog` and as `#CapabilityCatalog`. Each entry describes what the system exposes, not who is authorized to use it. Capability `id` values follow the GovOps SHA-256 convention (§6.2).

```yaml
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
    description: The system exposes the ability to retrieve an existing invoice by id.
    group: g.payments
    action: read
    resource: invoice
    data-sensitivity: restricted
    risk-tier: medium

  - id: 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
    title: Transfer funds
    description: >
      The system exposes the ability to initiate funds transfers between bank accounts.
      Mapped controls require strong authentication evidence in PARC Context.
    group: g.payments
    action: transfer
    resource: bank-account
    data-sensitivity: confidential
    risk-tier: critical
    business-impact: revenue-critical
    geography: global
    org-unit: payments-platform

  - id: 3c6e0df2c70f2ecdea45d9e413db49b8c5e94921eb34eb7eb2a6de3ea46919cd
    title: Approve loan
    description: >
      The system exposes the ability to approve a loan application for disbursement.
      Mapped controls require separation of duties (two distinct approvers).
    group: g.lending
    action: approve
    resource: loan
    data-sensitivity: restricted
    risk-tier: critical
    business-impact: regulatory-exposure

  - id: ec0e5e80cae8a6933dd1e0ad377b1c92f5c9fa8062d32e547ca52a0ea9ceffa2
    title: Flag transaction
    description: >
      The system exposes the ability to flag a payment transaction for fraud review.
      Typically invoked by the Acme Fraud System (software agent) and by analysts.
    group: g.fraud
    action: flag
    resource: transaction
    data-sensitivity: internal
    risk-tier: high
    business-impact: customer-trust
```



### 8.2 Primary mapping: capabilities to OSCAL-aligned controls (excerpt)

GovOps **does not** map capabilities directly to NIST control numbers in the ACC core. The first hop is always capability → abstract control objective (Gemara `#ControlCatalog` or equivalent), expressed in OSCAL-compatible terms for Trestle to consume.

```yaml
# mappings/acme-capabilities-to-controls.yaml
title: Acme Capabilities to OSCAL-aligned Controls
metadata:
  id: map.acme.acc.aco
  type: MappingDocument
  mapping-references:
    - id: acc
      title: Acme Authorization Capability Catalog
    - id: aco
      title: Acme OSCAL-aligned Control Objectives
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
```

A GovOps-native compliance query becomes: *"Which capabilities at* `risk-tier >= high` *and* `business-impact` *in {revenue-critical, regulatory-exposure} lack a mapping to* `govops.ac-03.access-enforcement`*?"* — answered from `GovOps-ACC` and this mapping document alone. That query is a risk–reward filter: likelihood × impact, then governance gap.

### 8.3 Framework projection via Trestle/OSCAL (illustrative)

**NIST SP 800-53 Rev. 5**, **ISO 27001**, **SOC 2**, and other accreditations are **downstream**. Trestle imports framework catalogs as OSCAL JSON/YAML, maintains mapping collections between catalogs, resolves profiles, and emits SSPs, assessment plans, and results. A capability traced to `govops.ac-03.access-enforcement` may project to NIST `AC-3` and `IA-2(1)` through an OSCAL mapping collection—without changing the capability id or GovOps semantics when NIST revises.

```text
GovOps-ACC (capabilities)
    │  #MappingDocument (Gemara)
    ▼
GovOps-ACO / abstract control catalog
    │  Trestle: validate, split/merge, transform
    ▼
OSCAL catalog · profile · mapping-collection · SSP · assessment-results
    │  framework-specific views
    ▼
NIST 800-53 · ISO 27001 · SOC 2 · FedRAMP · PCI · internal controls
```

Example audit trace for a transfer capability:

```text
Capability 0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3
  → MappingDocument m.transfer.access-enforcement
  → govops.ac-03.access-enforcement (GovOps-ACO)
  → (Trestle) OSCAL mapping collection → NIST SP 800-53 AC-3, IA-2(1)
  → (optional) govops lint (UC-03), then govops drift on published Cedar policy release (UC-04)
```



### 8.4 Lint check (illustrative)

Before mapping or drift work is trusted, `govops lint` validates the catalog against the Authorization Capability Profile and GovOps id convention (UC-03):

```bash
cue vet govops/GovOps-ACC.yaml -d '#AuthorizationCapabilityCatalog'
govops lint govops/GovOps-ACC.yaml --lexicon govops/lexicon.yaml
```

Lint rejects capability id / preimage mismatches, out-of-enum `risk-tier` or `data-sensitivity` values, missing required `action` / `resource` fields, unresolved lexicon terms, and ill-formed optional classifiers (`business-impact`, `geography`, `org-unit`).

### 8.5 Drift check (illustrative)

Policy for the payments service is published separately (e.g., `oci://registry.acme.example/authz/payments-policy:2026.1.4` with digest `sha256:…`). Drift is run against that release (and other PARC-shaped Cedar releases such as fraud), not against policy bytes stored as source of truth in the GovOps tree (UC-04):

```bash
govops drift \
  --catalog govops/GovOps-ACC.yaml \
  --policy oci://registry.acme.example/authz/payments-policy:2026.1.4 \
  --digest sha256:abc123… \
  --engine cedar
```

A Type-C finding on `0c451a4b7305a117ad7e4c874799c5982100823ef1b71db3490fffc35a63fef3` means the supplied policy release does not satisfy mapped control expectations for that capability (e.g., `govops.ia-02.strong-authentication` requiring `context.acr == 'urn:mfa'`) — the gap is expressed in **capability id** terms, not fields bolted onto the profile.

---



## 9. Compliance architecture: GovOps, Trestle/OSCAL, and frameworks

GovOps and Gemara own the **ontology of authorization capabilities and governance intent**. Trestle/OSCAL own **compliance translation and interoperability**. Specific standards are **projections**, not source-of-truth fields on capability rows.


| Layer                           | Owner                                        | Role                                                                                                             | Artifacts                                                                                                             |
| ------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Enterprise truth**            | Gemara / GovOps                              | Finite authorization surface; governance metadata on capabilities                                                | `#CapabilityCatalog` (`GovOps-ACC`), `#Lexicon`, capability → control `#MappingDocument`                              |
| **Compliance interoperability** | OSCAL Compass / Trestle                      | Normalize, validate, transform, and compose OSCAL documents; bridge governance to operational compliance tooling | OSCAL catalog, profile, **mapping collection**, component-definition, SSP, assessment-plan, assessment-results, POA&M |
| **Framework renderings**        | NIST, ISO, AICPA, regulators, enterprise GRC | Downstream targets that evolve on independent cadences                                                           | NIST SP 800-53, ISO/IEC 27001, SOC 2, FedRAMP, PCI, OSPS Baseline, internal control sets                              |


This matches how Trestle is used in practice: an ensemble for **creating, validating, and governing** OSCAL artifacts in `git`, with **transform tasks** from other formats into OSCAL—not a single-framework converter. Trestle v4 explicitly supports NIST's **Mapping Model** for relationships between catalogs.

### 9.1 Responsibilities

**Gemara/GovOps SHOULD:**

- Treat capabilities as canonical governance objects referenced by opaque ids.
- Map capabilities to **abstract, OSCAL-aligned control objectives** via `#MappingDocument` (and optionally a `#ControlCatalog` such as `GovOps-ACO.yaml`).
- Keep framework semantics **out of** the Authorization Capability Profile (no NIST `AC-3` literals on capability rows).
- Emit or exchange artifacts that Trestle can import (JSON/YAML OSCAL fragments, mapping inputs).

**Trestle/OSCAL SHOULD:**

- Import and validate framework catalogs (e.g., NIST SP 800-53 Rev. 5 via `trestle import`).
- Maintain **mapping collections** from the GovOps abstract catalog to framework catalogs.
- Resolve profiles, assemble SSPs, and produce assessment and posture artifacts for auditors and GRC tools.
- Absorb framework revisions by updating OSCAL-side mappings, not by rewriting GovOps capability semantics.



### 9.2 Why map abstract first

1. **One capability, many frameworks** — the same `0c451a4b…` transfer capability can simultaneously inform SOC 2, PCI, ISO, FedRAMP, and internal objectives through parallel OSCAL mapping collections.
2. **Independent evolution** — NIST, ISO, and SOC 2 releases change downstream catalogs; the enterprise capability inventory stays stable.
3. **Internal control objectives** — enterprises can define `govops.`* controls first, then project outward.
4. **Additive frameworks** — new accreditations are new mapping exercises and Trestle transforms, not Gemara schema redesigns.



### 9.3 Gemara `#MappingDocument` usage

Use Gemara's `#MappingDocument` with `source-reference` pointing at `#CapabilityCatalog` (`GovOps-ACC`) and `entry-type: Capability`. The **primary target** is an OSCAL-aligned `#ControlCatalog` (enterprise `GovOps-ACO` or a GovOps reference catalog)—**not** NIST/ISO/SOC 2 control ids in the ACC core layout.

Secondary mappings (framework catalog ↔ abstract catalog, OSPS Baseline ↔ capabilities) MAY live in the GovOps repository for convenience or in a **Trestle workspace** under `catalogs/`, `profiles/`, and mapping-collection paths. Both are valid; the **normative GovOps boundary** remains capability → abstract control.

Direct capability → NIST-only `#MappingDocument` examples are **illustrative shortcuts** for small deployments; the reference architecture is two-hop.

### 9.4 OSPS Baseline and project scope

For OSS maintainers, OSPS Baseline mappings follow the same pattern: capabilities → abstract controls → OSPS via Trestle/OSCAL (or a maintained Gemara `#MappingDocument` at the OSPS layer). GovOps does not embed OSPS control text in capability entries.

---



## 10. Tooling implications

Phase 1 reference tooling (profile module + conventions; no Gemara core schema changes), in the priority order reflected by the companion use cases:

1. **`govops lint`** (UC-03) — Day-to-day catalog validator. Validate against `#AuthorizationCapabilityCatalog`; capability `id` matches SHA-256 of `<group-slug>|<action-slug>|<resource-slug>`; lexicon resolution; group membership; `risk-tier` / `data-sensitivity` enum checks; optional `business-impact`, `geography`, and `org-unit` well-formedness. EXIT non-zero on any error.
2. **`govops drift`** (UC-04) — Compare catalog **(action, resource)** entries to **published PARC-shaped policy releases** (Cedar and other AuthZEN-compatible engines; artifacts passed in at run time by path, URI, or digest); report Type A (catalog without policy), Type B (policy without catalog), Type C (mapped control / description expectation vs. policy). Compose findings across multiple policy releases.
3. **`govops oscal-export`** (supports UC-02) — Emit OSCAL-aligned catalog/mapping fragments for import into a Trestle workspace; framework projection is completed with `trestle` commands (import, merge, profile resolve, mapping collection).

Engine-specific drift plug-ins treat policy formats as opaque and MUST target engines that evaluate **PARC-shaped** requests. A future phase MAY add `govops prove` for symbolic analysis of control-derived context expectations (§7.1).

---



## 11. Adoption / migration path

**Phase 0 — Base catalog (today).** Inventory capabilities with stable `#CapabilityCatalog` (`id`, `title`, `description`, `group`) while the profile module is prepared.

**Phase 1 — Authorization profile module and lint.** Publish the `authorization` CUE package (`#AuthorizationCapability` / `#AuthorizationCapabilityCatalog`), reference `GovOps-ACC` / `GovOps-ACO` templates, and ship `govops lint` as the first consumer toolchain (UC-01 authoring + UC-03 validation). Validate with `cue vet … -d '#AuthorizationCapabilityCatalog'`.

**Phase 2 — Compliance mappings.** Capability → abstract-control `#MappingDocument`s, Trestle workspace examples for NIST/ISO/SOC 2 projection (UC-02).

**Phase 3 — Drift against published policy.** `govops drift` with Cedar (and other PARC-shaped) analyzer plug-ins; Type A/B/C reports across policy releases (UC-04).

**Phase 4 — Engine adapters and optional proofs.** Read-only catalog emitters for common PDPs; optional provable-claim workflow against mapped controls. Keep the profile as an independently versioned module; optionally register it alongside Kubernetes/Linux/Cloud profiles.

---



## 12. Use cases (companion map)

The companion [use cases](./authorization-capability-catalog-use-cases.md) document walks Acme Bank personas through the design. Design sections map as follows:


| Use case | Primary persona | Toolchain | Design §§ |
|---|---|---|---|
| **UC-01** Capability Catalog Authoring | Platform Security Engineer | `#Lexicon`, `#AuthorizationCapabilityCatalog`, `govops lint` | §5–6, §8.1, §10 |
| **UC-02** Compliance Mapping and Audit | Compliance Auditor | `#MappingDocument`, Trestle/OSCAL | §8.2–8.3, §9 |
| **UC-03** Lint tool | Platform Security Engineer | `govops lint`, `cue vet` | §6.2, §8.4, §10 |
| **UC-04** Policy Drift Detection | Platform Security Engineer | `govops drift` (Cedar / PARC-shaped releases) | §7.1, §8.5, §10 |

```text
UC-01 Author catalog ──► UC-03 Lint ──► UC-02 Map / audit ──► UC-04 Drift
         │                    │                │                    │
         ▼                    ▼                ▼                    ▼
   GovOps-ACC.yaml      profile + id       ACO + Trestle      published Cedar
   + lexicon.yaml         checks           projections         policy releases
```

Lint is the gate on catalog quality; drift is the gate on catalog–policy alignment. Compliance mapping may proceed once lint is clean.

---



## 13. Open questions

1. **Granularity of** `resource`**.** Type vs. pattern in **PARC Context** — should a future profile refinement model graph-native hierarchies?
2. **Type-C expectation source.** Machine-readable predicates on mapped controls vs. free-text in `description` vs. a separate annotations artifact.
3. **Versioning of capabilities.** `replaced-by` pattern for splits and renames.
4. **Composed catalogs.** When an enterprise mixes authorization and Kubernetes (or other) profiles in one YAML, what composition rules apply?
5. **Public reference catalogs.** Community process for banking, cloud IAM, and other authorization surfaces.
6. **AuthZEN integration depth.** Guidance for feeding evaluate responses into optional evidence workflows.

---



## 14. Summary

Gemara already provides `#CapabilityCatalog`, `#MappingDocument`, `#Lexicon`, and optional layered controls. GovOps adds an **Authorization Capability Profile** — an external CUE module — that types each capability as the **(action, resource)** surface the system exposes, plus optional `risk-tier`, `data-sensitivity`, `business-impact`, `geography`, and `org-unit`.

The *thing governed* is that finite inventory. *Prioritization* uses **`risk-tier` × `business-impact`** so governors spend attention on the most likely failures with the biggest consequence. *Assurance* starts with **`govops lint`** on the catalog (UC-03), then catalog–policy alignment via **`govops drift`** (UC-04) and **abstract control mappings** (UC-02), with framework views produced through Trestle/OSCAL. Entitlements and PARC Context rules stay in published policy, not in the profile.

---



## 15. References

- Gemara — `capabilitycatalog.cue` (stable), `controlcatalog.cue` (stable), `mapping_inline.cue`, `mappingdocument.cue`, `lexicon.cue`, `entities.cue`, `threatcatalog.cue`, `evaluationlog.cue`.
- Gemara ADRs — 0017 (Base Catalog Type), 0018 (Promote Nested Concepts to Catalogs), 0019 (Promote Capabilities), 0020 (Groups), 0021 (Lexicon).
- OpenID AuthZEN — Authorization API specification using the PARC **request** shape.
- RFC 7519 — JSON Web Token (JWT), commonly used as signed evidence carried in **PARC Context**.
- [OSCAL Compass compliance-trestle](https://github.com/oscal-compass/compliance-trestle) — OSCAL validation, transformation, catalog/profile/mapping-collection workflows, CI/CD compliance pipelines.
- NIST [OSCAL](https://pages.nist.gov/OSCAL/) — standard interchange format; Mapping Model for cross-catalog relationships.
- NIST SP 800-53 r5, ISO/IEC 27001, SOC 2, OSPS Baseline — example **downstream** framework catalogs (imported and mapped via Trestle, not embedded in capability rows).

