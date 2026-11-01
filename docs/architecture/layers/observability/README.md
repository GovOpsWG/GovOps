# Observability

The observability layer provides evidence about what is actually happening. Using the nautical metaphor, observability gives governors the charts and instruments needed to steer. For authorization governance, this may include authorization decision logs, SIEM, identity threat detection and response (ITDR), analytics, threat detection, session recording, application telemetry, network observability, and kernel observability tools. Observability should connect technical events back to governed capabilities so that governors can understand activity in business terms. LLMs may help analyze and summarize this evidence, but the underlying telemetry remains the source of truth.

GovOps does not run observability systems. It asks the observability layer to be governable:

* Link what executed to the authorization decision that allowed it, using the same `capability_id`.
* Report when expected evidence is missing or dropped, rather than failing silently.

See [Kernel Observability](./kernel-observability.md) for independent, process-level proof of what actually ran.
