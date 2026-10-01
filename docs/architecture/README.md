## Table of Contents

1. [Architecture at a Glance](#architecture-at-a-glance)
2. [What is Governance?](#what-is-governance)
3. [Big Picture: Where does governance fit in the IT landscape](#big-picture-where-does-governance-fit-in-the-it-landscape)
4. [GovOps Services](#govops-services)
   1. [Reference Architecture](#reference-architecture)
   2. [Governability requirements](#governability-requirements)
   3. [Service pages](#service-pages)
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

Our society is in the midst of a multi-generational digital transformation. Enterprises are expanding their digital footprints, especially to capture productivity gains from autonomous software agents that use large language models ("LLMs") to plan actions and achieve goals. Effective authorization governance depends on four layers: **governance, access management, observability, and identity**. Each layer answers a different question. How does the enterprise manage risk? Who may do what? What is actually happening? Who or what is acting?

GovOps owns the governance layer. It does not replace the other three. Instead, it asks them to be governable. Each must expose the artifacts and evidence that governance needs, keyed on `capability_id`. [Governability requirements](#governability-requirements) lists what each layer must provide.

The **governance layer** is what GovOps owns. The Capability Catalog identifies the actions and resources the enterprise wants to govern and assigns business context such as risk, impact, and ownership. Continuous Evidence collects runtime evidence and links it to the capabilities in the catalog. Continuous Compliance maps capabilities and their evidence to control objectives and regulatory requirements. Governance Metrics measure risk, accountability, and coverage, using `capability_id` as the unit.

The **access management layer** defines and enforces who may do what. It includes Policy Authoring, authorization, Schema Management, Federation Management, Shared Signals, identity governance and administration (IGA), and privileged access management (PAM). Policy Authoring defines the rules that control capabilities. Schema Management defines the entities, attributes, and context those policies can reference. Federation Management defines which external issuers, credentials, and claims the enterprise is willing to trust. These artifacts are managed centrally, but decisions are made locally, close to the resource.

The **observability layer** provides evidence about what is actually happening. Using the nautical metaphor, observability gives governors the charts and instruments needed to steer. For authorization governance, this may include authorization decision logs, SIEM, identity threat detection and response (ITDR), analytics, threat detection, session recording, application telemetry, network observability, and kernel observability tools. Observability should connect technical events back to governed capabilities so that governors can understand activity in business terms. LLMs may help analyze and summarize this evidence, but the underlying telemetry remains the source of truth.

The **identity layer** establishes identifiers and trusted evidence about the entities participating in authorization. GovOps groups these entities as human, software, and organization identities. Software identities include applications, workloads, devices, and AI agents. Identity systems typically associate identifiers with cryptographic keys, credentials, attributes, or other evidence that can be verified by the authorization system. Human workforce identity is relatively mature, while software, workload, organizational, and agent identity standards continue to evolve. The identity layer therefore provides evidence about actors; governance policy determines what that evidence permits them to do. Identity data also enriches evidence, so each record can be traced to the actor behind it.

**Response** closes the loop. It determines what happens when the enterprise detects a condition that requires action. Events may come from any of the four layers. A response may invoke a workflow, require additional authorization, revoke a credential, quarantine a workload, notify an accountable owner, trigger an AI agent, or require a human decision. Response converts governance evidence into operational action.

[Figure 1.1](./images/figure_1_1.jpg) shows an earlier version of this model, with Event as a separate layer. It will be updated. The GovOps loop and plane diagram are in [Architecture at a Glance](#architecture-at-a-glance).


## GovOps Services

GovOps defines a set of shared services that enable governors to manage authorization across many applications, APIs, workloads, infrastructure components, and AI agents. These services provide the connection between business governance and distributed enforcement.

The key architectural principle is that the enterprise should be able to trace a governed capability from its definition in the catalog, through authorization policy, into the application and ultimately down to runtime execution. In other words, the `capability_id` should be able to travel from the catalog to the kernel.

This does not mean authorization decisions need to be centralized. In fact, GovOps supports local authorization decisions close to the application, resource, or action being protected. What should be centralized are the governance artifacts necessary to understand and manage those decisions across the enterprise.

GovOps owns four services: the **Capability Catalog**, **Continuous Evidence**, **Continuous Compliance**, and **Governance Metrics**. It also defines what the access management, observability, and identity layers must provide to be governable. The service pages cover the GovOps services and the services in other layers that GovOps depends on most: **Policy Management**, **Schema Management**, **Federation Management**, the **Runtime Authorization Context**, and **Kernel Observability**.

### Reference Architecture

GovOps separates the architecture into two planes: a **Governance Plane** and a **Runtime Plane**. The canonical diagram is in [Architecture at a Glance](#architecture-at-a-glance).

The Governance Plane manages the shared artifacts required to govern authorization across the enterprise. These include the Authorization Capability Catalog, Policy Stores, authorization schemas, federation configuration, compliance mappings, and governance evidence. These artifacts are centrally managed so governors can understand and measure authorization consistently across many systems. GovOps does not own all of them. Policy, schema, and federation belong to the access management layer. They sit in the Governance Plane because they are managed centrally, not because GovOps runs them.

The Runtime Plane performs authorization close to the resource or action being protected. Applications, APIs, workloads, infrastructure, and AI agents use local or embedded Policy Decision Points to evaluate policy. Each authorization decision references the governed `capability_id` and the versions of the policy and evidence used to make the decision.

The two planes are connected by stable identifiers rather than by a centralized runtime authorization service. Most importantly, the `capability_id` defined in the ACC is carried into the authorization decision and associated with subsequent telemetry.

This architecture allows authorization to remain distributed while governance remains centralized. A mobile application, database, Kubernetes workload, or AI agent can make authorization decisions locally while still using centrally governed capabilities, policies, schemas, and federation rules.

Runtime evidence flows in the opposite direction along the stack in Architecture at a Glance. Authorization decisions and observability data are correlated with the same `capability_id` and returned to the Governance Plane — the **Observe → Detect → Respond → Govern** half of the GovOps loop.

### Governability requirements

GovOps does not run access management, observability, or identity systems. It asks each layer to be governable. The requirements below say what each layer must provide. The exact evidence claims will come from a profile of TRACE, which is in progress.

Access management:

* Record every authorization decision with the `capability_id`, the decision (Allow, Deny, or Challenge), and the versions of the policy and evidence used.
* Keep policy, schema, and federation artifacts centrally versioned, so a decision can be traced to the artifact versions behind it.
* Make decisions available as evidence, not only as local logs.

Observability:

* Link what executed to the authorization decision that allowed it, using the same `capability_id`.
* Report when expected evidence is missing or dropped, rather than failing silently.

Identity:

* Provide verifiable identifiers for human, software, and organization actors.
* Provide the attributes and status, such as revocation, needed to enrich evidence about who or what acted.

### Service pages

Each service has its own page.

Governance:

* [Capability Catalog](./governance/capability-inventory.md)
* [Continuous Evidence](./governance/continuous-evidence.md) (to be added)
* [Continuous Compliance](./governance/continuous-compliance.md)
* [Governance Metrics](./governance/telemetry-dashboard.md)

Access Management:

* [Centralized Policy Management](./access-management/policy-management.md)
* [Schema Management](./access-management/schema-management.md)
* [Federation Management](./access-management/federation-management.md)
* [Runtime Authorization Context](./access-management/runtime-authorization-context.md)

Observability:

* [Kernel Observability](./observability/kernel-observability.md)

Identity:

* [Identity](./identity/identity.md) (to be added)

Event handling:

* [Event Handling and Response](./event-handling.md)


## Summary

GovOps provides an architecture for governing authorization at enterprise scale. The `capability_id` is the common unit that connects business risk, policy, schema, federation, authorization decisions, runtime telemetry, and compliance. Governance artifacts are managed centrally, while authorization decisions remain distributed and close to the applications and resources they protect. This gives governors a consistent way to understand what the enterprise can do, which rules control those capabilities, and who is accountable for them.

The architecture also extends governance beyond the authorization decision itself. By correlating `capability_id` with existing kernel observability tools, enterprises can connect what was authorized with what actually executed. That evidence can then flow back into risk management, threat detection, and continuous compliance — and, through Gemara mappings exported as OSCAL and managed in Trestle, into many compliance programs without remapping the same capabilities for each framework.

The result is the GovOps loop — **Govern → Authorize → Execute → Observe → Detect → Respond → Govern** — with `capability_id` as the join key. Define capabilities and map them once to a canonical control layer; authorize locally; observe execution; detect and respond; then reuse that governance work across compliance frameworks.

For the ACC artifact model and worked examples, see the [ACC design](../acc/authorization-capability-catalog-design.md) and [ACC use cases](../acc/authorization-capability-catalog-use-cases.md).

To follow GovOps discussions, join the [GovOps LinkedIn Group](https://gluu.co/govops-group).
