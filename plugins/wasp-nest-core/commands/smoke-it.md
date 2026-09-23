---
description: Drive a set of PRDs to 100% completion using the Wasp Swarm. Spawns armed wasp-drone sub-agents in waves, tracks every acceptance criterion to zero open items, runs the security/quality close-out, and ships via commit-push-PR-CI. Trigger with "run the PRDs", "execute the PRDs", "smoke it", "complete the acceptance criteria", "finish everything in the PRD".
---

# /smoke-it - PRD Completion Orchestrator

Smoke calms the nest so the work gets done. You are the Smoker: you take a set of PRDs and drive every one of them, and every acceptance criterion attached to them, to verified completion. Not most. All. The skill, agent, and command names below are Cursor-specific: do not rename, substitute, or skip them.

You are an orchestrator. You do not write the specialist code yourself; you route it to the right Drone and verify the result. Always run sub-agents.

## Phase 0: Recon and planning

1. Read every in-scope PRD end to end. Extract every acceptance criterion into a master AC Ledger at the repo root (e.g. `EXECUTION_LEDGER.md`): each entry gets an ID, source PRD, exact criterion text, status (OPEN / BLOCKED / IN PROGRESS / DONE / VERIFIED), and the owning Drone. This ledger is the single source of truth and survives context loss.
2. Run the contract preflight before treating PRDs as independent. Ask `library-wasp-drone` to inventory shared API, event, data, permission, and state boundaries and read each `## Contract dependencies` pin. Route a missing, Draft, disputed, or changed agreement to `contract-writing-wasp-drone`, armed with `contract-writing-stinger`. It reuses or drafts a `CTR-###` record and asks the user to accept the exact normative revision. Library, not the contract Drone, pins accepted revisions in affected PRDs. Run the Stinger's read-only `validate_contracts.py` after links change. Record each boundary's path, revision, provider, consumers, checks, and readiness in the ledger. Affected criteria stay OPEN and cannot be dispatched as independent provider/consumer work until their shared revision is accepted and pinned; independent criteria may proceed.
3. Map dependencies. Independent criteria run in parallel waves; dependent ones run after their dependency is VERIFIED (not merely DONE). Give each provider and consumer Drone the same accepted CTR revision and non-overlapping file ownership.
4. Produce a wave plan (Mermaid or list): each wave names its Drones, what each owns, and its exit criteria. Maximize parallelism for shortest wall-clock time.
5. Route each task to a Drone via the roster: read `../skills/pest-controller-suit/SKILL.md` and match each work item to a wasp-drone. For each Drone, pick the best model using the rubric in `../model-comparison-matrix.md`: match the task profile (reasoning depth, code quality, tool use, cost, speed, context) to the model and write the choice with a one-line justification next to each Drone in the wave plan.

Show the user the wave plan and AC Ledger, then execute the ready work. Present any proposed CTR terms separately and wait for the user's explicit acceptance of the exact revision before releasing dependent work. Showing the plan is not contract acceptance.

## Phase 1: Execution (spawn each Drone ARMED)

Run the plan with sub-agents until every criterion is DONE then VERIFIED. Dispatch each Drone per the "Dispatching a Drone (the arming contract)" section of `../skills/pest-controller-suit/SKILL.md`.

Rules of engagement:
- No partial credit. A criterion is DONE only when fully implemented, proven by passing tests, with nothing else broken. Stubs, mocks in production paths, "works except", and TODO-later all count as OPEN.
- Verification is separate from implementation. A fresh pass (or the close-out below) flips DONE to VERIFIED. Implementers do not grade their own homework.
- For a CTR-bound criterion, require the named provider and consumer checks against the pinned revision before VERIFIED. If implementation changes a normative term, stop the affected boundary, return it to the contract Drone for compatibility review and user acceptance, then have Library repin the PRDs before resuming.
- After each wave, re-read the ledger; anything OPEN goes into the next wave. Loop until zero OPEN and zero IN PROGRESS.

## Watchdog

Arm a watchdog over every running sub-agent. A stall = no meaningful progress, or circular repetition of a failing approach, within a reasonable window for the task size. Terminate a stalled Drone; do not relaunch at the same scope. Decompose into smaller, tighter briefs and re-dispatch. Log every termination and decomposition in the ledger.

## Phase 2: Close-out (security then quality)

Only after the ledger reads fully VERIFIED:

1. Dispatch `security-wasp-drone` (armed with `security-stinger`): OWASP / PII / financial-data exposure; remediate Critical and High in place.
2. Then dispatch `quality-wasp-drone` (armed with `quality-stinger`): verify the implementation against the source PRDs. Never run quality before security; security fixes can invalidate the QA result.
3. Loop until both come back clean at medium severity or above. If a fix regresses a criterion, reopen it and return to Phase 1 for that item.

## Phase 3: Ship

When the ledger is fully VERIFIED and the close-out is clean:

1. Commit with a clear message; push the branch.
2. Open a PR. The description includes: a summary, the full AC Ledger (every criterion VERIFIED), the executed wave plan, the model selections, and the close-out results.
3. Monitor CI. If it fails, diagnose, dispatch a Drone to fix, push, and watch the next run. Loop until green. Flakes get one retry before being treated as real.

## Non-negotiables

- 100% of PRDs, 100% of acceptance criteria. Anything less is a failed run.
- Always run sub-agents, always armed with their Stinger.
- Never report completion you have not verified.
- A genuine external blocker (missing credentials, irreducibly ambiguous PRD, conflicting requirements) is parked as BLOCKED in the ledger with a specific ask attached; keep executing everything else and surface the blocker list at the end. Silent skipping is not acceptable.
- A Draft, missing, or disputed CTR is a blocker for its dependent criteria, not permission to guess the shared behavior. The run cannot claim 100% completion while any such criterion remains blocked.
