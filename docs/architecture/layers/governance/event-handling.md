# Event Handling and Response

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
