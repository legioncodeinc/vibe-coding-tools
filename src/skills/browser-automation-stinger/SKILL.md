---
name: "browser-automation-stinger"
description: "Playwright and Puppeteer automation for deterministic browser tests, debugging, downloads, screenshots, and browser lifecycle control. Use for browser automation work."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-bee: browser-automation-worker-bee
  domain: browser-automation
  pair-bee: browser-automation-worker-bee
  research-window: 2026-03-05 to 2026-09-05
---

# Browser Automation Stinger

## Purpose

Guide testable Playwright and Puppeteer automation without conflating their APIs or assuming a browser binary is installed on every host. It covers framework selection, browser installation, isolation, selectors, diagnostics, downloads, external-effect boundaries, and CI evidence.

## When to use

- Writing, debugging, or reviewing Playwright tests or scripts
- Writing, debugging, or reviewing Puppeteer automation
- Setting up browser binaries, traces, screenshots, UI mode, or browser automation CI

## When not to use

- Implementing Chrome DevTools Protocol directly or building Chromium, use [chrome-chromium-stinger](../chrome-chromium-stinger).
- Browser performance or SEO analysis without automation code, use the appropriate performance or SEO Stinger.

## Procedure

1. Read [guides/01-select-and-operate.md](guides/01-select-and-operate.md).
2. Choose Playwright for a test-runner workflow and cross-browser project configuration. Choose Puppeteer for a focused JavaScript browser-control task, after checking its documented browser support.
3. Install the required browser binaries explicitly in local and CI environments. Do not rely on a developer machine cache.
4. Prefer semantic, stable locators and explicit expected conditions. Isolate test data and block unapproved external effects.
5. Capture trace, screenshot, video, console, and network evidence proportionate to the failure, then verify the exact browser and channel used.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load for selection and evidence table.
- [references/research/distilled-browser-automation.md](references/research/distilled-browser-automation.md), load to verify facts.
- `references/research/raw/`, load for primary source captures.
- [guides/01-select-and-operate.md](guides/01-select-and-operate.md), load before implementation.

## Related bees and stingers

- [browser-automation-worker-bee](../../agents/browser-automation-worker-bee.md) - paired implementation specialist.
- [chrome-chromium-stinger](../chrome-chromium-stinger) - CDP and Chromium engineering.
- [ci-release-stinger](../ci-release-stinger) - CI architecture beyond the browser-specific job.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [chrome-chromium-stinger](../chrome-chromium-stinger) - protocol and browser-engine ownership.
  - [ci-release-stinger](../ci-release-stinger) - workflow design.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
