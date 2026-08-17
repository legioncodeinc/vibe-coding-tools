---
source_url: https://doc.rust-lang.org/cargo/commands/cargo-package.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: package
stinger: rust-stinger
---

# Cargo package verification

## Summary
`cargo package` builds a distributable crate archive, lists controlled contents, injects best-effort VCS metadata, and rebuilds the extracted package to verify a clean package. The VCS metadata does not prove source provenance, and `--no-verify`/`--allow-dirty` weaken evidence.

## Key quotations / statistics
- It rebuilds "from scratch" from the package.
- "the provenance of the package is not verified"

## Version/date caveat
Stable Cargo 1.97-era docs; binary release archives produced by dist have separate contents and verification.

## Annotations for stinger-forge
- Supports package-content and clean-build checks for publishable crates.
- Do not confuse crate packaging proof with signed binary artifact provenance.

