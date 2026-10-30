# Governance

The governance layer is what GovOps owns. The Capability Catalog identifies the actions and resource types the enterprise wants to govern and assigns business context such as risk, impact, and ownership. Continuous Evidence collects runtime evidence and links it to the capabilities in the catalog. Continuous Compliance maps capabilities and their evidence to control objectives and regulatory requirements. The GovOps Dashboard calculates, visualizes, and reports governance metrics, organized by layer as Identity, Access, Observability, and Governance metrics, measuring risk, accountability, and coverage using `capability_id` as the unit.

Each of these is a functional component with its own page — see [Functional components](../../functional-components/README.md).

**Response** closes the loop. It determines what happens when the enterprise detects a condition that requires action. Events may come from any of the four layers. A response may invoke a workflow, require additional authorization, revoke a credential, quarantine a workload, notify an accountable owner, trigger an AI agent, or require a human decision. Response converts governance evidence into operational action — see [Event Handling and Response](./event-handling.md).
