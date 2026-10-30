# Illustrative Use Cases

Proposed examples of GovOps applied to concrete scenarios — three sector-specific deep dives and one
set of shorter, cross-cutting scenarios. See [`./govops-thesis.md`](./govops-thesis.md) for the
underlying model these use cases apply, and [`./stakeholder-goals.md`](./stakeholder-goals.md) for
what each business function gets out of it.

## Agentic Workloads

### Scenario: Natural Language Interface to Cloud-Native Infrastructure

This use case describes a scenario where a human operator uses a natural language interface (NLI) to deploy an application to a cloud-native environment (e.g., Kubernetes). This scenario involves multiple trust domains and is a good example of the type of complex, agentic workload that GovOps is designed to govern.

#### Actors

- **Human Operator:** The user interacting with the NLI.
- **Natural Language Interface (NLI) Agent:** An agent that interprets the operator's commands.
- **Model Context Protocol (MCP) Server:** A server that provides the NLI agent with the necessary skills and context.
- **Kubernetes Cluster:** The target environment for the application deployment.
- **Identity Provider (IDP):** The provider that issues tokens to the various actors.

#### Flow

1. The **Human Operator** issues a command to the **NLI Agent**, e.g., "Deploy the latest version of the `webapp` application."
2. The **NLI Agent** calls the **MCP Server** to get the necessary skills to perform this operation.
3. The **MCP Server** returns the relevant skills, which may involve interacting with the **Kubernetes Cluster**.
4. The **NLI Agent**, acting on behalf of the operator, makes a request to the **Kubernetes Cluster** to deploy the application.
5. The **Kubernetes Cluster** and its components (e.g., API server, custom admission controllers) evaluate the request against their policies.

#### GovOps in Action

In this scenario, GovOps can be used to govern the interactions between the different components:

- **Capability Definition:** Each operation (e.g., `deploy-application`, `get-mcp-skill`) is defined as a capability in the Authorization Capability Catalog (ACC).
- **Policy Enforcement:** Policies are enforced at multiple points:
    - The **MCP Server** may have policies that restrict which agents can access which skills.
    - The **Kubernetes Cluster** will have policies that restrict who can deploy applications.
- **Runtime Observability:** As each policy is evaluated, an observable event is generated. This provides a complete, real-time audit trail of the entire operation, from the initial NLI command to the final deployment.
- **Metrics:** The observable events can be used to generate metrics, such as the number of successful deployments, the number of denied requests, and the denial ratio trend.

## Financial Sector

### Scenario: Automated High-Value Transaction Approval

In a modern financial institution, an automated trading system (an AI agent) is authorized to execute high-value transactions based on market conditions. The system is designed to act quickly to capitalize on opportunities, operating 24/7 without direct human intervention for every trade.

#### The Challenge

- **Risk of Errors or Malicious Activity:** A bug in the agent's code or a security compromise could lead to catastrophic financial losses in a very short amount of time.
- **Lack of Real-time Oversight:** How do risk officers and compliance teams monitor the agent's behavior in real-time? Traditional audit logs are reviewed after the fact, which is too late to prevent a major incident.
- **Complex Authorization Logic:** The authorization rules for the trading agent are complex, involving factors like market volatility, transaction value, and the agent's own risk score. It's difficult to get a clear picture of what the agent is allowed to do and what it is actually doing.

#### GovOps in Action

1.  **Capability Definition:** The action of executing a high-value trade is defined as a capability in the ACC, e.g., `execute-trade-over-1M`. This capability is assigned a high-risk and high-business-impact rating.

2.  **Runtime Observability:** Every time the trading agent attempts to execute a trade, the authorization decision from the underlying policy engine (e.g., OPA) is made observable as a GovOps event. This event includes:
    *   `capability_id: execute-trade-over-1M`
    *   `decision: allow` (or `deny`)
    *   `identity: trading-agent-prod-us-east-1`
    *   `context: { "transaction_value": 1.2M, "market_volatility": 0.78 }`

3.  **Governance and "Closing the Loop":**
    - **Real-time Monitoring and Alerting:** A monitoring system ingests the stream of GovOps events. The system can be configured to send an immediate alert to the risk management team if, for example, the number of `execute-trade-over-1M` events exceeds a certain threshold within a given time period.
    - **Automated Response:** If an anomalous pattern is detected (e.g., a single agent executing an unexpectedly high volume of trades), an automated workflow can be triggered to temporarily suspend the agent's privileges, effectively "closing the loop" and preventing further risk.
    - **Audit and Compliance:** The immutable log of observable events provides a complete and granular audit trail for compliance purposes, showing not just that a trade happened, but what capability was invoked and why the decision was made.

### Value of GovOps

In this scenario, GovOps provides a layer of real-time governance and risk management on top of the automated trading system. It moves beyond simple, static authorization to provide dynamic observability and control, which is essential for managing the risks associated with high-speed, autonomous financial systems.

## Healthcare Sector

### Scenario: AI-Powered Medical Diagnosis and Record Sharing

- A hospital uses an AI-powered diagnostic tool that analyzes patient medical records (Protected Health Information - PHI) to assist doctors in identifying potential illnesses.
- To provide a comprehensive diagnosis, the AI tool needs to access patient records from multiple sources, including the hospital's own Electronic Health Record (EHR) system and potentially external records from other providers, with patient consent.

#### The Challenge

- **Data Privacy and Compliance:** Access to PHI is strictly regulated by laws like HIPAA. The hospital must be able to demonstrate exactly who or what accessed patient data, when, and for what purpose. Unauthorized access can lead to severe penalties and a loss of patient trust.
- **Complex Access Rules:** The rules for accessing patient data are complex. A doctor may have broad access, while a researcher may only have access to anonymized data, and the AI tool may have access only to specific parts of a record for a limited time.
- **Audit Trail Complexity:** Generating a meaningful and comprehensive audit trail in a distributed system with multiple actors (doctors, AI agents, external providers) is extremely challenging.

