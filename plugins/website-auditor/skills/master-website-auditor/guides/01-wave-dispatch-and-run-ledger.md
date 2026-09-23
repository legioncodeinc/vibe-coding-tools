# 01. Wave dispatch and the run ledger

Procedural detail behind the wave list in `SKILL.md`. This guide is engineering judgment authored during forge stage 6 for this pair, not a sourced fact from the build plan. The build plan (`plan/website-auditor-build-plan.md` sections 2 and 3) fixes the dependency graph, the folder tree, and the fact that `_shared/run-ledger.json` exists and is append-only per-Drone; it does not fix the ledger's exact JSON shape or the precise mechanics of a pre-advance check. Those decisions live here.

## Where this sits

`master-website-auditor` (and `commands/perform-website-audit.md`, which carries the identical logic for harnesses with native command dispatch) is the only component that reads this guide. No Drone in the 20-pair roster loads it; each Drone only knows how to write its own ledger entry, per its own Stinger.

## The run-ledger.json shape

Proposed shape, engineering judgment:

```json
{
  "domain": "example.com",
  "run_id": "2026-08-18T19:30:00Z-example.com",
  "status": "in_progress",
  "interactive_mode": false,
  "waves": {
    "W0": {
      "audit-intake-wasp-drone": {
        "status": "complete",
        "started_at": "2026-08-18T19:30:05Z",
        "completed_at": "2026-08-18T19:31:40Z",
        "artifacts": ["README.md", "00-intake/engagement-record.md"]
      }
    },
    "W1": {
      "stack-fingerprint-wasp-drone": {
        "status": "complete",
        "started_at": "2026-08-18T19:32:00Z",
        "completed_at": "2026-08-18T19:34:10Z",
        "artifacts": ["01-recon/stack-fingerprint.md"]
      },
      "vendor-inventory-wasp-drone": {
        "status": "complete",
        "started_at": "2026-08-18T19:32:00Z",
        "completed_at": "2026-08-18T19:35:02Z",
        "artifacts": ["01-recon/vendor-inventory.md"]
      }
    },
    "W2": {
      "icp-positioning-wasp-drone": {
        "status": "gate_halt",
        "started_at": "2026-08-18T19:35:10Z",
        "completed_at": "2026-08-18T19:36:00Z",
        "artifacts": ["02-positioning/positioning-attempt.md"],
        "gate_reason": "Landing page is a holding page with no product, service, or content signal; confidence below the Stinger's stated threshold."
      }
    }
  },
  "halted_at": "2026-08-18T19:36:05Z",
  "halted_wave": "W2",
  "halted_reason": "ICP hard gate: focus undeterminable, see waves.W2.icp-positioning-wasp-drone.gate_reason"
}
```

Field notes, all engineering judgment:

- `status` at the top level is one of `in_progress`, `halted`, `complete`. The orchestrator sets `halted` and `complete`; it never sets `in_progress` mid-Drone, that is implicit while any dispatched Drone has not yet written a terminal status.
- `interactive_mode` is a boolean the orchestrator itself records at invocation time (see "Interactive-mode consent" below), not something any Drone writes.
- Each Drone writes exactly one key under its wave, keyed by its own Drone name. This is the "per-Drone key" append-only rule the build plan names in section 3 ("the run ledger is the only file multiple Drones append to, and it is append-only with a per-Drone key to avoid contention"): two Drones in the same wave (for example W1's pair, or W5's ten) can append concurrently without a write race because they never touch each other's key.
- `status` per Drone is one of `running`, `complete`, `failed`, or (icp-positioning-wasp-drone only, W2) `gate_halt`.
- `started_at` / `completed_at` are ISO 8601 UTC timestamps. These are what prd-022 AC-1 means by "verified by overlapping timestamps in `_shared/run-ledger.json`": if W5's ten Drones ran genuinely concurrently, their `started_at` windows overlap; if they ran sequentially (the Codex fallback, see below), they will not, and that absence of overlap is itself the honest record of which dispatch mode actually ran.
- `artifacts` lists every path the Drone wrote, relative to the workspace root. An entry with `status: complete` and an empty `artifacts` list is treated as a failed dispatch by the pre-advance check below, on the same principle pest-controller-suit uses for an unarmed Drone: a Drone that claims completion but points at nothing did not actually do the work.

