# ACC.yaml: proposed format

**Status:** Draft v0.2, for sub-group comment. Moved from the wiki into the repository so review can happen through PRs, as discussed on [issue #17](https://github.com/GovOpsWG/GovOps/issues/17). The wiki page now points here.

**Editor:** Dinesh Rajasekharan

This document proposes the concrete file format for ACC.yaml, the Authorization Capability Catalog. It is the editor's working draft of the catalog syntax and its claims. It complements the [ACC design document](./authorization-capability-catalog-design.md), which defines the underlying model over Gemara; where the two differ (notably on the id convention, see below), this draft records the editor's current proposal and the difference is an open review item.

## Changes from v0.1

This revision incorporates the first-round review comments from Mike and Vidyaa on issue #17.

1. The capability id is now defined as an opaque, stable, globally unique string, and the spec no longer mandates how it is produced. The SHA-256 recipe from v0.1 moves to a recommended, non-normative appendix. (Mike's comment on hash reproducibility and M&A collisions; Vidyaa confirmed the metrics only need the id stable and opaque.)
2. A new Claims section defines the exact meaning and value type of every metadata key, and cuts the required set down. Only five keys are required for a valid entry, and one more (risk-tier) is required to generate the published metrics. Everything else is optional. (Mike's concern about speculative first-class claims; Vidyaa's minimum list from the metrics side.)
3. risk-tier is an integer 0 to 100 with normatively defined bands, so numbers stay comparable across organizations. business-impact is an integer cost of failure. geography is a sequence of two-letter country codes. (Mike's proposed claim table; Vidyaa's requirement that bands be defined centrally.)
4. business-unit and business-function are renamed to org-unit and org-function to match the published profile and the metrics README, org-unit is a sequence, and a single primary-org-unit is added so per-unit reporting has a headline home and totals still reconcile. (Vidyaa's naming and double-counting points.)
5. The review block no longer carries structured conditions. The catalog now declares only that a review boundary exists, the expected outcome (challenge), and who reviews. The conditions themselves (amounts, payment methods, channels) live in policy, where conditional logic belongs. A prose text field documents the band for humans and drift tooling. (Mike's concern that v0.1 was starting to recreate policy syntax.)
6. Intent is repositioned. The draft now states explicitly that intent itself is runtime authorization input, a layer below governance, and the catalog never carries or evaluates it. What remains is optional reviewer-facing documentation of expected intents, marked provisional pending steering discussion. (Mike's comment that intent is the natural language source of authority for a request, not catalog metadata.)
7. The encoding position adopts Mike's mixed approach: push action, resource, and group as core profile keys in Gemara (tracking gemara#419), and carry extended metadata in the description. The x- extension convention is unchanged, since it was the one part everyone liked.

## Purpose

ACC.yaml is a vendor-neutral, machine-readable inventory of the meaningful actions an organization's systems can perform. Each entry describes one capability, which is an (action, resource) pair such as refund on a customer order. A capability records that the system exposes an operation; who may perform it is runtime policy and lives outside the catalog.

The catalog exists to answer a question no organization can answer today: what are all the risky actions our systems and our AI agents can perform, who owns them, and how are they governed?

Everything downstream depends on this list. The architecture connects catalog entries to operational systems through the capability id. The metrics can only compute trends if decision records carry a capability id and the catalog supplies risk tiers.

## Design principles

1. **Identity is minimal and stable.** A capability's identity is its group, action, and resource. The capability id is an opaque, stable, globally unique string; how it is produced is up to the implementation (a recommended recipe is in the appendix). The id never changes once assigned, so runtime correlation survives reorganizations, reclassifications, and ownership changes.
2. **Governance metadata describes, it does not enforce.** Claims like risk-tier and review document intent for governors, reviewers, and drift tooling. Enforcement always lives in policy. The catalog states what should be true, and `govops drift` checks whether published policy agrees.
3. **AI agents are requesters, not a separate catalog.** The same capability can be exercised by a human, a service, or an agent. What differs per requester class is the governance expectation, most importantly whether a review boundary applies.
4. **Extensible by convention.** Organization-specific fields use an `x-` prefix. Tooling preserves them and the spec never interprets them.

## Claims: exact meanings and types

**Required for a valid entry:**

| Key | Meaning | Type |
|---|---|---|
| `id` | Opaque, stable, globally unique capability identifier | String |
| `title` | Human label | String |
| `group` | Logical domain the capability belongs to | String (reference to a group id) |
| `action` | The verb half of the capability | String (lexicon term) |
| `resource` | The resource type half of the capability | String (lexicon term) |

**Required to generate the published metrics** (the decision record supplies capability id, outcome, timestamp, and policy version; the catalog must supply the rest):

| Key | Meaning | Type |
|---|---|---|
| `risk-tier` | Probability that exercising this capability goes wrong | Integer 0 to 100. Bands are normative for reporting: 0-25 low, 26-50 medium, 51-75 high, 76-100 critical |

The catalog-level `catalogue-version` (in `metadata`) is also required, since every metric result must cite it.

**Optional documented claims:**

| Key | Meaning | Type |
|---|---|---|
| `business-impact` | Cost of failure | Integer, denominated in the catalog-level `impact-currency` |
| `geography` | Physical locations where the capability operates | Sequence of ISO 3166-1 alpha-2 country codes |
| `org-unit` | Organizations or sub-organizations using the capability | Sequence of strings |
| `primary-org-unit` | The single unit used for headline reporting, so per-unit totals reconcile | String, must appear in `org-unit` |
| `org-function` | Business functions the capability serves | Sequence of strings |
| `data-sensitivity` | Classifications of data the capability exposes | Sequence of strings from the lexicon's sensitivity group |
| `third-party-exposure` | Named external parties in the request path | Sequence of strings, empty meaning none |
| `accountable-owner` | The identifiable owner answerable for this capability | String (a role or subject reference) |
| `lifecycle-stage` | Position in the capability lifecycle | String: discover, register, classify, govern, deploy, observe, retire |

A note on `accountable-owner`: the claims discussion proposed a sequence here, but the architecture defines accountability as an identifiable owner, and a list of owners tends to mean no owner. This draft keeps it singular; organizations that need to record interested parties can use an `x-stakeholders` extension until the committee decides.

## Proposed syntax

```yaml
# ACC.yaml - Authorization Capability Catalog (draft v0.2)
acc-version: "0.2"
metadata:
  organization: acme-bank
  catalogue-version: "2026.08.2"
  impact-currency: USD
  lexicon: ./lexicon.yaml

groups:
  - id: g.payments
    title: Payments
  - id: g.release-engineering
    title: Release Engineering

capabilities:

  # ------------------------------------------------------------------
  # Example 1: API capability (classic)
  # ------------------------------------------------------------------
  - id: 5532b0293198fd4ff0a93c358f4f6304280daf0187e69580a7de137c85a12682
    title: Read an invoice
    group: g.billing
    action: read
    resource: invoice
    risk-tier: 40            # medium band
    business-impact: 5000
    geography: [de, us]
    org-unit: [finance]
    primary-org-unit: finance
    data-sensitivity: [pii]
    third-party-exposure: []
    accountable-owner: role:billing-platform-lead
    lifecycle-stage: govern

  # ------------------------------------------------------------------
  # Example 2: infrastructure capability
  # ------------------------------------------------------------------
  - id: c38b36c29364dbc490e295e817947ada36ec6fe7ff64922baad32daf79a3019a
    title: Delete a production Kubernetes namespace
    group: g.release-engineering
    action: delete
    resource: production-namespace
    risk-tier: 90            # critical band
    business-impact: 2000000
    org-unit: [platform]
    primary-org-unit: platform
    accountable-owner: role:head-of-platform
    lifecycle-stage: govern
    documented-requester-classes: [interactive-subject, software-agent]
    documented-context-expectations:
      - id: c.mfa
        text: "Policy MUST require fresh strong authentication evidence."
    review:
      software-agent:
        expected-outcome: challenge
        reviewer: accountable-owner
        text: "Agents never delete production namespaces autonomously.
               Policy is expected to challenge every agent request and
               route it to the accountable owner."

  # ------------------------------------------------------------------
  # Example 3: AI-agent capability with a review boundary
  # ------------------------------------------------------------------
  - id: 873909ffdd404a6d25a69bd5b8d35ad6c80dee5180cc9c1df7577440c5c52bb1
    title: Issue a refund on a customer order
    group: g.payments
    action: refund
    resource: customer-order
    risk-tier: 65            # high band
    business-impact: 250000
    geography: [us]
    org-unit: [customer-operations, finance]
    primary-org-unit: customer-operations
    data-sensitivity: [financial]
    third-party-exposure: [payment-processor]
    accountable-owner: role:head-of-customer-ops
    lifecycle-stage: govern
    documented-requester-classes: [interactive-subject, software-agent]
    review:
      software-agent:
        expected-outcome: challenge
        reviewer: accountable-owner
        text: "Agents may issue small refunds autonomously. Above the
               threshold set in policy (currently 500 USD), requests are
               expected to be challenged and routed for human approval.
               The conditions themselves live in policy, not here."
    documented-intent-expectations:      # PROVISIONAL, see open questions
      - id: i.resolve-complaint
        text: "Reviewers should expect intents like resolve-complaint or
               order-error-correction alongside a challenged request."
    x-acme-cost-center: "CC-4471"        # extension field, preserved not interpreted
```

## What changed in the thinking, and why

**The id is a contract, not a recipe.** v0.1 mandated SHA-256 of the group, action, and resource slugs. Review made the right objection: reproducibility of the hash buys little, and slug collisions across mergers are a real risk. What every consumer actually needs is that the id is stable, opaque, and globally unique. So that is now the whole normative requirement, and the hash recipe becomes a recommended default for implementations that want deterministic ids (appendix), where an organization prefix in the preimage addresses the M&A case. Note that the design document currently specifies the SHA-256 convention as normative; reconciling the two is an open review item for this PR.

**Claims are now defined, and the required set is small.** A catalog standard whose fields have no defined types produces catalogs nobody can compare. At the same time, an early draft should not speculate its way into a large mandatory schema. The resolution: five required keys for validity, risk-tier required when you want the published metrics, and everything else optional with exact types. The risk-tier bands are defined in the spec itself because every metric reports by tier, and if each organization draws its own bands the numbers stop meaning anything across organizations.

**The review block documents a boundary, it does not encode one.** v0.1 put a structured condition (max-amount, currency) in the catalog, and review correctly called that the beginning of a policy language. The catalog now records three things only: that a review boundary exists for a requester class, that the expected outcome above it is challenge rather than deny, and who reviews. The conditions (amounts, payment instruments, channels, velocity) belong in policy, which already has languages for exactly that. Drift tooling can still verify the pair: the catalog says agent requests on this capability should sometimes challenge, and a policy release where they never can is a finding. The metrics entry for denial ratio trend already notes that most engines do not emit challenge today; the review block states governance expectation, and the engine limitation is inherited from there.

**Intent is documentation for reviewers, not a governance object.** Review located intent correctly: it is the natural language source of authority for a request, tactical, an input to authorization, a layer below steering the ship. The catalog therefore never carries or evaluates intent. What v0.2 keeps, marked provisional, is a small documentation hook: when a challenged agent request lands in front of a reviewer, the catalog can say what intents are normal to see there. If the committee concludes even that belongs elsewhere (the lexicon, or reviewer tooling), it lifts out cleanly without touching anything else.

**Encoding: the mixed approach.** Core keys (action, resource, group) get pushed as first-class Gemara profile keys, and extended metadata rides in the description. This tracks the request already in front of the Gemara group (gemara#419) and keeps the catalog valid against stable Gemara either way. The design document's CUE-module profile is the natural home for the required claims defined here.

## What this draft does not do

There is no policy language, no evaluation API, and no enforcement semantics here. Enforcement is policy's job; the catalog documents governance intent, consistent with the initiative's out-of-scope list. The draft does not model principals or entitlements, and it never claims a capability is secure. It claims only that the capability is named, classified, owned, and observable.

## Appendix: recommended id recipe (non-normative)

Implementations wanting deterministic ids can use the lowercase hex SHA-256 of `<org-slug>|<group-slug>|<action-slug>|<resource-slug>`, with slugs lowercased, trimmed, internal whitespace collapsed to single hyphens, and unicode NFC-normalized. The org prefix keeps ids from colliding when catalogs merge. Consumers must never parse or recompute ids; they are opaque.

## Open questions for review

1. Review boundary dimensions: settled for v0.2 by moving conditions to policy. The remaining question is whether `expected-outcome` needs values beyond challenge, for example notify-only.
2. Intent placement: keep the provisional reviewer-documentation hook, move it to the lexicon, or drop it from the catalog entirely.
3. Gemara embedding: mixed approach adopted as the working position; tracking gemara#419 for the core-key request.
4. org-unit reporting semantics: v0.2 adds primary-org-unit; confirm this satisfies the metrics side before it lands in the profile text and the metrics README.
5. Should the risk-tier band boundaries (25/50/75) be fixed by the spec, as drafted, or profile-configurable with fixed defaults?
6. Id convention: this draft makes the id opaque and implementation-defined, while the design document keeps the SHA-256 convention normative. The two documents should land on one answer.
