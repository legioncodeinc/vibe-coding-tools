---
name: "stack-fingerprint-stinger"
description: "Landing-page-only stack and render-mode fingerprinting (React/Vite, Next.js, SvelteKit, WordPress, Shopify, Magento). Writes target-profile.json every later Drone reads."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: stack-fingerprint-wasp-drone
  research-window: 2026-08-18
  primary-surface: external-website-audit
---

# Stack Fingerprint Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final
> Skill/Drone authorship). Stage 7 (Register: pest-controller-suit registration and cross-harness deploy)
> has not run yet.

## Purpose

Equips **stack-fingerprint-wasp-drone**, wave W1a of every Website Auditor by Legion Code Inc.
engagement, to classify the audited site's technology stack and render mode from the landing page
alone, no crawl required, and write the one shared-workspace file (`_shared/target-profile.json`)
every later Drone reads instead of re-detecting anything itself. Full scope and acceptance criteria:
[prd-003-stack-fingerprint](../../library/requirements/backlog/prd-003-stack-fingerprint/prd-003-stack-fingerprint-index.md).

Every factual claim this skill makes traces to a downloaded primary source in
`references/research/raw/` or to this pair's PRD/the build plan; anywhere the archive runs thin
(React+Vite, SvelteKit specifically versus Svelte generally, Magento, and the render-mode comparison
heuristic itself all have no dedicated source), that gap is named explicitly rather than smoothed
into an unstated guess. See `references/research/distilled-stack-fingerprint.md` section 8 and
`references/fingerprint-signature-table.md`.

## When to use this skill

- Wave W1a of every audit run, right after `audit-intake-wasp-drone` scaffolds the workspace, in
  parallel with `vendor-inventory-wasp-drone` (wave W1b)
- Determining crawl strategy before `site-crawler-wasp-drone` starts (wave W4), by writing the
  `platform_guide` pointer it reads
- Re-fingerprinting after a site migration is suspected mid-engagement

## When not to use

- Crawling beyond the landing page and its directly linked static assets, that is
  `site-crawler-wasp-drone`'s job, and only after this Stinger has written `target-profile.json`
- Enumerating third-party vendors/scripts, that is `vendor-inventory-stinger`'s job (its sibling
  wave, not this one)
- Judging the stack choice as good or bad, this Stinger classifies, it does not evaluate

## Procedure

1. Read `00-intake/` for the target URL. Do not ask the user for it again.
2. Fetch the landing page once (single-request channel: HTML, headers, cookies) per
   `guides/01-fetch-and-collect-signals.md`, and perform the one permitted headless-browser load for
   render-mode comparison.
3. Run `shared/scripts/fingerprint.py` against the captured evidence to classify `stack` and
   `rendering` per `guides/02-signature-matching.md` and `guides/03-render-mode-detection.md`. Apply
   the precision-over-recall discipline: match only vendor asset URLs, header names, cookie names,
   or generator tags, never free-text keywords.
4. If nothing matches, report `stack: unknown` with the raw signals attached, per PRD-003 AC-2.
   Never force an unrecognized site into the nearest known category.
5. Write `_shared/target-profile.json` and `01-recon/stack-fingerprint.md` from the same run, per
   `guides/04-write-target-profile-and-report.md`. Set `platform_guide` to the exact build-plan-
   section-6 guide path `site-crawler-wasp-drone` should load next, or `null` if `stack` is
   `unknown`.

## References map

- `references/fingerprint-signature-table.md`, load when applying or extending the signature table,
  or verifying a classification's grounding (researched vs. judgment call)
- `references/templates/target-profile.template.json`, load when writing `_shared/target-profile.json`
- `references/templates/stack-fingerprint-report-template.md`, load when writing
  `01-recon/stack-fingerprint.md`
- `references/research/distilled-stack-fingerprint.md`, load when a domain claim needs verification
  or this Stinger's coverage gaps need checking before making a claim
- `references/research/raw/`, load when tracing a distilled claim back to its primary source
- `references/scripts/README.md` and `shared/scripts/fingerprint.py`, load/run for the deterministic
  matcher that drives steps 3-4 of the procedure above

## Related drones and stingers

- [stack-fingerprint-wasp-drone](../../agents/stack-fingerprint-wasp-drone.md) - this Stinger's
  paired Drone
- [vendor-inventory-stinger](../vendor-inventory-stinger) - runs in parallel, wave W1b; both read
  `00-intake/`, only vendor-inventory also reads this Stinger's `target-profile.json` for
  render-mode context
- [site-crawler-stinger](../site-crawler-stinger) - wave W4, reads this Stinger's
  `target-profile.json` to select its platform-specific crawl strategy without re-detecting anything
- [audit-intake-stinger](../audit-intake-stinger) - wave W0, scaffolds the workspace this Stinger
  reads `00-intake/` from
- [seo-aeo-stinger](../seo-aeo-stinger) - internal-repo SEO/AEO reference; consult for standard
  definitions this external audit's technical-seo pair also relies on

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [vendor-inventory-stinger](../vendor-inventory-stinger) - parallel wave-W1 sibling; consult when a signal you find looks more like a vendor/tag than a platform/framework signature

## Ship Gate

Ship Gate removed: stack-fingerprint-stinger performs a read-only external website audit and writes
its output into the audited customer's `www.<domain>-audit/` workspace, not into this repository. It
never produces a commit inside this repo as part of its own operation, so the Ship Gate
(security-stinger, then quality-stinger, then github-repo-health-stinger) does not apply to this
pair's runtime procedure. This is separate from the fact that changes to this plugin's own source
(this file included) still go through this repository's normal Ship Gate before being committed, per
the build plan's own development process, that gate governs building the plugin, not what the
plugin does when it runs.
