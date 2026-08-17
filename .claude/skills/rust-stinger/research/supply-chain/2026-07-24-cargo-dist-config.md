---
source_url: https://axodotdev.github.io/cargo-dist/book/reference/config.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: packaging
stinger: rust-stinger
---

# cargo-dist artifact and installer configuration

## Summary
cargo-dist configures target builds, archives, checksums, source tarballs, extra artifacts, and shell/PowerShell/npm/Homebrew/MSI installers. It can integrate cargo-auditable and cargo-cyclonedx. Checksums are unsigned integrity values; the docs explicitly describe stronger signed checksums as future work.

## Key quotations / statistics
- Default checksum is "sha256".
- "Future work is planned to support more robust signed checksums."

## Version/date caveat
Current docs include settings introduced through dist 0.31-era behavior; pin the generator because generated workflows/installers change.

## Annotations for stinger-forge
- Grounds release manifest, artifact naming, installer matrix, and checksum evidence.
- Release topology/publication/signing authorization remains with the release peer.

