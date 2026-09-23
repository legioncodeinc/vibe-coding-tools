# Guide 03: Capture checkpoint screenshots

## What this guide covers

The mechanical capture step, once the funnel is sequenced (guide 01) and device emulation is configured (guide 02).

## Procedure

1. For every checkpoint in the sequenced list, capture both a desktop screenshot (1440x900 profile) and a mobile screenshot (390x844 profile), per PRD-012 AC-1. Neither is optional; a checkpoint with only one of the two is an incomplete checkpoint, log it as such rather than treating it as done.
2. Write desktop captures to `visual/desktop/{checkpoint-id}.png` and mobile captures to `visual/mobile/{checkpoint-id}.png`, matching the shared workspace layout in build plan section 3. Use a stable, descriptive checkpoint ID (e.g. `03-cart` or `05-checkout-shipping`) so the evidence pointer in the funnel report is self-explanatory without opening the log.
3. Capture at the moment of observation, not from memory or from a re-derived mental model of the page. Conduct rule 2 (evidence at the moment of finding) applies to screenshots exactly as it applies to any other artifact: the screenshot IS the evidence, log its path and timestamp immediately, in the same pass as the capture.
4. Prefer full-page or full-above-the-fold capture over a viewport-clipped shot when the checklist in guide 04 needs to assess scroll-depth placement (e.g. "does the pricing answer sit within one scroll of the fold"). A clipped screenshot that only shows the initial viewport cannot support that judgment.
5. If a checkpoint fails to load, is blocked by a bot-wall, or renders a JS error instead of the intended page, do not skip it silently. Capture whatever the browser actually shows (the error state itself is evidence), log the failure reason in `checkpoint-log.md`, and continue the walk. A missing checkpoint with no explanation reads as a missed step; a captured failure state reads as a finding.
6. Stop the capture sequence at the boundary recorded in the interactive-mode opt-in record (`references/templates/interactive-mode-opt-in-record.md`). If interactive mode is OFF, the last checkpoint captured is the one immediately before the state-creating step (final submit, final purchase), per PRD-012 AC-2. Do not capture a "preview" of the state-creating step by partially filling a form; either the walk proceeds through it under an explicit opt-in, or it stops before it.

## Common failure this guide prevents

Treating "the page looked the same on mobile" as a reason to skip the mobile capture. It is not; the mobile screenshot is required evidence per AC-1 regardless of whether the auditor's own judgment says the layout is unchanged. A missing mobile screenshot is a missing checkpoint even when the desktop finding turns out identical.
