---
source_url: https://docs.sigstore.dev/cosign/signing/signing_with_blobs/
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: signing
stinger: rust-stinger
---

# Cosign blob signing

## Summary
Cosign signs ordinary files with keyless OIDC identities, local/KMS/hardware-backed keys, and emits a recommended bundle containing signature, certificate, and transparency-log proof. Noninteractive signing can create external effects and identity records, so it must remain an explicitly authorized release step.

## Key quotations / statistics
- "using a bundle is the recommended way of signing a blob"
- The bundle includes "proof of transparency log inclusion"

## Version/date caveat
Sigstore public infrastructure, identity claims, and command flags can change; capture the CLI version and verification policy.

## Annotations for stinger-forge
- Supports signing/verification transcript requirements, not automatic invocation.
- Signing identity and publication remain peer/user-authorized boundaries.
