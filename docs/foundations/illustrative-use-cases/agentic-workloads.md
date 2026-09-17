# Use Case: Agentic Workloads

## Scenario: Natural Language Interface to Cloud-Native Infrastructure

This use case describes a scenario where a human operator uses a natural language interface (NLI) to deploy an application to a cloud-native environment (e.g., Kubernetes). This scenario involves multiple trust domains and is a good example of the type of complex, agentic workload that GovOps is designed to govern.

### Actors

- **Human Operator:** The user interacting with the NLI.
- **Natural Language Interface (NLI) Agent:** An agent that interprets the operator's commands.
- **Model Context Protocol (MCP) Server:** A server that provides the NLI agent with the necessary skills and context.
- **Kubernetes Cluster:** The target environment for the application deployment.
- **Identity Provider (IDP):** The provider that issues tokens to the various actors.

### Flow

1. The **Human Operator** issues a command to the **NLI Agent**, e.g., "Deploy the latest version of the `webapp` application."
2. The **NLI Agent** calls the **MCP Server** to get the necessary skills to perform this operation.
3. The **MCP Server** returns the relevant skills, which may involve interacting with the **Kubernetes Cluster**.
4. The **NLI Agent**, acting on behalf of the operator, makes a request to the **Kubernetes Cluster** to deploy the application.
5. The **Kubernetes Cluster** and its components (e.g., API server, custom admission controllers) evaluate the request against their policies.

### GovOps in Action

In this scenario, GovOps can be used to govern the interactions between the different components:

- **Capability Definition:** Each operation (e.g., `deploy-application`, `get-mcp-skill`) is defined as a capability in the Authorization Capability Catalog (ACC).
- **Policy Enforcement:** Policies are enforced at multiple points:
    - The **MCP Server** may have policies that restrict which agents can access which skills.
    - The **Kubernetes Cluster** will have policies that restrict who can deploy applications.
- **Runtime Observability:** As each policy is evaluated, an observable event is generated. This provides a complete, real-time audit trail of the entire operation, from the initial NLI command to the final deployment.
- **Metrics:** The observable events can be used to generate metrics, such as the number of successful deployments, the number of denied requests, and the denial ratio trend.
