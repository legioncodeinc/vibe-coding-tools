# Rust nightly watchlist

This file records current experiments that may affect future Rust development. None of them are stable recommendations as of 2026-09-03.

| Experiment | Current nightly state | Safe use in a production repository |
|---|---|---|
| Polonius Alpha | Default borrow checker on nightly for testing; opt out with `-Zpolonius=off` | Add an exact-date nightly canary for advance compatibility only. Keep stable CI authoritative. |
| Next-generation trait solver | Default on nightly; opt out with `-Znext-solver=coherence` | Use a non-blocking canary and report inference, diagnostics, or performance changes. |
| Cargo future-version changelog entries | Cargo's living nightly changelog can show future-dated sections before release | Treat them as a watchlist. Never write them as stable features until the matching stable release ships. |
| Cargo `-Z` flags | Unstable features are nightly-only; exact-date pinning is this Stinger's reproducibility rule | Keep the flag, nightly date, stable comparison, fallback, and removal plan together. |

## Rules

1. Label every nightly claim `EXPERIMENTAL` and record the exact nightly date.
2. Do not raise MSRV, rewrite stable guidance, or ship a public compatibility promise from a nightly announcement.
3. Give each canary an opt-out and a stable comparison lane.
4. Re-fetch the official announcement and tracking issue before acting because nightly defaults can change before stabilization.
5. Promote a watchlist item only after its stable release notes and stable documentation agree.

## Sources

- `research/raw/rust--nightly--polonius-alpha.md`
- `research/raw/rust--nightly--next-trait-solver.md`
- `research/raw/rust--cargo--nightly-changelog.md`
- `research/raw/rust--cargo--unstable-features.md`
- `research/raw/rust--releases--stable-release-notes.md`
