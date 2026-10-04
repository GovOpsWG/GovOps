# Kernel Observability

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