## Pre-advance check (the "verify prior wave completed" step)

Before dispatching wave N+1, the orchestrator:

1. Reads `_shared/run-ledger.json`.
2. For every Drone required by wave N (per the dependency graph in `SKILL.md`), confirms a key exists under `waves.WN.<drone-name>` with `status: complete` and a non-empty `artifacts` list.
3. If wave N is W2, additionally checks whether `icp-positioning-wasp-drone`'s status is `gate_halt` instead of `complete`. If so, this is not a normal incomplete-wave condition, it is the hard gate; see the halt procedure below instead of retry logic.
4. If any other required Drone is missing, still `running`, or `failed`, the orchestrator does not advance. It re-checks (the dispatched Drone may still be finishing) or, if a Drone reports `failed`, re-dispatches that one Drone with the same arming line rather than restarting the whole wave.
5. Only once every required key in wave N reads `complete` with artifacts does the orchestrator dispatch wave N+1.

This check is what "sync" means operationally for every non-parallel wave in the graph (W0, W2, W3, W4, W7, W8): the orchestrator blocks on it before moving on, it is not a courtesy log.

## Dispatching a wave

Every dispatch, in every wave, uses the same arming line pattern pest-controller-suit uses for its own roster (`pest-controller-suit/SKILL.md`, "Dispatch and arming contract"), adapted to this plugin's pairs:

