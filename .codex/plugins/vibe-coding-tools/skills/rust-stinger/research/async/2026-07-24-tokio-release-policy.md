---
source_url: https://docs.rs/crate/tokio/latest
retrieved_on: 2026-07-24
source_type: changelog
authority: official
relevance: critical
topic: tokio
stinger: rust-stinger
---

# Tokio current release and support policy

## Summary
Docs.rs records Tokio 1.53.1 released 2026-07-20. Tokio states that 1.51.x is LTS through March 2027 with MSRV 1.71, while current minor releases may move faster. A fixed-minor daemon dependency can choose an LTS line, but the choice must be reconciled with required APIs and security fixes.

## Key quotations / statistics
- "1.53.1 (2026-07-20)"
- "`1.51.x` - LTS release until March 2027. (MSRV 1.71)"

## Version/date caveat
Patch versions and LTS designations can change; this is a retrieval-time snapshot.

## Annotations for stinger-forge
- Use to frame current versus LTS version policy without choosing on the release peer's behalf.
- Record the transitive-dependency MSRV caveat stated by Tokio.

