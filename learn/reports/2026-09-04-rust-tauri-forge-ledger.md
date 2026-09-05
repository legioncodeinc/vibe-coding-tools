# Rust and Tauri Stinger forge ledger

Date: 2026-09-05
Branch: `codex/rust-tauri-integration`
Base: `origin/main` at `ae0358b4b3ca6ff71841ed0e567593cd270278d3`
Method: `queen-bee-stinger` seven-stage forge

## Goal

Deliver two current, research-grounded development capabilities for all four Hive harnesses:

1. Refresh the newly merged `rust-worker-bee` and `rust-stinger` instead of creating an overlapping Rust pair.
2. Forge and register `tauri-worker-bee` and `tauri-stinger`, with current Tauri 2 update guidance and explicitly labeled AI application patterns.

## Acceptance criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-01 | Work is isolated from the user's unrelated dirty checkout on a feature branch based on current remote main. | VERIFIED | Separate integration worktree at `C:\Users\mario\GitHub\vibe-coding-tools-rust-tauri-integration`; branch and base recorded above. |
| AC-02 | Rust uses the existing registered pair and gains a Queen-format current research layer for the six-month window. | VERIFIED | `.claude/skills/rust-stinger/references/research/`, refresh guide, current references, inspector, and updated Bee/Stinger shells. |
| AC-03 | Rust current guidance identifies the stable patch accurately, separates current toolchain from MSRV, and distinguishes stable from nightly. | VERIFIED | `references/CURRENT-RUST.md`, `NIGHTLY-WATCHLIST.md`, the cited distillation, and the Rust 1.98 refresh example. |
| AC-04 | The new Tauri pair walks Topic, Research, Distillation, References, Guides, Skill File, and Register in order. | VERIFIED | `TOPIC.md`, dated raw archive, distillation, references, guides, examples, templates, root skill, Bee, guide, roster, and generated harness copies. |
| AC-05 | Tauri update notes use a dated package-by-package ledger and do not confuse Tauri core, plugins, Wry, or Tao. | VERIFIED | `references/CURRENT-TAURI-2.md` and `references/research/distilled-tauri-2.md` separate core, CLI, API, plugins, runtime, Wry, and Tao. |
| AC-06 | AI examples cover hosted streaming, local desktop sidecars, least-privilege capabilities, persistence, and release boundaries. They identify derived designs because no first-party Tauri AI example was found. | VERIFIED | Examples 01 through 06, AI architecture reference, and runtime/persistence/release guides. The sidecar example now specifies raw bounded framing and managed lifecycle ownership. |
| AC-07 | Both Stingers use portable frontmatter, descriptions no longer than 200 characters, progressive disclosure, exact Critical Directives, and development Ship Gates. | VERIFIED | Canonical skill validation reports zero errors for both skills; Tauri description is within the Cowork limit and both Cowork package checks report zero errors and warnings. |
| AC-08 | The Tauri pair is registered with accurate counts, routing boundaries, reciprocal Rust links, and a multi-Bee sequence. | VERIFIED | 82 Bees, 85 core skills, and 87 Codex-facing skills; Beekeeper roster, pairing audit, routing guides, and reciprocal Rust/Tauri links are present. |
| AC-09 | Canonical changes are generated into Cursor and Codex surfaces without hand-editing generated trees. | VERIFIED | `python learn/scripts/generate-harnesses.py` produced 82 Cursor Bees, 85 Cursor skills, 82 Codex TOML Bees, and 87 skills in each Codex-facing tree. |
| AC-10 | Canonical and generated skills/agents validate, local links resolve, deterministic scripts run, and the Cowork skill package succeeds. | VERIFIED | All 85 canonical skills and 82 canonical Bees validate with zero errors; generated Tauri files match canonical content; inspector self-tests and both Cowork package checks pass. |
| AC-11 | Fresh claim sampling traces release, security, IPC, sidecar, updater, and AI-pattern claims to archived primary sources. | VERIFIED | Independent grounding review resolved 152 cited occurrences across 67 raw records and confirmed the documented current Tauri core tag. |
| AC-12 | Ship Gate runs in order: Security, affected-check reruns, Quality, repository health, then user review before commit or push. | VERIFIED | Security report, post-remediation re-evaluation, Quality report, and repository-health report were completed in order. The user authorized commit, push, pull request, and merge. |

## Status vocabulary

- VERIFIED: backed by current local or primary-source evidence.
- IN PROGRESS: implementation exists but required validation is not complete.
- OPEN: work has not reached its verification step.
- EXTERNAL: requires credentials, a platform, hardware, signing identity, publication, or another effect not authorized in this task.
- BLOCKED: cannot safely proceed without a missing human decision or external state change.

## External effects

- The user authorized commit, push, pull request, and merge after required Ship Gate completion.
- No package publication, signing, store submission, updater rollout, paid provider call, or credential use is authorized.
- A temporary local Cowork package may be built only for structural validation and will not be uploaded.
