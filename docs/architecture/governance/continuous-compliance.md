# Continuous Compliance

Compliance frameworks describe **controls**. Operational systems expose **capabilities**. The Authorization Capability Catalog connects those two worlds. Abstract-control mappings, Trestle/OSCAL projection, and the Gemara export path are detailed in the ACC design (§8–9) and walked through in the compliance mapping use case (UC-02). Both are listed in the [ACC documents](../../acc/README.md).

Traditional compliance programs frequently operate separately from runtime authorization. Controls are documented in one system, policies are implemented somewhere else, and evidence is collected manually during an audit. GovOps closes this gap by treating the ACC as the common reference point between what the enterprise can do and what it is obligated to govern.

## From capabilities to controls (Gemara)

[Gemara](https://gemara.openssf.org) supplies the common data model. A `#CapabilityCatalog` defines the capabilities. A separate `#MappingDocument` records how a capability relates to one or more **abstract control objectives** (a canonical control layer), not directly to every framework's control numbers.

A mapping can assert that a capability such as *Approve Loan* supports an access-control objective, while preserving rationale, applicability, confidence, and mapping strength. That mapping is an explicit **governance assertion** — not proof that the control is already satisfied. Proof comes later from policy versions, authorization decisions, and runtime evidence.

Gemara's published tooling includes CUE schemas for validating YAML or JSON and the [`go-gemara`](https://github.com/gemaraproj/go-gemara) Go SDK for integrating Gemara structures into automated tools.

## Export path (Gemara → OSCAL → Trestle)

The export path is concrete:

1. **Load and validate.** An exporter loads the ACC as a Gemara `#CapabilityCatalog` and its accompanying `#MappingDocument`, and verifies that every source capability and target control exists.
2. **Translate to OSCAL.** Each Gemara relationship becomes an entry in an OSCAL **Mapping Collection**. Confidence and strength become OSCAL confidence, coverage, or properties; the mapping rationale is retained as remarks.
3. **Manage with Trestle.** [OSCAL Compass compliance-trestle](https://github.com/oscal-compass/compliance-trestle) reads the transformed data and constructs versioned OSCAL classes. Trestle's recommended transformer pattern separates file handling from data processing: read the native input, transform it into the OSCAL object hierarchy, validate it against the OSCAL schema, and write the resulting JSON.

Gemara defines the semantics. OSCAL defines the interchange format. Trestle manages the resulting compliance artifacts. Outputs can include a Mapping Collection, Component Definition, profile, or System Security Plan. Implementation statements and evidence can then be attached to the mapped controls and reused across NIST, SOC 2, ISO 27001, PCI DSS, or internal frameworks.

**Define the capability once. Map it once to a canonical control layer. Collect evidence once. Then use OSCAL and Trestle to reuse that governance work across many compliance programs.**

## Continuous evidence chain

Compliance joins the same stack shown in [Architecture at a Glance](../README.md#architecture-at-a-glance): frameworks project through Trestle/OSCAL onto abstract controls, `#MappingDocument` links those controls to ACC capabilities, and policy → decision → runtime evidence flows down the Runtime Plane and back up via `capability_id`.

An auditor should eventually identify the capabilities associated with a control, which policies govern them, which policy versions were active, and evidence of how those capabilities were exercised — without treating the mapping itself as certification. That turns compliance from a periodic documentation exercise into another pass through the GovOps loop.
