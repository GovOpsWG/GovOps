# Schema Management

Authorization policies operate on data. Therefore, an enterprise cannot effectively govern policy without also governing the schemas that define that data.

For example, a policy might reference attributes such as:

```text
action.business_unit
resource.data_sensitivity
resource.geography
context.token.id_token.acr
```

If application teams disagree about the names, types, or meaning of these attributes, enterprise policy becomes difficult to analyze and eventually impossible to govern.

GovOps therefore treats authorization schemas as shared governance artifacts.

The schema defines the entity types, attributes, relationships, and actions that policy authors can reference. It also provides a contract between token issuers, applications, policy authors, and Policy Decision Points.

Schema governance should also extend to claims mapping. If an enterprise maps `department`, `country`, or `risk_level` from JWTs or other credentials into authorization entities, the schema should guarantee that those values can actually be represented and consumed by policy.

Without schema management, an enterprise may centrally manage policy while still having no guarantee that applications and identity systems are supplying the data those policies require.
