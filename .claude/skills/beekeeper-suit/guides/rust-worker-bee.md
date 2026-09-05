# rust-worker-bee

## Domain
This Bee owns bounded implementation and code review for production Rust systems. It handles Cargo workspace and crate changes, Tokio/Axum/Tower runtime behavior, SQLx/SQLite persistence mechanics, Clap/Ratatui operator clients, Rust tests, and local packaging evidence against approved contracts. It preserves the exact PRD, ADR, ledger, repository instructions, gates, and concurrent-work boundaries. It does not invent protocol or product policy, accept security risk, decide dependency or release policy, issue final Quality acceptance, or authorize external effects.

## Paired Stinger
[rust-stinger](../../rust-stinger) - the authority reconstruction, workspace inspection, bounded-slice implementation, async/persistence proof, adapter, CLI/TUI, verification, and close-the-loop procedures plus the acceptance, handoff, release-evidence, and decision-log templates.

## Trigger phrases
- "Implement this in Rust."
- "Review this Cargo workspace."
- "Fix this Tokio or SQLx service."
- "Audit this SQLx transaction."
- "Build the approved Rust PRD slice."

Also route proactively when a requested change or review touches Rust source, Cargo manifests or workspaces, Tokio/Axum/Tower services, SQLx/SQLite state, Clap/Ratatui clients, Rust tests, or local Rust packaging evidence.

## Do NOT route when
- The ask is HTTP/REST or MCP semantic and compatibility decisions: that is `http-rest-fundamentals-worker-bee` or `mcp-protocol-worker-bee`; Rust implements their approved contracts.
- The ask is product, model, and provider policy: that is `ai-tools-platform-worker-bee` or the named product owner.
- The ask is schema architecture: that is `db-worker-bee`; this Bee owns approved SQLx/SQLite mechanics and proof.
- The ask is Security acceptance: that is `security-worker-bee`.
- The ask is dependency/license/advisory disposition: that is `dependency-audit-worker-bee`.
- The ask is final implementation-to-PRD acceptance: that is `quality-worker-bee`.
- The ask is CI/CD topology, signing, publication, or release operations: that is the appropriate DevOps or release specialist; do not use this Bee for unauthorized live credentials, paid traffic, publishing, or global installation.

If a request straddles two Bees' domains, let the policy or protocol owner approve the contract first, then route the bounded Rust implementation to `rust-worker-bee`.

## Inputs the Bee needs
- The exact repository or worktree, owned paths, branch/change boundary, and concurrent-work constraints.
- The authorizing PRD, ADR, ledger rows, acceptance criteria, gates, and repository instructions.
- The current Cargo graph, Rust source, features and targets, migrations, tests, and release configuration.
- Approved protocol, provider, persistence, security, CLI, platform, and operational contracts, including data-integrity and cancellation requirements.
- The required verification commands and explicit authorization for any external effect.

If a missing input controls safety, public compatibility, money, credentials, signing, publication, or destructive behavior, invoke only to record the fail-closed blocker and smallest safe checkpoint; do not ask the Bee to guess.

## Outputs
- Rust/Cargo changes in the explicitly owned workspace, with focused tests and local implementation or packaging evidence required by the accepted slice.
- An acceptance-linked Rust implementation handoff using `templates/implementation-handoff.md`, including changed paths, exact verification commands and results, safety evidence, rollback/recovery notes, and remaining gates.
- When release evidence is explicitly in scope, a populated local `templates/release-evidence-manifest.yaml`; signing and publication remain closed unless separately authorized.
- A precise blocker record instead of a completion claim when an owning decision, tool, gate, or required proof is missing.

## Commonly sequenced with
- Plan execution loop: `rust-worker-bee` is the implementation Bee for Rust/Cargo work; it hands the final implemented state to `security-worker-bee`, reruns affected checks after security fixes, and only then hands it to `quality-worker-bee`.
- Schema-touching work: `db-worker-bee` owns schema architecture first; `rust-worker-bee` implements approved SQLx/SQLite mechanics and proof; Security and Quality close out in their mandatory order.
- Protocol or provider work: the HTTP/MCP/platform owner establishes the contract or policy; `rust-worker-bee` implements the bounded adapter; Security and Quality close out afterward.

## Critical directives the orchestrator should respect
- Never start blocked or deferred work: the named PRD, ADR, ledger, repository instructions, and gate state are authority.
- Keep harness agency and external effects fail-closed while requiring provable bounded concurrency, cancellation/replay behavior, transactions, crash recovery, redaction, and a default of no `unsafe`; no live credentials, paid traffic, global installation, signing, publication, or auto-update execution without explicit authorization.
- Preserve the verification order: implementation checks, Security, affected-check reruns, then Quality; partial or stale evidence is not shipped evidence.
