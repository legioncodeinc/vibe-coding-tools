---
source_url: https://docs.rs/clap/latest/clap/type.Error.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: exits
stinger: rust-stinger
---

# Clap error and exit behavior

## Summary
Clap errors expose their kind, rendered form, stderr/stdout routing, printing, and exit code. Library/test paths can use non-exiting parse APIs, while the process boundary decides when to print and exit. Operational failures after parsing need a separate stable exit-code taxonomy.

## Key quotations / statistics
- The error API includes `exit_code`.
- The error API includes `use_stderr` and `render`.

## Version/date caveat
Clap 4.6.2 at retrieval; exact human rendering is not a stable machine protocol.

## Annotations for stinger-forge
- Supports separating parse errors from domain/transport exit codes.
- Require JSON/stdout contracts to avoid scraping colored human help/error output.

