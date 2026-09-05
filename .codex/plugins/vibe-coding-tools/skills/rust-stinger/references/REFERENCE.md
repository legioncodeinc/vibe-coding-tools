# Rust Stinger reference map

This is the entry point for deep Rust reference material that should not live in the root `SKILL.md`.

## Choose the right reference

| Need | Load |
|---|---|
| Current stable Rust, recent release changes, Cargo security floors, or an upgrade plan | `CURRENT-RUST.md` |
| Upcoming compiler or Cargo work that is still nightly-only | `NIGHTLY-WATCHLIST.md` |
| AI-assisted contribution to `rust-lang/rust` | `UPSTREAM-RUST-LLM-POLICY.md` |
| Claim-level current research synthesis | `research/distilled-rust-current.md` |
| Primary-source notes behind a current claim | `research/raw/` |
| Broader async, persistence, boundary, CLI/TUI, testing, or packaging evidence from the original pair | `../research/index.md` and `../research/evidence-synthesis.md` |

## Evidence discipline

- Re-fetch current Rust, Cargo, Clippy, rustup, RustSec, and relevant ecosystem releases at the decision point.
- Keep current build toolchain, release toolchain, edition, resolver, and declared/tested MSRV separate.
- Label nightly information as experimental and pin its exact date.
- Treat the upstream LLM policy as scoped to the repositories and teams it names.
- Generate static discovery with `../scripts/inspect-rust-workspace.py`, then verify behavior with the repository's actual Cargo commands.

## Output references

- `../templates/acceptance-slice-checklist.md` for bounded implementation scope.
- `../templates/implementation-handoff.md` for acceptance-linked completion or blocker reporting.
- `../templates/release-evidence-manifest.yaml` for local artifact and gate evidence.
- `../templates/rust-decision-log.md` for version-sensitive implementation decisions.

Actual execution reports belong in the target repository's root `library/` hierarchy, not inside this Stinger.
