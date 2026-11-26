---
name: "go-desktop-stinger"
description: "Build Wails v2 desktop apps around Go backends: typed bindings, lifecycle, storage, native builds and package evidence. Use after Wails is explicitly selected."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork"
metadata:
  hive-drone: go-desktop-wasp-drone
  pair-drone: go-desktop-wasp-drone
  domain: go-desktop-applications
  research-window: 2026-04-08 to 2026-10-08
---

# Go Desktop Stinger

Start with [README.md](README.md). This specialist covers an explicitly selected Wails v2 app with a Go backend and web frontend. It does not infer Wails from a Go language preference.

## Purpose

Build a bounded Wails desktop slice with a narrow Go facade, generated frontend bindings, owned lifecycle and app-local state, and honest native/package evidence. Runtime versions and support come from the consumer graph and named target, not this documentation snapshot.

## When to use

- Build a desktop app around a Go backend after Wails v2 is explicitly selected.
- Implement or inspect Wails Bind facades, generated wailsjs DTOs, runtime hooks and events.
- Integrate approved app-local storage, offline behavior and native/package qualification into Wails v2.

## When not to use

- General Go modules/business service internals: use [go-stinger](../go-stinger).
- Tauri/Electron with a Go sidecar: use the existing shell specialist plus Go under its process contract.
- Wails v3, Fyne, mobile or hosted-browser/server-only applications: this pair has no qualified procedure for them.
- Frontend visual/framework architecture, generic schemas, AI provider policy, formal security or public release effects: preserve their peer owners.

## Procedure

1. Read [the topic](TOPIC.md), [owner reference](references/REFERENCE.md) and fresh digest. Preserve explicit scope, target and effect authority.
2. Follow [inspection](guides/01-inspect-and-scope.md): resolve actual Go/Wails/frontend versions, existing bindings/assets and native prerequisites. Missing framework selection blocks that branch.
3. Follow [bindings](guides/02-bind-and-validate.md): dedicated facade, bounded DTOs, backend validation, safe errors, origins/navigation and native resource policies.
4. Follow [lifecycle/storage](guides/03-own-lifecycle-and-storage.md): readiness, bounded jobs, cancellation and completion joins, explicit storage contracts and recovery.
5. Implement only assigned Wails-specific files. Go services/frontend/schema/protocol/provider/release work stays with its named peer and accepted interface revision.
6. Follow [build/qualification](guides/04-build-and-qualify.md), fill [the worksheet](templates/desktop-app-evidence.md), and distinguish source/fixture/native/package evidence. Missing target/platform rows remain OPEN.
7. Write the consumer library report, run Security then affected checks then Quality, and return the parent repository-health/approval gate before commit or push. No installs, credentials, native file mutation, signing or publication without exact authority.

## References map

- [README.md](README.md) - Owner selection and workflow map.
- [references/REFERENCE.md](references/REFERENCE.md) - Bridge operation record, state ownership and peer boundaries.
- Source research archive (not shipped with the plugin): do not require it.
- [Fictional plan](examples/01-fictional-go-desktop-plan.md), [negative decisions](examples/02-negative-decisions.md) - NOT_RUN constructed acceptance decisions.
- [Worksheet](templates/desktop-app-evidence.md) - Actual consumer target/effect/evidence record.

## Related drones and stingers

- [go-stinger](../go-stinger) - General Go modules, tooling and service internals.
- [tauri-stinger](../tauri-stinger) and [electron-app-stinger](../electron-app-stinger) - Their existing shells and Go sidecar integration.
- [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) - Independent trust-boundary acceptance.
- [dependency-audit-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/dependency-audit-stinger) - Advisory, license and dependency disposition.
- [quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger) - Final implementation-to-contract acceptance after Security.
- [devops-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/platform-and-release-tools/skills/devops-stinger) - CI and distribution infrastructure.

- [go-desktop-wasp-drone](../../agents/go-desktop-wasp-drone.md) - Paired Wails boundary implementation owner.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [go-stinger](../go-stinger) - General Go mechanics beneath the Wails boundary.
  - [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) - Independent first Ship Gate review.
  - [quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger) - Independent second gate after Security findings resolve.
  - [github-repo-health-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/github-repo-health-stinger) - Parent-owned final repository gate.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
