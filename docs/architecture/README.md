## Table of Contents

1. [Architecture at a Glance](#architecture-at-a-glance)
2. [What is Governance?](#what-is-governance)
3. [Big Picture: Where does governance fit in the IT landscape](#big-picture-where-does-governance-fit-in-the-it-landscape)
4. [GovOps Services](#govops-services)
   1. [Reference Architecture](#reference-architecture)
   2. [Capability Catalog](#capability-catalog)
   3. [Centralized Policy Management](#centralized-policy-management)
   4. [Schema Management](#schema-management)
   5. [Federation Management](#federation-management)
   6. [Continuous Compliance](#continuous-compliance)
   7. [Runtime Authorization Context](#runtime-authorization-context)
   8. [Governance Metrics](#governance-metrics)
   9. [Kernel Observability](#kernel-observability)
   10. [Event Handling and Response](#event-handling-and-response)
5. [Summary](#summary)

## Architecture at a Glance

GovOps is an architecture for **authorization governance** at enterprise scale: manage governance artifacts centrally, authorize locally next to the resource, and join everything with a stable `capability_id` from catalog to kernel.

The continuous **GovOps loop**:

```text
Govern → Authorize → Execute → Observe → Detect → Respond → Govern
```

| Step | Meaning |
|---|---|
| **Govern** | Define and classify capabilities; manage policy, schema, federation, and control mappings; improve those artifacts from evidence. |
| **Authorize** | Evaluate a PARC-shaped request at a local Policy Decision Point (Allow, Deny, or Challenge). |
| **Execute** | Perform the protected action only after Allow. |
| **Observe** | Collect authorization context, application telemetry, and kernel observability joined by `capability_id`. |
| **Detect** | Identify conditions that require action (unexpected exercise, drift, revoked credentials, missing telemetry, threshold breach). |
| **Respond** | Act on the detection (revoke, quarantine, re-authorize, notify owner, open incident) and feed outcomes back into **Govern**. |

The architecture separates a **Governance Plane** (centralized artifacts) from a **Runtime Plane** (local decisions and execution). The diagram below is the canonical view of that stack; later sections refer back to it rather than redrawing it.

```text
                       GOVERNANCE PLANE

                 Authorization Capability Catalog
                            ACC
                             │
                 capability_id + metadata
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
     Policy Stores      Schema Registry    Federation
          │                  │              Management
          └──────────────────┼──────────────────┘
                             │
                    governed artifacts
                             │
                             ▼

                        RUNTIME PLANE

       ┌──────────────────────────────────────────────┐
       │ Applications / APIs / Workloads / AI Agents │
       └──────────────────────────────────────────────┘
                             │
                             ▼
                    Policy Decision Point
                             │
                             ▼
                    Authorization Decision
                   Allow | Deny | Challenge
                             │
                             ▼
                   Authorization Context
                             │
          capability_id + policy version + jti
                             │
                             ▼
                   Application Execution
                             │
                             ▼
                  Kernel Observability
              Cilium / Falco / Sysdig /
                 Tetragon / OS telemetry
                             │
                             ▼
                    Governance Evidence
                             │
                             ▼
              Gemara / OSCAL / Compliance
```

A `Challenge` means available evidence is insufficient for a final decision — the caller must obtain more evidence and resubmit before the protected capability can execute. Runtime evidence flows back up the same `capability_id` join into the Governance Plane (**Observe → Detect → Respond → Govern**).

Related ACC documents:

* [Authorization Capability Catalog: Design](../acc/authorization-capability-catalog-design.md)
* [Authorization Capability Catalog: Use Cases](../acc/authorization-capability-catalog-use-cases.md)

Google's July 2026 whitepaper [Beyond Zero: Enterprise security for the AI era](https://spawn-queue.acm.org/doi/10.1145/3819083) calls for open architectures that enhance transparency into access. GovOps aligns with Beyond Zero's principle that security must move to distributed, local resource/action-based authorization decisions.

## What is Governance?

It is de rigueur to proclaim that AI needs governance, or AI needs guardrails. But what does it mean to govern? Who governs? What must governors do?

Enterprises govern to achieve **security** — literally *securus*, "without care" — so accountable leaders can sleep at night. To *govern* is to steer (Greek κυβερνᾶν, *kybernan*). GovOps names three steering responsibilities: **risk management** (prioritize the most likely risks with the biggest business impact), **accountability** (know who to call when things go wrong), and **observability** (see enterprise risk, or fly blind).

Who governs? Humans. AI can assist; it cannot abdicate board and management responsibility. This document proposes the architecture for that work amid agentic transformation.

## Big Picture: Where does governance fit in the IT landscape

Our society is in the midst of a multi-generational digital transformation. Enterprises are expanding their digital footprints, especially to capture productivity gains from autonomous software agents that use large language models ("LLMs") to plan actions and achieve goals. Effective authorization governance depends on four major layers: **governance, observability, identity, and event handling**. Each layer answers a different question: How does the enterprise manage risk? What is actually happening? Who or what is acting? And how should the enterprise respond?

The **governance layer** defines the shared artifacts used to control authorization across the enterprise. The Capability Catalog identifies the actions and resources the enterprise wants to govern and assigns business context such as risk, impact, and ownership. Policy Authoring defines the rules that control those capabilities. Schema Management defines the entities, attributes, and context those policies can reference. Federation Management defines which external issuers, credentials, and claims the enterprise is willing to trust. Continuous Compliance maps capabilities and their operational evidence to control objectives and regulatory requirements. Together, these services establish the enterprise-wide rules, semantics, trust relationships, and accountability needed to govern distributed authorization decisions.

The **observability layer** provides evidence about what is actually happening. Using the nautical metaphor, observability gives governors the charts and instruments needed to steer. For authorization governance, this may include authorization decision logs, SIEM, threat-detection systems, application telemetry, network observability, and kernel observability tools. Observability should connect technical events back to governed capabilities so that governors can understand activity in business terms. LLMs may help analyze and summarize this evidence, but the underlying telemetry remains the source of truth.

The **identity layer** establishes identifiers and trusted evidence about the entities participating in authorization. These entities may include humans, applications, workloads, organizations, devices, and AI agents. Identity systems typically associate identifiers with cryptographic keys, credentials, attributes, or other evidence that can be verified by the authorization system. Human workforce identity is relatively mature, while software, workload, organizational, and agent identity standards continue to evolve. The identity layer therefore provides evidence about actors; governance policy determines what that evidence permits them to do.

The **event-handling layer** determines what happens when the enterprise detects a condition that requires action. Events may originate from authorization decisions, identity systems, observability tools, compliance monitoring, or other governance services. A response may invoke a workflow, require additional authorization, revoke a credential, quarantine a workload, notify an accountable owner, trigger an AI agent, or require a human decision. The event layer closes the loop by converting governance evidence into operational response.

See [Figure 1.1](./images/figure_1_1.jpg) for a visualization of the four layers. The GovOps loop and plane diagram are in [Architecture at a Glance](#architecture-at-a-glance).


## GovOps Services

GovOps defines a set of shared services that enable governors to manage authorization across many applications, APIs, workloads, infrastructure components, and AI agents. These services provide the connection between business governance and distributed enforcement.

The key architectural principle is that the enterprise should be able to trace a governed capability from its definition in the catalog, through authorization policy, into the application and ultimately down to runtime execution. In other words, the `capability_id` should be able to travel from the catalog to the kernel.

This does not mean authorization decisions need to be centralized. In fact, GovOps supports local authorization decisions close to the application, resource, or action being protected. What should be centralized are the governance artifacts necessary to understand and manage those decisions across the enterprise.

The core GovOps services are the **Capability Catalog**, **Policy Management**, **Schema Management**, **Federation Management**, and **Continuous Compliance**.

### Reference Architecture

GovOps separates the architecture into two planes: a **Governance Plane** and a **Runtime Plane**. The canonical diagram is in [Architecture at a Glance](#architecture-at-a-glance).

The Governance Plane manages the shared artifacts required to govern authorization across the enterprise. These include the Authorization Capability Catalog, Policy Stores, authorization schemas, federation configuration, compliance mappings, and governance evidence. These artifacts are centrally managed so governors can understand and measure authorization consistently across many systems.

The Runtime Plane performs authorization close to the resource or action being protected. Applications, APIs, workloads, infrastructure, and AI agents use local or embedded Policy Decision Points to evaluate policy. Each authorization decision references the governed `capability_id` and the versions of the policy and evidence used to make the decision.

The two planes are connected by stable identifiers rather than by a centralized runtime authorization service. Most importantly, the `capability_id` defined in the ACC is carried into the authorization decision and associated with subsequent telemetry.

This architecture allows authorization to remain distributed while governance remains centralized. A mobile application, database, Kubernetes workload, or AI agent can make authorization decisions locally while still using centrally governed capabilities, policies, schemas, and federation rules.

Runtime evidence flows in the opposite direction along the stack in Architecture at a Glance. Authorization decisions and observability data are correlated with the same `capability_id` and returned to the Governance Plane — the **Observe → Detect → Respond → Govern** half of the GovOps loop.

### Capability Catalog

The Authorization Capability Catalog ("ACC") is a machine-readable inventory of what applications, APIs, infrastructure, workloads, and AI agents can actually do — the authorization surface the enterprise wants to govern. The catalog model, Authorization Capability Profile, and tooling conventions are specified in the [ACC design](../acc/authorization-capability-catalog-design.md); persona workflows are in the [ACC use cases](../acc/authorization-capability-catalog-use-cases.md).

A capability is an action on a resource. Examples might include:

* `transfer:funds`
* `approve:loan`
* `deploy:production`
* `read:customer-record`
* `invoke:model`
* `github:merge_pr`
* `open:room-101`

Each capability has a stable identifier, description, group, and business context useful to governors — such as risk tier, business impact, geography, business function, data sensitivity, third-party exposure, regulatory scope, and accountable owner. Risk tier and business impact together support risk–reward prioritization: the most likely failures with the biggest consequence.

This makes it possible to ask governance questions across otherwise unrelated systems. Which capabilities expose customer data? Which capabilities operate in a particular geography? Which capabilities are exercised by third-party software or AI agents?

The `capability_id` in the ACC becomes the common index across policy, telemetry, metrics, and compliance. Authorization engines may change and applications may use different technologies, but the capability identifier provides a stable enterprise-level unit of governance.

#### Capability Lifecycle

The ACC is not just an inventory. Each capability is a governed object with its own lifecycle (distinct from the enterprise GovOps loop above):

```text
Discover → Register → Classify → Govern → Deploy → Observe → Retire
```

When a capability is registered, it receives a stable `capability_id` and an accountable owner. Governors then classify its business impact and risk, including factors such as geography, data sensitivity, regulatory scope, and third-party exposure.

The capability is then associated with the authorization artifacts required to govern it. These may include Policy Stores, authorization schemas, trusted credential issuers, and Gemara control mappings. When the capability is deployed, its `capability_id` is exposed at the authorization enforcement point so decisions and runtime telemetry can be correlated back to the ACC.

Once operational, governors can measure the capability continuously. They can determine which policies govern it, who or what exercises it, whether runtime evidence is available, and whether its compliance obligations are being met.

Capabilities should also have a defined retirement process. Removing a capability should identify dependent policies, applications, schemas, telemetry, and compliance mappings so obsolete governance artifacts do not remain in production.

### Centralized Policy Management

Enterprises should centralize policy management, not necessarily policy execution.

Authorization decisions increasingly need to happen locally: inside an application, next to an API, in a database, on a mobile device, or within an AI workload. A centralized authorization service can introduce latency, availability dependencies, and unnecessary network calls.

But if every development team independently creates, stores, deploys, and audits its own authorization policies, governors have no practical way to understand enterprise-wide authorization risk.

GovOps therefore separates policy administration from runtime policy enforcement.

Policies should be stored in centrally governed Policy Stores with common mechanisms for ownership, versioning, review, testing, approval, deployment, rollback, and audit history. Policy Decision Points can then consume those policies and enforce them wherever authorization decisions need to occur.

This architecture gives application teams local enforcement while giving governors centralized visibility into the rules controlling important enterprise capabilities.

Centralized policy management also enables enterprise-wide questions that are difficult to answer when policy is embedded in application code. For example: Which policies govern Tier 1 capabilities? Which policies changed this month? Which applications are still enforcing an old version? What is the impact when we add a new policy to an existing policy store?

### Schema Management

Authorization policies operate on data. Therefore, an enterprise cannot effectively govern policy without also governing the schemas that define that data.

For example, a policy might reference attributes such as:

```text
action.business_unit
resource.data_sensitivity
resource.geography
context.token.id_token.acr
```

If application teams disagree about the names, types, or meaning of these attributes, enterprise policy becomes difficult to analyze and eventually impossible to govern.

GovOps therefore treats authorization schemas as shared governance artifacts.

The schema defines the entity types, attributes, relationships, and actions that policy authors can reference. It also provides a contract between token issuers, applications, policy authors, and Policy Decision Points.

Schema governance should also extend to claims mapping. If an enterprise maps `department`, `country`, or `risk_level` from JWTs or other credentials into authorization entities, the schema should guarantee that those values can actually be represented and consumed by policy.

Without schema management, an enterprise may centrally manage policy while still having no guarantee that applications and identity systems are supplying the data those policies require.

### Federation Management

Authorization depends on evidence, and much of that evidence arrives in tokens or other signed credentials.

Federation Management defines which credentials the enterprise is willing to trust, from which issuers, and under what conditions.

An enterprise may accept JWTs from its workforce identity provider, customer identity systems, cloud platforms, partners, workload identity systems, AI agent registries, transaction-token issuers, or other external authorities. Each issuer may have different security practices, key-management procedures, claim semantics, assurance levels, token lifetimes, and revocation mechanisms.

Trusting an issuer should therefore be an explicit governance decision.

Federation Management should define, at minimum:

* trusted issuers;
* accepted token and credential types;
* acceptable signing algorithms;
* key discovery and rotation requirements;
* audiences;
* token lifetime requirements;
* required claims;
* claim mappings;
* assurance requirements;
* token status or revocation mechanisms;
* issuer-specific restrictions.

This becomes particularly important as authorization moves beyond a single access token. An authorization decision may combine evidence from a human identity token, workload token, transaction token, device attestation, delegation credential, or AI agent credential.

GovOps does not require that all of this evidence identify one canonical "subject." Instead, Federation Management determines which evidence the enterprise trusts, while authorization policy determines what that evidence permits.

### Continuous Compliance

Compliance frameworks describe **controls**. Operational systems expose **capabilities**. The Authorization Capability Catalog connects those two worlds. Abstract-control mappings, Trestle/OSCAL projection, and the Gemara export path are detailed in the [ACC design](../acc/authorization-capability-catalog-design.md) (§8–9) and walked through in [UC-02: Compliance Mapping and Audit](../acc/authorization-capability-catalog-use-cases.md#uc-02-compliance-mapping-and-audit).

Traditional compliance programs frequently operate separately from runtime authorization. Controls are documented in one system, policies are implemented somewhere else, and evidence is collected manually during an audit. GovOps closes this gap by treating the ACC as the common reference point between what the enterprise can do and what it is obligated to govern.

#### From capabilities to controls (Gemara)

[Gemara](https://gemara.openssf.org) supplies the common data model. A `#CapabilityCatalog` defines the capabilities. A separate `#MappingDocument` records how a capability relates to one or more **abstract control objectives** (a canonical control layer), not directly to every framework's control numbers.

A mapping can assert that a capability such as *Approve Loan* supports an access-control objective, while preserving rationale, applicability, confidence, and mapping strength. That mapping is an explicit **governance assertion** — not proof that the control is already satisfied. Proof comes later from policy versions, authorization decisions, and runtime evidence.

Gemara's published tooling includes CUE schemas for validating YAML or JSON and the [`go-gemara`](https://github.com/gemaraproj/go-gemara) Go SDK for integrating Gemara structures into automated tools.

#### Export path (Gemara → OSCAL → Trestle)

The export path is concrete:

1. **Load and validate.** An exporter loads the ACC as a Gemara `#CapabilityCatalog` and its accompanying `#MappingDocument`, and verifies that every source capability and target control exists.
2. **Translate to OSCAL.** Each Gemara relationship becomes an entry in an OSCAL **Mapping Collection**. Confidence and strength become OSCAL confidence, coverage, or properties; the mapping rationale is retained as remarks.
3. **Manage with Trestle.** [OSCAL Compass compliance-trestle](https://github.com/oscal-compass/compliance-trestle) reads the transformed data and constructs versioned OSCAL classes. Trestle's recommended transformer pattern separates file handling from data processing: read the native input, transform it into the OSCAL object hierarchy, validate it against the OSCAL schema, and write the resulting JSON.

Gemara defines the semantics. OSCAL defines the interchange format. Trestle manages the resulting compliance artifacts. Outputs can include a Mapping Collection, Component Definition, profile, or System Security Plan. Implementation statements and evidence can then be attached to the mapped controls and reused across NIST, SOC 2, ISO 27001, PCI DSS, or internal frameworks.

**Define the capability once. Map it once to a canonical control layer. Collect evidence once. Then use OSCAL and Trestle to reuse that governance work across many compliance programs.**

#### Continuous evidence chain

Compliance joins the same stack shown in [Architecture at a Glance](#architecture-at-a-glance): frameworks project through Trestle/OSCAL onto abstract controls, `#MappingDocument` links those controls to ACC capabilities, and policy → decision → runtime evidence flows down the Runtime Plane and back up via `capability_id`.

An auditor should eventually identify the capabilities associated with a control, which policies govern them, which policy versions were active, and evidence of how those capabilities were exercised — without treating the mapping itself as certification. That turns compliance from a periodic documentation exercise into another pass through the GovOps loop.

### Runtime Authorization Context

GovOps requires a standard way to correlate an authorization decision with the execution that follows.

When a governed capability is evaluated, the Policy Decision Point should produce a compact authorization context containing enough information to identify the capability, the decision, and the policy state used to make that decision.

At minimum:

```text
capability_id
decision
decision_id
policy_store_id
policy_store_version
```

The `decision` may be:

```text
allow
deny
challenge
```

Where available, the context may also include identifiers for trusted evidence used in the decision:

```text
access_token.jti
id_token.jti
transaction_token.jti
```

The authorization context is not a copy of the policy, token, or authorization request. It is a set of stable correlation identifiers. Only those identifiers need to cross the boundary between the application and runtime layers — not tokens, policy text, or authorization entities. Token identifiers such as `jti` can join the authorization context to evidence from the identity layer.

The context should remain associated with the resulting execution for as long as practical. Depending on the platform, this association may use request context, thread-local storage, process metadata, container metadata, environment variables, or other propagation mechanisms. GovOps defines the required information, not the implementation mechanism.

For example:

```text
capability_id        = transfer:funds
decision             = allow
decision_id          = 9db214
policy_store_id      = payments
policy_store_version = 42
access_token.jti     = a81f...
```

That context is the join point in the [Architecture at a Glance](#architecture-at-a-glance) stack between authorization decision and application execution. The critical field is `capability_id` (business meaning); the remaining identifiers provide provenance (decision, policy version, trusted evidence). Runtime telemetry can then answer not only **what happened**, but **which governed capability was executing when it happened**.

#### Authorization Challenges

Some authorization requests cannot be resolved from the evidence initially available.

A `Challenge` is an intermediate authorization outcome. It means additional evidence is required before the Policy Decision Point can make a final authorization decision.

A challenge should contain enough information to correlate the request with the capability and identify the additional evidence required.

For example:

```text
challenge_id
capability_id
reason
required_evidence
expires_at
```

Required evidence may include:

```text
phishing-resistant authentication
manager approval
device attestation
transaction confirmation
additional credential
```

The challenge remains associated with the same `capability_id` and authorization request.

```text
Authorization Request
        ↓
Policy Evaluation
        ↓
   ┌────┴─────────────┐
 Allow   Deny    Challenge
                  ↓
          Obtain Evidence
                  ↓
          Re-evaluate Policy
                  ↓
          Allow | Deny
```

A Challenge is not a weaker form of Allow. The protected capability does not execute until the required evidence is obtained and authorization is evaluated again.

GovOps does not require the underlying policy language itself to implement a three-valued decision model. A Policy Decision Point may internally use binary policy evaluation while the surrounding authorization service determines that additional evidence is required and returns a Challenge.

### Governance Metrics

Governance requires measurement.

The ACC provides a finite set of capabilities against which the enterprise can measure authorization risk, accountability, policy coverage, observability, and compliance. This makes it possible to define governance metrics using `capability_id` as the common unit of analysis.

The specific GovOps metrics should be developed separately and refined through implementation experience. Metrics should generally be aggregated by attributes already present in the ACC, such as risk tier, business impact, geography, business function, data sensitivity, or third-party exposure.

The purpose of GovOps metrics is not to prescribe a fixed dashboard. It is to establish a common measurement model in which governance questions can be answered across otherwise unrelated applications and infrastructure.

The final set of metrics, their definitions, and any recommended key performance indicators are being developed as a separate GovOps deliverable.

### Kernel Observability

Authorization proves that an operation was permitted. It does not prove what happened during execution. GovOps closes this gap by correlating the runtime authorization context with operating-system and kernel telemetry.

The key requirement is that the `capability_id` (and related identifiers) associated with an authorization decision can be joined to the runtime activity that follows. Kernel observability tools can then associate process, filesystem, network, or system-call telemetry with that context.

Existing observability tools already provide visibility into runtime behavior. Examples include:

* **Cilium** for network and workload observability;
* **Falco** for runtime security events and behavioral detection;
* **Sysdig** for process, filesystem, container, and system-call telemetry;
* **Tetragon** for process, network, and security observability;
* **Linux Audit**, Windows ETW, and macOS Endpoint Security for platform-specific telemetry.

These systems can observe events such as:

```text
process execution
child process creation
file access
network connections
socket activity
system calls
```

They normally understand technical execution context such as processes, containers, namespaces, files, and network endpoints. GovOps adds business context: making `capability_id` observable provides a more granular view of what is happening inside the application and enables a new class of tools for threat detection.

### Event Handling and Response

Observability identifies conditions that may require action. Event handling determines how the enterprise responds.

A GovOps event may originate from an authorization decision, runtime telemetry, identity infrastructure, compliance monitoring, or another governance system. Examples include:

* a high-risk capability exercised by an unexpected entity;
* a denied authorization request;
* execution that deviates from expected runtime behavior;
* use of an expired or unapproved policy version;
* loss of required telemetry;
* a revoked credential still associated with active execution;
* a compliance or risk threshold being exceeded.

GovOps does not prescribe a single event-processing platform. Events may be handled by workflow systems, SOAR platforms, message buses, security products, AI agents, or human operators.

The important architectural requirement is that governance events retain enough context to identify what happened and what governed capability was involved.

For example:

```text
capability_id
event_type
decision_id
policy_store_id
policy_store_version
credential identifiers
runtime identifiers
timestamp
```

A response may include:

```text
revoke credential
terminate execution
quarantine workload
require additional authorization
change policy
open incident
notify accountable owner
request human approval
```

Event handling is the **Detect → Respond** segment of the same GovOps loop, returning outcomes into **Govern**:

```text
Govern → Authorize → Execute → Observe → Detect → Respond → Govern
                              └──── event handling ────┘
```

Authorization-time Challenges and event responses serve different purposes within that loop. A Challenge occurs in **Authorize**, before **Execute**. An event response occurs after **Observe** / **Detect**. Event handling may invoke the workflow needed to satisfy a Challenge (for example, requesting human approval), but the Policy Decision Point remains responsible for the final authorization decision.

The `capability_id` remains the common reference throughout the loop. It allows an event detected in infrastructure or runtime telemetry to be connected back to the capability owner, authorization policy, risk classification, and compliance obligations defined in the Governance Plane.

## Summary

GovOps provides an architecture for governing authorization at enterprise scale. The `capability_id` is the common unit that connects business risk, policy, schema, federation, authorization decisions, runtime telemetry, and compliance. Governance artifacts are managed centrally, while authorization decisions remain distributed and close to the applications and resources they protect. This gives governors a consistent way to understand what the enterprise can do, which rules control those capabilities, and who is accountable for them.

The architecture also extends governance beyond the authorization decision itself. By correlating `capability_id` with existing kernel observability tools, enterprises can connect what was authorized with what actually executed. That evidence can then flow back into risk management, threat detection, and continuous compliance — and, through Gemara mappings exported as OSCAL and managed in Trestle, into many compliance programs without remapping the same capabilities for each framework.

The result is the GovOps loop — **Govern → Authorize → Execute → Observe → Detect → Respond → Govern** — with `capability_id` as the join key. Define capabilities and map them once to a canonical control layer; authorize locally; observe execution; detect and respond; then reuse that governance work across compliance frameworks.

For the ACC artifact model and worked examples, see the [ACC design](../acc/authorization-capability-catalog-design.md) and [ACC use cases](../acc/authorization-capability-catalog-use-cases.md).

To follow GovOps discussions, join the [GovOps LinkedIn Group](https://gluu.co/govops-group).
