---
name: "rust-stinger"
description: "Rust development specialist for Cargo, async services, persistence, CLI/TUI, tests, upgrades, and current toolchains. Use for Rust implementation, review, migration, or release guidance."
license: MIT
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Rust projects using Cargo."
metadata:
  hive-bee: "rust-worker-bee"
  domain: "rust"
  pair-bee: "rust-worker-bee"
  research-window: "2026-03-03 to 2026-09-03"
---

# Rust Stinger

## Purpose

Equip `rust-worker-bee` to own bounded Rust implementation while preserving the authority of the exact PRD, ADR, ledger, and peer specialists. Make async ownership, durability, state transitions, redaction, and release evidence mechanically reviewable. Stop at a recorded fail-closed boundary whenever a missing decision affects safety, compatibility, money, credentials, signing, publication, or another external effect.

## When to use

- Implement, refactor, debug, or review Rust source, Cargo manifests, workspaces, features, build scripts, or tests.
- Design or verify Tokio, Axum, Tower, SQLx, SQLite, Clap, Ratatui, tracing, rustls, and Rust release-evidence paths.
- Ask for the newest stable Rust information, a compiler/Cargo upgrade, an edition or resolver migration, or an MSRV policy.
- Prepare an AI-assisted contribution to `rust-lang/rust` when the owning team has ratified the upstream project's live LLM policy.

## When not to use

- Tauri application-shell, capability, plugin, updater, and webview integration work belongs to `tauri-stinger`, with this Stinger owning the Rust implementation underneath.
- Dependency advisory and license disposition belongs to `dependency-audit-stinger`; this Stinger generates Rust-specific evidence but does not accept risk.
- Database schema architecture belongs to `db-stinger`; this Stinger implements and proves an approved SQLx or SQLite design.
- General AI model/provider selection belongs to `ai-tools-platform-stinger`, and cognitive/RAG architecture belongs to `mind-stinger`.

## Required inputs

Before editing, obtain:

- the exact repository or worktree, owned paths, and concurrent-work boundaries;
- the authorizing PRD/ADR/ledger rows, acceptance criteria, gates, and repository instructions;
- the existing Cargo graph, toolchain files, feature/target matrix, migrations, code, tests, and release configuration;
- approved protocol, provider, persistence, security, CLI, platform, and operational contracts;
- the required verification commands and explicit authorization for any external effect.

If a missing input determines safety, public compatibility, monetary behavior, credentials, publication, or destructive behavior, return a blocker rather than choosing silently.

## Procedure

1. Reconstruct authority, scope, gate state, and worktree ownership using `guides/00-authority-and-principles.md`.
2. Inventory the Rust system and record revalidation points using `guides/01-inspect-workspace.md`.
3. If the request depends on current or upcoming Rust behavior, refresh the version claim using `guides/10-refresh-current-rust.md` before selecting a design.
4. Establish the smallest coherent crate, feature, type, and error design using `guides/02-design-workspace-and-types.md`.
5. Implement a test-first acceptance slice using `guides/03-implement-bounded-slices.md`.
6. Prove task, cancellation, stream, backpressure, timeout, retry, and shutdown behavior using `guides/04-prove-async-streams.md`.
7. Prove SQLite/SQLx transactions, migrations, crash recovery, and typed state transitions using `guides/05-prove-persistence-and-state.md`.
8. Implement provider and harness edges only behind approved contracts using `guides/06-implement-adapters.md`.
9. Build scriptable CLI and optional TUI surfaces using `guides/07-build-cli-and-tui.md`.
10. Run the complete owned verification and generate release evidence without publishing using `guides/08-verify-and-package-evidence.md`.
11. Produce the acceptance-linked handoff, route Security before Quality, and leave unresolved gates explicit using `guides/09-close-the-loop.md`.

## Operating constraints

- Treat the named PRD, ADR, ledger, gate state, and repository instructions as authority. Never start blocked or deferred work.
- Keep provider code subordinate to the host harness: it may route inference but never acquire tools, approvals, repository access, memory, or user interaction.
- Default to bounded queues, explicit task owners, operation-level cancellation review, and no transparent replay after visible output or a harness-visible tool call.
- Put monetary/quota checks, reservations, reconciliation, idempotency, and aggregate updates in explicit transactions with concurrency and crash evidence.
- Keep credentials in approved secret references and start sensitive instrumentation with `skip_all`; allowlist only non-sensitive correlation and state fields.
- Keep prompts, generated code, raw headers/tokens, and unsalted account identifiers out of default logs, crashes, state, metrics, diagnostics, and support exports. Enforce approved egress allowlists and never bypass redirect, DNS, or SSRF checks.
- Default to no `unsafe`. Any exception needs a minimal scope, written invariant, targeted tests, and independent review.
- Use fake providers and fixtures by default. Do not use live credentials, paid traffic, subscriptions, signing identities, publishing, auto-update, Git initialization, or destructive controls without explicit authorization.
- Never promote retrieval-time crate/tool versions, OS targets, durability settings, timeout values, signing systems, or soak thresholds into timeless defaults. Revalidate them at the decision point.
- Preserve peer authority: protocol semantics, product/provider policy, security acceptance, schema review, dependency/license disposition, CI topology, signing/publication, and final PRD Quality remain separate handoffs.
- Preserve verification order: implementation checks, Security, affected-check reruns, then Quality. Partial or stale evidence is not shipped evidence.

