---
source_url: https://embarkstudios.github.io/cargo-deny/checks/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: policy
stinger: rust-stinger
---

# cargo-deny checks

## Summary
cargo-deny evaluates licenses, duplicate/banned crates, advisories/yanks, and dependency sources from the resolved crate graph. Running the umbrella check uses defaults for sections not configured, so a repository needs an explicit reviewed policy rather than assuming tool defaults match its legal/security constraints.

## Key quotations / statistics
- Checks include "licenses", "bans", "advisories", and "sources".
- Advisories cover vulnerabilities, unmaintained crates, and yanked versions.

## Version/date caveat
Policy/schema changes across cargo-deny versions; pin both tool and configuration version.

## Annotations for stinger-forge
- Supports Rust-side evidence generation for dependency peer review.
- The Bee may run/report it but must not own final license/advisory exceptions.
