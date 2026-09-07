---
name: "electron-app-stinger"
description: "Electron application engineering for process boundaries, preload APIs, IPC, sandboxing, packaging, updates, and desktop verification. Use for Electron app implementation or review."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-bee: electron-app-worker-bee
  domain: electron-applications
  pair-bee: electron-app-worker-bee
  research-window: 2026-03-05 to 2026-09-05
---

# Electron Application Stinger

## Purpose

Guide secure Electron application work from main process through preload and renderer, with a narrow typed IPC surface and evidence from a running packaged desktop app. It is intentionally separate from the quarantined Electron dissection material, which is reverse-engineering work.

## When to use

- Building, reviewing, migrating, packaging, or debugging an Electron desktop application
- Designing main, preload, renderer, IPC, permissions, sandbox, or external navigation behavior
- Testing an Electron desktop boundary beyond a browser-only web test

## When not to use

- Reverse engineering a third-party Electron app, use the Electron dissection material when it is explicitly available.
- Tauri-specific desktop work, use [tauri-stinger](../tauri-stinger).
- Generic TypeScript or frontend design, use the relevant language or UI Stinger.

## Procedure

1. Read [guides/01-secure-process-boundary.md](guides/01-secure-process-boundary.md).
2. Inventory each `BrowserWindow`, loaded origin, preload API, IPC channel, permission request, navigation policy, and shell-open path before edits.
3. Keep Node integration disabled for remote content, preserve context isolation, and expose only validated capability-shaped preload methods.
4. Validate IPC payloads in the main process. Do not pass whole Electron objects, unrestricted `ipcRenderer`, shell access, or filesystem primitives to the renderer.
5. Verify in a native run and, when release behavior is claimed, a packaged artifact. Distinguish this from a unit or browser-only result.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load for process and verification tables.
- [references/research/distilled-electron-app.md](references/research/distilled-electron-app.md), load to verify a claim.
- `references/research/raw/`, load for primary source captures.
- [guides/01-secure-process-boundary.md](guides/01-secure-process-boundary.md), load before implementation.

## Related bees and stingers

- [electron-app-worker-bee](../../agents/electron-app-worker-bee.md) - paired implementation specialist.
- [tauri-stinger](../tauri-stinger) - alternative desktop application boundary.
- [security-stinger](../security-stinger) - independent security acceptance.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [tauri-stinger](../tauri-stinger) - Tauri-specific application work.
  - [security-stinger](../security-stinger) - audit the assembled desktop trust boundary.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
