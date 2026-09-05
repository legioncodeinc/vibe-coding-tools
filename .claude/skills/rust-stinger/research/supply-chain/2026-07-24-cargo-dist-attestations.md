---
source_url: https://axodotdev.github.io/cargo-dist/book/supplychain-security/attestations/github.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: provenance
stinger: rust-stinger
---

# cargo-dist GitHub artifact attestations

## Summary
dist can enable GitHub artifact attestations, creating verifiable provenance linked to GitHub Actions and Sigstore. The feature is disabled by default and has repository/plan limitations. Verification uses `gh attestation verify`, so evidence must include both generation and consumer verification transcripts.

## Key quotations / statistics
- "Artifact Attestations is disabled by default"
- Verification is supported via "`gh attestation verify`"

## Version/date caveat
The page labels GitHub Artifact Attestations public beta and records eligibility constraints that may change.

## Annotations for stinger-forge
- Supports provenance as an explicit opt-in release gate, not an assumed dist feature.
- Signing identity/workflow permissions remain release/security peer concerns.
