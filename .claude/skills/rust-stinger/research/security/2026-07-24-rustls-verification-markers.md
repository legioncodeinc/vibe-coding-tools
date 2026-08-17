---
source_url: https://rustls.dev/src/rustls/verify.rs.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: typestate
stinger: rust-stinger
---

# rustls verification marker types

## Summary
rustls uses non-constructible marker values to encode that certificate-chain and handshake-signature verification occurred before traffic state is reached. The source explicitly frames this as protection against omitted-check control flow. This is directly relevant as prior art for non-forgeable replay/promotion authorization tokens.

## Key quotations / statistics
- "bind the fact some verification ... has taken place into protocol states"
- "compiler check that there are no `goto fail`-style elisions"

## Version/date caveat
Source view from rustls.dev may track development rather than the pinned 0.23 release; use the pattern, not an internal type dependency.

## Annotations for stinger-forge
- Key evidence for private constructors and capability tokens representing completed checks.
- Do not couple the router's state machine to rustls internal marker types.

