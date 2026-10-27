# Standards

Standards is one of GovOps's three project deliverables, alongside Architecture and Metrics. It
holds the specifications that make authorization governance interoperable: a shared catalog format
for what a system can do, a shared evidence profile for what actually happened, and alignment with
the external request-shape standard that runtime policy decisions use.

- [Overview](./overview/README.md) — how the Authorization Capability Catalog, the GovOps TRACE
  Profile, and AuthZen relate to each other and to the GovOps loop.
- [Authorization Capability Catalog (ACC)](./acc/README.md) — the catalog model, the Authorization
  Capability Profile over Gemara, the Gemara-to-OSCAL-to-Trestle export path, and worked persona
  use cases.
- [GovOps TRACE Profile (GTP)](./gtp/README.md) — the GovOps evidence profile of the TRACE Trust
  Record: the schema changes required on top of the base TRACE v0.2 specification.
- [AuthZen](./authzen/README.md) — placeholder. How GovOps's capability model aligns with AuthZen's
  request shape; no dedicated draft exists yet.
