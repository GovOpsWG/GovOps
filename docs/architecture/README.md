## Table of Contents

1. [Architecture at a Glance](#architecture-at-a-glance)
2. [What is Governance?](#what-is-governance)
3. [Where to go next](#where-to-go-next)
4. [Summary](#summary)

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

The catalog design and use cases are listed in the [ACC documents](../standards/acc/README.md).

Google's July 2026 whitepaper [Beyond Zero: Enterprise security for the AI era](https://spawn-queue.acm.org/doi/10.1145/3819083) calls for open architectures that enhance transparency into access. GovOps aligns with Beyond Zero's principle that security must move to distributed, local resource/action-based authorization decisions.

## What is Governance?

It is de rigueur to proclaim that AI needs governance, or AI needs guardrails. But what does it mean to govern? Who governs? What must governors do?

Enterprises govern to achieve **security** — literally *securus*, "without care" — so accountable leaders can sleep at night. To *govern* is to steer (Greek κυβερνᾶν, *kybernan*). GovOps names three steering responsibilities: **risk management** (prioritize the most likely risks with the biggest business impact), **accountability** (know who to call when things go wrong), and **observability** (see enterprise risk, or fly blind).

Who governs? Humans. AI can assist; it cannot abdicate board and management responsibility. This document proposes the architecture for that work amid agentic transformation.

See [Actors and responsibilities](./actors-and-responsibilities.md) for how this plays out across the four layers below.

## Where to go next

Effective authorization governance depends on four layers: **governance, access, observability, and identity**. Each layer answers a different question. How does the enterprise manage risk? Who may do what? What is actually happening? Who or what is acting? GovOps owns the governance layer; it asks the other three to be governable, exposing the artifacts and evidence governance needs, keyed on `capability_id`.

* [Actors and responsibilities](./actors-and-responsibilities.md) — who governs, and what each layer is responsible for.
* [Layers](./layers/README.md) — Identity, Observability, Access, and Governance: what each layer provides and what it must expose to be governable.
* [Functional components](./functional-components/README.md) — the services GovOps defines (Capability Inventory, Evidence, Compliance, the GovOps Dashboard) and the services it depends on most.

## Summary

GovOps provides an architecture for governing authorization at enterprise scale. The `capability_id` is the common unit that connects business risk, policy, schema, federation, authorization decisions, runtime telemetry, and compliance. Governance artifacts are managed centrally, while authorization decisions remain distributed and close to the applications and resources they protect. This gives governors a consistent way to understand what the enterprise can do, which rules control those capabilities, and who is accountable for them.

The architecture also extends governance beyond the authorization decision itself. By correlating `capability_id` with existing kernel observability tools, enterprises can connect what was authorized with what actually executed. That evidence can then flow back into risk management, threat detection, and continuous compliance — and, through Gemara mappings exported as OSCAL and managed in Trestle, into many compliance programs without remapping the same capabilities for each framework.

The result is the GovOps loop — **Govern → Authorize → Execute → Observe → Detect → Respond → Govern** — with `capability_id` as the join key. Define capabilities and map them once to a canonical control layer; authorize locally; observe execution; detect and respond; then reuse that governance work across compliance frameworks.

For the ACC artifact model and worked examples, see the [ACC documents](../standards/acc/README.md).

To follow GovOps discussions, join the [GovOps LinkedIn Group](https://gluu.co/govops-group).
