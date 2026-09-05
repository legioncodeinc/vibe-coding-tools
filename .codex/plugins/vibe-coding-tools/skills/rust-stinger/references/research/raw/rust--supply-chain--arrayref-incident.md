# Supply chain attack on arrayref
- URL: https://blog.rust-lang.org/2026/08/20/supply-chain-attack-on-arrayref/
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Published: 2026-08-20 by the Rust Security Response Team
- Confirmed behavior field: `proc-macro1` used a build script to download a malicious payload
- Publisher assessment field: the established-crate author was not believed malicious; the computer or credentials were likely compromised; the account was locked
- Deleted release fields: `append-only-vec@0.1.9`, `arrayref@0.3.10`, `internment@0.8.7`
- Deleted crate fields, any version: `proc-macro1`, `proc-macro-en`, `aovine`, `arone`, `aronenao`, `tinymember`
- Exposure intervals recorded by the source: 107 minutes, 86 minutes, and 90 minutes for the three established-crate releases above

## Archived facts

- The Rust Security Response Team confirmed that several malicious crates used a build script to download a payload.
- A compromised publisher account was used to release malicious versions of established crates and manipulate yanks.
- `arrayref` 0.3.10, `append-only-vec` 0.1.9, and `internment` 0.8.7 were among the deleted versions named by the response team.
- The incident notice instructed users to check local Cargo registry caches for the named crates and versions.

## Stinger relevance

`Cargo.lock` review alone is not enough after a disclosed compromise. Inspect the resolved graph, local and CI caches, build scripts, fetched artifacts, and build hosts. Rotating credentials or rebuilding hosts is a derived response step that depends on the actual exposure analysis.

## Scope caution

This source records a specific incident. Do not turn its affected-version list into a generic malicious-crate detector.
