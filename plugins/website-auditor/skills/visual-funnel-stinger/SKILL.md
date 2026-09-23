---
name: "visual-funnel-stinger"
description: "25-page visual funnel walk, real desktop (1440x900) and mobile (390x844) Chrome, screenshots at every checkpoint. No state-creating actions unless interactive mode is opted into."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: visual-funnel-wasp-drone
  research-window: "2026-08-18 (round 2 sweep and round 3 deeper pass)"
  primary-surface: external-website-audit
---

# Visual Funnel Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final Skill/Drone authorship). Stage 7 (registration/validation sweep) has not run yet.

You are equipping **visual-funnel-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-012-visual-funnel](../../library/requirements/backlog/prd-012-visual-funnel/prd-012-visual-funnel-index.md).

## Purpose

Walk the customer conversion funnel identified by `icp-positioning-wasp-drone`, up to 25 pages deep, as a real customer would, on both a real desktop Chrome session (1440x900) and a real mobile Chrome session (390x844, real mobile user agent). Capture a screenshot at every checkpoint on both viewports, apply stage-specific UX/CRO checklists, and produce a scored, evidenced `05-funnel/funnel-report.md` that feeds the Revenue-drivers scoring category (build plan section 4.2). By default the walk stops short of any state-creating action (a real purchase, a real lead-form submission); it proceeds through that step only when interactive/stateful mode has been explicitly opted into for the run.

The 1440x900 and 390x844 viewport dimensions are a binding product decision from PRD-012 and the build plan, not a value any research source states; do not cite a source for those two numbers.

## When to use this skill

- Wave W5 of every audit run, reading `02-positioning/` for the funnel definition
- Any request specifically about visual UX/UI quality or navigation/user-journey quality on a live external site
- A user explicitly opting into interactive/stateful mode for a deeper funnel walk that includes the final state-creating step

## When not to use

- Core Web Vitals or page-load-feel methodology as a primary concern: that belongs to `performance-cwv-stinger` (and `lighthouse-pagespeed-stinger` for the measurement discipline itself); this Stinger only notes load feel as checkpoint context
- Technical SEO, structured data, or crawlability checks: owned by `technical-seo-stinger` and `aeo-audit-stinger`
- Auditing a repository the team owns with deploy rights: that is the existing `lighthouse-pagespeed-wasp-drone` posture (improve-a-repo-you-own), not this pair's external, read-only, no-source-access posture
- Completing a real purchase or submitting a real lead form when interactive mode has not been explicitly opted into for this run, ever

## Procedure

1. **Discover and sequence the funnel.** Read `02-positioning/`, sequence checkpoints in purchase order (not visual interest order), cap at 25 pages, prioritizing by revenue/lead exposure if the funnel implies more. `guides/01-discover-funnel-and-sequence-checkpoints.md`.
2. **Configure device emulation.** Set up the desktop (1440x900) and mobile (390x844, real mobile UA) browser profiles as explicit custom configurations, not a bare spread of a named registry device. `guides/02-configure-device-emulation.md`, `references/scripts/playwright-viewport-config.js`.
3. **Capture checkpoint screenshots.** Both desktop and mobile, at every checkpoint, written to `visual/desktop/` and `visual/mobile/` at the moment of capture. `guides/03-capture-checkpoint-screenshots.md`.
4. **Apply stage-specific checklists.** Entry/landing, product/landing page, cart, checkout, each with its own sourced checklist and priority ordering. `guides/04-apply-stage-checklists.md`.
5. **Honor the interactive-mode boundary.** Read the recorded intake decision; if OFF (default), stop before any state-creating action and log why; if ON, use no real credentials and no real payment instrument. `guides/05-honor-the-interactive-mode-boundary.md`, `references/templates/interactive-mode-opt-in-record.md`.
6. **Score and evidence findings.** Zero-to-six scale, boolean checkpoints resolve only to 6 or 1, every score carries an evidence pointer and one-line justification, `[subjective]` calls kept separate. `guides/06-score-and-evidence-findings.md`.
7. **Write the funnel report.** Assemble `05-funnel/funnel-report.md`, cross-check screenshot completeness, update the run ledger and evidence index, hand off to `audit-scoring-wasp-drone`. `guides/07-write-funnel-report.md`, `references/templates/funnel-report-template.md`.

## References map

- `references/research/distilled-visual-funnel.md`, load when a domain claim (funnel methodology, checklist thresholds, device-emulation mechanics) needs verification or a dispute needs settling; every claim there cites its `raw/` source
- `references/research/raw/`, load when tracing a distilled claim back to its primary source, or when a guide's citation needs the full original context
- `references/templates/checkpoint-log-template.md`, load when starting a new run's `05-funnel/checkpoint-log.md`
- `references/templates/funnel-report-template.md`, load when assembling the final `05-funnel/funnel-report.md`
- `references/templates/interactive-mode-opt-in-record.md`, load at intake, before the walk begins, to record the OFF/ON decision
- `references/scripts/playwright-viewport-config.js`, load/copy when configuring the harness's browser tool for the two required viewports; see `guides/02-configure-device-emulation.md`
- `references/scripts/README.md`, points to `shared/scripts/visual-capture.py` for this pair's centrally-planned deterministic script

## Related drones and stingers

- [visual-funnel-wasp-drone](../../agents/visual-funnel-wasp-drone.md) - this Stinger's paired Drone
- [lighthouse-pagespeed-stinger](../lighthouse-pagespeed-stinger) - consult for Core Web Vitals measurement discipline during the walk; does not own this pair's screenshot/UX scoring
- [performance-cwv-stinger](../performance-cwv-stinger) - owns Core Web Vitals field-data scoring for this plugin specifically; this Stinger only notes load feel as checkpoint context
- [icp-positioning-stinger](../icp-positioning-stinger) - produces the funnel definition this Stinger consumes from `02-positioning/`
- [audit-scoring-stinger](../audit-scoring-stinger) - consumes this Stinger's scored, evidenced `05-funnel/funnel-report.md`

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [visual-funnel-wasp-drone](../../agents/visual-funnel-wasp-drone.md) - this Stinger's paired Drone.
  - [lighthouse-pagespeed-stinger](../lighthouse-pagespeed-stinger) - consult for CWV methodology context during the visual walk, does not own this pair's screenshot/UX scoring

## Ship Gate decision

Ship Gate removed: research-only stinger. This pair assesses a live third-party website from the outside, with no source access and no deploy rights; its output is screenshots and a scored report written to the audit workspace (`visual/`, `05-funnel/`), never a code change committed to this repository. The security/quality/repo-health close-out sequence has nothing to gate here.
