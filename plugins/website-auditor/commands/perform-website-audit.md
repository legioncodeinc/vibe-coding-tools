---
name: "perform-website-audit"
description: "Runs a full Website Auditor by Legion Code Inc. engagement end to end: intake through branded reports, sequencing all 20 Drone/Stinger pairs per the dependency graph."
allowed-tools: "*"
---

# /perform-website-audit

> **Forge status:** stage 6 (final authorship) complete for this pair. Orchestration logic below is real and executable, grounded in `plan/website-auditor-build-plan.md` sections 2 to 4 and 7, `library/requirements/backlog/prd-022-orchestration/prd-022-orchestration-index.md`, `library/requirements/backlog/prd-001-website-auditor-plugin/prd-001-website-auditor-plugin-index.md`, and the per-pair PRDs it references by name. Stage 7 (registering this pair into `pest-controller-suit`'s own roster, and deploying/syncing the plugin) has not run. The exact `_shared/run-ledger.json` shape and the mechanics of the pre-advance check are this pair's own engineering judgment, not a sourced fact from any PRD; see `skills/master-website-auditor/guides/01-wave-dispatch-and-run-ledger.md` for the full detail and for which claims are judgment versus sourced. This command and the `master-website-auditor` skill carry the identical orchestration logic; the guide file is shared between them rather than duplicated.

Entry point for harnesses with native command/agent dispatch (Claude Code, Cursor, and Codex per `harness-support-matrix.md`, though Codex has deprecated custom prompts in favor of skills per GitHub issue #7047, so a Codex operator may be routed to `master-website-auditor` in practice even though this file is present; Cowork prefers this flat `commands/` path over `skills/` due to the slash-invocation bug tracked at GitHub issue #46079). For harnesses without native dispatch, the equivalent entry point is the `master-website-auditor` skill, which activates the identical 20 pairs in the identical order and produces a structurally identical `www.<domain>-audit/` workspace per prd-022 AC-2.

Full scope and acceptance criteria: [prd-022-orchestration](../library/requirements/backlog/prd-022-orchestration/prd-022-orchestration-index.md).

## Why `allowed-tools: "*"`

This command dispatches all 20 Drone/Stinger pairs across every wave of a full audit engagement: filesystem writes for workspace scaffolding, web fetches for crawling and research, browser automation for screenshot capture, and read/write across the entire `www.<domain>-audit/` tree. No fixed subset of tools covers that surface without either blocking a downstream Drone's legitimate work or requiring this file to be re-edited every time a Drone's own tool needs change. `allowed-tools: "*"` is appropriate here specifically because this is the top-level orchestrator for the whole plugin, the same posture `pest-controller-suit` and `queen-wasp-stinger` take at their own orchestrator tier; a leaf Drone (for example `web-security-posture-wasp-drone`, which should never place an order or submit a form) is where a narrower `allowed-tools` scope and the read-only conduct rule actually bite, not here. This command's own direct writes are limited to `_shared/run-ledger.json`'s halt fields and conditional-wave `skipped` markers (see "What this command writes directly" below); it does not itself perform site reconnaissance, scoring, or reporting.

## Procedure

### 1. Load routing

Load `pest-controller-suit`-equivalent routing for this plugin's own 20-pair roster (per the Wasp Nest closed-loop convention: an orchestrator-tier component routes to its roster the same way `pest-controller-suit` routes to the wider Wasp Nest, but scoped to this plugin's own 20 pairs rather than the full multi-project Wasp Nest roster). This means: resolve the target domain from the invocation argument, confirm the 20 Drone/Stinger pairs named in the build plan's section 1.2 table are all reachable in this plugin's `agents/` (or harness-equivalent) and `skills/` trees, and proceed to dispatch. This command does not implement any audit logic itself; all domain logic lives in the 20 pairs it dispatches (per prd-022's stated non-goal).

### 2. Dispatch the waves, in order, verifying completion before advancing

Full procedural detail, including the run-ledger schema and the pre-advance check, lives in [`skills/master-website-auditor/guides/01-wave-dispatch-and-run-ledger.md`](../skills/master-website-auditor/guides/01-wave-dispatch-and-run-ledger.md). Summary:

0. **W0, audit-intake, sync, blocking.** Delegate entirely to `audit-intake-wasp-drone` (armed with `audit-intake-stinger`): the four questions in order, full workspace scaffold per the build plan's section 3 folder spec, and the initial `_shared/run-ledger.json` / `_shared/target-profile.json` / `_shared/evidence-index.md` writes. This command does not scaffold the workspace itself or duplicate `audit-intake-wasp-drone`'s logic; it waits for a `complete` ledger entry before advancing.
1. **W1a + W1b, stack-fingerprint + vendor-inventory, parallel.** Both dispatched together against the landing page W0 fetched once.
2. **W2, icp-positioning, sync, HARD GATE.** If focus cannot be determined, `icp-positioning-wasp-drone` writes `gate_halt` to the ledger instead of `complete`. This command halts the entire run on that status: no further wave is dispatched, the halt is recorded in the ledger and the workspace `README.md`, and the user is asked a direct clarifying question grounded in the Drone's own finding. See "The ICP hard gate" below for the exact operational sequence.
3. **W3, keyword-intelligence, sync, needs ICP.** Only dispatched once W2 reads `complete`.
4. **W4, site-crawler, sync, needs stack type.** Waits on W1a's fingerprint because crawl strategy differs by platform.
5. **W5, nine-wide parallel wave plus social-presence (ten Drones).** `technical-seo-wasp-drone`, `aeo-audit-wasp-drone`, `content-semantics-wasp-drone`, `internal-linking-wasp-drone`, `accessibility-audit-wasp-drone`, `web-security-posture-wasp-drone`, `analytics-stack-wasp-drone`, `performance-cwv-wasp-drone`, `visual-funnel-wasp-drone` (all read `site-data/` read-only, write only to their own subfolder), plus `social-presence-wasp-drone` (independent of `site-data/`). See "Wave 5 dispatch mechanics" below for exactly how these ten are made to run concurrently rather than merely listed together.
6. **W6a + W6b, blog-content + ecommerce-catalog, conditional, parallel.** Dispatched only when their content type was detected in W1/W4; otherwise this command writes `skipped` directly to that Drone's ledger key with a reason and does not dispatch it (per prd-018 AC-1 / prd-019 AC-1, not-detected resolves to N/A, never a penalty).
7. **W7, audit-scoring, sync, needs all findings.** Dispatched only once every prior wave's required Drones read `complete` or `skipped`.
8. **W8, audit-reporting, sync, needs scores.** Final wave.

Every dispatched Drone/Stinger writes into the shared `www.<domain>-audit/` workspace `audit-intake-wasp-drone` scaffolded in W0, never an ad-hoc location.

### 3. Verify wave completion before advancing

Before dispatching wave N+1, read `_shared/run-ledger.json` and confirm every Drone required by wave N has a `status: complete` (or, for conditional Wave 6 Drones not applicable, `status: skipped`) entry with a non-empty `artifacts` list under its own key. A `complete` entry with no artifacts is treated as a failed dispatch and re-run, not a pass. This is what "sync" means operationally for every non-parallel wave (W0, W2, W3, W4, W7, W8): the command blocks on this check, it does not merely log it.

### Wave 5 dispatch mechanics

Wave 5's nine Drones, plus `social-presence-wasp-drone`, must run genuinely concurrently, not merely be listed together and executed one at a time (prd-022's explicit non-goal). How that is actually achieved depends on the harness:

- **Claude Code.** All ten arming dispatches issued in a single turn, mirroring `pest-controller-suit/SKILL.md`'s own "spawn every Drone at the top level" pattern. Genuinely overlapping `started_at`/`completed_at` timestamps in the ledger are the evidence, per prd-022 AC-1.
- **Cursor.** `.claude/agents/` fallback read means a Drone's agent file often loads unmodified, but `harness-support-matrix.md` does not confirm genuine concurrent multi-subagent dispatch from one orchestrating turn is available. Treat this as unconfirmed and default to sequential dispatch unless verified otherwise on the operator's own setup.
- **Codex.** No documented file-based subagent-definition format exists at all; only `agents.<role>` config keys in `config.toml` with an undocumented `.config_file` shape, per the matrix's Agents section. This is a known constraint. W5 (and any other wave that would otherwise be parallel) runs as a sequential dispatch of the same ten Drones, each still fully armed, with non-overlapping ledger timestamps as the honest record. This command does not fabricate overlapping timestamps to satisfy a Claude-Code-scoped acceptance criterion on a harness that cannot deliver it.
- **Cowork.** This command (`commands/perform-website-audit.md`) is only reachable in Cowork proper, where plugin `agents/<name>.md` supports genuine subagent dispatch; Cowork's Chat surface has no `commands/` path at all, so an operator there is routed to the `master-website-auditor` skill instead, which has its own Chat-specific fallback described in its own file.

Every dispatch uses the same arming line pattern: name the Drone, point it at its paired Stinger under `skills/<stinger-name>/SKILL.md`, state its read/write scope inside `www.<domain>-audit/`, state the current `interactive_mode` value explicitly, and instruct it to append its own key to `_shared/run-ledger.json` on completion. A Drone dispatched without this full line is a failed dispatch, terminated and re-dispatched, per the same rule `pest-controller-suit` applies to an unarmed Drone.

### The ICP hard gate (W2, prd-001 AC-3)

If `icp-positioning-wasp-drone` cannot determine the site's focus above its stated confidence threshold, it writes `gate_halt` (never `complete`) to `_shared/run-ledger.json` under its own key, with a `gate_reason` field, and whatever partial evidence it gathered still lands in `02-positioning/` per conduct rule 2 (evidence at the moment of finding). On seeing `gate_halt`, this command:

1. Sets the ledger's top-level `status` to `halted`, with `halted_at`, `halted_wave: "W2"`, and `halted_reason` pointing at the Drone's own `gate_reason`.
2. Appends a dated halt entry to the workspace `README.md` run manifest.
3. Does not dispatch W3 or any later wave. There is no guess-and-continue path.
4. Reports to the user in the same turn: states the run halted at W2, states the actual `gate_reason` and evidence path, and asks a direct clarifying question grounded in that finding (for example, whether the domain is correct, whether a different entry path should be audited, or whether the site is genuinely not yet ready for audit).
5. Leaves the workspace resumable. On a corrected answer, either re-dispatches `icp-positioning-wasp-drone` with the clarification, or defers to `audit-intake-wasp-drone`'s own resume behavior against the existing ledger (prd-002 AC-4) if the target itself changed.

This is a critical failure per prd-001 AC-3 and conduct rule 6, not a low-confidence guess this command talks itself past.

## What this command writes directly

Per prd-022's shared workspace contract ("Writes: Nothing directly; orchestration only dispatches, the dispatched pairs write their own outputs"), this command's own direct writes are limited to: the ledger's top-level halt fields on a W2 gate, and `skipped` markers (with reason) for conditional Wave 6 Drones not dispatched. It never writes a finding, a score, or a report on any dispatched pair's behalf.

## Conduct rules, enforced at the orchestration level

Declared binding on every component by `rules/website-audit-conduct.md`; this section states how this command specifically enforces or delegates each one. This pair is the sole owner of enforcing the dependency graph's sync/parallel split at runtime, per prd-022's conduct-rules section.

1. **Read-only/passive by default; interactive/stateful testing opt-in, defaulting off (Q16).** `interactive_mode: false` is recorded in the ledger at run start, set `true` only on an explicit user request at invocation, never inferred, and passed explicitly in every arming line. `audit-intake-wasp-drone`'s fixed four questions (prd-002 AC-1) do not carry this field, so this command holds it; see the guide's "Interactive-mode consent" section for the full reasoning.
2. **Evidence captured at time-of-finding, never reconstructed.** Enforced by delegation: this command never writes a finding, and treats a `complete` ledger entry with empty `artifacts` as a failed dispatch.
3. **Subjective findings labeled and separated from quantified ones.** Owned by each Drone's own Stinger; this command's only touchpoint is a coarse pre-W7 check that `_shared/evidence-index.md` has grown since W0.
4. **Verification log is a mandatory deliverable.** Owned by `audit-scoring-wasp-drone` (W7), which rejects any leaf finding arriving without an evidence pointer or justification (prd-020 AC-5); not re-implemented here.
5. **AI-content detection reported as a probability band, never a verdict.** This command's W6a arming line to `blog-content-wasp-drone` restates the prd-018 AC-3 constraint explicitly; a verdict-phrased output surfaced by the coarse evidence check is treated as a failed dispatch and re-run.
6. **The hard gate holds.** This command's own core responsibility at W2, spelled out above.

## Related

Both this command and `skills/master-website-auditor/SKILL.md` carry the identical orchestration logic against the identical shared workspace; the wave-dispatch and run-ledger mechanics are documented once, in [`skills/master-website-auditor/guides/01-wave-dispatch-and-run-ledger.md`](../skills/master-website-auditor/guides/01-wave-dispatch-and-run-ledger.md), and referenced by both rather than duplicated.
