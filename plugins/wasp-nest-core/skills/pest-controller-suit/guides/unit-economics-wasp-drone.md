# unit-economics routing guide

**Plugin owner:** `software-economics-tools`. **Required:** Core plus this selected owner.
**Source Drone:** `packs/software-economics-tools/agents/unit-economics-wasp-drone.md`.
**Source Stinger:** `packs/software-economics-tools/skills/unit-economics-stinger/SKILL.md`.

## Domain

Model supplied prices and costs into contribution, gross margin, break-even and sensitivity.

## Trigger phrases

unit economics; break even; contribution margin; refund sensitivity; free users; trial costs; abuse cost sensitivity.

## Do NOT route when

Selecting a commercial price is a separate pricing domain; Payments owns accepted billing implementation; Estimation owns delivery forecasts.

## Inputs the Drone needs

explicit price, billing unit, currency/period, costs, fee/refund assumptions and dates.

## Outputs the Drone produces

reviewable worksheet, assumptions, calculator input/output, limits.

Use the paired skill's free/trial cohort worksheet to separate blocked attempts, legitimate free service and suspected served abuse. Reconcile shared floors and credits once; held cohort totals make break-even conditional. No production mitigation or fraud attribution is established.

## Dispatch

Read the root catalog for source work. For installed work resolve `unit-economics-stinger` through trusted Core's selected-plugin resolver and read the returned path. A cached plugin is not a selected capability. Follow [Core's arming contract](../SKILL.md#dispatch-and-arming-contract). If the host lacks a native role, use direct skill execution only within the user-authorized approach and report that surface honestly. No guessed role or source fallback.

The runtime produces an advisory artifact. No installation, credential entry, provider change, messages or release action follows implicitly. Keep the parent's scope, clock and file ownership. Code-producing changes close with Security then Quality and the orchestrator repository-health review.

[Paired source skill](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/software-economics-tools/skills/unit-economics-stinger/SKILL.md) and [source Drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/software-economics-tools/agents/unit-economics-wasp-drone.md) carry the exact domain procedure and boundaries.

For O281 fair service limits, load the paired skill's focused guide and integrated entitlement usage cost and abuse-limit worksheet. Compose Unit Economics cost evidence with SaaS Pricing value/overflow/recovery proposals. Retain owner-selected fairness criteria, exact decision evidence and unknowns; no fair threshold or fraud control follows from cost arithmetic. Separately accepted implementation belongs to actual selected Payments and Security/platform owners. Billing, legitimate-user behavior, fairness and native execution remain NOT_RUN unless independently observed.
