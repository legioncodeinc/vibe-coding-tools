---
name: "tauri-stinger"
description: "Tauri 2 engineering for desktop and mobile: updates, migration, IPC, capabilities, sidecars, AI runtimes, persistence, signing, updater, testing, and distribution. Use for Tauri-specific work."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Tauri 2 projects; Python 3.9+ for the optional inspector.
metadata:
  hive-bee: tauri-worker-bee
  domain: tauri
  pair-bee: tauri-worker-bee
  research-window: 2026-03-03 to 2026-09-03
---

# Tauri Stinger

## Purpose

Equip `tauri-worker-bee` to inspect, migrate, implement, secure, test, and distribute Tauri 2 desktop and mobile applications. It includes a dated six-month update sweep, compact primary-source captures, supplemental living baseline documentation, and derived patterns for hosted and local AI applications.

## When to use

- Creating, upgrading, or debugging a Tauri 2 desktop or mobile application
- Migrating a Tauri 1 project to Tauri 2
- Aligning `tauri`, `@tauri-apps/api`, CLI, plugin, runtime, Wry, or Tao versions
- Designing Rust commands, frontend `invoke`, events, Channels, managed state, or cancellation
- Configuring capabilities, permissions, scopes, CSP, remote origins, or sidecar access
- Building a hosted-provider, local-sidecar, native-runtime, or mobile-plugin AI feature
- Choosing Store, SQL, Stronghold, or managed state for application data
- Testing native behavior, building installers, signing, updating, or distributing a Tauri application
- Refreshing current Tauri 2 release and security notes from primary sources

## When not to use

- General Rust language, Cargo, async, unsafe, or library architecture unrelated to Tauri; use [rust-stinger](../rust-stinger).
- Frontend-framework component design or reactivity; use the relevant framework Stinger such as [svelte-stinger](../svelte-stinger) or [react-stinger](../react-stinger).
- Formal security audit of the resulting implementation; use [security-stinger](../security-stinger) after Tauri implementation work.
- CI platform architecture or release automation beyond Tauri-specific integration; use [ci-release-stinger](../ci-release-stinger) or [devops-stinger](../devops-stinger).
- Dependency vulnerability triage, SBOMs, or update-bot policy; use [dependency-audit-stinger](../dependency-audit-stinger).

## Procedure

