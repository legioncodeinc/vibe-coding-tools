---
source_url: https://docs.rs/ratatui/latest/ratatui/init/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: terminal
stinger: rust-stinger
---

# Ratatui terminal initialization and restoration

## Summary
Ratatui 0.30.2 recommends `run` for ownership of terminal setup/cleanup, or fallible `try_init`/`try_restore` when the application needs explicit handling. Helpers manage raw mode, alternate screen, and a panic hook that restores the terminal. Manual construction transfers teardown responsibility to the application.

## Key quotations / statistics
- `run` "automatically restores the terminal state"
- "All initialization functions install a panic hook"

## Version/date caveat
`run` was introduced in 0.30.0; older examples may show manual lifecycle code.

## Annotations for stinger-forge
- Grounds terminal cleanup on success, error, panic, and cancellation.
- Favor the headless CLI/control client; keep the TUI a thin optional surface.

