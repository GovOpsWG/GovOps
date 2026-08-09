## Introduction: What is Governance?

It is de rigour to proclaim that AI needs governance, or AI needs guardrails. But
what does it mean to govern? Why do enterprises even need to govern? Who governs? What are the key activities and responsibilities of governors? Without agreement on these questions, conversations at conferences quickly go off the rails.

Enteprises need to govern because they need "security". The word "security" has a latin derivation: *se*- → a prefix meaning without, and *cura* → a noun meaning care, concern or worry. So literally, “securus” means without care → free from worry → safe. So enterprises need to govern to achieve security so the people responsible for them can sleep soundly at night!

"Govern" is derived from the ancient Greek root κυβερνᾶν (kybernan) which meant to steer a ship. Metaphorically, the governors are the ones responsible to steer the ship around the rocks. Because we're talking about IT, and not sailing, GovOps defines three essential responsibilities of governors: (1) risk management--prioritize the most likely risks with the biggest business impact; (2) accountability--when things go wrong, you need to know who to call; (3) observability--tools to see enterprise risk, governors are "flying blind."

Who governs? Humans. AI cannot govern--that is called abdication. AI can help humans govern. But fundamentally, only humans bear responsibility for steering something as big and expensive as an enterprise. In a corporation, the Board of Directors is ultimately responsible. So they are the defacto governors, although they may delegate to management.

What are the key activities of governors? That is the purpose of GovOps -- it's a new gameplan for what governors need to do to effectively manage risk, hold the right entities accountable, and to build a transparent authorization system. This document proposes an architecture to best accomplish this task given the agentic transformation enterprises are facing.

Google's July, 2026 whitepaper [Beyond Zero: Enterprise security for the AI era](https://spawn-queue.acm.org/doi/10.1145/3819083) calls for "open architectures that can enhance transparency into access" and standardized approaches to realtime risk analysis. GovOps is a new approach to authorization governance which aligns with the Beyond Zero first principle that security must move to local resource/action-based authorization decisions.

## Big Picture: Where does governance fit in the IT landscape

Our society is in the midst of a multi-generational digital transformation. Enterprises are all expanding their digital footprints, especially to gain recent productivity advances unocked by autonomous software agents using large language models ("LLM") for planning actions to acheive goals. Effective authorization governance relies on four layers: governance, observability, identity, and event handling.

Using the nautical metaphor, "observability" is the layer that helps governors to see what's going on. For ships, observability is the result of charts and instruments. For authorization governance, observability may means that the enterprise is using threat detection,  SIEM, or kernel observability tools. LLMs may enhance observability by  analyzing the data to make it more comprehensible by humans.

One of the most important layers is "identity." This is the layer that insures that each entity has an identifier. The identity layer also typical stores public keys or shared secrets, so the identity can prove its authenticity. While human identity management is well trodden technology, especially with regard to workforce, software and organizational identity standards are developing and in various stages of adoption.

The final layer is Event handling. When an enteprise detects that something actionable has happened, how do they respond? In the event layer, this may mean executing a workflow stored in a graph. Or it may mean triggering an AI agent to react. Or it may require a human in the loop. The Event layer coordinates these reactions to events.

See [Figure 1.1](./images/figure_1_1.jpg) for a visualization of the four layers.

### GovOps Services

GovOps defines a set of shared services that enable governors to manage authorization across many applications, APIs, workloads, infrastructure components, and AI agents. These services provide the connection between business governance and distributed enforcement.

The key architectural principle is that the enterprise should be able to trace a governed capability from its definition in the catalog, through authorization policy, into the application and ultimately down to runtime execution. In other words, the `capability_id` should be able to travel from the catalog to the kernel.

This does not mean authorization decisions need to be centralized. In fact, GovOps favors local authorization decisions close to the application, resource, or action being protected. What should be centralized are the governance artifacts necessary to understand and manage those decisions across the enterprise.

The core GovOps services are the Capability Catalog, Policy Management, Schema Management, Federation Management, and Continuous Compliance.

#### Reference Architecture

GovOps separates the architecture into two planes: a **Governance Plane** and a **Runtime Plane**.

The Governance Plane manages the shared artifacts required to govern authorization across the enterprise. These include the Authorization Capability Catalog, Policy Stores, authorization schemas, federation configuration, compliance mappings, and governance evidence. These artifacts are centrally managed so governors can understand and measure authorization consistently across many systems.

The Runtime Plane performs authorization close to the resource or action being protected. Applications, APIs, workloads, infrastructure, and AI agents use local or embedded Policy Decision Points to evaluate policy. Each authorization decision references the governed `capability_id` and the versions of the policy and evidence used to make the decision.

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

A `Challenge` means that the available evidence is insufficient to make a final authorization decision. The caller must obtain the required additional evidence and resubmit the authorization request before the protected capability can execute.

The two planes are connected by stable identifiers rather than by a centralized runtime authorization service. Most importantly, the `capability_id` defined in the ACC is carried into the authorization decision and associated with subsequent telemetry.

This architecture allows authorization to remain distributed while governance remains centralized. A mobile application, database, Kubernetes workload, or AI agent can make authorization decisions locally while still using centrally governed capabilities, policies, schemas, and federation rules.

Runtime evidence flows in the opposite direction. Authorization decisions and observability data are correlated with the same `capability_id` and returned to the Governance Plane. Governors can therefore trace a capability from its business definition, through the policy that authorized it, to evidence about its actual execution.

The resulting architecture forms a continuous loop:

```text
Define → Govern → Authorize → Execute → Observe → Measure
   ↑                                                   │
   └───────────────────────────────────────────────────┘
```

### Capability Catalog

