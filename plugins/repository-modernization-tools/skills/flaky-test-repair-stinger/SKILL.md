---
name: "flaky-test-repair-stinger"
description: "Repair flaky tests from observed failures with bounded causal reproduction, narrow fixture fixes, preserved assertions and exact final-candidate evidence."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork"
metadata:
  hive-drone: flaky-test-repair-wasp-drone
  pair-drone: flaky-test-repair-wasp-drone
  domain: flaky-test-repair
  research-window: 2026-04-08 to 2026-10-08
---

# Flaky Test Repair Stinger

Start with [README.md](README.md). Diagnose and repair from actual observed failures with a bounded test/fixture scope, preserved assertions and exact final-candidate receipts.

## Purpose

Turn an observed intermittent failure into a causal hypothesis, a bounded discriminating experiment and a narrow repair with honest proof. A source guide, retry pass or plausible diff does not establish a repaired consumer test.

## When to use

- Fix a flaky test using supplied failing assertion/trace and actual repository evidence.
- Diagnose order, isolation, teardown, concurrency, clock/random or network causes with a defined test budget.
- Repair exact owned test/fixture files while preserving the genuine oracle and relevant negative coverage.

## When not to use

- No observed failure/consumer repository: guidance only, no implementation/repair claim.
- Broad test-suite rewrite, CI retry policy, dependency install or quarantine/deletion to make a job green.
- Final implementation audit: Core Quality independently reviews after Security.
- Product code/framework mechanics beyond assigned repair scope: route its language/browser owner under the accepted interface.

## Procedure

1. Read [topic](TOPIC.md), fresh digest and [ownership/state reference](references/REFERENCE.md). Preserve exact scope, active ownership and task-specific test authority.
2. Follow [failure capture](guides/01-capture-observed-failure.md): pin source/environment/runner/seed/order, failing oracle, actual attempt outcomes and total budget.
3. Follow [bounded repro](guides/02-run-bounded-causal-repro.md): one discriminating condition per hypothesis, max two identical failed invocations/max three failed approaches unless the user explicitly authorizes a specific larger measurement batch.
4. Follow [causal repair](guides/03-apply-causal-repair.md): change only the evidenced owned test/fixture cause; preserve assertions, negative coverage, accepted deadlines and contracts. Product bugs return to their owner.
5. Follow [proof](guides/04-prove-repair-on-final-candidate.md): actual bounded trials on the final pin under original conditions, retaining every failed/skipped/retried/cancelled/stale result and coverage limits.
6. Complete [the worksheet](templates/failure-repair-evidence.md) and consumer library report. Source/fictional cases are NOT_RUN; no live CI/native/provider claim follows.
7. Run independent Security, resolve findings and affected checks, then Quality. Parent loads repository health and preserves user review/approval before commit/push or other external effects.

## References map

- [README.md](README.md) - Selection, implementation/diagnosis modes and workflow map.
- [references/REFERENCE.md](references/REFERENCE.md) - Observation/causal/repair states, budgets and peer ownership.
- Source research archive (not shipped with the plugin): do not require it.
- [Fictional record](examples/01-fictional-observed-failure-record.md), [negative decisions](examples/02-negative-decisions.md) - Explicitly constructed NOT_RUN learning cases.
- [Worksheet](templates/failure-repair-evidence.md) - Exact consumer failure/hypothesis/repair/proof record.

## Related drones and stingers

- [flaky-test-repair-wasp-drone](../../agents/flaky-test-repair-wasp-drone.md) - Paired triage and bounded test/fixture implementation owner.
- [browser-automation-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/browser-and-app-testing-tools/skills/browser-automation-stinger) - Actual Playwright/Puppeteer mechanics and browser target evidence.
- [quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger) - Independent final audit after Security; never repairs implementation.
- [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) - Independent first gate.
- [python-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/backend-and-desktop-tools/skills/python-stinger), [typescript-node-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/backend-and-desktop-tools/skills/typescript-node-stinger), [go-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/backend-and-desktop-tools/skills/go-stinger) - Language/product implementation under the accepted repair boundary.
- [ci-release-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/platform-and-release-tools/skills/ci-release-stinger) - CI topology/policy changes outside this repair.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [browser-automation-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/browser-and-app-testing-tools/skills/browser-automation-stinger) - Framework-native browser testing mechanics.
  - [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) - Independent first Ship Gate review.
  - [quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger) - Independent audit after Security findings resolve.
  - [github-repo-health-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/github-repo-health-stinger) - Parent final repository gate.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
