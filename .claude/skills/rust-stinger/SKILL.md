---
name: "rust-stinger"
description: "Implements and reviews production Rust systems across Cargo workspaces, Tokio/Axum/Tower services, SQLx/SQLite state, Clap/Ratatui operator surfaces, tests, and release evidence. Use when the user says \"implement this in Rust\", \"review this Cargo workspace\", \"fix this Tokio or SQLx service\", or invokes rust-worker-bee. Do not use it to invent protocol semantics, approve security or dependency policy, author the final Quality report, or publish a release."
license: MIT
---

# Rust Stinger

Equip `rust-worker-bee` to own bounded Rust implementation while preserving the authority of the exact PRD, ADR, ledger, and peer specialists. Make async ownership, durability, state transitions, redaction, and release evidence mechanically reviewable. Stop at a recorded fail-closed boundary whenever a missing decision affects safety, compatibility, money, credentials, signing, publication, or another external effect.

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
3. Establish the smallest coherent crate, feature, type, and error design using `guides/02-design-workspace-and-types.md`.
4. Implement a test-first acceptance slice using `guides/03-implement-bounded-slices.md`.
5. Prove task, cancellation, stream, backpressure, timeout, retry, and shutdown behavior using `guides/04-prove-async-streams.md`.
6. Prove SQLite/SQLx transactions, migrations, crash recovery, and typed state transitions using `guides/05-prove-persistence-and-state.md`.
7. Implement provider and harness edges only behind approved contracts using `guides/06-implement-adapters.md`.
8. Build scriptable CLI and optional TUI surfaces using `guides/07-build-cli-and-tui.md`.
9. Run the complete owned verification and generate release evidence without publishing using `guides/08-verify-and-package-evidence.md`.
10. Produce the acceptance-linked handoff, route Security before Quality, and leave unresolved gates explicit using `guides/09-close-the-loop.md`.

## Critical directives

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

Produce a Rust implementation handoff from `templates/implementation-handoff.md`, backed by exact commands and artifacts. When release work is in scope, also populate `templates/release-evidence-manifest.yaml` without signing or publishing unless independently authorized. Past execution reports belong in `reports/`; see `reports/README.md`.

## Examples

- `examples/01-happy-path-bounded-service-slice.md` - Cargo/Axum/SQLx acceptance slice with deterministic evidence.
- `examples/02-edge-visible-output-cancellation.md` - cancellation after visible output, where replay must remain disabled.
- `examples/03-edge-concurrent-budget-reservation.md` - concurrent SQLite reservation and crash boundary.
- `examples/04-release-evidence-with-closed-gates.md` - package evidence generation with signing/publication held closed.

## Research and refresh points

Read `research/research-summary.md` and `research/evidence-synthesis.md` before making architecture or version-sensitive claims. Use `research/index.md` to locate primary notes. Re-fetch the Rust release/platform matrix, Tokio support policy, the selected SQLx transaction API, stable rustls APIs, cargo-dist behavior, and RustSec data at the point of use; the research packet records a 2026-07-24 snapshot, not permanent defaults.

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
