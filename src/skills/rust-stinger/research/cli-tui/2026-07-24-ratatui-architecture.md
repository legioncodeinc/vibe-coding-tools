---
source_url: https://docs.rs/ratatui/latest/ratatui/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: medium
topic: tui
stinger: rust-stinger
---

# Ratatui crate architecture

## Summary
Ratatui's primary crate re-exports the application-facing surface, while lower-level workspace crates exist for custom widget libraries and backend-specific integrations. The docs recommend staying in the main crate unless a lower-level dependency is specifically needed, reducing feature and compile-time surface for ordinary applications.

## Key quotations / statistics
- "Most application authors should stay in this `ratatui` crate."
- "Reach for other crates ... only when you specifically need a lower-level layer"

## Version/date caveat
Ratatui 0.30.2; workspace decomposition may evolve.

## Annotations for stinger-forge
- Supports avoiding premature internal TUI crate fragmentation.
- Feature-gate the entire TUI and keep domain/control logic outside it.
