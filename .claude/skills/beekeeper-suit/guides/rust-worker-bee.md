# Rust Worker-Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `rust-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/rust-worker-bee.md`](../../../agents/rust-worker-bee.md)
**Stinger:** [`.cursor/skills/rust-stinger/`](../../rust-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** proactive

---

## Domain

`rust-worker-bee` owns bounded implementation and code review for production Rust systems. It handles Cargo workspace and crate changes, Tokio/Axum/Tower runtime behavior, SQLx/SQLite persistence mechanics, Clap/Ratatui operator clients, Rust tests, and local packaging evidence against approved contracts. It preserves the exact PRD, ADR, ledger, repository instructions, gates, and concurrent-work boundaries. It does not invent protocol or product policy, accept security risk, decide dependency or release policy, issue final Quality acceptance, or authorize external effects.

## Trigger phrases

Route to `rust-worker-bee` when the user says any of:

- "Implement this in Rust."
- "Review this Cargo workspace."
- "Fix this Tokio or SQLx service."
- "Audit this SQLx transaction."
- "Build the approved Rust PRD slice."

Also route proactively when a requested change or review touches Rust source, Cargo manifests or workspaces, Tokio/Axum/Tower services, SQLx/SQLite state, Clap/Ratatui clients, Rust tests, or local Rust packaging evidence.

## Do NOT route when

- Route HTTP/REST or MCP semantic and compatibility decisions to `http-rest-fundamentals-worker-bee` or `mcp-protocol-worker-bee`; Rust implements their approved contracts.
- Route product, model, and provider policy to `ai-tools-platform-worker-bee` or the named product owner.
- Route schema architecture to `db-worker-bee`, Security acceptance to `security-worker-bee`, dependency/license/advisory disposition to `dependency-audit-worker-bee`, and final implementation-to-PRD acceptance to `quality-worker-bee`.
- Route CI/CD topology, signing, publication, and release operations to the appropriate DevOps or release specialist; do not use this Bee for unauthorized live credentials, paid traffic, publishing, or global installation.

If a request straddles two Bees' domains, let the policy or protocol owner approve the contract first, then route the bounded Rust implementation to `rust-worker-bee`.

## Inputs the Bee needs

Before invoking, ensure the user has provided or the orchestrator can infer:

- The exact repository or worktree, owned paths, branch/change boundary, and concurrent-work constraints.
- The authorizing PRD, ADR, ledger rows, acceptance criteria, gates, and repository instructions.
- The current Cargo graph, Rust source, features and targets, migrations, tests, and release configuration.
- Approved protocol, provider, persistence, security, CLI, platform, and operational contracts, including data-integrity and cancellation requirements.
- The required verification commands and explicit authorization for any external effect.

If a missing input controls safety, public compatibility, money, credentials, signing, publication, or destructive behavior, invoke only to record the fail-closed blocker and smallest safe checkpoint; do not ask the Bee to guess.

## Outputs the Bee produces

- Rust/Cargo changes in the explicitly owned workspace, with focused tests and local implementation or packaging evidence required by the accepted slice.
- An acceptance-linked Rust implementation handoff using `templates/implementation-handoff.md`, including changed paths, exact verification commands and results, safety evidence, rollback/recovery notes, and remaining gates.
- When release evidence is explicitly in scope, a populated local `templates/release-evidence-manifest.yaml`; signing and publication remain closed unless separately authorized.
- A precise blocker record instead of a completion claim when an owning decision, tool, gate, or required proof is missing.

## Multi-Bee sequences this Bee participates in

- **Plan execution loop** - `rust-worker-bee` is the implementation Bee for Rust/Cargo work; it hands the final implemented state to `security-worker-bee`, reruns affected checks after security fixes, and only then hands it to `quality-worker-bee`.
- **Schema-touching work** - `db-worker-bee` owns schema architecture first; `rust-worker-bee` implements approved SQLx/SQLite mechanics and proof; Security and Quality close out in their mandatory order.
- **Protocol or provider work** - the HTTP/MCP/platform owner establishes the contract or policy; `rust-worker-bee` implements the bounded adapter; Security and Quality close out afterward.

## Critical directives the orchestrator should respect

- Never start blocked or deferred work: the named PRD, ADR, ledger, repository instructions, and gate state are authority.
- Keep harness agency and external effects fail-closed while requiring provable bounded concurrency, cancellation/replay behavior, transactions, crash recovery, redaction, and a default of no `unsafe`; no live credentials, paid traffic, global installation, signing, publication, or auto-update execution without explicit authorization.
- Preserve the verification order: implementation checks, Security, affected-check reruns, then Quality; partial or stale evidence is not shipped evidence.

(The full directive set lives in the installed Bee file and paired Stinger.)

---

*Part of Beekeeper-Suit's roster. See [`SKILL.md`](../SKILL.md) for the full Army.*
