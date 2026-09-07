---
name: "chrome-chromium-stinger"
description: "Chrome DevTools Protocol and Chromium development for remote debugging, profiles, protocol inspection, source builds, and browser-engine diagnosis. Use for Chrome or Chromium engineering."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-bee: chrome-chromium-worker-bee
  domain: chrome-chromium
  pair-bee: chrome-chromium-worker-bee
  research-window: 2026-03-05 to 2026-09-05
---

# Chrome Chromium Stinger

## Purpose

Guide Chrome developer tooling and Chromium engineering: isolated browser profiles, remote-debugging safety, Chrome DevTools Protocol inspection, Chromium checkout and build orientation, and diagnosis of browser-specific behavior. Browser automation clients remain in the Browser Automation Stinger.

## When to use

- Inspecting or integrating Chrome DevTools Protocol directly
- Creating a safe Chrome development profile or remote-debugging session
- Checking out, building, or debugging Chromium source
- Diagnosing Chrome or Chromium behavior that needs browser-engine evidence

## When not to use

- Playwright or Puppeteer test authoring, use [browser-automation-stinger](../browser-automation-stinger).
- Browser extension product design or web application UI work without protocol or engine concerns.
- Electron application process and IPC work, use [electron-app-stinger](../electron-app-stinger).

## Procedure

1. Read [guides/01-devtools-and-chromium-workflow.md](guides/01-devtools-and-chromium-workflow.md).
2. Use a dedicated `--user-data-dir` for development. Never point experiments or remote debugging at an everyday profile.
3. Treat a debugging port and its WebSocket endpoints as sensitive local control surfaces. Bind and expose them only when explicitly required.
4. For protocol work, discover the active target and browser metadata before assuming a command or domain is supported.
5. For Chromium source, verify host OS, storage, RAM, checkout path, toolchain, target, and build configuration before the long-running build.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load for CDP and source-build decisions.
- [references/research/distilled-chrome-chromium.md](references/research/distilled-chrome-chromium.md), load to verify facts.
- `references/research/raw/`, load for primary-source captures.
- [guides/01-devtools-and-chromium-workflow.md](guides/01-devtools-and-chromium-workflow.md), load before work.

## Related bees and stingers

- [chrome-chromium-worker-bee](../../agents/chrome-chromium-worker-bee.md) - paired implementation specialist.
- [browser-automation-stinger](../browser-automation-stinger) - Playwright and Puppeteer owner.
- [electron-app-stinger](../electron-app-stinger) - Electron app boundary owner.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [browser-automation-stinger](../browser-automation-stinger) - browser automation clients.
  - [electron-app-stinger](../electron-app-stinger) - Electron-specific integration.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
