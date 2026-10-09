---
name: "before-after-stinger"
license: AGPL-3.0-or-later
description: "Capture PR-ready before and after screenshots of web pages or elements using the @vercel/before-and-after CLI, upload them, and append a comparison table to the pull request. Use when the user says \"take before and after\", \"screenshot comparison\", \"visual diff\", \"PR screenshots\", \"compare old and new\", or needs to document UI changes visually."
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Needs Node for npx, the @vercel/before-and-after CLI, and optionally gh for PR edits and the Vercel CLI for protected deployments."
metadata:
  hive-tier: specialist
  paired-drone: before-after-wasp-drone
  research-window: 2026-10-05
  provenance: "Workflow informed by the michaelshimeles/skills before-and-after skill; body authored fresh for The Wasp Nest. See references/research/."
---

# Before-After Stinger

Prove a UI change with a side-by-side screenshot pair and a markdown table a
reviewer can read in the PR. The CLI is `@vercel/before-and-after` (the
unscoped `before-and-after` name is a different, wrong package; via npx
always spell the full name).

Read `guides/01-capture-workflow.md` for the full procedure before the first
capture in a session.

## Standing rules

- The current state of the working tree is **After**. Never switch branches,
  stash, or start servers to manufacture a "before"; if the before URL is
  missing, ask: production URL, preview deployment, or a local port.
- Run the pre-flight and the protection check on every capture; they are
  steps 1 and 2 of the guide, never skipped.
- `--full` (full scroll capture) only when explicitly requested.
- `--markdown` whenever the output is headed for a PR or any markdown
  surface.
- `--mobile` / `--tablet` whenever the user mentions phone, tablet,
  responsive, or similar.
- Protected Vercel preview URLs (401/403) need a bypass token from
  `vercel inspect`, or the user's help; see the guide.

## Deliverable

A markdown table with both images hosted (default uploader 0x0.st, gist
adapter available), appended to the PR body via `gh pr edit` when a PR
exists and `gh` is present, otherwise handed to the user for manual paste.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event that your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [browser-automation-stinger](../browser-automation-stinger/) - driving browsers with Playwright or Puppeteer when a URL needs scripting beyond a static capture
  - [evidence-testing-stinger](../evidence-testing-stinger/) - recorded proof of behavior with annotations, when a video or interaction log is needed rather than a still pair

## Ship Gate

Prior to committing any code or posting to a PR you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each pass prepare a report in the repository's relevant library directory. All medium or above findings must be resolved followed by another thorough re-evaluation prior to proceeding. The user reviews and approves before commit or push.
