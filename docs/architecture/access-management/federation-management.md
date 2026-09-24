# Federation Management

Authorization depends on evidence, and much of that evidence arrives in tokens or other signed credentials.

Federation Management defines which credentials the enterprise is willing to trust, from which issuers, and under what conditions.

An enterprise may accept JWTs from its workforce identity provider, customer identity systems, cloud platforms, partners, workload identity systems, AI agent registries, transaction-token issuers, or other external authorities. Each issuer may have different security practices, key-management procedures, claim semantics, assurance levels, token lifetimes, and revocation mechanisms.

Trusting an issuer should therefore be an explicit governance decision.

Federation Management should define, at minimum:

* trusted issuers;
* accepted token and credential types;
* acceptable signing algorithms;
* key discovery and rotation requirements;
* audiences;
* token lifetime requirements;
* required claims;
* claim mappings;
* assurance requirements;
* token status or revocation mechanisms;
* issuer-specific restrictions.

This becomes particularly important as authorization moves beyond a single access token. An authorization decision may combine evidence from a human identity token, workload token, transaction token, device attestation, delegation credential, or AI agent credential.

GovOps does not require that all of this evidence identify one canonical "subject." Instead, Federation Management determines which evidence the enterprise trusts, while authorization policy determines what that evidence permits.
