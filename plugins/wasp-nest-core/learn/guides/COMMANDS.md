# Commands: named jobs that coordinate the Nest

A command gives a repeatable job a short name. It answers **what whole workflow should run?** A Drone owns a specialist part; a Stinger supplies the method; a command puts several parts in an order with evidence and stopping rules. A command is not magic code and does not grant permission to push, publish, or deploy.

## Choose the right command

The core plugin contains seven named commands. These are the current entry points, not the former Beekeeper and Smoker names:

| Command | Use it when | Expected result |
| --- | --- | --- |
| [`/pest-controller`](../../commands/pest-controller.md) | A task needs routing across specialist Drones. | A scoped dispatch with each Drone armed by its Stinger. |
| [`/smoke-it`](../../commands/smoke-it.md) | One or more PRDs must reach verified acceptance criteria. | An acceptance ledger, dependency-aware waves, checks, and an honest close-out. |
| [`/ship-gate`](../../commands/ship-gate.md) | A changed branch needs its ordered pre-ship review. | Security review before independent quality, then the remaining owner and repository checks. |
| [`/forge`](../../commands/forge.md) | A genuinely new Drone, Stinger, rule, command, or plugin is needed. | A researched and validated component, beginning with topic questions. |
| [`/register`](../../commands/register.md) | A new Drone/Stinger pair exists but is not discoverable. | Pairing, roster guide, cross-links, and validation. |
| [`/drift-audit`](../../commands/drift-audit.md) | The roster may disagree with shipped files. | A findings report; it does not silently fix drift. |
| [`/re-research`](../../commands/re-research.md) | A Stinger's external facts need a dated refresh. | Updated evidence and distillation for that one Stinger. |

Do not run `/smoke-it` for a one-line answer or a typo. Do not run `/forge` because an existing Drone's description could be improved. Use the smallest workflow that produces the outcome.

## See a command in action

For a bounded task, give Pest Controller a target and a boundary:

```text
Use Pest Controller to route this authentication change. Identify the auth, API documentation, and test responsibilities. Show which Drones you would use and where they must coordinate before anyone edits code.
```

For a planned feature, give Smoke It a real PRD rather than a vague ambition:

```text
Use Smoke It for PRD-014. Build an acceptance ledger, check every shared CTR revision, keep blocked criteria visible, and show me the execution waves before work begins.
```

The second request does not accept a Draft CTR or authorize an external action. The [PRD execution guide](PRD-EXECUTION.md) explains the ledger and the [CTR guide](WRITE-A-CTR.md) explains the shared-boundary preflight.

## What a good command contains

A useful command names its trigger, desired outcome, inputs, sequence, owner of each step, safety boundary, evidence, and stop conditions. "Make the feature good and ship it" has none of those. "Read the PRD, check accepted CTR pins, track every criterion, run named tests, then report the proof and ask before pushing" can be audited.

Claude Code exposes the plugin's native slash commands. Codex uses generated `source-command-*` Stinger wrappers for the same workflows; other harnesses have their own support. [Harness capabilities](../reference/HARNESS-CAPABILITIES.md) is the place to check the real surface. When no command UI exists, ask for the workflow by name and point at its Stinger or readable command file.
