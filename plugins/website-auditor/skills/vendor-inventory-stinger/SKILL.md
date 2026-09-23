---
name: "vendor-inventory-stinger"
description: "Third-party vendor census after a real JS-executed page load, including GTM-hydrated scripts and content-injection/metadata-manipulation tools like Search Atlas, classified by function."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: vendor-inventory-wasp-drone
  research-window: 2026-08-18
  primary-surface: external-website-audit
---

# Vendor Inventory Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final
> Skill/Drone authorship). Stage 7 (Register: pest-controller-suit registration and cross-harness deploy)
> has not run yet.

## Purpose

Equips **vendor-inventory-wasp-drone**, wave W1b of every Website Auditor by Legion Code Inc.
engagement, to enumerate every third-party script, tag, pixel, and iframe present on the audited
landing page after a real headless-browser load, including anything Google Tag Manager hydrates at
runtime, and to flag content-injection/metadata-manipulation tooling (Search Atlas's OTTO Pixel and
peers) as its own category. Full scope and acceptance criteria:
[prd-004-vendor-inventory](../../library/requirements/backlog/prd-004-vendor-inventory/prd-004-vendor-inventory-index.md).

Every factual claim this skill makes traces to a downloaded primary source in
`references/research/raw/` or to this pair's PRD/the build plan. The archive covers only Google Tag
Manager and Search Atlas in real depth, two sources total; everywhere else (the broader vendor
lookup table's judgment-call rows, and the Search Atlas detection signature itself, which the
vendor's own page never documents) that gap is named explicitly, never smoothed into an unstated
guess. See `references/research/distilled-vendor-inventory.md` and
`references/vendor-lookup-table.md`.

## When to use this skill

- Wave W1b of every audit run, in parallel with `stack-fingerprint-wasp-drone` (wave W1a)
- Flagging content-injection/SEO-manipulation tooling before an SEO/AEO audit runs, so
  `technical-seo-wasp-drone` (prd-008) and `aeo-audit-wasp-drone` (prd-009) know some on-page
  metadata may not be the client's own hand
- Building the vendor list `analytics-stack-wasp-drone` and `web-security-posture-wasp-drone` later
  interpret

## When not to use

- Judging whether a detected vendor is good or bad, or a security/analytics risk, that belongs to
  `analytics-stack-wasp-drone` and `web-security-posture-wasp-drone` downstream, this Stinger only
  inventories, per PRD-004's explicit non-goal
- Classifying the site's technology stack or render mode, that is `stack-fingerprint-stinger`'s job
  (its sibling wave, not this one)
- Any step that would create state on the target (order placement, form submission, auth bypass,
  file upload), which defaults OFF and requires explicit per-run opt-in

## Procedure

1. Read `00-intake/` for the target URL and `_shared/target-profile.json` for render-mode context
   (a CSR/hybrid site's real vendor list only appears after JS execution). If
   `target-profile.json` does not exist yet, proceed anyway, the two wave-W1 Drones run in parallel by
   design.
2. Perform a real, read-only, JS-executed headless-browser load and capture the third-party network
   request log, DOM `<script src>` list, and rendered HTML, per
   `guides/01-headless-capture-procedure.md`.
3. Detect Google Tag Manager first, using all seven researched signals across three channels, then
   cross-reference every other vendor row against the same page load rather than assuming GTM's
   presence explains anything away, per `guides/02-gtm-hydration-and-downstream-tags.md`.
4. Detect and flag content-injection/metadata-manipulation tooling (Search Atlas OTTO Pixel and
   peers) as its own category, labelled vendor-self-reported and `candidate, needs manual
   confirmation` since no raw source documents its detection signature, per
   `guides/03-injection-tool-detection.md`.
5. Classify every remaining vendor by function (analytics, tag manager, chat, payments,
   CRO/testing, SEO-injection, ads, consent/CMP, other) with evidence, per
   `guides/04-vendor-classification.md`. Run `shared/scripts/vendor-census.py` to apply the lookup
   table deterministically.
6. Write `01-recon/vendor-inventory.md`, cross-referencing the flagged content-injection findings
   for prd-008/prd-009 per PRD-004 AC-2, per `guides/05-write-vendor-inventory-report.md`.

## References map

- `references/vendor-lookup-table.md`, load when applying or extending the vendor lookup table, or
  verifying a classification's grounding (researched vs. judgment call)
- `references/templates/vendor-inventory-report-template.md`, load when writing
  `01-recon/vendor-inventory.md`
- `references/templates/vendor-entry.template.json`, load when assembling the intermediate
  per-vendor row shape before writing the markdown report
- `references/research/distilled-vendor-inventory.md`, load when a domain claim needs verification
  or this Stinger's coverage gaps need checking before making a claim
- `references/research/raw/`, load when tracing a distilled claim back to its primary source
- `references/scripts/README.md` and `shared/scripts/vendor-census.py`, load/run for the
  deterministic classifier that drives steps 3-5 of the procedure above

## Related drones and stingers

- [vendor-inventory-wasp-drone](../../agents/vendor-inventory-wasp-drone.md) - this Stinger's
  paired Drone
- [stack-fingerprint-stinger](../stack-fingerprint-stinger) - runs in parallel, wave W1a; this
  Stinger reads its `target-profile.json` for render-mode context
- [audit-intake-stinger](../audit-intake-stinger) - wave W0, scaffolds the workspace this Stinger
  reads `00-intake/` from
- [analytics-stack-stinger](../analytics-stack-stinger) - downstream consumer of this Stinger's
  vendor list; judges the analytics vendors this Stinger only inventories
- [web-security-posture-stinger](../web-security-posture-stinger) - downstream consumer of this
  Stinger's vendor list; judges third-party risk this Stinger only inventories

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [stack-fingerprint-stinger](../stack-fingerprint-stinger) - parallel wave-W1 sibling; consult its `target-profile.json` for render-mode context before capturing

## Ship Gate

Ship Gate removed: vendor-inventory-stinger performs a read-only external website audit and writes
its output into the audited customer's `www.<domain>-audit/` workspace, not into this repository. It
never produces a commit inside this repo as part of its own operation, so the Ship Gate
(security-stinger, then quality-stinger, then github-repo-health-stinger) does not apply to this
pair's runtime procedure. This is separate from the fact that changes to this plugin's own source
(this file included) still go through this repository's normal Ship Gate before being committed, per
the build plan's own development process, that gate governs building the plugin, not what the
plugin does when it runs.
