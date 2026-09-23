---
name: webapp-capture-stinger
description: Capture live web apps. Demo videos and scripts; component library with tokens, a Claude Design handoff zip, and a shadcn/ui map; visual and code audits.
license: AGPL-3.0-or-later
compatibility: Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork. Scripts need Node 20.9, playwright-core, Chromium; sharp and ffmpeg for some routes.
metadata:
  author: Legion Code Inc.
  designed-by: Legion Code Inc.
  homepage: https://www.legioncodeinc.com
  hive-drone: webapp-capture-wasp-drone
  pair-drone: webapp-capture-wasp-drone
  domain: web app capture
  version: 1.1.0
---

# Webapp Capture Stinger

Designed and built by [Legion Code Inc.](https://www.legioncodeinc.com)

## Where this skill's files are

Every path below (`guides/`, `references/`, `scripts/`) is relative to the folder that contains this `SKILL.md`. In Claude Code that folder is `${CLAUDE_SKILL_DIR}`. If that text was not replaced with a real path, find the folder yourself (for example with Glob for `**/webapp-capture-stinger/SKILL.md` under `~/.claude/plugins/` or the project's `.claude/`) and use it as `SKILL_DIR` in every command.

## Purpose

Capture a running, authenticated web application from the outside, the way a user sees it, and turn that capture into something a person or another AI can build on. Three routes share one read-only crawler: a narrated-ready demo (video, key screenshots, captions, script), a component library inventory (one folder per unique component with code, measured styles, screenshots, assets, and purpose, plus a ledger and DTCG candidate tokens), and an inconsistency audit (near-duplicate tokens, scale sprawl, component drift, contrast, and the source patterns behind them). It works on any framework because it reads the rendered DOM, not the source.

## When to use

- "Make a demo video of the app", "record a walkthrough", "screenshot every page", "write a demo script"
- "Capture our entire component library", "build a component inventory from the live app", "extract design tokens from the running site", "give my UX AI everything it needs for a token guide"
- "Find visual inconsistencies", "audit our UI for drift", "which colors should be one token", "find hardcoded colors and one-off values in the code"
- "Package this for Claude Design", "map our components to shadcn/ui", "migrate this app's UI to shadcn"
- Re-running any of the above after a redesign to measure what changed

## When not to use

- Writing or maintaining Playwright tests, CI browser setup, or trace debugging for tests: `browser-automation-stinger`
- Chrome DevTools Protocol internals or Chromium builds: `chrome-chromium-stinger`
- Bootstrapping a new design system from a brief (no live app to capture): `design-system-stinger`
- Enforcing an existing design system on new UI work: `impeccable-stinger`, `ux-ui-svelte-stinger`, `ux-ui-stinger`
- Pixel regression gating between builds in CI: hosted visual-regression tooling via `ci-release-stinger` (see `guides/03-inconsistency-audit.md` for why this is a different job)
- Voice synthesis beyond basic narration: `elevenlabs-api-stinger`; avatar video: `heygen-api-stinger`

## Procedure

1. **Read `guides/00-foundation.md` in full.** Confirm origin, environment (prefer local, staging, or a seeded account), theme, and output paths with the user.
2. **Install and configure.** Run `npm install` in this skill's `scripts/` folder (and `npx playwright install chromium` if needed). Copy `scripts/capture.config.example.json` into the target repo, fill it in, and gitignore the `auth.storageState` path and its `.session.json` sidecar. Run `scripts/doctor.mjs` and fix every ERROR before continuing.
3. **Get a session without touching credentials.** Run `scripts/save-session.mjs`; the user logs in in the visible window. Never type passwords, tokens, or keys yourself, and never script it.
4. **Dry run.** Capture 3 or 4 routes. Check for setting pickers exposed as tabs, theme flips, naming collisions, and blind spots. Update `tabs.noTabsOnRoutes`, `tabs.notATabLabel`, and `routes.exclude`. Reload any settings page a tab click touched and confirm nothing persisted.
5. **Pick the route** and follow its guide end to end:
   - Demo, screenshots, script: `guides/01-demo-video-screenshots-script.md`. The demo plan needs the user's approval before recording.
   - Component library: `guides/02-component-library-capture.md`. Pilot the describe and merge stages on the dry-run pages and show the user a sample before running every route.
   - Inconsistencies: `guides/03-inconsistency-audit.md`. Needs only the code stages of route 2 plus the source tree.
   - shadcn/ui map: `guides/04-shadcn-map.md`. Needs a built library; maps every component, new variant, and theme token onto shadcn/ui.
6. **Run in parallel within limits.** Use `scripts/parallel.mjs` for browser stages (it caps shards by available memory); run large agent stages through a workflow under the harness subagent cap. Use Sonnet for describe and merge; Haiku skipped images and produced generic output in the pilot.
7. **Verify before reporting.** Coverage (every route has output), integrity (every group described and assigned once), spot checks against screenshots, no secrets in text or pixels, no settings changed.
8. **Hand off to Claude Design.** Whenever a component library exists, finish by running `scripts/inventory/design-handoff.mjs` and give the user the zip it prints (guide 02, stage 8). It bundles the library, tokens, audits, page screenshots, the shadcn/ui map when present, and `CLAUDE-DESIGN-INSTRUCTIONS.md`.
9. **Report** to the repo's `library/` per Library Schema v2: what was captured, where outputs live, blind spots, environment changes, and next steps. Do not commit large raw capture data unless the user asks.

## References map

- `guides/00-foundation.md`, load first on every task: session, safety contract, route discovery, tab rules, naming, parallelism, blind spots
- `guides/01-demo-video-screenshots-script.md`, load for demos, walkthrough videos, screenshot sets, narration scripts, captions
- `guides/02-component-library-capture.md`, load for component inventories, ledger, design token extraction
- `guides/03-inconsistency-audit.md`, load for visual drift, token duplication, contrast, code-level UI inconsistency
- `guides/04-shadcn-map.md`, load for mapping the captured library onto shadcn/ui components, variants, and theme tokens
- `references/shadcn-catalog.json`, the valid shadcn/ui components, variants, and theme tokens used to validate maps
- `references/REFERENCE.md`, load when running scripts or editing config: requirements, config fields, script map, output contracts, naming
- `references/prompts/`, describe, merge, reconcile, Claude Design handoff, and shadcn map and theme templates; filled by the `inventory/prepare-*`, `design-handoff`, and `shadcn-prepare` scripts, never by hand
- `scripts/`, run as documented in the guides: `doctor.mjs`, `save-session.mjs`, `parallel.mjs`, `screenshots.mjs`, `inventory/*.mjs`, `demo/record-demo.mjs`, `audit/*.mjs`, `lib/common.mjs`
- `references/research/distilled-webapp-capture.md`, load to verify a claim about Playwright, DTCG, color math, WCAG, ffmpeg, or linting, or to settle a dispute
- `references/research/raw/`, load when tracing a distilled claim to its primary source

## Related drones and stingers

This skill is self-contained. When the matching skills from The Wasp Nest (Legion Code Inc.) are also installed, hand off to them:

- `browser-automation-stinger` - Playwright and Puppeteer tests, traces, browser installs, CI reliability.
- `chrome-chromium-stinger` - CDP and Chromium internals, remote debugging, developer profiles.
- `design-system-stinger` - Builds a design system from this skill's inventory and candidate tokens.
- `impeccable-stinger` - Frontend design implementation that acts on inconsistency findings.
- `dark-mode-theming-stinger` - Theme token architecture when light and dark captures disagree.
- `elevenlabs-api-stinger` - Narration audio for demo videos.
- [webapp-capture-wasp-drone](../../agents/webapp-capture-wasp-drone.md) - The paired agent in this plugin; delegate script-heavy capture stages to it.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills, when installed alongside this plugin: `browser-automation-stinger`, `chrome-chromium-stinger`, `design-system-stinger`, `impeccable-stinger`, `dark-mode-theming-stinger`, `elevenlabs-api-stinger`, `security-stinger` (first Ship Gate pass), `quality-stinger` (second pass), and `github-repo-health-stinger` (final orchestrator-level pass).

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

If `security-stinger`, `quality-stinger`, or `github-repo-health-stinger` are not installed, do not skip the gate: run an equivalent thorough security review (secrets, credential files, redaction of captured text and screenshots, injection in any generated code), then a quality review against the route's "Done when" list, then a repository hygiene check (session files gitignored, no large raw capture data staged unless the user asked). Write each report to the repository's `library/` directory, resolve medium and above findings, and get the user's approval before any commit or push.

---

Designed and built by Legion Code Inc. Licensed under AGPL-3.0-or-later.
