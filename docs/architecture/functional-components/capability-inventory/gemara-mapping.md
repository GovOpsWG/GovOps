# Gemara Mapping

Each capability's catalog entry carries a reference to the Gemara control mapping that governs it: the `capability_id` is linked to one or more entries in a Gemara `MappingDocument`, which in turn ties the capability to specific control objectives in one or more compliance frameworks (for example ISO 27001, SOC 2, the EU Cyber Resilience Act).

This reference lives on the catalog entry so that governors can answer, from the inventory alone, which capabilities are already mapped to a framework and which are not — without re-deriving that mapping from policy or evidence each time.

The mapping metadata referenced here is just a pointer. The mechanics of how Gemara mappings are authored, kept current, and exported through OSCAL into audit tooling are covered in [Compliance](../compliance.md).