> You are `<drone-name>`. Before doing anything else, read your paired Stinger in full at `skills/<stinger-name>/SKILL.md` and follow it as your operating manual. Your workspace is `www.<domain>-audit/`, already scaffolded. Read from `<the folders this Drone's inputs live in>`, per the build plan's dependency graph. Write your findings to `<this Drone's assigned subfolder>` per the build plan's section 3 folder spec. When done, append your own key to `_shared/run-ledger.json` under `waves.<wave-id>` with `status`, `started_at`, `completed_at`, and `artifacts`. Interactive/stateful testing is `<on/off per interactive_mode>`; if off, do not perform any action that creates state on the target.

A Drone dispatched without this full arming line, in particular without the interactive-mode instruction and without the ledger-write instruction, is a failed dispatch by the same rule pest-controller-suit applies to a missing Stinger reference: terminate and re-dispatch with the line present, do not let it proceed on partial instructions.

## Wave 5, the nine-wide parallel wave (plus social-presence)

W5 is ten Drones: `technical-seo-wasp-drone`, `aeo-audit-wasp-drone`, `content-semantics-wasp-drone`, `internal-linking-wasp-drone`, `accessibility-audit-wasp-drone`, `web-security-posture-wasp-drone`, `analytics-stack-wasp-drone`, `performance-cwv-wasp-drone`, `visual-funnel-wasp-drone` (all nine read `site-data/` and write to their own subfolder, no write contention per the build plan), plus `social-presence-wasp-drone` (independent of `site-data/`, included in the same wave for wall-clock reasons per the build plan).

**On a harness with native concurrent subagent dispatch** (Claude Code, and Cowork's plugin `agents/` surface when running inside Cowork proper rather than Chat, per `harness-support-matrix.md`'s Agents section): the orchestrator issues all ten arming dispatches in a single turn, the same "spawn every Drone at the top level" pattern `pest-controller-suit/SKILL.md` uses for its own multi-Drone sequences. It then waits for all ten to return before running the pre-advance check for W5. Genuinely overlapping `started_at`/`completed_at` windows in the ledger are the evidence this happened, per prd-022 AC-1.

**On a harness without a documented file-based concurrent subagent format** (Codex; per the matrix's Agents section, Codex exposes only `agents.<role>` config keys in `config.toml` with an undocumented `.config_file` shape, not a per-agent markdown file the way Claude Code, Cursor, and Cowork do): genuine concurrent dispatch is not available. This is a known constraint, not a design choice. The fallback is a sequential dispatch of the same ten Drones, one after another, each still fully armed with its Stinger and each still writing its own ledger key. The ledger's `started_at`/`completed_at` values will not overlap in this case, and that is the correct, honest record; the orchestrator does not fake overlapping timestamps to match AC-1's Claude Code-native reading. AC-1 is scoped to "a harness with native dispatch" for exactly this reason (see prd-022 AC-1's own wording).

**On Cursor**, the matrix documents that Cursor 2.4 supports its own subagent format at `.claude/agents/` (project) with a fallback read of Claude-shaped agent files, so a Drone's agent definition often loads unmodified. The matrix does not, however, document whether an orchestrating Cursor session can dispatch multiple such subagents concurrently from one turn the way Claude Code's Task-tool pattern does; the one adjacent citation in the matrix (Cursor 2.0 "Composer multiagent") is attached to Team Commands, not to a confirmed concurrent-subagent-from-one-orchestrator guarantee. Treat this as unconfirmed rather than assume it. Where the operator has not verified genuine concurrent dispatch on their Cursor setup, use the same sequential fallback as Codex and say so in the run summary, rather than claim a parallelism the matrix does not back.

**On Cowork's Chat surface** (as opposed to Cowork proper): the matrix's Conflicts section records that hooks and sub-agents are "Cowork-only, not Chat" while skills work in both. Since `master-website-auditor` is a skill, it is reachable from Chat, but Chat gives it no subagent fan-out mechanism at all. In that case W5's ten Drones are run as ten sequential in-context passes by the skill itself, each still producing the same subfolder outputs and the same ledger entries, just inline rather than via dispatched agents.

In every fallback case, the folder outputs, the ledger schema, and the dependency order are identical to the native-dispatch case; only wall-clock concurrency differs, and the ledger honestly reflects which mode ran, honoring prd-022 AC-2's "structurally identical workspace" requirement even when the parallelism itself could not be replicated.

## Conditional Wave 6

`blog-content-wasp-drone` (W6a) and `ecommerce-catalog-wasp-drone` (W6b) are dispatched only when their content type was detected earlier in the run. The build plan and prd-018/prd-019 do not name a single Drone as the owner of this detection signal; reading `stack-fingerprint-wasp-drone`'s (W1a) and `site-crawler-wasp-drone`'s (W4) scope, the most plausible signal is `_shared/target-profile.json`, which `audit-intake-wasp-drone` stubs in W0 and which platform/commerce signals would naturally populate during W1 and W4. This is engineering judgment, not a sourced fact: treat `target-profile.json`'s platform/content-type fields as the detection source, and if a future pair's authored Stinger writes this signal somewhere else, this orchestrator's check should be updated to match rather than the other Drone's contract bent to fit this guess.

Skipping mechanics: if `target-profile.json` shows no blog/content-marketing section detected, the orchestrator does not dispatch `blog-content-wasp-drone` at all. It writes a `skipped` (not `failed`, not `complete`) status directly into the ledger on that Drone's behalf, with a `reason` field, and the pre-advance check for W7 treats `skipped` as satisfying the wave-completion requirement for that Drone (per prd-018 AC-1, a not-detected content type resolves to N/A/0 and is excluded from scoring entirely, never penalized). The same applies to `ecommerce-catalog-wasp-drone` against a commerce-detected signal, per prd-019 AC-1.

## The ICP hard gate, operationally (W2)

`icp-positioning-wasp-drone` is dispatched normally for W2. If its own Stinger cannot determine the site's focus above its stated confidence threshold, it writes `gate_halt` (not `complete`, not `failed`) as its status in the ledger, with a `gate_reason` field describing what it found and why confidence fell short, and whatever partial evidence it gathered still lands in `02-positioning/`, per conduct rule 2 (evidence at the moment of finding, never withheld pending an outcome).

On seeing `gate_halt` in the pre-advance check, the orchestrator, and only the orchestrator, does the following, in order:

1. Sets the ledger's top-level `status` to `halted`, and writes `halted_at`, `halted_wave: "W2"`, and `halted_reason` (a short pointer to the Drone's own `gate_reason`, not a restatement in the orchestrator's own words, so the record traces to the original finding).
2. Appends a dated entry to the workspace `README.md` run manifest recording the halt, in the same manifest section `audit-intake-wasp-drone` established in W0.
3. Does not dispatch W3, W4, or any later wave. There is no partial-credit path and no "proceed with a best guess" fallback; per prd-001 AC-3 and conduct rule 6, an undeterminable focus is a critical failure, not a low-confidence continuation.
4. Reports to the user in the same turn: states plainly that the run halted at W2, quotes or closely paraphrases `icp-positioning-wasp-drone`'s `gate_reason` and the evidence path in `02-positioning/`, and asks a direct clarifying question grounded in what was actually found (for example, whether the given domain is correct, whether a different entry path such as a specific subdomain or locale should be audited instead, or whether the site is genuinely a holding page not yet ready for audit).
5. Leaves the workspace in place, resumable. Once the user answers, the orchestrator re-dispatches `icp-positioning-wasp-drone` with the clarification folded into its arming line (or, if the correction changes the target domain itself, defers to `audit-intake-wasp-drone`'s own documented resume behavior against the existing `_shared/run-ledger.json`, per prd-002 AC-4, rather than re-implementing resume logic here).

## Interactive-mode consent (conduct rule 1, Q16)

The build plan's Q16 default is an opt-in interactive/stateful-testing mode, consent recorded at intake, defaulting off. `audit-intake-wasp-drone`'s own PRD (prd-002 AC-1) names exactly four questions it asks, in order (auditor name, audited-party contact name, audited-party business name, website URL), and none of them is this consent flag. No other pair in the 20-pair roster claims ownership of it either. Reading that gap plainly: this orchestrator is the component left holding it, since it is the one place that runs before every Drone that could need it.

Concretely: `interactive_mode` defaults to `false` and is recorded in the ledger at run start. It only becomes `true` if the user explicitly requests interactive or stateful testing at invocation time (for example, an explicit flag or a stated instruction alongside the domain when the command or skill is invoked), never inferred from context. Every arming line for every dispatched Drone carries the current value of `interactive_mode` explicitly, so no Drone has to infer the run's consent posture from its own judgment. This is this pair's own design decision to close a real gap between the build plan's stated default and prd-002's fixed four-question scope, not a sourced fact from any PRD; if a later stage assigns this consent capture to `audit-intake-wasp-drone` instead, this orchestrator should defer to that Drone's recorded value in the ledger rather than capture its own.

## Verification-log and subjective-labeling enforcement

The orchestrator does not author, edit, or move findings; every Drone owns its own verification log and its own `[subjective]` labeling, per its own Stinger. This orchestrator's enforcement is structural, not editorial: it treats a Drone's `complete` ledger entry with no `artifacts` as a failed dispatch (see the pre-advance check above), and before dispatching W7 (`audit-scoring-wasp-drone`), it confirms `_shared/evidence-index.md` has been appended to since W0 (non-empty growth, not content review) as a coarse check that findings are landing with evidence pointers rather than being silently skipped. It does not itself validate that a specific finding is correctly labeled `[subjective]` or that a specific rejected candidate is logged with the correct reason; that validation is `audit-scoring-wasp-drone`'s job per prd-020 AC-5 (rejecting any leaf finding that arrives without an evidence pointer or justification).

## AI-content-detection posture enforcement (W6a)

When dispatching `blog-content-wasp-drone`, the arming line explicitly restates the constraint from prd-018 AC-3: AI-authorship findings must be a probability band with stated method and error rate, never a flat verdict. This is enforcement by instruction, not by the orchestrator parsing the Drone's prose for banned phrasing; the static check described in prd-018 AC-3 belongs to `blog-content-wasp-drone`'s own Stinger. If the orchestrator, in the course of the coarse evidence-index check above, notices output phrased as a flat verdict, it treats that the same as any other failed dispatch and re-dispatches the Drone with the constraint restated, rather than silently passing it through to scoring and reporting.