#### GovOps in Action

1.  **Capability Definition:** Accessing patient data is broken down into granular capabilities in the ACC:
    *   `view-patient-demographics`
    *   `view-patient-lab-results`
    *   `access-anonymized-patient-dataset`
    *   `share-patient-record-with-consent`
    Each capability is tagged with metadata, such as `data-type: phi` and `risk: high`.

2.  **Runtime Observability:** When the AI diagnostic tool requests access to a patient's lab results, the underlying authorization system makes a decision. This decision is then exposed as a GovOps event, regardless of the outcome.
    *   `capability_id: view-patient-lab-results`
    *   `decision: allow`
    *   `identity: ai-diagnostic-agent-oncology-dept`
    *   `context: { "patient_id": "12345", "requester_id": "dr-jane-doe" }`

3.  **Governance and "Closing the Loop":**
    - **Granular Auditing:** The stream of GovOps events creates a perfect, real-time audit log. A compliance officer can easily query the logs to answer questions like, "Show me all access events for patient 12345 in the last 24 hours" or "Show me every time the AI agent accessed PHI."
    - **Anomaly Detection:** A security system can monitor the event stream for anomalous behavior. For example, if the AI agent, which normally accesses a few records per minute, suddenly starts requesting thousands of records, an alert can be triggered. This could be a sign of a system malfunction or a security breach.
    - **Patient Consent and Trust:** By providing a transparent and auditable record of data access, the hospital can better demonstrate its commitment to patient privacy, thereby building trust with its patients.

### Value of GovOps

In this healthcare scenario, GovOps provides the necessary framework for governing access to sensitive patient data in a complex and dynamic environment. It moves the focus from a simple "allow/deny" to a more comprehensive governance model that includes fine-grained observability, real-time monitoring, and a detailed audit trail. This is essential for meeting compliance requirements and protecting patient privacy in the age of AI-driven healthcare.

## Additional Governance Scenarios

The three sector scenarios above illustrate GovOps end-to-end in a specific industry context. The
scenarios below are shorter and cut across sectors — each highlights a single governance capability
in Situation / Need / How / Outcome form, and several point directly at named open gaps.

### AI agent capability drift

**Situation.** An AI agent is granted a capability (e.g., read access to a resource) for a specific
task. Over a long-running session, the agent spins up subagents and calls tools that were not part
of the original grant's intent.

**Need.** A way to tell, after the fact, whether the agent's actual behavior stayed within the scope
of what was granted, without relying solely on the agent's own self-reported logs.

**How GovOps addresses it.** The capability grant is tied to a `capability_id` with an explicit
scope — compare to Meta Muse's capability grants, bound to connector/destination/use-case with
lifecycle scope (see `./positioning.md`). Kernel observability provides independent proof
of what the agent's process actually touched, joined on the same identifier.

**Outcome.** Drift between granted scope and actual behavior becomes detectable (the Detect step of
the GovOps loop) instead of invisible.

### Credential revocation during execution

**Situation.** A credential backing an in-flight action is revoked mid-execution.

**Need.** To know whether the revocation actually stopped anything, and what happened to the
execution that was already underway.

**How GovOps addresses it.** By separating authorization evidence (why an action was allowed, at
decision time) from execution evidence (what actually happened, potentially after revocation).
This is a named, currently unresolved gap, not a solved problem.

**Outcome.** A defined contract for what "revoked" means for work already in flight, instead of an
undefined edge case.

### Compliance audit preparation

**Situation.** An audit cycle is approaching (SOC 2, ISO 27001, or the EU Cyber Resilience Act), and
evidence has to be assembled manually from disparate systems.

**Need.** Continuous, ready evidence rather than a scramble at audit time.

**How GovOps addresses it.** Capability-level governance and execution evidence maps through Gemara
to OSCAL, which already has profiles for these frameworks.

**Outcome.** Audit prep becomes an export, not a reconstruction project.

### Cross-functional incident review

**Situation.** Something goes wrong involving a governed action. Security, audit, legal, and finance
each need to understand what happened, but each function currently works from its own siloed system
of record.

**Need.** One shared account of "what was authorized, what actually happened" that every function
can query without reconciling separate logs.

**How GovOps addresses it.** The `capability_id`-anchored trail is function-agnostic: the same record
security uses for a security investigation is the record legal uses to check a contractual
obligation. See `./govops-thesis.md#a-cross-functional-governance-deal-not-just-a-compliance-tool`.

**Outcome.** Incident review time shrinks because the cross-department reconciliation step is largely
eliminated.

### Third-party and federated trust review

**Situation.** An organization needs to periodically review which external issuers or token sources
it trusts, and why — third-party risk management is one of the largest aggregate enterprise threats.

**Need.** A clear boundary between "which issuers do we trust" (a governance decision) and "is this
specific token valid right now" (a runtime check), so the review does not get tangled up with
runtime validation logic.

**How GovOps addresses it.** Federation Management owns the trust/onboarding decision; runtime
validation is a separate concern.

**Outcome.** Third-party trust reviews become a bounded, auditable exercise instead of an ad hoc one.

### Continuous governance metrics

**Situation.** Governance health is usually assessed periodically (a review meeting, an annual risk
assessment) rather than continuously.

**Need.** A live signal of whether governance is working, not just a point-in-time snapshot.

**How GovOps addresses it.** Metrics like the Denial Ratio Trend are computed continuously from the
same capability-anchored decision stream used for authorization itself.

**Outcome.** Governance drift becomes visible as a trend line, not something discovered only at the
next scheduled review.
