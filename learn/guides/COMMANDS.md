# Commands: named jobs that coordinate the Nest

A command gives a repeatable job a short name. It answers **what whole workflow should run?** A Drone owns a specialist part; a Stinger supplies the method; a command puts several parts in an order with evidence and stopping rules. A command is not magic code and does not grant permission to push, publish, or deploy.

## Choose the right command

The catalog defines eighty-five source commands: nine in Core and seventy-six in optional plugins. The tables below list the main entry points; `plugin-catalog.json` has the complete list per plugin. The Core commands below are shown by short name; native Claude uses the `wasp-nest-core:` prefix. Local home installations also expose flat commands.

| Command | Use it when | Expected result |
| --- | --- | --- |
| [`/pest-controller`](../../plugins/wasp-nest-core/commands/pest-controller.md) | A task needs routing across specialist Drones. | A scoped dispatch with each Drone armed by its Stinger. |
| [`/smoke-it`](../../plugins/wasp-nest-core/commands/smoke-it.md) | One or more PRDs must reach verified acceptance criteria. | An acceptance ledger, dependency-aware waves, checks, and an honest close-out. |
| [`/ship-gate`](../../plugins/wasp-nest-core/commands/ship-gate.md) | A changed branch needs its ordered pre-ship review. | Security review before independent quality, then the remaining owner and repository checks. |
| [`/forge`](../../plugins/wasp-nest-core/commands/forge.md) | A genuinely new Drone, Stinger, rule, command, or plugin is needed. | A researched and validated component, beginning with topic questions. |
| [`/register`](../../plugins/wasp-nest-core/commands/register.md) | A new Drone/Stinger pair exists but is not discoverable. | Pairing, roster guide, cross-links, and validation. |
| [`/drift-audit`](../../plugins/wasp-nest-core/commands/drift-audit.md) | The roster may disagree with shipped files. | A findings report; it does not silently fix drift. |
| [`/re-research`](../../plugins/wasp-nest-core/commands/re-research.md) | A Stinger's external facts need a dated refresh. | Updated evidence and distillation for that one Stinger. |
| [`/choose-outcome`](../../plugins/wasp-nest-core/commands/choose-outcome.md) | You know the result you want but not which pack or skill owns it. | One recommended route that separates proposed coverage, source presence and installed availability. |
| [`/qualify-wiring`](../../plugins/wasp-nest-core/commands/qualify-wiring.md) | A skill, agent, command or plugin was added or rewired. | A qualification of source, generated carriers, selected owners and native proof. |

## Optional command owners

Install the owning plugin and its prerequisites before choosing an optional workflow. The native Claude selectors are:

| Owner | Command | Workflow |
| --- | --- | --- |
| `website-audit-tools` | `/website-audit-tools:perform-website-audit` | Public-site intake, crawl, findings, scores and reports. |
| `code-audit-tools` | `/code-audit-tools:audit-my-code` | Source and app audits, evidence and remediation planning. |
| `documentation-tools` | `/documentation-tools:library-packets` | Source-grounded audience documents and exports. |
| `documentation-tools` | `/documentation-tools:kb-refresh` | Repository knowledge refresh; full discovery also needs Code Audit. |
| `data-and-ai-tools` | `/data-and-ai-tools:tars` | TARS manages sessions with CASE as adviser and read-only systems and CI watcher, and KIPP as idea factory and PRD writer. Claude Code Desktop only. |
| `browser-and-app-testing-tools` | `/browser-and-app-testing-tools:webapp-capture` | Scoped live-app capture and visual inventory. |
| `app-primer-zero` | `/app-primer-zero:app-primer-zero` | App preparation and dependency-ordered handoff before implementation. |
| `product-studio` | `/product-studio:plan-product` | Strategy, UX design and the build plan (PRD map, wave plan, Definition of Done), approved stage by stage before PRDs are written. |
| `interstellar-coding` | `/interstellar-coding:interstellar` | Stand up the crew: TARS leads KIPP, CASE, LADY, MOON, OWEL, COOP and MURPH, each with its own command (`/kipp`, `/case`, `/lady`, `/moon`, `/owel`, `/coop`, `/murph`). Needs `data-and-ai-tools` and `code-audit-tools`. |

Codex exposes each owner's generated `source-command-<name>` skill. Use the exact installed selector shown by the client. A wrapper reads the existing command procedure; it does not duplicate that procedure or expand its authority.

[Document workflows](DOCUMENT-WORKFLOWS.md) gives the prerequisites, inputs, outputs and sample requests for Library Packets, App Primer Zero and KB Refresh. KB Refresh updates repository knowledge from code; Library Packets creates documents for readers; App Primer prepares a future build.

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

For a documentation refresh, start with a scope request before writers run:

```text
Use KB Refresh for this repository. Pin the base commit, inventory stale or missing knowledge docs, and show me the write scope, frozen files, proposed units and cost before launching the writer fleet. Log suspected code issues without fixing them. Keep commits, pushes and PRs pending my approval.
```

Install Core and Documentation Tools. Full repository discovery also needs Code Audit Tools. The source installer's `refresh-repository-knowledge` profile selects those three packages; a marketplace user must select each required plugin. One page needing a correction belongs to Knowledge Stinger instead.

## What a good command contains

A useful command names its trigger, desired outcome, inputs, sequence, owner of each step, safety boundary, evidence, and stop conditions. "Make the feature good and ship it" has none of those. "Read the PRD, check accepted CTR pins, track every criterion, run named tests, then report the proof and ask before pushing" can be audited.

Claude Code exposes the plugin's native slash commands. Codex uses generated `source-command-*` Stinger wrappers for the same workflows; other harnesses have their own support. [Harness capabilities](../reference/HARNESS-CAPABILITIES.md) is the place to check the real surface. When no command UI exists, ask for the workflow by name and point at its Stinger or readable command file.

The `/tars` manager team (TARS, CASE and KIPP) requires Claude Code Desktop. An installed TARS skill or command wrapper in another client does not provide those session tools.
