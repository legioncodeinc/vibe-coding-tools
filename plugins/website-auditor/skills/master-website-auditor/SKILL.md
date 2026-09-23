---
name: "master-website-auditor"
description: "Fallback orchestrator for harnesses without native command dispatch. Activates the same 20 Drone/Stinger pairs as /perform-website-audit, same order, same shared workspace."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: orchestrator
  hive-role: fallback-dispatcher
---

# Master Website Auditor

> **Forge status:** stage 6 (final authorship) complete for this pair. Orchestration logic below is real and executable, grounded in `plan/website-auditor-build-plan.md` sections 2 to 4 and 7, `library/requirements/backlog/prd-022-orchestration/prd-022-orchestration-index.md`, `library/requirements/backlog/prd-001-website-auditor-plugin/prd-001-website-auditor-plugin-index.md`, and the per-pair PRDs it references by name. Stage 7 (registering this pair into `pest-controller-suit`'s own roster, and deploying/syncing the plugin) has not run. The exact `_shared/run-ledger.json` shape and the mechanics of the pre-advance check are this pair's own engineering judgment, not a sourced fact from any PRD; see [`guides/01-wave-dispatch-and-run-ledger.md`](guides/01-wave-dispatch-and-run-ledger.md) for the full detail and for which claims are judgment versus sourced.

Orchestrator-tier skill with no single paired Drone, same pattern as `pest-controller-suit` and `queen-wasp-stinger`. Exists so this plugin still functions end to end on a harness that lacks native command/agent dispatch, or where `commands/perform-website-audit.md` isn't reachable for another reason (per `harness-support-matrix.md`, e.g. Codex's deprecated custom-prompts path, or Cowork's Chat surface which reads skills but not `commands/`).

Full scope and acceptance criteria: [prd-022-orchestration](../../library/requirements/backlog/prd-022-orchestration/prd-022-orchestration-index.md).

## Purpose

Run a complete Website Auditor by Legion Code Inc. engagement, from the four intake questions through both branded reports, by sequencing the same 20 Drone/Stinger pairs `commands/perform-website-audit.md` sequences, in the same dependency order, into the same shared `www.<domain>-audit/` workspace. This skill does not perform any audit work itself (no fingerprinting, no crawling, no scoring); it names the next Drone, arms it with its paired Stinger, verifies the prior wave's completion in `_shared/run-ledger.json`, and holds the line on the one hard stop in the graph (the W2 ICP gate). All domain logic lives in the 20 pairs it dispatches.

## When to use this skill

- The current harness has no native command/agent dispatch, or `commands/perform-website-audit.md` isn't reachable for another reason.
- The user asks to run a website audit and the harness's command surface is unavailable or unreliable (per `harness-support-matrix.md`'s Commands section: Codex deprecated custom prompts in favor of skills per GitHub issue #7047; Cowork's Chat surface has no `commands/` path at all, only skills).
- Anywhere else `/perform-website-audit` would apply. Both entry points produce a structurally identical workspace per prd-022 AC-2; use whichever one the harness actually surfaces to the user.

## Orchestration order, with real mechanics

Full procedural detail (the run-ledger schema, the pre-advance check, wave-5 dispatch by harness, the ICP hard-gate halt sequence, conditional-wave detection, and how each conduct rule is enforced) lives in [`guides/01-wave-dispatch-and-run-ledger.md`](guides/01-wave-dispatch-and-run-ledger.md). This section is the wave list plus the operational summary; read the guide before running a real engagement.

0. **W0, audit-intake, sync, blocking.** Delegate entirely to `audit-intake-wasp-drone` (armed with `audit-intake-stinger`): the four questions in order (auditor name, audited-party contact name, audited-party business name, website URL), scaffolding the full `www.<domain>-audit/` folder tree per the build plan's section 3 spec, and writing `_shared/run-ledger.json`, `_shared/target-profile.json` (stub), and `_shared/evidence-index.md` (stub). This skill does not scaffold the workspace itself and does not duplicate `audit-intake-wasp-drone`'s logic; it dispatches, waits for a `complete` ledger entry, and reads the resulting `_shared/target-profile.json`/`run-ledger.json` going forward. If a `_shared/run-ledger.json` already exists for this domain, `audit-intake-wasp-drone` offers to resume per its own prd-002 AC-4; this skill defers to that behavior rather than re-implementing resume logic.
1. **W1a + W1b, stack-fingerprint + vendor-inventory, parallel.** Both read the landing page W0 fetched once; genuinely dispatched together, not merely listed together and run one after another.
2. **W2, icp-positioning, sync, HARD GATE.** If `icp-positioning-wasp-drone` cannot determine the site's focus above its stated confidence threshold, it writes `gate_halt` (not `complete`) to the ledger with a `gate_reason`. On seeing that status this skill halts the entire run: no later wave is dispatched, the ledger and workspace `README.md` record the halt, and the user is asked a direct clarifying question grounded in the Drone's own finding, per prd-001 AC-3 and conduct rule 6. See the guide's "ICP hard gate, operationally" section for the exact sequence.
3. **W3, keyword-intelligence, sync, needs ICP.** Only dispatched once W2 reads `complete` (never `gate_halt`).
4. **W4, site-crawler, sync, needs stack type.** Crawl strategy differs by platform (Shopify needs `/collections/` and `/products/` traversal, SvelteKit needs route-manifest discovery, WordPress needs `/wp-json/` and category pagination), so this waits on W1a's fingerprint.
5. **W5, nine-wide parallel wave plus social-presence, ten Drones total.** `technical-seo-wasp-drone`, `aeo-audit-wasp-drone`, `content-semantics-wasp-drone`, `internal-linking-wasp-drone`, `accessibility-audit-wasp-drone`, `web-security-posture-wasp-drone`, `analytics-stack-wasp-drone`, `performance-cwv-wasp-drone`, `visual-funnel-wasp-drone` (all read `site-data/` read-only, write only to their own subfolder, no write contention) plus `social-presence-wasp-drone` (independent of `site-data/`, included here for wall-clock reasons per the build plan). Dispatched genuinely concurrently where the harness supports it; where it does not (see "Harness-specific dispatch notes" below), dispatched sequentially with that fact stated in the run summary rather than faked in the ledger's timestamps.
6. **W6a + W6b, blog-content + ecommerce-catalog, conditional, parallel.** Dispatched only when the respective content type was detected (blog/content-marketing section, or commerce platform) during W1/W4. If not detected, this skill writes `skipped` directly to that Drone's ledger key with a `reason`, and does not dispatch it; per prd-018 AC-1 / prd-019 AC-1 a not-detected content type resolves to N/A and is excluded from scoring, never penalized.
7. **W7, audit-scoring, sync, needs all findings.** Dispatched only once every wave-0-through-6 Drone reads `complete` or `skipped` in the ledger.
8. **W8, audit-reporting, sync, needs scores.** Final wave; produces the customer and auditor report pairs from the scored workspace.

Every dispatched Drone writes only into the shared `www.<domain>-audit/` workspace `audit-intake-wasp-drone` scaffolded in W0, never an ad-hoc location. This skill's own writes are limited to the ledger's top-level halt fields (on the W2 gate) and the `skipped` markers for conditional Drones not dispatched; it never writes a finding, a score, or a report on any Drone's behalf.

## Conduct rules, enforced at the orchestration level

All six rules are declared binding on every component by `rules/website-audit-conduct.md` (the canonical source; this section states how this skill specifically enforces or delegates each one, per prd-022's conduct-rules section naming this pair "the sole owner of enforcing the dependency-graph's sync/parallel split at runtime").

1. **Read-only/passive by default; interactive/stateful testing opt-in, defaulting off (Q16).** This skill records `interactive_mode: false` in the ledger at run start and only sets it `true` on an explicit user request at invocation time, never inferred. Every arming line to every dispatched Drone carries the current value explicitly, so no Drone infers the run's consent posture on its own. `audit-intake-wasp-drone`'s fixed four questions (per prd-002 AC-1) do not include this consent field, so this skill is the component holding it; see the guide's "Interactive-mode consent" section for the full reasoning on that gap.
2. **Evidence captured at time-of-finding, never reconstructed.** Enforced by delegation: this skill never writes a finding itself, and its pre-advance check treats a `complete` ledger entry with an empty `artifacts` list as a failed dispatch, not a pass.
3. **Subjective findings labeled and separated from quantified ones.** Owned entirely by each Drone's own Stinger. This skill's only touchpoint is a coarse pre-W7 check that `_shared/evidence-index.md` has grown since W0, as a structural signal findings are landing at all; it does not itself validate a specific `[subjective]` label.
4. **Verification log is a mandatory deliverable.** Same delegation model as rule 3; `audit-scoring-wasp-drone` (W7) is the component that rejects any leaf finding arriving without an evidence pointer or justification (prd-020 AC-5), not this skill.
5. **AI-content detection reported as a probability band, never a verdict.** This skill's W6a arming line to `blog-content-wasp-drone` explicitly restates the constraint from prd-018 AC-3 (probability band, method, error rate, never a flat verdict). If this skill's coarse evidence check surfaces output phrased as a verdict, it is treated as a failed dispatch and re-run with the constraint restated, the same as any other malformed dispatch.
6. **The hard gate holds.** This is this skill's own core responsibility at W2, spelled out in full above and in the guide. There is no guess-and-continue path; an undeterminable focus is a critical failure per prd-001 AC-3, not a low-confidence continuation.

## Harness-specific dispatch notes

Grounded in `harness-support-matrix.md`'s Commands and Agents sections. Full detail, including exactly how W5's ten Drones are dispatched per harness, is in [`guides/01-wave-dispatch-and-run-ledger.md`](guides/01-wave-dispatch-and-run-ledger.md).

- **Claude Code.** Native concurrent subagent dispatch. W5's ten Drones are spawned in a single turn, mirroring the "spawn every Drone at the top level" pattern `pest-controller-suit/SKILL.md` uses for its own multi-Drone sequences.
- **Cursor.** Cursor 2.4's `.claude/agents/` fallback read means a Drone's agent definition often loads unmodified, but the matrix does not confirm genuine concurrent multi-subagent dispatch from one orchestrating turn. Treat that as unconfirmed; default to the sequential fallback unless the operator has verified otherwise on their own Cursor setup.
- **ChatGPT Codex.** No documented file-based subagent-definition format exists (only `agents.<role>` config keys in `config.toml`, undocumented `.config_file` shape). This is a known constraint, not a design choice: W5 (and every other wave that would otherwise be parallel) runs as a sequential dispatch of the same Drones, each still fully armed and each still writing its own ledger key, with non-overlapping timestamps as the honest record of what actually ran.
- **Claude Cowork.** Inside Cowork proper, plugin `agents/<name>.md` supports genuine subagent dispatch. In Cowork's Chat surface, hooks and subagents are unavailable ("Cowork-only, not Chat" per the matrix), so `master-website-auditor` (a skill, reachable from both) runs W5's ten Drones as sequential in-context passes when invoked from Chat.

In every fallback mode the folder outputs, the ledger schema, and the dependency order stay identical to the native-dispatch case; only wall-clock concurrency differs, and the run summary states plainly which mode ran.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [audit-intake-stinger](../audit-intake-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [stack-fingerprint-stinger](../stack-fingerprint-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [vendor-inventory-stinger](../vendor-inventory-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [icp-positioning-stinger](../icp-positioning-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [keyword-intelligence-stinger](../keyword-intelligence-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [site-crawler-stinger](../site-crawler-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [technical-seo-stinger](../technical-seo-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [aeo-audit-stinger](../aeo-audit-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [content-semantics-stinger](../content-semantics-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [internal-linking-stinger](../internal-linking-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [visual-funnel-stinger](../visual-funnel-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [accessibility-audit-stinger](../accessibility-audit-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [web-security-posture-stinger](../web-security-posture-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [analytics-stack-stinger](../analytics-stack-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [performance-cwv-stinger](../performance-cwv-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [social-presence-stinger](../social-presence-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [blog-content-stinger](../blog-content-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [ecommerce-catalog-stinger](../ecommerce-catalog-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [audit-scoring-stinger](../audit-scoring-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
  - [audit-reporting-stinger](../audit-reporting-stinger) - activated as part of this orchestration, see the wave list above for sequencing.