1. **Establish authority and scope.** Read [guides/00-authority-and-scope.md](guides/00-authority-and-scope.md). Keep dated Tauri facts separate from derived AI designs.
2. **Inspect before editing.** Follow [guides/01-inspect-and-align.md](guides/01-inspect-and-align.md), resolve `scripts/inspect-tauri-project.py` relative to this loaded `SKILL.md`, and run `python <resolved-script-path> <project-root> --pretty` for a read-only JSON inventory.
3. **Refresh mutable versions.** Read [references/CURRENT-TAURI-2.md](references/CURRENT-TAURI-2.md) as a dated snapshot, then use [guides/09-refresh-current-tauri.md](guides/09-refresh-current-tauri.md) before making present-tense version claims.
4. **Migrate deliberately.** For Tauri 1, execute [guides/02-migrate-v1-to-v2.md](guides/02-migrate-v1-to-v2.md) in bounded slices and manually review generated capabilities.
5. **Design IPC and state.** Use [guides/03-design-ipc-and-state.md](guides/03-design-ipc-and-state.md) for typed commands, structured errors, ordered Channels, event cleanup, managed state, timeouts, and cancellation.
6. **Constrain authority and secrets.** Apply [guides/04-secure-capabilities-and-secrets.md](guides/04-secure-capabilities-and-secrets.md). Treat custom scope enforcement as authorization code and keep publisher-owned secrets outside the client.
7. **Choose the AI topology.** Use [guides/05-integrate-ai-runtimes.md](guides/05-integrate-ai-runtimes.md) and label the hosted-provider, desktop-sidecar, native-runtime, or mobile-plugin result as a derived application design.
8. **Classify persistence.** Follow [guides/06-persist-ai-state.md](guides/06-persist-ai-state.md) to separate preferences, structured records, user-owned secrets, and ephemeral runtime handles.
9. **Verify real behavior.** Follow [guides/07-test-desktop-and-mobile.md](guides/07-test-desktop-and-mobile.md). Distinguish mocked, browser-only, native, packaged, and physical-device evidence.
10. **Build and distribute.** Complete [guides/08-build-sign-update-distribute.md](guides/08-build-sign-update-distribute.md) and [references/RELEASE-CHECKLIST.md](references/RELEASE-CHECKLIST.md), then enter the Ship Gate.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load for the full project, version, IPC, platform, escalation, and red-flag decision tables.
- [references/CURRENT-TAURI-2.md](references/CURRENT-TAURI-2.md), load before an update, migration, security-floor, or "latest version" question; every value is dated 2026-09-03.
- [references/IPC-SECURITY-REFERENCE.md](references/IPC-SECURITY-REFERENCE.md), load when designing commands, Channels, capabilities, scopes, CSP, sidecars, or secret boundaries.
- [references/AI-ARCHITECTURE-REFERENCE.md](references/AI-ARCHITECTURE-REFERENCE.md), load when choosing hosted, local, native, or mobile AI architecture and stream contracts.
- [references/RELEASE-CHECKLIST.md](references/RELEASE-CHECKLIST.md), load before packaging, signing, updating, publishing, or claiming release readiness.
- [references/research/distilled-tauri-2.md](references/research/distilled-tauri-2.md), load when a domain claim needs verification or a conflict needs resolution.
- `references/research/raw/`, load when tracing a distilled claim to its official or upstream primary source note.
- `examples/`, load the one example matching the task: typed AI Channel, hosted command boundary, local sidecar, least-privilege capability, v1 migration, or signed updater flow.
- `templates/`, copy the relevant inspection, AI decision, capability review, upgrade plan, or release evidence template into the consumer repository's planning or report location.
- `scripts/inspect-tauri-project.py`, run for deterministic read-only discovery or with `--self-test` after maintaining the script.

## Related bees and stingers

- [tauri-worker-bee](../../agents/tauri-worker-bee.md) - Paired implementation specialist for Tauri-specific project work.
- [rust-stinger](../rust-stinger) - General Rust and Cargo architecture beneath Tauri integration.
- [typescript-node-stinger](../typescript-node-stinger) - TypeScript boundaries, package tooling, and test infrastructure around the WebView frontend.
- [svelte-stinger](../svelte-stinger) - Svelte 5 and SvelteKit frontend behavior when the Tauri WebView uses Svelte.
- [security-stinger](../security-stinger) - Formal review of IPC authorization, filesystem and shell exposure, remote origins, credentials, and update trust.
- [ci-release-stinger](../ci-release-stinger) - CI and release workflow architecture beyond Tauri-specific bundle integration.
- [dependency-audit-stinger](../dependency-audit-stinger) - Dependency vulnerabilities, lockfile policy, update automation, and SBOM evidence.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [rust-stinger](../rust-stinger) - General Rust architecture, Cargo, async, testing, and unsafe-code guidance below the Tauri layer.
  - [typescript-node-stinger](../typescript-node-stinger) - TypeScript and package-tooling guidance for the frontend half of a Tauri application.
  - [svelte-stinger](../svelte-stinger) - Svelte 5 and SvelteKit guidance when that framework renders the WebView.
  - [security-stinger](../security-stinger) - Required first Ship Gate audit and formal review of Tauri authority and secret boundaries.
  - [quality-stinger](../quality-stinger) - Required independent Quality gate after Security findings are resolved.
  - [github-repo-health-stinger](../github-repo-health-stinger) - Required orchestrator-level repository-health gate before commit or push.
  - [ci-release-stinger](../ci-release-stinger) - CI and release workflow architecture for signed multi-platform delivery.
  - [dependency-audit-stinger](../dependency-audit-stinger) - Dependency, advisory, lockfile, SBOM, and provenance review.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
