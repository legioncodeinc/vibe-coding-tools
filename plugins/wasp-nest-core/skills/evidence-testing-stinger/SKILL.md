---
name: "evidence-testing-stinger"
license: AGPL-3.0-or-later
description: "Records verifiable proof that a change works: an annotated screen recording of the agent driving the live app, a headless screenshot-and-probe sequence, or measured before and after numbers, packaged as evidence artifacts (video or image set, report, manifest) and posted to the PR or tracker issue. Use whenever a change needs evidence instead of a prose claim that it works, for UI changes, bug-fix verification, and non-UI changes that can show a measured delta."
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Live path needs a GUI the agent can drive plus any recorder honoring the artifact contract (ffmpeg, macOS screencapture, OS recorder). Headless path needs only a running app and a scriptable browser such as Playwright. Posting needs gh or equivalent."
metadata:
  hive-tier: specialist
  paired-drone: evidence-testing-wasp-drone
  research-window: 2026-10-05
  provenance: "Protocol design informed by the michaelshimeles/skills evidence-driven-testing skill (whose bundled recorder is third-party code we do not redistribute); artifact contract and body authored fresh for The Wasp Nest. See references/research/."
---

# Evidence Testing Stinger

A claim that it works is not evidence. This skill turns testing into an
artifact a reviewer can inspect: a recording of the live session (or a
screenshot sequence, or a measured pair of numbers), plus a report and a
manifest, attached where the decision happens.

Read `guides/01-evidence-protocol.md` for the artifact contract and
annotation protocol, and `guides/02-paths.md` for choosing the live, headless,
or measured path and running it.

## Standing rules

- The recording must show the agent's own live session driving the app: a
  video of someone else's clicks, or a synthetic pattern, is not evidence.
- One assertion per meaningful state change. Consolidate; do not annotate
  per label.
- An assertion timestamp records when you asserted it, not that it was true:
  look at the screen before choosing passed.
- A test that cannot run is marked untested with the reason. Never skipped
  silently, never marked passed.
- Record the revision: `git rev-parse HEAD`, branch, and the deployment URL
  go into the report and manifest.
- Headless is a first-class path, not a fallback apology: scripted
  screenshots and probes with an assertions file are full evidence.

## Deliverable

`evidence.mp4` (or the screenshot set), `report.md`, and `manifest.json` in
the task's artifacts folder, posted to the PR and tracker issue when they
exist, otherwise delivered to the requester with paths.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event that your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [browser-automation-stinger](../browser-automation-stinger/) - Playwright and Puppeteer mechanics for the headless path
  - [before-after-stinger](../before-after-stinger/) - the still-image pair for a visual diff when a full session recording is more than needed
  - [quality-stinger](../quality-stinger/) - implementation-versus-plan audit; this skill proves behavior, that one proves conformance

## Ship Gate

Prior to committing any code you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each pass prepare a report in the repository's relevant library directory. All medium or above findings must be resolved followed by another thorough re-evaluation prior to proceeding. The user reviews and approves before commit or push.