The Authorization Capability Catalog ("ACC") is a machine-readable inventory of what applications, APIs, infrastructure, workloads, and AI agents can actually do — the authorization surface the enterprise wants to govern.

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

The ACC is not just an inventory. Each capability is a governed object with a lifecycle.

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

Compliance frameworks describe **controls**. Operational systems expose **capabilities**. The Authorization Capability Catalog connects those two worlds.

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

This creates a machine-readable chain from obligations to operational evidence:

```text
Compliance frameworks (NIST, SOC 2, ISO, PCI, …)
        ↓  Trestle / OSCAL projection
Abstract control objectives (Gemara)
        ↓  #MappingDocument
Capability (ACC)
        ↓
Authorization Policy
        ↓
Authorization Decision
        ↓
Runtime Evidence
```

An auditor should eventually be able to identify the capabilities associated with a control, determine which policies govern those capabilities, verify which policy versions were active, and examine evidence showing how those capabilities were actually exercised — without treating the mapping itself as certification.

The same `capability_id` used in the ACC can appear in policy metadata, authorization decision logs, application telemetry, and runtime observability. Kernel observability tools can correlate an authorization context such as a token `jti` or decision identifier with a process, thread, workload, network connection, filesystem event, or other operating-system activity:

```text
ACC capability_id
        ↓
Policy
        ↓
Authorization Decision
        ↓
Authorization Context / jti
        ↓
Application and Runtime Execution
        ↓
Kernel Observability
        ↓
Governance Evidence
        ↓
Gemara / OSCAL / Trestle
```

The goal is not simply to prove that the enterprise has a policy. It is to provide governors with evidence that the policy was applied to the capabilities they care about and to show what happened when those capabilities were exercised. That turns compliance from a periodic documentation exercise into a continuous governance loop.

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

The authorization context is not a copy of the policy, token, or authorization request. It is a set of stable correlation identifiers.

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

Kernel observability tools can then associate process, filesystem, network, or system-call telemetry with this authorization context.

This creates a common join between the governance and observability layers:

```text
ACC
 ↓
capability_id
 ↓
Authorization Policy
 ↓
Authorization Decision
 ↓
Runtime Authorization Context
 ↓
Application / Workload Execution
 ↓
Kernel Observability
```

The critical field is `capability_id`. It provides the business meaning of the operation. The remaining identifiers provide provenance: which decision authorized it, which policy version governed it, and which trusted evidence contributed to the decision.

This enables runtime telemetry to answer not only **what happened**, but **which governed capability was executing when it happened**.

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

## Kernal Observability

Authorization proves that an operation was permitted. It does not prove what happened during execution. GovOps closes this gap by correlating authorization decisions with operating-system and kernel telemetry.

The architecture is:

```text
ACC
 ↓
Authorization Policy
 ↓
Authorization Decision
 ↓
Authorization Context
 ↓
Kernel Observability
 ↓
Governance Evidence
```

The key requirement is that the `capability_id` associated with an authorization decision can be correlated with the runtime activity that follows.

## Authorization Context

When a high-risk capability is authorized, the application can retain a compact execution context such as:

```text
capability_id
decision: (allow or deny)
policy_store_id
policy_store_version
id_token jti
```

This context does not require copying tokens, policy, or authorization entities into the kernel. Only identifiers needed for correlation must cross the boundary between the application and runtime layers. Token identifiers like `jti` can be used to join information from the Identity layer.

## Kernel Observability

Existing observability tools already provide visibility into runtime behavior.

Examples include:

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

They normally understand technical execution context such as processes, containers, namespaces, files, and network endpoints. GovOps adds business context. Making capability_id observable provides a more granular view of what is happening inside the application, and will enable a new class of tools for threat detection.

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

Authorization-time Challenges and event responses serve different purposes.

A Challenge occurs before a capability is exercised. It obtains additional evidence required to make a final authorization decision.

An event response occurs after an authorization, identity, runtime, compliance, or other governance event has been detected. Event handling may invoke the workflow needed to satisfy a Challenge, such as requesting human approval or additional authentication, but the Policy Decision Point remains responsible for the final authorization decision.

This creates a feedback path from runtime evidence back into governance:

```text
Govern
  ↓
Authorize
  ↓
Execute
  ↓
Observe
  ↓
Detect
  ↓
Respond
  ↓
Improve Governance
  ↺
```

The `capability_id` remains the common reference throughout the loop. It allows an event detected in infrastructure or runtime telemetry to be connected back to the capability owner, authorization policy, risk classification, and compliance obligations defined in the Governance Plane.

GovOps therefore treats event handling as the mechanism that converts governance evidence into operational response.

## Summary

GovOps provides an architecture for governing authorization at enterprise scale. The `capability_id` is the common unit that connects business risk, policy, schema, federation, authorization decisions, runtime telemetry, and compliance. Governance artifacts are managed centrally, while authorization decisions remain distributed and close to the applications and resources they protect. This gives governors a consistent way to understand what the enterprise can do, which rules control those capabilities, and who is accountable for them.

The architecture also extends governance beyond the authorization decision itself. By correlating `capability_id` with existing kernel observability tools, enterprises can connect what was authorized with what actually executed. That evidence can then flow back into risk management, threat detection, and continuous compliance — and, through Gemara mappings exported as OSCAL and managed in Trestle, into many compliance programs without remapping the same capabilities for each framework.

The result is a closed governance loop: define capabilities, map them once to a canonical control layer, manage policy, authorize locally, observe execution, collect evidence, and reuse that governance work across frameworks.

To follow GovOps discussions, join the [GovOps LinkedIn Group](https://gluu.co/govops-group).
