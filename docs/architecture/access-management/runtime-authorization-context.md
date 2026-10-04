# Runtime Authorization Context

GovOps requires a standard way to correlate an authorization decision with the execution that follows.

When a governed capability is evaluated, the Policy Decision Point should produce a compact authorization context containing enough information to identify the capability, the decision, and the policy state used to make that decision.

At minimum:

```text
capability_id
decision
decision_id
policy_store_id
policy_store_version
```

The `decision` may be:

```text
allow
deny
challenge
```

Where available, the context may also include identifiers for trusted evidence used in the decision:

```text
access_token.jti
id_token.jti
transaction_token.jti
```

The authorization context is not a copy of the policy, token, or authorization request. It is a set of stable correlation identifiers. Only those identifiers need to cross the boundary between the application and runtime layers — not tokens, policy text, or authorization entities. Token identifiers such as `jti` can join the authorization context to evidence from the identity layer.

The context should remain associated with the resulting execution for as long as practical. Depending on the platform, this association may use request context, thread-local storage, process metadata, container metadata, environment variables, or other propagation mechanisms. GovOps defines the required information, not the implementation mechanism.

For example:

```text
capability_id        = transfer:funds
decision             = allow
decision_id          = 9db214
policy_store_id      = payments
policy_store_version = 42
access_token.jti     = a81f...
```

That context is the join point in the [Architecture at a Glance](../README.md#architecture-at-a-glance) stack between authorization decision and application execution. The critical field is `capability_id` (business meaning); the remaining identifiers provide provenance (decision, policy version, trusted evidence). Runtime telemetry can then answer not only **what happened**, but **which governed capability was executing when it happened**.

## Authorization Challenges

Some authorization requests cannot be resolved from the evidence initially available.

A `Challenge` is an intermediate authorization outcome. It means additional evidence is required before the Policy Decision Point can make a final authorization decision.

A challenge should contain enough information to correlate the request with the capability and identify the additional evidence required.

For example:

```text
challenge_id
capability_id
reason
required_evidence
expires_at
```

Required evidence may include:

```text
phishing-resistant authentication
manager approval
device attestation
transaction confirmation
additional credential
```

The challenge remains associated with the same `capability_id` and authorization request.

```text
Authorization Request
        ↓
Policy Evaluation
        ↓
   ┌────┴─────────────┐
 Allow   Deny    Challenge
                  ↓
          Obtain Evidence
                  ↓
          Re-evaluate Policy
                  ↓
          Allow | Deny
```

A Challenge is not a weaker form of Allow. The protected capability does not execute until the required evidence is obtained and authorization is evaluated again.

GovOps does not require the underlying policy language itself to implement a three-valued decision model. A Policy Decision Point may internally use binary policy evaluation while the surrounding authorization service determines that additional evidence is required and returns a Challenge.