See `guides/00-authority-and-principles.md` for the rationale and fail-closed decision table.

## Output contract

Produce a Rust implementation handoff from `templates/implementation-handoff.md`, backed by exact commands and artifacts. When release work is in scope, also populate `templates/release-evidence-manifest.yaml` without signing or publishing unless independently authorized. Store actual execution and gate reports in the active repository's root `library/` hierarchy. The Stinger's `reports/` folder contains reusable report-shape templates only.

## Examples

- `examples/01-happy-path-bounded-service-slice.md` - Cargo/Axum/SQLx acceptance slice with deterministic evidence.
- `examples/02-edge-visible-output-cancellation.md` - cancellation after visible output, where replay must remain disabled.
- `examples/03-edge-concurrent-budget-reservation.md` - concurrent SQLite reservation and crash boundary.
- `examples/04-release-evidence-with-closed-gates.md` - package evidence generation with signing/publication held closed.
- `examples/05-rust-1-98-refresh.md` - bounded upgrade evidence from 1.97.1 to the fixed 1.98.1 patch.

## Research and refresh points

For current toolchain, Cargo, security, nightly, or upstream AI-policy claims, read `references/research/distilled-rust-current.md` first. Its raw archive separates bounded primary-source captures from Stinger interpretation and cites every current source record. For the broader architecture corpus, read `research/research-summary.md` and `research/evidence-synthesis.md`, then use `research/index.md` to locate the legacy primary notes. Re-fetch the Rust release/platform matrix, Tokio support policy, the selected SQLx transaction API, stable rustls APIs, cargo-dist behavior, and RustSec data at the point of use. Both research dates are snapshots, not permanent defaults.

## Human decisions that remain open

Do not resolve these from the Stinger alone:

- supported OS/architecture/install matrix and minimum OS baselines;
- actual MSRV after the resolved graph and public features exist;
- SQLite power-loss durability and contended-writer behavior;
- durable replay/promotion event schema;
- first-milestone TUI scope;
- signing identity, attestation platform, installer formats, and publication authorization;
- quantitative soak pass/fail thresholds.

Record the missing owner/decision, affected acceptance criteria, and first authorized next action in the handoff.

## Paired owner

This Stinger is paired with `rust-worker-bee`.

## References map

- `TOPIC.md` - load when auditing the forge scope, ownership boundary, or required outcomes.
- `references/REFERENCE.md` - load first when the task needs the deep reference layer rather than the root procedure alone.
- `references/CURRENT-RUST.md` - load for current stable, compiler/Cargo upgrades, edition/resolver changes, MSRV decisions, and security-driven toolchain floors.
- `references/NIGHTLY-WATCHLIST.md` - load when the user asks about upcoming Rust features; never use it as stable production guidance.
- `references/UPSTREAM-RUST-LLM-POLICY.md` - load only for AI-assisted contributions to `rust-lang/rust` in a team covered by the upstream policy.
- `references/research/distilled-rust-current.md` - load when a current domain claim needs verification or sources disagree.
- `references/research/raw/` - load to trace the current distillation to official primary-source notes.
- `research/research-summary.md`, `research/evidence-synthesis.md`, and `research/index.md` - load for the broader 2026-07-24 architecture and tooling corpus retained from the original pair.
- `scripts/inspect-rust-workspace.py` - run for a deterministic static Cargo/version/unsafe inventory before planning a workspace change.
- `guides/10-refresh-current-rust.md` - load for any request using "latest", "current", "upgrade Rust", "MSRV", or nightly language.

## Related bees and stingers

- [tauri-stinger](../tauri-stinger) - Tauri 2 app-shell, IPC, capability, sidecar, plugin, updater, and distribution work built on Rust.
- [dependency-audit-stinger](../dependency-audit-stinger) - dependency advisories, lockfile hygiene, license decisions, SBOMs, and supply-chain risk.
- [security-stinger](../security-stinger) - independent vulnerability review and security acceptance.
- [db-stinger](../db-stinger) - database schema, migration, and indexing authority.
- [rust-worker-bee](../../agents/rust-worker-bee.md) - the paired implementation and review agent for this Stinger.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [tauri-stinger](../tauri-stinger) - Tauri 2 application integration and AI desktop/mobile shell patterns.
  - [dependency-audit-stinger](../dependency-audit-stinger) - Rust dependency, advisory, license, and supply-chain decisions.
  - [security-stinger](../security-stinger) - Independent security audit and remediation.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
