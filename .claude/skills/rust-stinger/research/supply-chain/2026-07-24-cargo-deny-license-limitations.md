---
source_url: https://embarkstudios.github.io/cargo-deny/checks/licenses/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: licenses
stinger: rust-stinger
---

# cargo-deny license check limitations

## Summary
cargo-deny evaluates SPDX expressions and license files but explicitly cannot exhaustively prove a crate's legal licensing. It trusts manifest/package evidence and documents absence, mismatch, and unconventional-placement gaps. Clarifications are hash-bound evidence, not permanent blanket waivers.

## Key quotations / statistics
- "does not exhaustively search the entirety of the source code"
- It makes a "good-faith assumption" that crates define licensing correctly.

## Version/date caveat
License-list versions and cargo-deny detection behavior evolve; legal review cannot be replaced by a passing scan.

## Annotations for stinger-forge
- Prevent overclaiming `cargo deny` as legal clearance.
- Route exceptions and notices to dependency/legal/release peers with exact evidence.

